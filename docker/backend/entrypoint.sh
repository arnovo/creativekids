#!/bin/sh
set -e

echo "🚀 CreativaKids Backend — Starting up..."

# ─── Install Composer dependencies if needed ───────────────
if [ ! -f "vendor/autoload.php" ]; then
    echo "📦 Installing Composer dependencies..."
    composer install --no-interaction --optimize-autoloader
fi

# ─── Generate app key if not set ───────────────────────────
if [ -z "$APP_KEY" ] || [ "$APP_KEY" = "base64:" ]; then
    if grep -q "APP_KEY=$" .env 2>/dev/null || grep -q "APP_KEY=base64:$" .env 2>/dev/null; then
        echo "🔑 Generating application key..."
        php artisan key:generate --force
    fi
fi

# ─── Fix permissions ──────────────────────────────────────
echo "🔧 Setting permissions..."
chown -R www-data:www-data storage bootstrap/cache 2>/dev/null || true
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# ─── Clear and cache config ────────────────────────────────
echo "⚡ Optimizing..."
php artisan config:clear
php artisan route:clear
php artisan view:clear

# ─── Run migrations ───────────────────────────────────────
echo "🗄️  Running migrations..."
php artisan migrate --force 2>/dev/null || echo "⏳ Migrations skipped (DB may not be ready yet)"

# ─── Create storage link ──────────────────────────────────
php artisan storage:link 2>/dev/null || true

echo "✅ Backend ready!"

# ─── Execute the main command (php-fpm) ────────────────────
exec "$@"
