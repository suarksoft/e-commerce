#!/bin/bash

# Belirli tabloları export et
# Kullanım: ./scripts/export-specific-tables.sh

echo "📤 Belirli tablolar export ediliyor..."

# Yerel veritabanı bilgileri
LOCAL_DB="postgresql://username:password@localhost:5432/database_name"

# Export edilecek tablolar
TABLES=("products" "collections" "customers" "orders" "product_favorites")

# Her tablo için ayrı dosya oluştur
for table in "${TABLES[@]}"; do
    echo "📋 $table tablosu export ediliyor..."
    pg_dump -h localhost -U username -d database_name -t "$table" --data-only > "${table}_data.sql"
done

echo "✅ Tablo export işlemi tamamlandı!"
echo "📁 Export edilen dosyalar:"
ls -la *_data.sql 