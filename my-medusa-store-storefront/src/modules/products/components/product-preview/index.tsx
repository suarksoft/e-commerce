"use client"

import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import { Heart } from "lucide-react"
import { useState, useEffect } from "react"
import { addToFavorites, removeFromFavorites, isProductFavorited } from "@lib/data/favorites"

export default function ProductPreview({
  product,
  isFeatured,
  region,
}: {
  product: HttpTypes.StoreProduct
  isFeatured?: boolean
  region: HttpTypes.StoreRegion
}) {
  const [isFavorited, setIsFavorited] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { cheapestPrice } = getProductPrice({
    product,
  })

  const handleFavoriteClick = async (e: React.MouseEvent) => {
    e.preventDefault() // Link'e tıklamayı engelle
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      if (isFavorited) {
        await removeFromFavorites(product.id!)
        setIsFavorited(false)
      } else {
        await addToFavorites(product.id!)
        setIsFavorited(true)
      }
    } catch (error) {
      console.error("Favori işlemi başarısız:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Sayfa yüklendiğinde favori durumunu kontrol et
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      try {
        const favorited = await isProductFavorited(product.id!)
        setIsFavorited(favorited)
      } catch (error) {
        console.error("Favori durumu kontrol edilemedi:", error)
      }
    }
    checkFavoriteStatus()
  }, [product.id])

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper" className="relative">
        <div className="relative">
          <Thumbnail
            thumbnail={product.thumbnail}
            images={product.images}
            size="full"
            isFeatured={isFeatured}
          />
          
          {/* Favori Butonu */}
          <button
            onClick={handleFavoriteClick}
            disabled={isLoading}
            className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-200 z-10"
          >
            {isLoading ? (
              <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Heart 
                className={`w-4 h-4 transition-colors duration-200 ${
                  isFavorited 
                    ? "text-rose-500 fill-current" 
                    : "text-gray-600 group-hover:text-rose-500"
                }`} 
              />
            )}
          </button>
        </div>
        
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">
            {product.title}
          </Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
