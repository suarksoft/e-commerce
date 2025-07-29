import { listCategories } from "@lib/data/categories"
import { HttpTypes } from "@medusajs/types"
import { Text } from "@medusajs/ui"
import InteractiveLink from "@modules/common/components/interactive-link"
import ProductPreview from "@modules/products/components/product-preview"
import { sdk } from "@lib/config"

// Göstermek istediğimiz belirli kategoriler
const FEATURED_CATEGORY_HANDLES = [
  "elbise",
  "ust-giyim", 
  "alt-giyim",
  "firsat-urunleri"
]

interface FeaturedCategoriesProps {
  region: HttpTypes.StoreRegion
}

async function CategoryRail({
  category,
  region,
}: {
  category: HttpTypes.StoreProductCategory
  region: HttpTypes.StoreRegion
}) {
  // Kategoriden ürünleri al
  const categoryProducts = category.products?.slice(0, 4) || []

  if (!categoryProducts || categoryProducts.length === 0) {
    return null
  }

  // Ürünlerin fiyat bilgilerini region ile birlikte getir
  const productsWithPrices = await Promise.all(
    categoryProducts.map(async (product) => {
      try {
        const response = await sdk.client.fetch<{ product: HttpTypes.StoreProduct }>(
          `/store/products/${product.id}`,
          {
            query: {
              fields: "*variants,*variants.calculated_price,*images,*options,*tags,*categories",
              region_id: region.id,
            },
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
              "x-currency-code": region.currency_code,
            },
          }
        )
        
        // Debug için fiyat bilgilerini kontrol et
        console.log(`Product ${product.id} price data:`, {
          variants: response.product.variants?.map(v => ({
            id: v.id,
            calculated_price: v.calculated_price
          }))
        })
        
        return response.product
      } catch (error) {
        console.error(`Error fetching product ${product.id}:`, error)
        return product
      }
    })
  )

  return (
    <div className="mb-12">
      <div className="flex justify-between items-center mb-6">
        <Text className="text-2xl font-bold text-gray-900">{category.name}</Text>
        <div className="text-rose-600 hover:text-rose-700 font-medium">
          <InteractiveLink href={`/${category.handle}`}>
            Tümünü Gör
          </InteractiveLink>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {productsWithPrices.map((product) => (
          <div key={product.id}>
            <ProductPreview 
              product={product} 
              region={region} 
              isFeatured={true}
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default async function FeaturedCategories({ region }: FeaturedCategoriesProps) {
  // Kategorileri products ile birlikte getir (calculated_price olmadan)
  const allCategories = await listCategories({
    fields: "*products",
    limit: 50
  })
  
  // Sadece belirli kategorileri filtrele
  const featuredCategories = allCategories.filter(category => 
    FEATURED_CATEGORY_HANDLES.includes(category.handle || "")
  )

  if (!featuredCategories || featuredCategories.length === 0) {
    return null
  }

  return (
    <section className="py-12 bg-gray-50">
      <div className="content-container">
        <div className="text-center mb-12">
          <Text className="text-3xl font-bold text-gray-900 mb-4">
            Öne Çıkan Kategoriler
          </Text>
          <Text className="text-gray-600 max-w-2xl mx-auto">
            En popüler kategorilerimizden seçili ürünleri keşfedin
          </Text>
        </div>
        
        <div className="space-y-12">
          {featuredCategories.map((category) => (
            <CategoryRail 
              key={category.id} 
              category={category} 
              region={region} 
            />
          ))}
        </div>
      </div>
    </section>
  )
} 