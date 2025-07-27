#!/bin/bash

# CSV import script
# Kullanım: ./scripts/import-from-csv.sh

echo "📥 CSV formatında import başlıyor..."

# Render PostgreSQL connection string
RENDER_DB_URL="postgresql://moda_es_es_user:password@host:port/moda_es_es"

# Import edilecek tablolar
TABLES=("products" "collections" "customers" "orders" "product_favorites")

# Her tablo için CSV import et
for table in "${TABLES[@]}"; do
    if [ -f "csv_exports/${table}.csv" ]; then
        echo "📋 $table tablosu CSV'den import ediliyor..."
        
        # Önce tabloyu temizle (opsiyonel)
        psql "$RENDER_DB_URL" -c "TRUNCATE TABLE $table CASCADE;"
        
        # CSV import
        psql "$RENDER_DB_URL" -c "\COPY $table FROM 'csv_exports/${table}.csv' WITH CSV HEADER"
        
        if [ $? -eq 0 ]; then
            echo "✅ $table tablosu başarıyla import edildi!"
        else
            echo "❌ $table tablosu import edilirken hata oluştu!"
        fi
    else
        echo "⚠️ csv_exports/${table}.csv dosyası bulunamadı!"
    fi
done

echo "🎉 CSV import işlemi tamamlandı!" 