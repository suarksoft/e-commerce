import { Metadata } from "next"
import { notFound } from "next/navigation"
import { getCollectionByHandle, getCollectionByName } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"

export const metadata: Metadata = {
  title: "Yeni Gelenler | Moda Es Es",
  description: "En yeni ürünlerimizi keşfedin",
}

const PRODUCT_LIMIT = 12

export default async function YeniGelenlerPage({
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

  
  // Önce handle ile dene, sonra name ile
  let collection = await getCollectionByHandle("yeni-gelenler")
  
  if (!collection) {
    collection = await getCollectionByName("yeni-gelenler")
  }

  // Debug için collection bilgilerini yazdır
  console.log("Collection bulundu:", collection?.title, collection?.handle, collection?.id)

  if (!collection) {
    return (
      <div className="content-container py-6">
        <div className="mb-8 text-2xl-semi">
          <h1>Yeni Gelenler</h1>
        </div>
        <p>Henüz yeni ürün bulunmamaktadır.</p>
      </div>
    )
  }

  
  const {
    response: { products, count },
  } = await listProducts({
    pageParam: pageNumber,
    queryParams: {
      limit: PRODUCT_LIMIT,
      collection_id: [collection.id],
    } as any,
    countryCode,
  })

  const totalPages = Math.ceil(count / PRODUCT_LIMIT)

  return (
    <div className="content-container py-6">
      <div className="mb-8 text-2xl-semi">
        <h1>Yeni Gelenler</h1>
        <p className="text-sm text-gray-600 mt-2">
          En yeni ürünlerimizi keşfedin
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
          <p className="text-gray-500">Bu kategoride henüz ürün bulunmamaktadır.</p>
        </div>
      )}
    </div>
  )
}