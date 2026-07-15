#!/bin/bash
set -e

php artisan migrate --force
php artisan db:seed --class=SettingSeeder --force
php artisan config:cache
php artisan route:cache
php artisan view:cache
php artisan storage:link
