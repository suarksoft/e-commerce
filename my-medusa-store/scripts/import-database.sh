#!/bin/bash

# Render PostgreSQL import script
# Kullanım: ./scripts/import-database.sh

echo "🚀 Render PostgreSQL'e veri aktarımı başlıyor..."

# Render PostgreSQL connection string'i buraya ekleyin
RENDER_DB_URL="postgresql://moda_es_es_user:password@host:port/moda_es_es"

# Backup dosyasının yolu
BACKUP_FILE="backup.sql"

# Veritabanını import et
echo "📥 Veritabanı import ediliyor..."
psql "$RENDER_DB_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Veritabanı başarıyla import edildi!"
else
    echo "❌ Import sırasında hata oluştu!"
    exit 1
fi

echo "�� İşlem tamamlandı!" 