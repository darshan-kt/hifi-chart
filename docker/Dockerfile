# HiFi Chats — static marketing/ordering site
# Built with build context = repo root (see docker-compose.yml), so all
# COPY paths below are relative to the project root, not this folder.

FROM nginx:1.27-alpine

# Site pages, styles, scripts & images
COPY index.html menu.html about.html catering.html chat.html contact.html /usr/share/nginx/html/
COPY css/    /usr/share/nginx/html/css/
COPY js/     /usr/share/nginx/html/js/
COPY assets/ /usr/share/nginx/html/assets/

# Nginx config template + startup script
COPY docker/nginx.conf.template /etc/nginx/templates/nginx.conf.template
COPY docker/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

ENV PORT=80
EXPOSE 80

ENTRYPOINT ["/entrypoint.sh"]
