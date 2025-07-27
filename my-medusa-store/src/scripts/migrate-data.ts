import { createConnection } from 'pg'
import { loadEnv } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

async function migrateData() {
  console.log('🚀 Veri aktarımı başlıyor...')

  // Yerel veritabanı bağlantısı
  const localDb = createConnection({
    host: 'localhost',
    port: 5432,
    database: 'your_local_database',
    user: 'your_username',
    password: 'your_password'
  })

  // Render veritabanı bağlantısı
  const renderDb = createConnection({
    connectionString: process.env.DATABASE_URL
  })

  try {
    await localDb.connect()
    await renderDb.connect()

    console.log('✅ Veritabanı bağlantıları başarılı')

    // Ürünleri aktar
    console.log('📦 Ürünler aktarılıyor...')
    const products = await localDb.query('SELECT * FROM products')
    for (const product of products.rows) {
      await renderDb.query(
        'INSERT INTO products (id, title, handle, thumbnail, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [product.id, product.title, product.handle, product.thumbnail, product.created_at, product.updated_at]
      )
    }

    // Koleksiyonları aktar
    console.log('📚 Koleksiyonlar aktarılıyor...')
    const collections = await localDb.query('SELECT * FROM collections')
    for (const collection of collections.rows) {
      await renderDb.query(
        'INSERT INTO collections (id, title, handle, created_at, updated_at) VALUES ($1, $2, $3, $4, $5) ON CONFLICT (id) DO NOTHING',
        [collection.id, collection.title, collection.handle, collection.created_at, collection.updated_at]
      )
    }

    // Müşterileri aktar
    console.log('👥 Müşteriler aktarılıyor...')
    const customers = await localDb.query('SELECT * FROM customers')
    for (const customer of customers.rows) {
      await renderDb.query(
        'INSERT INTO customers (id, email, first_name, last_name, created_at, updated_at) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (id) DO NOTHING',
        [customer.id, customer.email, customer.first_name, customer.last_name, customer.created_at, customer.updated_at]
      )
    }

    // Favorileri aktar
    console.log('❤️ Favoriler aktarılıyor...')
    const favorites = await localDb.query('SELECT * FROM product_favorites')
    for (const favorite of favorites.rows) {
      await renderDb.query(
        'INSERT INTO product_favorites (customer_id, product_id, created_at, updated_at) VALUES ($1, $2, $3, $4) ON CONFLICT (customer_id, product_id) DO NOTHING',
        [favorite.customer_id, favorite.product_id, favorite.created_at, favorite.updated_at]
      )
    }

    console.log('🎉 Veri aktarımı tamamlandı!')

  } catch (error) {
    console.error('❌ Veri aktarımı sırasında hata:', error)
  } finally {
    await localDb.end()
    await renderDb.end()
  }
}

migrateData() 