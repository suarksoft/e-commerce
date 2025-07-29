import React from 'react'
import { Clock, Star, Heart, ShoppingCart, Flame, Tag } from 'lucide-react'
import Link from 'next/link'
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { getCategoryByName } from "@lib/data/categories"

type Product = {
  id: string;
  title: string;
  thumbnail?: string | null;
  categories?: { id: string; name: string }[] | null;
  variants?: { 
    prices?: { amount: number; currency_code?: string }[]; 
    metadata?: { [key: string]: any };
    calculated_price?: { calculated_amount: number };
  }[];
  metadata?: { [key: string]: any };
  handle?: string;
  _calculated_price?: number;
  _has_discount?: boolean;
  _discount_percentage?: number;
};

async function getFirsatUrunleri(limit = 20, countryCode: string): Promise<Product[]> {
  try {
    const region = await getRegion(countryCode)
    if (!region) return []

    // 1. Önce "firsat-urunleri" kategorisini dene
    let firsatCategory = await getCategoryByName("firsat-urunleri")
    
    // 2. Eğer yoksa "indirim" kategorisini dene
    if (!firsatCategory) {
      firsatCategory = await getCategoryByName("indirim")
    }
    
    // 3. Eğer o da yoksa "elbise" kategorisini dene (fallback)
    if (!firsatCategory) {
      firsatCategory = await getCategoryByName("elbise")
    }

    let products: any[] = []

    if (firsatCategory) {
      // Kategori varsa o kategoriden ürünleri çek
      const { response } = await listProducts({
        queryParams: {
          limit: limit * 2, // Daha fazla çek ki filtreleyelim
          category_id: [firsatCategory.id],
        } as any,
        countryCode,
      })
      products = response.products
    } else {
      // Kategori yoksa tüm ürünleri çek
      const { response } = await listProducts({
        queryParams: {
          limit: limit * 2,
        },
        countryCode,
      })
      products = response.products
    }

    // Ürünleri işle ve fırsat ürünlerini filtrele
    const processedProducts = products
      .map((product: any) => {
        // Fiyat hesaplama
        const variant = product.variants?.[0]
        const calculatedPrice = variant?.calculated_price?.calculated_amount || 0
        const originalPrices = variant?.prices || []
        
        // İndirim hesaplama
        let discountPercentage = 0
        let hasDiscount = false
        
        if (originalPrices.length > 1) {
          const sortedPrices = [...originalPrices].sort((a, b) => b.amount - a.amount)
          const highestPrice = sortedPrices[0].amount
          const lowestPrice = sortedPrices[sortedPrices.length - 1].amount
          
          if (highestPrice > lowestPrice) {
            discountPercentage = Math.round(((highestPrice - lowestPrice) / highestPrice) * 100)
            hasDiscount = true
          }
        }

        // Metadata işleme
        const metadata = {
          ...product.metadata,
          discount_percentage: discountPercentage,
          has_discount: hasDiscount,
          is_last_chance: product.metadata?.isLastChance === "True" || 
                         variant?.metadata?.isLastChance === "True",
          discount_end: product.metadata?.discount_end || 
                       variant?.metadata?.discount_end,
        }

        return {
          ...product,
          metadata,
          _calculated_price: calculatedPrice,
          _has_discount: hasDiscount,
          _discount_percentage: discountPercentage,
        }
      })
      .filter((product: any) => {
        // Fırsat ürünü kriterleri:
        // 1. İndirim varsa
        // 2. Son fırsat ise
        // 3. Metadata'da fırsat işareti varsa
        // 4. Veya kategori fırsat kategorisiyse
        return (
          product._has_discount ||
          product.metadata?.is_last_chance ||
          product.metadata?.is_firsat === "True" ||
          firsatCategory?.name?.toLowerCase().includes("fırsat") ||
          firsatCategory?.name?.toLowerCase().includes("indirim")
        )
      })
      .sort((a: any, b: any) => {
        // Önce indirim yüzdesine göre sırala (yüksekten düşüğe)
        if (a._discount_percentage !== b._discount_percentage) {
          return b._discount_percentage - a._discount_percentage
        }
        // Sonra son fırsat olanları öne çıkar
        if (a.metadata?.is_last_chance !== b.metadata?.is_last_chance) {
          return a.metadata?.is_last_chance ? -1 : 1
        }
        // Son olarak fiyata göre sırala (düşükten yükseğe)
        return a._calculated_price - b._calculated_price
      })
      .slice(0, limit)

    return processedProducts
  } catch (error) {
    console.error("Fırsat ürünleri alınırken hata:", error)
    return []
  }
}

