# docker build . -t my-php-app:1.0.0

FROM nginx
COPY html/. /usr/share/nginx/html/
