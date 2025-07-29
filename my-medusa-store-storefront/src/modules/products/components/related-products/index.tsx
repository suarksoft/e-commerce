import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { HttpTypes } from "@medusajs/types"
import Product from "../product-preview"

type RelatedProductsProps = {
  product: HttpTypes.StoreProduct
  countryCode: string
}

export default async function RelatedProducts({
  product,
  countryCode,
}: RelatedProductsProps) {
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  const currentProductPrice = product.variants?.[0]?.calculated_price?.calculated_amount || 0

  // **AKILLI BENZERLİK ALGORİTMASI**
  
  // 1. ÖNCE AYNİ KOLEKSİYONDAN BENZER FİYATLI ÜRÜNLER
  let relatedProducts: HttpTypes.StoreProduct[] = []
  
  if (product.collection_id) {
    const collectionParams: any = {
      collection_id: [product.collection_id],
      region_id: region.id,
      is_giftcard: false,
      limit: 20 // Daha fazla getir ki filtreleyelim
    }
    
    const collectionProducts = await listProducts({
      queryParams: collectionParams,
      countryCode,
    }).then(({ response }) => {
      return response.products.filter(p => p.id !== product.id)
    })
    
    relatedProducts.push(...collectionProducts)
  }

  // 2. SONRA AYNI CATEGORY/TAG'LARDENKİLER
  if (product.tags && product.tags.length > 0) {
    const tagParams: any = {
      tag_id: product.tags.map((t) => t.id).filter(Boolean) as string[],
      region_id: region.id,
      is_giftcard: false,
      limit: 15
    }
    
    const tagProducts = await listProducts({
      queryParams: tagParams,
      countryCode,
    }).then(({ response }) => {
      return response.products.filter(p => 
        p.id !== product.id && 
        !relatedProducts.some(rp => rp.id === p.id) // Duplicate'leri engelle
      )
    })
    
    relatedProducts.push(...tagProducts)
  }

  // 3. GENEL ÜRÜNLERDEN EKLEYİCİ OLANLAR (fallback)
  if (relatedProducts.length < 8) {
    const generalParams: any = {
      region_id: region.id,
      is_giftcard: false,
      limit: 20
    }
    
    const generalProducts = await listProducts({
      queryParams: generalParams,
      countryCode,
    }).then(({ response }) => {
      return response.products.filter(p => 
        p.id !== product.id && 
        !relatedProducts.some(rp => rp.id === p.id)
      )
    })
    
    relatedProducts.push(...generalProducts)
  }

  if (!relatedProducts.length) {
    return null
  }

  // **AKILLI SIRALAMA STRATEJİSİ**
  const smartSortedProducts = relatedProducts
    .map(p => {
      const productPrice = p.variants?.[0]?.calculated_price?.calculated_amount || 0
      const priceDiff = Math.abs(productPrice - currentProductPrice)
      const priceRatio = currentProductPrice > 0 ? priceDiff / currentProductPrice : 1
      
      // Scoring system (0-100)
      let score = 50 // Base score
      
      // 1. Fiyat uyumu (+30 puan max)
      if (priceRatio <= 0.3) score += 30        // ±30% fiyat farkı = mükemmel
      else if (priceRatio <= 0.5) score += 20   // ±50% fiyat farkı = iyi  
      else if (priceRatio <= 1) score += 10     // ±100% fiyat farkı = kabul edilebilir
      
      // 2. Aynı koleksiyon bonus (+20 puan)
      if (p.collection_id === product.collection_id) score += 20
      
      // 3. Stok durumu (+15 puan)
      const hasStock = p.variants?.some(v => 
        !v.manage_inventory || 
        v.allow_backorder || 
        (v.inventory_quantity && v.inventory_quantity > 0)
      )
      if (hasStock) score += 15
      
      // 4. Premium fiyat bonus (+10 puan) - Daha pahalı ürünler (upselling)
      if (productPrice > currentProductPrice * 1.2) score += 10
      
      // 5. Yeni ürün bonus (+5 puan)
      const isNew = new Date(p.created_at || '').getTime() > Date.now() - (30 * 24 * 60 * 60 * 1000) // Son 30 gün
      if (isNew) score += 5

      return { ...p, _score: score, _priceRatio: priceRatio }
    })
    .sort((a, b) => b._score - a._score) // En yüksek score'dan en düşüğe
    .slice(0, 12) // En iyi 12 ürün

  return (
    <div className="bg-gray-50 py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl mb-4">
            Sizin İçin Seçtiklerimiz
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Bu ürünle uyumlu, benzer fiyat aralığında ve tarzınıza uygun ürünler
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {smartSortedProducts.slice(0, 6).map((relatedProduct) => (
            <div
              key={relatedProduct.id}
              className="group relative bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100 hover:border-rose-200"
            >
              <Product region={region} product={relatedProduct} />
              
              {/* Price Comparison Badge */}
              {(() => {
                const relatedPrice = relatedProduct.variants?.[0]?.calculated_price?.calculated_amount || 0
                const priceDiff = ((relatedPrice - currentProductPrice) / currentProductPrice) * 100
                
                if (Math.abs(priceDiff) > 20) {
                  return (
                    <div className="absolute top-2 right-2 z-10">
                      {priceDiff > 20 && (
                        <span className="bg-amber-100 text-amber-800 text-xs font-medium px-2 py-1 rounded-full">
                          Premium
                        </span>
                      )}
                      {priceDiff < -20 && (
                        <span className="bg-green-100 text-green-800 text-xs font-medium px-2 py-1 rounded-full">
                          Ekonomik
                        </span>
                      )}
                    </div>
                  )
                }
                return null
              })()}
            </div>
          ))}
        </div>

        {/* Show More Button */}
        {smartSortedProducts.length > 6 && (
          <div className="text-center mt-12">
            <button className="inline-flex items-center px-6 py-3 border border-rose-300 text-base font-medium rounded-md text-rose-700 bg-white hover:bg-rose-50 hover:border-rose-400 transition-colors duration-200">
              Daha Fazla Benzer Ürün
              <svg className="ml-2 -mr-1 w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
