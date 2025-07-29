import { listProductsWithSort } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

const PRODUCT_LIMIT = 12

type PaginatedProductsParams = {
  limit: number
  collection_id?: string[]
  category_id?: string[]
  id?: string[]
  order?: string
}

export default async function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  searchQuery,
  countryCode,
}: {
  sortBy?: SortOptions
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  searchQuery?: string
  countryCode: string
}) {
  const queryParams: PaginatedProductsParams = {
    limit: PRODUCT_LIMIT,
  }

  if (collectionId) {
    queryParams["collection_id"] = [collectionId]
  }

  if (categoryId) {
    queryParams["category_id"] = [categoryId]
  }

  if (productsIds) {
    queryParams["id"] = productsIds
  }

  if (sortBy === "created_at") {
    queryParams["order"] = "created_at"
  }

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  let {
    response: { products, count },
  } = await listProductsWithSort({
    page,
    queryParams,
    sortBy,
    countryCode,
  })

  // Arama sorgusu varsa ürünleri filtrele (geçici olarak devre dışı)
  let filteredProducts = products
  let filteredCount = count

  // Backend'de arama özelliği olmadığı için geçici olarak devre dışı
  // if (searchQuery) {
  //   const query = searchQuery.toLowerCase()
  //   filteredProducts = products.filter(product => 
  //     product.title?.toLowerCase().includes(query) ||
  //     product.description?.toLowerCase().includes(query) ||
  //     product.tags?.some(tag => tag.value?.toLowerCase().includes(query)) ||
  //     product.collection?.title?.toLowerCase().includes(query)
  //   )
  //   filteredCount = filteredProducts.length
  // }

  const totalPages = Math.ceil(filteredCount / PRODUCT_LIMIT)
  

  return (
    <>
      {searchQuery ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Ürün arama özelliği çok yakında sizlerle!
          </h3>
          <p className="text-gray-500">
            Şu anda kategorileri keşfedebilir veya önerilen aramaları deneyebilirsiniz.
          </p>
        </div>
      ) : (
        <>
          <ul
            className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8"
            data-testid="products-list"
          >
            {filteredProducts.map((p) => {
              return (
                <li key={p.id}>
                  <ProductPreview product={p} region={region} />
                </li>
              )
            })}
          </ul>
          {totalPages > 1 && (
            <Pagination
              data-testid="product-pagination"
              page={page}
              totalPages={totalPages}
            />
          )}
        </>
      )}
    </>
  )
}
