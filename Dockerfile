# docker build . -t my-php-app:1.0.0

FROM nginx
COPY /src/html/* /usr/share/nginx/html
