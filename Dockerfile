# docker build . -t my-php-app:1.0.0

FROM nginx
cd /src/html
COPY . /usr/share/nginx/html
