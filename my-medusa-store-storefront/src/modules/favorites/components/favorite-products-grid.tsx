"use client"

import { FavoriteProduct } from "@lib/data/favorites"
import { removeFromFavorites } from "@lib/data/favorites"
import { addToCart } from "@lib/data/cart"
import { useState } from "react"
import { Trash2, ShoppingCart, Heart } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"

interface FavoriteProductsGridProps {
  favorites: FavoriteProduct[]
}

export default function FavoriteProductsGrid({ favorites }: FavoriteProductsGridProps) {
  const [removingId, setRemovingId] = useState<string | null>(null)
  const [addingToCartId, setAddingToCartId] = useState<string | null>(null)

  const handleRemoveFavorite = async (productId: string) => {
    setRemovingId(productId)
    try {
      const success = await removeFromFavorites(productId)
      if (success) {
        window.location.reload() // Reload page after removal
      }
    } catch (error) {
      console.error("Favori kaldırılırken hata:", error)
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (product: FavoriteProduct) => {
    setAddingToCartId(product.id)
    try {
      if (!product.variants || product.variants.length === 0) {
        throw new Error("Ürün varyantı bulunamadı")
      }

      // İlk varyantı kullan
      const firstVariant = product.variants[0]
      
      await addToCart({
        variantId: firstVariant.id,
        quantity: 1,
        countryCode: "tr"
      })
    } catch (error) {
      console.error("Sepete eklenirken hata:", error)
    } finally {
      setAddingToCartId(null)
    }
  }

  if (favorites.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
          <Heart className="w-12 h-12 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Favori Ürününüz Yok</h3>
        <p className="text-gray-600 mb-6">Beğendiğiniz ürünleri favorilere ekleyerek daha sonra kolayca bulabilirsiniz.</p>
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700"
        >
          Alışverişe Başla
        </LocalizedClientLink>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((product) => (
        <div key={product.id} className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
          {/* Ürün Resmi */}
          <LocalizedClientLink href={`/products/${product.handle}`} className="block">
            <div className="relative aspect-square overflow-hidden">
              <Thumbnail
                thumbnail={product.thumbnail}
                size="full"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          </LocalizedClientLink>

          {/* Ürün Bilgileri */}
          <div className="p-4">
            <LocalizedClientLink href={`/products/${product.handle}`} className="block">
              <h3 className="text-lg font-medium text-gray-900 mb-2 hover:text-pink-600 transition-colors duration-200">
                {product.title}
              </h3>
            </LocalizedClientLink>

            {/* Butonlar */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => handleAddToCart(product)}
                disabled={addingToCartId === product.id}
                className="flex-1 mr-2 bg-pink-600 text-white px-4 py-2 rounded-md hover:bg-pink-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                {addingToCartId === product.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Sepete Ekle
                  </>
                )}
              </button>

              <button
                onClick={() => handleRemoveFavorite(product.id)}
                disabled={removingId === product.id}
                className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Favorilerden Kaldır"
              >
                {removingId === product.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 