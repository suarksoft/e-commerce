import { Heading, Text } from "@medusajs/ui"

import InteractiveLink from "@modules/common/components/interactive-link"
import { Button } from "@medusajs/ui"
import { ShoppingBag, Heart, Sparkles, TrendingUp, Star, ArrowRight, ShoppingCart } from "lucide-react"
import Link from "next/link"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"


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
