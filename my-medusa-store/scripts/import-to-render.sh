#!/bin/bash

# Render PostgreSQL'e import script
# Kullanım: ./scripts/import-to-render.sh backup_dosyasi.sql

echo "🚀 Render PostgreSQL'e import başlıyor..."

# Render PostgreSQL connection string
RENDER_DB_URL="postgresql://moda_es_es_db_user:oSZknwS1imzuhs10rbsUKeTxRqvHkB98@dpg-d22hae63jp1c738u7a50-a.frankfurt-postgres.render.com/moda_es_es_db"

# Backup dosyası
BACKUP_FILE="$1"

if [ -z "$BACKUP_FILE" ]; then
    echo "❌ Backup dosyası belirtilmedi!"
    echo "Kullanım: ./scripts/import-to-render.sh backup_dosyasi.sql"
    exit 1
fi

if [ ! -f "$BACKUP_FILE" ]; then
    echo "❌ Backup dosyası bulunamadı: $BACKUP_FILE"
    exit 1
fi

echo "📁 Backup dosyası: $BACKUP_FILE"
echo "📊 Dosya boyutu: $(du -h "$BACKUP_FILE" | cut -f1)"

echo ""
echo "📥 Render PostgreSQL'e import ediliyor..."

# Import işlemi
psql "$RENDER_DB_URL" < "$BACKUP_FILE"

if [ $? -eq 0 ]; then
    echo "✅ Import başarıyla tamamlandı!"
    
    echo ""
    echo "🔍 Import sonrası kontrol..."
    
    # Tabloları listele
    echo "📊 Tablolar:"
    psql "$RENDER_DB_URL" -c "\dt" | head -20
    
    # Veri sayılarını kontrol et
    echo ""
    echo "📈 Veri sayıları:"
    psql "$RENDER_DB_URL" -c "
    SELECT 
        tablename,
        n_tup_ins as kayit_sayisi
    FROM pg_stat_user_tables 
    WHERE schemaname = 'public'
    ORDER BY n_tup_ins DESC;
    "
    
    echo ""
    echo "🎉 Import işlemi tamamlandı!"
    echo "🌐 Render Dashboard'da kontrol edebilirsiniz:"
    echo "   https://dashboard.render.com/web/srv-xxxxx"
    
else
    echo "❌ Import sırasında hata oluştu!"
    echo "🔍 Hata detayları için logları kontrol edin."
    exit 1
fi 