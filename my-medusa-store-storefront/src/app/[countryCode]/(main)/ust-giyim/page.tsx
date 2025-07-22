import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCategoryByHandle, getCategoryByName } from "@lib/data/categories"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

export const metadata: Metadata = {
  title: "Üst Giyim | Moda Es Es",
  description: "En şık üst giyim ürünlerimizi keşfedin",
}

const PRODUCT_LIMIT = 12

export default async function UstGiyimPage({
  params,
  searchParams,
}: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ page?: string }>
}) {
  const { countryCode } = await params
  const { page } = await searchParams
  
  const pageNumber = page ? parseInt(page) : 1
  const region = await getRegion(countryCode)

  if (!region) {
    notFound()
  }

  let category: import("@medusajs/types").HttpTypes.StoreProductCategory | undefined = await getCategoryByHandle(["ust-giyim"])
  
  if (!category) {
    category = await getCategoryByName("ust-giyim")
  }

  // Debug için kategori bilgilerini yazdır
  console.log("Kategori bulundu:", category?.name, category?.handle, category?.id)

  if (!category) {
    return (
      <div className="content-container py-6">
        <div className="mb-8 text-2xl-semi">
          <h1>Üst Giyim</h1>
        </div>
        <p>Henüz üst giyim ürünü bulunmamaktadır.</p>
      </div>
    )
  }

  const categoryId = (category as import("@medusajs/types").HttpTypes.StoreProductCategory).id

  const {
    response: { products, count },
  } = await listProducts({
    pageParam: pageNumber,
    queryParams: {
      limit: PRODUCT_LIMIT,
      category_id: [categoryId],
    } as any,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="content-container py-6">
      <div className="mb-8 text-2xl-semi">
        <h1>Üst Giyim</h1>
        <p className="text-sm text-gray-600 mt-2">
          En şık üst giyim ürünlerimizi keşfedin
        </p>
      </div>
      
      {products.length > 0 ? (
        <>
          <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8 mb-8">
            {products.map((product) => (
              <li key={product.id}>
                <ProductPreview product={product} region={region} />
              </li>
            ))}
          </ul>
          
          {totalPages > 1 && (
            <Pagination
              page={pageNumber}
              totalPages={totalPages}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">Bu kategoride henüz üst giyim ürünü bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}