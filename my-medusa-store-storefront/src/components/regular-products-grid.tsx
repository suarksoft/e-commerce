"use client"

import { useState, useEffect } from "react"
import { Button } from "@medusajs/ui"
import { ShoppingBag, Heart, Star, Filter, ChevronDown } from "lucide-react"
import Image from "next/image"

type Product = {
  id: string
  title: string
  thumbnail: string
  price: number
  rating?: number
  reviews?: number
  category?: string
}

export default function RegularProductsGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [discountCollectionId, setDiscountCollectionId] = useState<string | null>(null)
  const [categories, setCategories] = useState<string[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  // İlk olarak indirim koleksiyonunu bulalım
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/collections`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const discountCollection = data.collections?.find(
          (c: any) => c.handle === "indirim" || c.title.toLowerCase() === "indirim",
        )

        if (discountCollection) {
          setDiscountCollectionId(discountCollection.id)
        }

        // Şimdi tüm ürünleri çekelim
        fetchProducts()
      })
      .catch((err) => {
        console.error("Koleksiyonlar alınırken hata oluştu:", err)
        // Hata olsa bile ürünleri çekmeye devam et
        fetchProducts()
        
      })
  }, [])

  const fetchProducts = () => {
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=20`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.products || !Array.isArray(data.products)) {
          setProducts([])
          setLoading(false)
          return
        }

      

        // Kategorileri çıkaralım
        const allCategories = data.products
          .map((p: any) => p.collection?.title)
          .filter((c: string | undefined) => c !== undefined && c.toLowerCase() !== "indirim")

        // Benzersiz kategorileri alalım
        const uniqueCategories = Array.from(new Set<string>(allCategories as string[]))
        setCategories(uniqueCategories)

        // İndirim koleksiyonunda olmayan ürünleri filtreleyelim
        const filteredProducts = data.products.filter((p: any) => {
          // Eğer ürünün koleksiyonu yoksa veya koleksiyonu indirim değilse göster
          return (
            !p.collection ||
            (discountCollectionId && p.collection?.id !== discountCollectionId) ||
            (!discountCollectionId && p.collection?.title.toLowerCase() !== "indirim")
          )
        })

        // Ürünleri dönüştür
        const formattedProducts = filteredProducts.map((p: any) => {
          const variant = Array.isArray(p.variants) && p.variants.length > 0 ? p.variants[0] : null
          const priceObj = variant?.prices?.find((pr: any) => pr.currency_code === "try") || variant?.prices?.[0]

          return {
            id: p.id,
            title: p.title,
            thumbnail: p.thumbnail || "/placeholder.svg?height=300&width=250",
            price: priceObj?.amount ?? 0,
            rating: p.rating || 4.5 + Math.random() * 0.5, // 4.5-5.0 arası rastgele
            reviews: p.reviews || Math.floor(Math.random() * 100) + 20,
            category: p.collection?.title || "Genel",
          }
        })

        setProducts(formattedProducts)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Ürünler alınırken hata oluştu:", err)
        setLoading(false)
        setProducts([])
      })
  }

  // Kategori filtreleme
  const filteredProducts = selectedCategory ? products.filter((p) => p.category === selectedCategory) : products

  if (loading) {
    return (
      <section className="py-12 sm:py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Yeni Ürünler</h2>
              <p className="text-gray-600">En yeni ve trend ürünlerimizi keşfedin</p>
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {[...Array(8)].map((_, index) => (
              <div key={index} className="bg-gray-100 rounded-2xl shadow-lg animate-pulse h-80"></div>
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
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Yeni Ürünler</h2>
              <p className="text-gray-600">En yeni ve trend ürünlerimizi keşfedin</p>
            </div>
          </div>
          <div className="text-center py-12">
            <p className="text-gray-600">Şu anda gösterilecek ürün bulunmuyor.</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Yeni Ürünler</h2>
            <p className="text-gray-600">En yeni ve trend ürünlerimizi keşfedin</p>
          </div>

          {/* Filtreler */}
          <div className="relative">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-800 transition-colors duration-200"
            >
              <Filter className="w-4 h-4" />
              <span>Filtrele</span>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${showFilters ? "rotate-180" : ""}`} />
            </button>

            {showFilters && (
              <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-xl z-10 overflow-hidden">
                <div className="p-2">
                  <button
                    onClick={() => {
                      setSelectedCategory(null)
                      setShowFilters(false)
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg ${!selectedCategory ? "bg-rose-50 text-rose-600" : "hover:bg-gray-100"}`}
                  >
                    Tümü
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => {
                        setSelectedCategory(category)
                        setShowFilters(false)
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg ${selectedCategory === category ? "bg-rose-50 text-rose-600" : "hover:bg-gray-100"}`}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden rounded-t-2xl">
                <Image
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  width={250}
                  height={300}
                  className="w-full h-48 sm:h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                />

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
                  <span className="text-lg font-bold text-gray-900">
                    {product.price > 0 ? `₺${(product.price / 100).toLocaleString("tr-TR")}` : "Fiyat Belirtilmemiş"}
                  </span>
                </div>

                <Button
                  size="small"
                  className="w-full bg-gradient-to-r from-gray-800 to-gray-700 hover:from-gray-900 hover:to-gray-800 text-white font-semibold rounded-xl transition-all duration-300"
                >
                  <ShoppingBag className="w-4 h-4 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button
            variant="secondary"
            size="large"
            className="border-2 border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 font-semibold rounded-full transition-all duration-300"
          >
            Daha Fazla Ürün Göster
          </Button>
        </div>
      </div>

      <style jsx>{`
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
