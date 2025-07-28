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

  // Alternatif fiyat hesaplama - calculated_price yoksa
  const getAlternativePrice = () => {
    if (cheapestPrice) return null // calculated_price varsa kullan
    
    const firstVariant = product.variants?.[0] as any
    if (!firstVariant?.prices?.length) return null
    
    // İlk fiyatı al (genellikle varsayılan fiyat)
    const price = firstVariant.prices[0]
    if (!price?.amount) return null
    
    return {
      calculated_price: `${Math.floor(price.amount)}₺`,
      calculated_price_number: price.amount,
      price_type: "default" as const,
      currency_code: price.currency_code || region.currency_code
    }
  }

  const alternativePrice = getAlternativePrice()
  const displayPrice = cheapestPrice || alternativePrice

  // Debug için fiyat bilgilerini kontrol et
  useEffect(() => {
    console.log(`ProductPreview Debug - Product: ${product.title}`, {
      productId: product.id,
      variants: product.variants?.map(v => ({
        id: v.id,
        calculated_price: (v as any).calculated_price,
        prices: (v as any).prices
      })),
      cheapestPrice,
      alternativePrice,
      displayPrice,
      region: region.currency_code
    })
  }, [product, cheapestPrice, alternativePrice, displayPrice, region])

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
      <div data-testid="product-wrapper" className="relative bg-white rounded-lg border border-gray-100 hover:border-rose-200 hover:shadow-md transition-all duration-200 overflow-hidden">
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

          {/* İndirim Badge */}
          {cheapestPrice?.price_type === "sale" && cheapestPrice?.percentage_diff && (
            <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
              %{Math.abs(Number(cheapestPrice.percentage_diff))} İndirim
            </div>
          )}
        </div>
        
        {/* Ürün Bilgileri */}
        <div className="p-4">
          {/* Ürün Başlığı */}
          <div className="mb-3">
            <Text 
              className="text-gray-900 font-medium text-sm line-clamp-2 group-hover:text-rose-600 transition-colors duration-200" 
              data-testid="product-title"
            >
              {product.title}
            </Text>
          </div>
          
          {/* Fiyat Bölümü */}
          <div className="flex justify-between items-end">
            <div className="flex-1">
              {displayPrice ? (
                cheapestPrice ? (
                  <PreviewPrice price={cheapestPrice} />
                ) : (
                  // Alternatif fiyat gösterimi
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      <Text className="font-bold text-lg text-gray-900">
                        {alternativePrice?.calculated_price}
                      </Text>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-sm text-gray-400">
                  Fiyat Yok
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
