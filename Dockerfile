FROM ubuntu:22.04

LABEL author="Radityo P W (radityo.p.w@gmail.com)"

ARG DEBIAN_FRONTEND=noninteractive

# UPDATE PACKAGES
RUN apt-get update

# INSTALL SYSTEM UTILITIES
RUN apt-get install -y \
    apt-utils \
    curl \
    vim \
    git \
    zip \
    apt-transport-https \
    software-properties-common \
    g++ \
    iputils-ping \
    wget \
    build-essential 

# INSTALL APACHE2
RUN apt-get install -y apache2
RUN a2enmod rewrite

# INSTALL locales
RUN apt-get install -qy language-pack-en-base \
    && locale-gen en_US.UTF-8
ENV LANG en_US.UTF-8
ENV LC_ALL en_US.UTF-8

# INSTALL PHP & LIBRARIES
# RUN add-apt-repository -y ppa:ondrej/php
# RUN apt-get update
# RUN apt-get --no-install-recommends --no-install-suggests --yes --quiet install \
#     php-pear \
#     php8.3 \
#     php8.3-common \
#     php8.3-mbstring \
#     php8.3-dev \
#     php8.3-xml \
#     php8.3-cli \
#     php8.3-mysql \
#     php8.3-sqlite3 \
#     php8.3-mbstring \
#     php8.3-curl \
#     php8.3-gd \
#     php8.3-imagick \
#     php8.3-xdebug \
#     php8.3-xml \
#     php8.3-zip \
#     php8.3-odbc \
#     php8.3-opcache \
#     php8.3-redis \
#     php8.3-intl \
#     autoconf \
#     zlib1g-dev \
#     libapache2-mod-php8.3

# # Install Composer Nightly (2.8-dev)
# RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer \
#   && composer self-update --preview

EXPOSE 80

CMD ["/usr/sbin/apache2ctl", "-D", "FOREGROUND"]