"use client"

import { useState } from "react"
import { Heart, Trash2, ShoppingBag } from "lucide-react"
import { Button } from "@medusajs/ui"
import { FavoriteProduct } from "@lib/data/favorites"
import { removeFromFavorites } from "@lib/data/favorites"
import { addToCart } from "@lib/data/cart"
import Image from "next/image"
import Link from "next/link"

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
        // Sayfayı yenile
        window.location.reload()
      }
    } catch (error) {
      console.error("Favori kaldırılırken hata:", error)
    } finally {
      setRemovingId(null)
    }
  }

  const handleAddToCart = async (productId: string) => {
    setAddingToCartId(productId)
    try {
      // Burada ürünün ilk varyantını sepete ekliyoruz
      // Gerçek uygulamada kullanıcı varyant seçebilir
      await addToCart({
        variantId: productId, // Bu örnek için productId kullanıyoruz
        quantity: 1,
        countryCode: "tr" // Varsayılan ülke kodu
      })
    } catch (error) {
      console.error("Sepete eklenirken hata:", error)
    } finally {
      setAddingToCartId(null)
    }
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {favorites.map((product) => (
        <div
          key={product.id}
          className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
        >
          {/* Ürün Resmi */}
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.thumbnail || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            
            {/* Favori Kaldır Butonu */}
            <button
              onClick={() => handleRemoveFavorite(product.id)}
              disabled={removingId === product.id}
              className="absolute top-2 right-2 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-red-50 transition-colors duration-200"
            >
              {removingId === product.id ? (
                <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Trash2 className="w-4 h-4 text-red-500" />
              )}
            </button>
          </div>

          {/* Ürün Bilgileri */}
          <div className="p-4">
            <Link href={`/products/${product.handle}`}>
              <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-pink-600 transition-colors">
                {product.title}
              </h3>
            </Link>

            {/* Aksiyon Butonları */}
            <div className="flex items-center justify-between mt-4">
              <Button
                onClick={() => handleAddToCart(product.id)}
                disabled={addingToCartId === product.id}
                className="flex-1 bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white"
              >
                {addingToCartId === product.id ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <ShoppingBag className="w-4 h-4 mr-2" />
                )}
                Sepete Ekle
              </Button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
} 