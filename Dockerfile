# ---- Stage 0: Node (build de React/Vite) ----
FROM node:20-alpine AS nodebuild
WORKDIR /app

# Toolchain para node-gyp / binarios nativos
RUN apk add --no-cache python3 make g++ libc6-compat

# Instalar deps del frontend según lock (mejor caché)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm i --no-audit --no-fund; fi

# Copiar el resto del código y build
COPY . .
RUN npm run build --verbose

# ---- Stage 1: Runtime PHP + Apache + Certbot ----
FROM php:8.3-apache
ENV DEBIAN_FRONTEND=noninteractive
ENV COMPOSER_ALLOW_SUPERUSER=1 COMPOSER_NO_INTERACTION=1

# PHP extensiones + módulos Apache
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends \
    git unzip \
    libpq5 libpng16-16 libjpeg62-turbo libfreetype6 libzip4 \
    $PHPIZE_DEPS libpq-dev libpng-dev libjpeg-dev libfreetype6-dev libzip-dev; \
  docker-php-ext-configure gd --with-freetype --with-jpeg; \
  docker-php-ext-install -j"$(nproc)" pdo pdo_pgsql pgsql gd zip opcache mbstring; \
  docker-php-ext-enable pdo_pgsql pgsql opcache; \
  a2enmod ssl headers rewrite mime; \
  apt-get purge -y --auto-remove $PHPIZE_DEPS libpq-dev libpng-dev libjpeg-dev libfreetype6-dev libzip-dev; \
  rm -rf /var/lib/apt/lists/*

# Certbot
RUN set -eux; \
  apt-get update; \
  apt-get install -y --no-install-recommends certbot python3-certbot-apache; \
  rm -rf /var/lib/apt/lists/*

# VHosts
COPY docker/vhost-http.conf /etc/apache2/sites-available/vhost-http.conf
COPY docker/vhost-ssl.conf  /etc/apache2/sites-available/vhost-ssl.conf
RUN a2dissite 000-default.conf || true && a2ensite vhost-http.conf

# App
WORKDIR /var/www/html

# Composer binario
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar vendor dentro del contenedor (mejor caché al separar)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-ansi --no-progress --no-scripts

# Copiar código fuente (sin .env ni vendor)
COPY --chown=www-data:www-data . /var/www/html

# Copiar build de Vite al public/build
COPY --from=nodebuild --chown=www-data:www-data /app/public/build /var/www/html/public/build

# Autoload optimizado
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# Permisos Laravel
RUN set -eux; \
  mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache; \
  chown -R www-data:www-data storage bootstrap/cache; \
  find storage -type d -exec chmod 775 {} \; ; \
  find storage -type f -exec chmod 664 {} \; ; \
  chmod -R 775 bootstrap/cache

# Script de arranque (SSL + migraciones/seed)
COPY docker/init-ssl.sh /usr/local/bin/init-ssl.sh
RUN chmod +x /usr/local/bin/init-ssl.sh

CMD ["/usr/local/bin/init-ssl.sh"]
