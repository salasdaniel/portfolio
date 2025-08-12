# ---- Etapa 1: Vendor con PHP 8.2 CLI (con extensiones necesarias) ----
FROM php:8.2-cli AS vendor
# Extensiones que suelen pedir proyectos Laravel / librerías (gd, zip)
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
  && docker-php-ext-configure gd --with-freetype --with-jpeg \
  && docker-php-ext-install gd zip \
  && rm -rf /var/lib/apt/lists/*

# Instalar Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app
COPY composer.json composer.lock ./

# Importante: --no-scripts para evitar fallos por checks en build
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts

# ---- Etapa 2: Build Frontend (Node + Vite) ----
FROM node:20-alpine AS nodebuild
WORKDIR /app
RUN apk add --no-cache python3 make g++ libc6-compat
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --no-audit --no-fund; fi
COPY . .
RUN npm run build

# ---- Etapa 3: Runtime PHP 8.2 + Apache ----
FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libzip-dev unzip git certbot python3 \
  && docker-php-ext-install pdo_pgsql zip opcache \
  && apt-get install -y --no-install-recommends libsqlite3-dev \
  && docker-php-ext-install pdo_sqlite \
  && a2enmod rewrite headers ssl \
  && rm -rf /var/lib/apt/lists/*

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf \
 || true

WORKDIR /var/www/html

# Copiamos el código de la app
COPY . .

# Copiamos vendor desde la etapa vendor (ya resuelto con ext-gd/zip)
COPY --from=vendor /app/vendor ./vendor

# Copiamos build de Vite (public/build y manifest si existe)
COPY --from=nodebuild /app/public/build ./public/build
# COPY --from=nodebuild /app/public/manifest.json ./public/manifest.json 2>/dev/null || true

# Permisos básicos para Laravel
RUN mkdir -p storage bootstrap/cache \
  && chown -R www-data:www-data storage bootstrap/cache

# Vhosts (ya los tienes en ./docker)
COPY docker/vhost-http.conf /etc/apache2/sites-available/vhost-http.conf
COPY docker/vhost-ssl.conf  /etc/apache2/sites-available/vhost-ssl.conf
