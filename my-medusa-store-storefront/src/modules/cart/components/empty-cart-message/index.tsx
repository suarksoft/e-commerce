import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import { Button } from "@medusajs/ui"
import { ShoppingBag, Heart, Sparkles, TrendingUp, Star, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"

const suggestedProducts = [
  {
    id: 1,
    name: "Beyaz Balon Kol Elbise",
    price: "₺299",
    originalPrice: "₺399",
    image: "/placeholder.svg?height=200&width=200",
    badge: "YENİ",
    discount: "25%",
  },
  {
    id: 2,
    name: "Açık Mavi Kot Ceket",
    price: "₺249",
    image: "/placeholder.svg?height=200&width=200",
    badge: "TREND",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Plaj Takımı Set",
    price: "₺189",
    originalPrice: "₺249",
    image: "/placeholder.svg?height=200&width=200",
    badge: "İNDİRİM",
    discount: "24%",
  },
  {
    id: 4,
    name: "Şık Blazer Ceket",
    price: "₺399",
    originalPrice: "₺599",
    image: "/placeholder.svg?height=200&width=200",
    badge: "POPÜLER",
    discount: "33%",
  },
]

const EmptyCartMessage = () => {
  return (
    <div className="py-8 px-4" data-testid="empty-cart-message">
    
      <div className="flex flex-col justify-center items-center mb-12">
        <div className="relative mb-8">
          <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-r from-pink-100 via-orange-100 to-amber-100 animate-pulse shadow-lg">
            <ShoppingBag className="h-12 w-12 text-pink-500" />
          </div>
          <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 flex items-center justify-center animate-bounce shadow-lg">
            <ShoppingCart className="h-3 w-3 text-white" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-pink-600 to-orange-600 bg-clip-text text-transparent">
          Sepetiniz Boş
        </h1>
        <p className="text-base text-gray-600 mb-8 text-center max-w-md leading-relaxed">
          Henüz sepetinize ürün eklemediniz. Size özel seçtiğimiz ürünlere göz atın ve alışverişe başlayın! 🛍️
        </p>

        <div className="flex gap-4">
          <Button
            asChild
            className="bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-semibold px-8 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
          >
            <Link href="/store">
              <ShoppingBag className="h-5 w-5 mr-2" />
              Alışverişe Başla
            </Link>
          </Button>

          <Button
            variant="secondary"
            asChild
            className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 font-semibold px-8 py-3 rounded-full transition-all duration-300 bg-transparent transform hover:scale-105"
          >
            <Link href="/favorites">
              <Heart className="h-5 w-5 mr-2" />
              Favoriler
            </Link>
          </Button>
        </div>
      </div>

      
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-orange-400"></div>
            <div className="flex items-center">
              <TrendingUp className="h-6 w-6 text-pink-500 mr-2" />
              <h2 className="text-xl font-bold text-gray-900">Size Özel Seçtiklerimiz</h2>
            </div>
            <div className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-orange-400"></div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestedProducts.map((product, index) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-pink-200 overflow-hidden"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="p-4">
                <div className="relative mb-4">
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-lg group-hover:scale-105 transition-transform duration-300"
                  />
                  
                  
                  <span
                    className={`absolute top-2 left-2 px-2 py-1 text-xs font-semibold rounded-full ${
                      product.badge === "YENİ"
                        ? "bg-green-100 text-green-600"
                        : product.badge === "TREND"
                          ? "bg-orange-100 text-orange-600"
                          : product.badge === "POPÜLER"
                            ? "bg-purple-100 text-purple-600"
                            : "bg-red-100 text-red-600"
                    }`}
                  >
                    {product.badge}
                  </span>
                  
                
                  {product.discount && (
                    <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold rounded-full bg-red-500 text-white">
                      {product.discount}
                    </span>
                  )}
                  
                 
                  <button className="absolute bottom-2 right-2 p-2 rounded-full bg-white/90 hover:bg-white transition-colors shadow-md">
                    <Heart className="h-4 w-4 text-gray-600 hover:text-pink-500 transition-colors" />
                  </button>
                </div>

                <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-pink-600 transition-colors line-clamp-2">
                  {product.name}
                </h3>

                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-gray-900">{product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-gray-500 line-through">{product.originalPrice}</span>
                    )}
                  </div>
                  <div className="flex items-center text-yellow-400">
                    <Star className="h-3 w-3 fill-current" />
                    <span className="text-xs text-gray-600 ml-1">
                      {product.rating || "4.5"}
                    </span>
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 text-white font-medium py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Sepete Ekle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

     
      <div className="text-center mt-16">
        <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-2xl p-8 border border-pink-100">
          <p className="text-base text-gray-600 mb-6 font-medium">Daha fazla ürün görmek ister misiniz?</p>
          <Button
            variant="secondary"
            asChild
            className="border-2 border-pink-200 text-pink-600 hover:bg-pink-50 hover:border-pink-300 font-semibold px-10 py-3 rounded-full transition-all duration-300 bg-transparent transform hover:scale-105"
          >
            <Link href="/store">
              Tüm Ürünleri Gör
              <ArrowRight className="h-5 w-5 ml-2" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmptyCartMessage
