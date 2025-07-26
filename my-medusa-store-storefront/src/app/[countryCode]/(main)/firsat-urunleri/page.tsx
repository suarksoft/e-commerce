import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByName } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

export const metadata: Metadata = {
  title: "Fırsat Ürünleri | Moda Es Es",
  description: "En uygun fiyatlarla fırsat ürünlerimizi keşfedin",
}

const PRODUCT_LIMIT = 12

export default async function FirsatUrunleriPage({
  params,
  searchParams,
}: {
  params: { countryCode: string }
  searchParams: { page?: string }
}) {
  const region = await getRegion(params.countryCode)
  if (!region) return notFound()

  // Kategoriyi isim ile bul
  const category = await getCategoryByName("firsat-urunleri")
  if (!category) return notFound()

  // Sayfalama
  const page = Number(searchParams.page) || 1

  // Kategoriye ait ürünleri çek
  const { response } = await listProducts({
    pageParam: page,
    queryParams: {
      category_id: [category.id],
      limit: PRODUCT_LIMIT,
      is_giftcard: false,
    } as any,
    regionId: region.id,
  })

  const { products, count } = response

  if (!products || products.length === 0) {
    return (
      <div className="py-24 text-center text-gray-500">
        Bu kategoride ürün bulunamadı.
      </div>
    )
  }

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="content-container py-6">
      <h1 className="mb-6 text-3xl font-bold">Fırsat Ürünleri</h1>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
        {products.map((product) => (
          <ProductPreview 
            product={product} 
            key={product.id} 
            region={region}
          />
        ))}
      </div>
      {totalPages > 1 && (
        <Pagination
          page={page}
          totalPages={totalPages}
        />
      )}
    </div>
  )
}   