const subKategoriler = [
  { name: "İndirimli", href: "/firsat-urunleri/indirimli", count: 45 },
  { name: "%50'ye Varan", href: "/firsat-urunleri/50ye-varan", count: 32 },
  { name: "Son Fırsat", href: "/firsat-urunleri/son-firsat", count: 12 }
];

const Page = async ({ params }: { params: Promise<{ countryCode: string }> }) => {
  const { countryCode } = await params
  const products = await getFirsatUrunleri(20, countryCode);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Flame className="h-8 w-8 animate-pulse" />
              <h1 className="text-4xl font-bold">Fırsat Ürünleri</h1>
              <Flame className="h-8 w-8 animate-pulse" />
            </div>
            <p className="text-xl opacity-90 mb-6">
              Kadın giyiminde özel indirimler! %50'ye varan fırsatlar
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur rounded-full px-6 py-3">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Kampanya bitiş: 3 gün 12 saat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Alt Kategoriler */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Fırsat Kategorileri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {subKategoriler.map((subKat) => (
              <Link
                key={subKat.name}
                href={subKat.href}
                className="group bg-white rounded-xl p-6 border border-gray-200 hover:border-pink-300 hover:shadow-lg transition-all duration-200"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-pink-600">
                      {subKat.name}
                    </h3>
                    <p className="text-sm text-gray-500">{subKat.count} ürün</p>
                  </div>
                  <div className="bg-pink-100 p-3 rounded-full group-hover:bg-pink-200 transition-colors">
                    <Tag className="h-5 w-5 text-pink-600" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Ürün Sayısı */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium">{products.length} fırsat ürünü bulundu</p>
        </div>

        {/* Ürün Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.map((product, index) => (
            <div key={product.id} className="group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100">
              {/* Ürün Resmi */}
              <div className="relative">
                <img
                  src={product.thumbnail || `https://images.unsplash.com/photo-${1515372039744 + index}?w=300&h=400&fit=crop`}
                  alt={product.title}
                  className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* İndirim Badge */}
                <div className="absolute top-3 left-3 space-y-2">
                  {(product._discount_percentage || 0) > 0 && (
                    <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                      <Tag className="h-3 w-3" />
                      <span>%{product._discount_percentage || 0}</span>
                    </div>
                  )}
                  
                  {/* Son Fırsat Badge */}
                  {product.metadata?.is_last_chance && (
                    <div className="bg-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg animate-pulse">
                      <Flame className="h-3 w-3" />
                      <span>SON FIRSAT</span>
                    </div>
                  )}
                </div>

                {/* Favori Butonu */}
                <button className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur rounded-full hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-pink-500" />
                </button>

                {/* Kalan Süre */}
                {product.metadata?.discount_end && (
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="bg-black/70 backdrop-blur text-white px-3 py-2 rounded-lg text-center">
                      <div className="flex items-center justify-center space-x-1 text-sm">
                        <Clock className="h-3 w-3" />
                        <span>
                          Son gün: {
                            (() => {
                              const tarih = product.metadata?.discount_end;
                              const dateObj = !isNaN(Date.parse(tarih))
                                ? new Date(tarih)
                                : new Date(tarih.replace(/-/g, '/'));
                              return dateObj.toLocaleDateString("tr-TR");
                            })()
                          }
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {product.categories?.[0]?.name || "Kategori"}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.title}
                </h3>

                {/* Fiyat ve İndirim */}
                <div className="flex flex-col space-y-1 mb-4">
                  <div className="flex items-center space-x-2">
                                         <span className="text-2xl font-bold text-pink-600">
                       {`${Math.floor(product._calculated_price || 0)}₺`}
                     </span>
                    {product._has_discount && product.variants?.[0]?.prices && (
                      <>
                                                 <span className="text-lg text-gray-400 line-through">
                           {Math.floor(Math.max(...(product.variants[0].prices?.map(p => p.amount) || [0])))}₺
                         </span>
                                                 <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-600 text-xs font-bold rounded-full">
                           %{product._discount_percentage || 0} İndirim
                         </span>
                      </>
                    )}
                  </div>
                </div>

                {/* Sepete Ekle Butonu */}
                <button className="w-full bg-gradient-to-r from-pink-500 to-orange-400 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2 group">
                  <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform" />
                  <span>Sepete Ekle</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Ürün bulunamadı mesajı */}
        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Henüz fırsat ürünü bulunmuyor.</p>
          </div>
        )}

        {/* Daha Fazla Yükle */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <button className="px-8 py-3 border-2 border-pink-500 text-pink-500 font-semibold rounded-xl hover:bg-pink-500 hover:text-white transition-all duration-200">
              Daha Fazla Ürün Yükle
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page