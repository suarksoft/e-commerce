#!/bin/bash

# Belirli tabloları import et
# Kullanım: ./scripts/import-specific-tables.sh

echo "📥 Belirli tablolar import ediliyor..."

# Render PostgreSQL connection string
RENDER_DB_URL="postgresql://moda_es_es_user:password@host:port/moda_es_es"

# Import edilecek tablolar
TABLES=("products" "collections" "customers" "orders" "product_favorites")

# Her tablo için import et
for table in "${TABLES[@]}"; do
    if [ -f "${table}_data.sql" ]; then
        echo "📋 $table tablosu import ediliyor..."
        psql "$RENDER_DB_URL" < "${table}_data.sql"
        
        if [ $? -eq 0 ]; then
            echo "✅ $table tablosu başarıyla import edildi!"
        else
            echo "❌ $table tablosu import edilirken hata oluştu!"
        fi
    else
        echo "⚠️ ${table}_data.sql dosyası bulunamadı!"
    fi
done

echo "🎉 Tablo import işlemi tamamlandı!" 