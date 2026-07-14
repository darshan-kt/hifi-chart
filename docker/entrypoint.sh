#!/bin/sh
# Renders the nginx config from the template (so the listen port is
# configurable via $PORT) and hands off to nginx as PID 1.
set -e

export PORT="${PORT:-80}"

envsubst '${PORT}' < /etc/nginx/templates/nginx.conf.template > /etc/nginx/conf.d/default.conf

echo "🍔 HiFi Chats — serving the static site on port ${PORT}"

exec nginx -g "daemon off;"
