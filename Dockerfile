# ---- Stage 0: Node (build de React/Vite) ----
FROM node:20-alpine AS nodebuild
WORKDIR /app

# Toolchain para node-gyp / binarios nativos + CA
RUN apk add --no-cache python3 make g++ libc6-compat ca-certificates
# Si usas sharp, descomenta:
# RUN apk add --no-cache vips vips-dev

# ===== Variables públicas para Vite (desde build args) =====
# Ejemplo: --build-arg VITE_API_URL=https://devfolio.noko.com.py/api
ARG VITE_API_URL
ARG VITE_APP_NAME
ENV VITE_API_URL=${VITE_API_URL}
ENV VITE_APP_NAME=${VITE_APP_NAME}

# Copiar manifiestos primero (mejor caché)
COPY package.json package-lock.json* pnpm-lock.yaml* yarn.lock* ./

# Instalar dependencias según lock
RUN if [ -f package-lock.json ]; then npm ci --no-audit --no-fund; \
    elif [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    else npm i --no-audit --no-fund; fi

# Copiar sólo lo necesario para el build de Vite
COPY vite.config.* tsconfig*.json ./
COPY resources ./resources
COPY public ./public

# Build de producción (Vite deja artefactos en public/build)
ENV NODE_ENV=production
ENV NODE_OPTIONS=--max-old-space-size=2048
RUN npm run build --verbose


# ---- Stage 1: Runtime PHP + Apache ----
FROM php:8.3-apache
ENV DEBIAN_FRONTEND=noninteractive \
    COMPOSER_ALLOW_SUPERUSER=1 \
    COMPOSER_NO_INTERACTION=1

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

# (Opcional) Certbot
# RUN set -eux; apt-get update; apt-get install -y --no-install-recommends certbot python3-certbot-apache; rm -rf /var/lib/apt/lists/*

# VHosts (asumiendo que ya existen estos archivos en tu repo)
COPY docker/vhost-http.conf /etc/apache2/sites-available/vhost-http.conf
COPY docker/vhost-ssl.conf  /etc/apache2/sites-available/vhost-ssl.conf
RUN a2dissite 000-default.conf || true && a2ensite vhost-http.conf

WORKDIR /var/www/html

# Composer binario
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Instalar vendor primero (mejor caché)
COPY composer.json composer.lock ./
RUN composer install --no-dev --prefer-dist --no-ansi --no-progress --no-scripts

# Copiar backend Laravel (evita .env y vendor)
COPY --chown=www-data:www-data app ./app
COPY --chown=www-data:www-data bootstrap ./bootstrap
COPY --chown=www-data:www-data config ./config
COPY --chown=www-data:www-data database ./database
COPY --chown=www-data:www-data routes ./routes
COPY --chown=www-data:www-data artisan ./artisan
# Si tienes vistas Blade o traducciones, cópialas (Laravel las necesita en runtime)
COPY --chown=www-data:www-data resources/views ./resources/views
COPY --chown=www-data:www-data resources/lang ./resources/lang
# Entradas públicas mínimas (index/robots)
COPY --chown=www-data:www-data public/index.php public/robots.txt ./public/

# Copiar build de Vite al public/build
COPY --from=nodebuild --chown=www-data:www-data /app/public/build ./public/build

# Autoload optimizado
RUN composer dump-autoload --no-dev --optimize --classmap-authoritative

# Permisos Laravel
RUN set -eux; \
  mkdir -p storage/framework/{cache,sessions,views} storage/logs bootstrap/cache; \
  chown -R www-data:www-data storage bootstrap/cache; \
  find storage -type d -exec chmod 775 {} \; ; \
  find storage -type f -exec chmod 664 {} \; ; \
  chmod -R 775 bootstrap/cache

# Script de arranque (migraciones/SSL si lo usas)
COPY docker/init-ssl.sh /usr/local/bin/init-ssl.sh
RUN chmod +x /usr/local/bin/init-ssl.sh

CMD ["/usr/local/bin/init-ssl.sh"]
