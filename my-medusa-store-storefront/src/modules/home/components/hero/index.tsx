"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { ChevronLeft, ChevronRight, ShoppingBag, Heart, Star } from "lucide-react"
import Image from "next/image"
import { useSwipe } from "@lib/hooks/useSwipe"

type Product = {
  id: string
  title: string
  thumbnail: string
  price: number
  original_price?: number
  rating?: number
  reviews?: number
}

export default function BoutiqueHero() {
  const [products, setProducts] = useState<Product[]>([])
  const [currentProduct, setCurrentProduct] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

useEffect(() => {
  fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=5`, {
    headers: {
      "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
    },
  })
    .then((res) => res.json())
    .then((data) => {
      console.log("API yanıtı:", data.products?.[0])
      console.log("Tüm ürünler:", data.products)
      if (!data.products || !Array.isArray(data.products)) {
        setProducts([])
        return
      }
      setProducts(
  data.products.map((p: any) => {
    const variant = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null
    const priceObj = variant?.prices?.find((pr: any) => pr.currency_code === "try") || variant?.prices?.[0]
    return {
      id: p.id,
      title: p.title,
      thumbnail: p.thumbnail || "/placeholder.svg?height=400&width=300",
      price: priceObj?.amount ?? 0,
      original_price: undefined,
      rating: p.rating || 4.8,
      reviews: p.reviews || 100,
    }
  })
)
    })
    .catch((err) => {
      console.error("Ürünler alınırken hata oluştu:", err)
      setProducts([])
    })
}, [])

  const nextProduct = () => {
    setCurrentProduct((prev) => (prev + 1) % products.length)
    setIsAutoPlaying(false)
  }

  const prevProduct = () => {
    setCurrentProduct((prev) => (prev - 1 + products.length) % products.length)
    setIsAutoPlaying(false)
  }

  const swipeHandlers = useSwipe({
    onSwipedLeft: nextProduct,
    onSwipedRight: prevProduct,
  })

  useEffect(() => {
    if (!isAutoPlaying || products.length === 0) return

    const interval = setInterval(() => {
      setCurrentProduct((prev) => (prev + 1) % products.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, products.length])

  if (products.length === 0) {
    return (
      <section className="min-h-screen flex items-center justify-center">
        <span>Yükleniyor...</span>
      </section>
    )
  }

  const currentItem = products[currentProduct]

  return (
    <section className="relative min-h-screen lg:min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 bg-rose-300 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-24 h-24 bg-amber-300 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-orange-300 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-4 py-8 sm:py-12 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center min-h-screen">
          {/* Sol Taraf - İçerik */}
          <div className="space-y-8 lg:pr-8">
            <div className="space-y-6">
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-rose-100 to-orange-100 rounded-full text-sm font-medium text-rose-800 border border-rose-200">
                <Heart className="w-4 h-4 mr-2 text-rose-600" />
                Yeni Sezon Koleksiyonu
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent">
                  Tarzınızı
                </span>
                <br />
                <span className="text-gray-800">Keşfedin</span>
              </h1>

              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Özenle seçilmiş, kaliteli ve şık parçalarla gardırobunuzu yenileyin. Her zevke uygun, özel tasarımlar
                sizi bekliyor.
              </p>
            </div>

            {/* CTA Butonları */}
            <div className="flex flex-col gap-4">
              <Button
                size="large"
                className="w-full sm:w-auto bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white px-8 py-4 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                <ShoppingBag className="w-5 h-5 mr-2" />
                Alışverişe Başla
              </Button>

              <Button
                variant="secondary"
                size="large"
                className="w-full sm:w-auto border-2 border-rose-300 text-rose-700 hover:bg-rose-50 px-8 py-4 text-lg font-semibold rounded-full transition-all duration-300"
              >
                Koleksiyonu İncele
              </Button>
            </div>

            {/* İstatistikler */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-rose-200">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">500+</div>
                <div className="text-xs sm:text-sm text-gray-600">Ürün Çeşidi</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">10K+</div>
                <div className="text-xs sm:text-sm text-gray-600">Mutlu Müşteri</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-gray-900">4.9</div>
                <div className="text-xs sm:text-sm text-gray-600">Müşteri Puanı</div>
              </div>
            </div>
          </div>

          {/* Sağ Taraf - Ürün Showcase */}
          <div className="relative">
            <div className="relative max-w-sm mx-auto lg:max-w-none" {...swipeHandlers}>
              <div className="relative bg-white rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-8 transform hover:rotate-0 lg:rotate-3 transition-transform duration-500">
                {/* Ürün Resmi */}
                <div className="relative overflow-hidden rounded-xl sm:rounded-2xl mb-4 sm:mb-6 group">
                  <Image
                    src={currentItem.thumbnail}
                    alt={currentItem.title}
                    width={300}
                    height={400}
                    className="w-full h-64 sm:h-80 lg:h-96 object-cover transition-transform duration-700 group-hover:scale-110"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                  {/* Favori Butonu */}
                  <button className="absolute top-4 right-4 w-10 h-10 bg-white/90 rounded-full flex items-center justify-center shadow-lg hover:bg-white transition-colors duration-200">
                    <Heart className="w-5 h-5 text-rose-500" />
                  </button>
                </div>

                {/* Ürün Bilgileri */}
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 sm:w-4 sm:h-4 ${i < Math.floor(currentItem.rating ?? 0) ? "text-amber-400 fill-current" : "text-gray-300"}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs sm:text-sm text-gray-600">({currentItem.reviews} değerlendirme)</span>
                  </div>

                  <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{currentItem.title}</h3>

                  <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                    <span className="text-2xl sm:text-3xl font-bold text-rose-600">
                      ₺{(currentItem.price / 100).toLocaleString("tr-TR")}
                    </span>
                    {currentItem.original_price && (
                      <span className="text-base sm:text-lg text-gray-500 line-through">
                        ₺{(currentItem.original_price / 100).toLocaleString("tr-TR")}
                      </span>
                    )}
                    {currentItem.original_price && (
                      <span className="px-2 py-1 bg-rose-100 text-rose-700 text-xs sm:text-sm font-semibold rounded-full">
                        %
                        {Math.round(
                          (1 - currentItem.price / currentItem.original_price) * 100
                        )}{" "}
                        İndirim
                      </span>
                    )}
                  </div>

                  <Button className="w-full bg-gradient-to-r from-rose-500 to-orange-500 hover:from-rose-600 hover:to-orange-600 text-white py-3 sm:py-4 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105 text-sm sm:text-base">
                    Sepete Ekle
                  </Button>
                </div>
              </div>
            </div>

            {/* Navigasyon Butonları - Sadece desktop */}
            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -left-6 z-20">
              <button
                onClick={prevProduct}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-rose-50 transition-colors duration-200"
              >
                <ChevronLeft className="w-6 h-6 text-rose-600" />
              </button>
            </div>

            <div className="hidden lg:block absolute top-1/2 -translate-y-1/2 -right-6 z-20">
              <button
                onClick={nextProduct}
                className="w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center hover:bg-rose-50 transition-colors duration-200"
              >
                <ChevronRight className="w-6 h-6 text-rose-600" />
              </button>
            </div>

            {/* Ürün Göstergeleri */}
            <div className="flex justify-center gap-2 mt-6">
              {products.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentProduct(index)
                    setIsAutoPlaying(false)
                  }}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentProduct ? "bg-rose-500 w-8" : "bg-rose-200 hover:bg-rose-300"
                  }`}
                />
              ))}
            </div>

            {/* Swipe İpucu - Sadece mobil */}
            <div className="lg:hidden text-center mt-4">
              <p className="text-sm text-gray-500">← Kaydırarak diğer ürünleri görün →</p>
            </div>
          </div>
        </div>
      </div>

      {/* Alt Dalga Efekti */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="w-full h-16 fill-white">
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"></path>
        </svg>
      </div>
    </section>
  )
}
