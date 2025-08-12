# -------------------------------------------------------
# Etapa 1: Vendor (Composer) sobre PHP 8.2 CLI (Debian)
# -------------------------------------------------------
FROM php:8.2-cli AS vendor

# Paquetes del sistema y extensiones usadas comúnmente por Laravel/librerías
RUN apt-get update && apt-get install -y --no-install-recommends \
    git unzip libzip-dev \
    libpng-dev libjpeg62-turbo-dev libfreetype6-dev \
 && docker-php-ext-configure gd --with-freetype --with-jpeg \
 && docker-php-ext-install gd zip \
 && rm -rf /var/lib/apt/lists/*

# Copiamos Composer desde la imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Solo manifiestos para aprovechar caché
COPY composer.json composer.lock ./

# Instalar dependencias PHP sin dev ni scripts (rápido y seguro en build)
RUN composer install --no-dev --prefer-dist --no-interaction --no-progress --no-scripts \
 && composer dump-autoload -o

# -------------------------------------------------------
# Etapa 2: Build Frontend (Node + Vite) base Ubuntu
# -------------------------------------------------------
FROM node:20 AS nodebuild
WORKDIR /app

# Toolchain para paquetes nativos (sharp/canvas/etc. si hiciera falta)
RUN apt-get update && apt-get install -y --no-install-recommends \
    python3 make g++ \
 && rm -rf /var/lib/apt/lists/*

# Copiar manifiestos primero
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Instalar según lock
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm install --no-audit --no-fund; fi

# Copiar el resto del código (resources, vite.config.*, etc.)
COPY . .

# Opcional: si tu VPS es chico, evita OOM
ENV NODE_OPTIONS="--max-old-space-size=1024"
ENV NODE_ENV=production

# Build de producción (Vite)
RUN npm run build --verbose

# -------------------------------------------------------
# Etapa 3: Runtime PHP 8.2 + Apache
# -------------------------------------------------------
FROM php:8.2-apache

# Paquetes del sistema y extensiones PHP necesarias en runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev libzip-dev unzip git certbot python3 \
 && docker-php-ext-install pdo_pgsql zip opcache \
 && apt-get install -y --no-install-recommends libsqlite3-dev \
 && docker-php-ext-install pdo_sqlite \
 && a2enmod rewrite headers ssl \
 && rm -rf /var/lib/apt/lists/*

# DocumentRoot a /public
ENV APACHE_DOCUMENT_ROOT=/var/www/html/public
RUN sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/000-default.conf || true

WORKDIR /var/www/html

# Copiamos el código de la app (necesario para públicos, artisan, etc.)
COPY . .

# Copiar vendor desde la etapa vendor
COPY --from=vendor /app/vendor ./vendor

# Copiar build de Vite (public/build y manifest si existe)
COPY --from=nodebuild /app/public/build ./public/build
# COPY --from=nodebuild /app/public/manifest.json ./public/manifest.json 2>/dev/null || true

# Vhosts (ya los tienes en ./docker)
COPY docker/vhost-http.conf /etc/apache2/sites-available/vhost-http.conf
COPY docker/vhost-ssl.conf  /etc/apache2/sites-available/vhost-ssl.conf

# Permisos mínimos para Laravel
RUN mkdir -p storage bootstrap/cache \
 && chown -R www-data:www-data storage bootstrap/cache

# Por defecto, la imagen corre apache2-foreground.
# En docker-compose puedes sobreescribir CMD para ejecutar tu init-ssl.sh
