#!/usr/bin/env bash
set -euo pipefail

DOMAIN_MAIN="${APACHE_SERVER_NAME:-visitapp.noko.com.py}"
DOMAIN_WWW="www.${DOMAIN_MAIN}"
EMAIL="${LE_EMAIL:-admin@${DOMAIN_MAIN}}"
CERT_DIR="/etc/letsencrypt/live/${DOMAIN_MAIN}"

APACHE_FG="apache2ctl -D FOREGROUND"

stop_apache_if_running() {
  if pgrep -x apache2 >/dev/null 2>&1; then
    apache2ctl -k stop || true
    sleep 1
  fi
}

issue_cert_if_missing() {
  if [ ! -f "${CERT_DIR}/fullchain.pem" ] || [ ! -f "${CERT_DIR}/privkey.pem" ]; then
    echo "[init-ssl] No hay certificados. Emite con certbot standalone..."
    stop_apache_if_running
    certbot certonly --standalone \
      --preferred-challenges http \
      -d "${DOMAIN_MAIN}" -d "${DOMAIN_WWW}" \
      -m "${EMAIL}" --agree-tos --non-interactive
    echo "[init-ssl] Certificados emitidos."
  else
    echo "[init-ssl] Certificados existentes, skip emisión."
  fi
}

start_renew_loop() {

  (
    while true; do
      certbot renew --quiet --deploy-hook "apache2ctl -k graceful"
      sleep 12h
    done
  ) &
}


issue_cert_if_missing
a2ensite vhost-ssl.conf >/dev/null 2>&1 || true
start_renew_loop

php /var/www/html/artisan key:generate --force || true
php /var/www/html/artisan storage:link || true
php /var/www/html/artisan migrate --force
php /var/www/html/artisan db:seed --force || true
php /var/www/html/artisan config:cache && php /var/www/html/artisan route:cache && php /var/www/html/artisan view:cache || true

exec ${APACHE_FG}
