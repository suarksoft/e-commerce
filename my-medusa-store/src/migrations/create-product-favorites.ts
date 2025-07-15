import { Migration } from '@mikro-orm/migrations'

export class CreateProductFavorites extends Migration {
  async up(): Promise<void> {
    this.addSql(`
      CREATE TABLE IF NOT EXISTS product_favorites (
        id SERIAL PRIMARY KEY,
        customer_id VARCHAR(255) NOT NULL,
        product_id VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(customer_id, product_id)
      );
      
      CREATE INDEX IF NOT EXISTS idx_product_favorites_customer_id ON product_favorites(customer_id);
      CREATE INDEX IF NOT EXISTS idx_product_favorites_product_id ON product_favorites(product_id);
    `)
  }

  async down(): Promise<void> {
    this.addSql('DROP TABLE IF EXISTS product_favorites;')
  }
} 