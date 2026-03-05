FROM php:8.4-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    libpq-dev \
    unzip \
    && docker-php-ext-install pdo pdo_pgsql \
    && apt-get clean

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www

# Copy project files
COPY . .

# Install PHP dependencies
RUN composer install --optimize-autoloader

# Set permissions
RUN chmod -R 775 storage bootstrap/cache

# Expose port
EXPOSE 10000

# Start Laravel
CMD php artisan config:cache && php artisan route:cache && php artisan migrate --force && php artisan db:seed --force && php artisan serve --host=0.0.0.0 --port=10000