"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@medusajs/ui"
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  title: string
  thumbnail: string
  price: number
  original_price?: number
  rating?: number
  reviews?: number
  discount_percentage?: number
  inStock: boolean
}

export default function SaleProductsCarousel() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Koleksiyon ID'sini bilmediğimiz için önce koleksiyonları çekip "indirim" koleksiyonunu bulacağız
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // "indirim" adlı koleksiyonu bul
        const discountCollection = data.collections?.find(
          (c: any) => c.handle === "indirim" || c.title.toLowerCase() === "indirim",
        )

        if (!discountCollection) {
          console.error("İndirim koleksiyonu bulunamadı")
          setLoading(false)
          return
        }

        // Koleksiyon ID'si ile ürünleri çek
        return fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?collection_id[]=${discountCollection.id}&limit=10`,
          {
            headers: {
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
            },
          },
        )
      })
      .then((res) => {
        if (!res) return null
        return res.json()
      })
      .then((data) => {
        if (!data || !data.products || !Array.isArray(data.products)) {
          setProducts([])
          setLoading(false)
          return
        }

        console.log("İndirimli ürünler:", data.products)
        console.log("İlk ürün detayı:", data.products[0])
        console.log("İlk ürün variant:", data.products[0]?.variants?.[0])
        console.log("İlk ürün fiyat:", data.products[0]?.variants?.[0]?.prices)

        // Ürünleri dönüştür
        const formattedProducts = data.products.map((p: any) => {
          const variant = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null
          const priceObj = Array.isArray(variant?.prices) && variant.prices.length > 0 ? variant.prices[0] : null

          const currentPrice = priceObj?.amount ?? null
          const originalPrice = currentPrice ? Math.round(currentPrice * 1.4) : null // %30 indirim varsayalım

          const discountPercentage =
            originalPrice && currentPrice
              ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
              : 0

          // Stok kontrolü
          const manageInventory = variant?.manage_inventory ?? false
          const inventoryQuantity = variant?.inventory_quantity ?? null
          const inStock = !manageInventory || (inventoryQuantity !== null && inventoryQuantity > 0)

          return {
            id: p.id,
            title: p.title,
            thumbnail: p.thumbnail || "/placeholder.svg?height=300&width=250",
            price: currentPrice,
            original_price: originalPrice && originalPrice > currentPrice ? originalPrice : undefined,
            rating: p.rating || 4.8,
            reviews: typeof p.reviews === 'number' ? p.reviews : 0,
            discount_percentage: discountPercentage > 0 ? discountPercentage : undefined,
            inStock,
          }
        })

        setProducts(formattedProducts)
        setLoading(false)
      })
      .catch((err) => {
        console.error("İndirimli ürünler alınırken hata oluştu:", err)
        setLoading(false)
        setProducts([])
      })
  }, [])

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 280 // Card width + gap
      container.scrollBy({ left: -cardWidth * 2, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current
      const cardWidth = 280 // Card width + gap
      container.scrollBy({ left: cardWidth * 2, behavior: "smooth" })
    }
  }

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Büyük İndirim
                </span>
              </h2>
              <p className="text-gray-600">Seçili ürünlerde %40'a varan indirimler</p>
            </div>
          </div>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {[...Array(4)].map((_, index) => (
              <div key={index} className="flex-none w-64 bg-gray-100 rounded-2xl shadow-lg animate-pulse h-80"></div>
            ))}
          </div>
        </div>
      </section>
    )
  }

  if (products.length === 0) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                  Büyük İndirim
                </span>
              </h2>
              <p className="text-gray-600">Seçili ürünlerde %40'a varan indirimler</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Şu anda indirimli ürün bulunmuyor.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
              <span className="bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                Büyük İndirim
              </span>
            </h2>
            <p className="text-gray-600">Seçili ürünlerde %40'a varan indirimler</p>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden sm:flex gap-2">
            <button
              onClick={scrollLeft}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-rose-100 flex items-center justify-center transition-colors duration-200 group"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
            </button>
            <button
              onClick={scrollRight}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-rose-100 flex items-center justify-center transition-colors duration-200 group"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-rose-600" />
            </button>
          </div>
        </div>

        {/* Products Carousel */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide pb-4"
            style={{
              scrollSnapType: "x mandatory",
              scrollbarWidth: "none",
              msOverflowStyle: "none",
            }}
          >
            {products.map((product) => (
              <div
                key={product.id}
                className="flex-none w-64 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
                style={{ scrollSnapAlign: "start" }}
              >
                {/* Product Image */}
                <div className="relative overflow-hidden rounded-t-2xl">
                  <Image
                    src={product.thumbnail || "/placeholder.svg"}
                    alt={product.title}
                    width={250}
                    height={300}
                    className="w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                  />

                  {/* Discount Badge - sadece geçerli indirim varsa göster */}
                  {product.discount_percentage &&
                    product.discount_percentage > 0 &&
                    !isNaN(product.discount_percentage) && (
                      <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-sm font-bold">
                        %{product.discount_percentage}
                      </div>
                    )}

                  {/* Favorite Button */}
                  <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 rounded-full flex items-center justify-center shadow-md hover:bg-white transition-colors duration-200 group">
                    <Heart className="w-4 h-4 text-gray-600 group-hover:text-rose-500 group-hover:fill-current" />
                  </button>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      size="small"
                      className="bg-white text-gray-900 hover:bg-gray-100 font-semibold px-4 py-2 rounded-full transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300"
                    >
                      <ShoppingBag className="w-4 h-4 mr-2" />
                      Hızlı Ekle
                    </Button>
                  </div>
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.floor(product.rating || 0) ? "text-amber-400 fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">{product.title}</h3>

                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-rose-600">
                      {product.price ? `₺${(product.price / 100).toLocaleString("tr-TR")}` : "Fiyat Yok"}
                    </span>
                    {product.original_price && product.original_price > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        ₺{(product.original_price / 100).toLocaleString("tr-TR")}
                      </span>
                    )}
                  </div>

                  {product.inStock ? (
                  <Button
                    size="small"
                    className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-semibold rounded-xl transition-all duration-300"
                  >
                    <ShoppingBag className="w-4 h-4 mr-2" />
                    Sepete Ekle
                  </Button>
                  ) : (
                    <Button
                      size="small"
                      className="w-full bg-gray-300 text-gray-500 font-semibold rounded-xl cursor-not-allowed"
                      disabled
                    >
                      Stokta Yok
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile scroll indicator */}
          <div className="flex justify-center mt-4 sm:hidden">
            <div className="flex gap-1">
              {Array.from({ length: Math.min(5, Math.ceil(products.length / 2)) }).map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                    index === 0 ? "bg-rose-500" : "bg-gray-300"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* View All Button */}
        <div className="text-center mt-8">
          <Button
            variant="secondary"
            size="large"
            className="border-2 border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-3 font-semibold rounded-full transition-all duration-300"
          >
            Tüm İndirimli Ürünleri Gör
          </Button>
        </div>
      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </section>
  )
}
