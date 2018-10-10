# docker build . -t my-php-app:1.0.0

FROM nginx
RUN cd /src/html
COPY . /usr/share/nginx/html
