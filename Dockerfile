# docker build . -t my-php-app:1.0.0

FROM nginx
RUN cd html/
COPY . /usr/share/nginx/html
