#!/bin/bash

# CSV export script
# Kullanım: ./scripts/export-to-csv.sh

echo "📤 CSV formatında export başlıyor..."

# Yerel veritabanı bilgileri
LOCAL_DB="postgresql://username:password@localhost:5432/database_name"

# Export edilecek tablolar
TABLES=("products" "collections" "customers" "orders" "product_favorites")

# CSV klasörü oluştur
mkdir -p csv_exports

# Her tablo için CSV export et
for table in "${TABLES[@]}"; do
    echo "📋 $table tablosu CSV'ye export ediliyor..."
    
    # CSV export
    psql "$LOCAL_DB" -c "\COPY $table TO 'csv_exports/${table}.csv' WITH CSV HEADER"
    
    if [ $? -eq 0 ]; then
        echo "✅ $table.csv oluşturuldu!"
    else
        echo "❌ $table CSV export edilirken hata oluştu!"
    fi
done

echo "🎉 CSV export işlemi tamamlandı!"
echo "📁 Export edilen dosyalar:"
ls -la csv_exports/ 