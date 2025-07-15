import { Metadata } from "next"
import { getFavorites } from "@lib/data/favorites"
import { redirect } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import FavoriteProductsGrid from "@modules/favorites/components/favorite-products-grid"

export const metadata: Metadata = {
  title: "Favori Ürünlerim",
  description: "Favori ürünlerinizi görüntüleyin ve yönetin",
}

export default async function FavoritesPage() {
  const customer = await retrieveCustomer()
  
  if (!customer) {
    redirect("/account/login")
  }

  const favorites = await getFavorites()

  return (
    <div className="py-12">
      <div className="content-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favori Ürünlerim</h1>
          <p className="text-gray-600">
            {favorites.length > 0 
              ? `${favorites.length} ürün favorilerinizde` 
              : "Henüz favori ürününüz yok"
            }
          </p>
        </div>

        {favorites.length > 0 ? (
          <FavoriteProductsGrid favorites={favorites} />
        ) : (
          <div className="text-center py-12">
            <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Favori Ürününüz Yok</h3>
            <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
            >
              Alışverişe Başla
            </a>
          </div>
        )}
      </div>
    </div>
  )
} 