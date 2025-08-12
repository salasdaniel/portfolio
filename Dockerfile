# ---- Etapa 1: Dependencias PHP (Composer) ----
FROM composer:2 AS vendor
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-interaction --no-ansi --no-progress

# ---- Etapa 2: Build Frontend (Node + Vite) ----
FROM node:20-alpine AS nodebuild
WORKDIR /app
# Herramientas para paquetes nativos (si algún paquete lo requiere)
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
# Instalar según tu lockfile
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --no-audit --no-fund; fi

# Copiar el resto del código (incluye resources, vite.config.*, etc.)
COPY . .
# Build de producción (Vite)
RUN npm run build

# ---- Etapa 3: Runtime PHP 8.2 + Apache ----
FROM php:8.2-apache

# Paquetes del sistema y extensiones PHP necesarias
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libzip-dev unzip git certbot python3 \
    && docker-php-ext-install pdo_pgsql zip \
    && docker-php-ext-install opcache \
    && apt-get install -y --no-install-recommends libsqlite3-dev \
    && docker-php-ext-install pdo_sqlite \
    && a2enmod rewrite headers ssl \
    && rm -rf /var/lib/apt/lists/*

# Configurar Apache (ServerName por variable)
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
    && sed -ri 's!/var/www/!/var/www/html/public!g' /etc/apache2/apache2.conf || true

WORKDIR /var/www/html

# Copia del código de la app
COPY . .

# Copiar vendor desde la etapa de Composer
COPY --from=vendor /app/vendor ./vendor

# Copiar build de frontend desde la etapa Node (Vite default -> public/build)
COPY --from=nodebuild /app/public/build ./public/build
# (Si usas manifest, también:)
# COPY --from=nodebuild /app/public/manifest.json ./public/manifest.json 2>/dev/null || true

# Ajustar permisos mínimos (Laravel)
RUN chown -R www-data:www-data /var/www/html \
    && mkdir -p storage bootstrap/cache \
    && chown -R www-data:www-data storage bootstrap/cache

# Copia de vhosts (los tienes en ./docker)
# Se habilitan luego desde el init-ssl.sh
COPY docker/vhost-http.conf /etc/apache2/sites-available/vhost-http.conf
COPY docker/vhost-ssl.conf  /etc/apache2/sites-available/vhost-ssl.conf

# Entrypoint: dejaremos que docker-compose monte ./docker y ejecute tu init-ssl.sh
# El comando final lo maneja el script (apache en foreground)
