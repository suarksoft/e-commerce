#!/bin/bash

# Tam backup ve restore script
# Kullanım: ./scripts/complete-backup.sh

echo "🚀 Tam veritabanı backup ve restore işlemi başlıyor..."

# Yerel veritabanı bilgileri
LOCAL_DB="postgresql://username:password@localhost:5432/database_name"

# Render PostgreSQL connection string
RENDER_DB_URL="postgresql://moda_es_es_user:password@host:port/moda_es_es"

# Backup dosya adı
BACKUP_FILE="complete_backup_$(date +%Y%m%d_%H%M%S).sql"

echo "📤 Tam backup oluşturuluyor: $BACKUP_FILE"

# Tam backup oluştur (hem schema hem data)
pg_dump -h localhost -U username -d database_name \
  --verbose \
  --clean \
  --if-exists \
  --create \
  --no-owner \
  --no-privileges \
  --blobs \
  > "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Backup başarıyla oluşturuldu: $BACKUP_FILE"
    echo "📊 Backup dosya boyutu: $(du -h "$BACKUP_FILE" | cut -f1)"
else
    echo "❌ Backup oluşturulurken hata oluştu!"
    exit 1
fi

echo ""
echo "📥 Render PostgreSQL'e import ediliyor..."

# Render'a import et
psql "$RENDER_DB_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Import başarıyla tamamlandı!"
    
    # Tablo sayılarını kontrol et
    echo ""
    echo "📊 Import edilen tablolar:"
    psql "$RENDER_DB_URL" -c "\dt"
    
    echo ""
    echo "📈 Veri sayıları:"
    psql "$RENDER_DB_URL" -c "
    SELECT 
        schemaname,
        tablename,
        n_tup_ins as inserts
    FROM pg_stat_user_tables 
    ORDER BY n_tup_ins DESC;
    "
else
    echo "❌ Import sırasında hata oluştu!"
    exit 1
fi

echo ""
echo "🎉 Tam backup ve restore işlemi tamamlandı!"
echo "💾 Backup dosyası: $BACKUP_FILE" 