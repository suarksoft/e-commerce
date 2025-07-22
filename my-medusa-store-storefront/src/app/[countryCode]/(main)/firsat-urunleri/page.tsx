"use client"
import React, { useState, useEffect } from 'react'
import { Clock, Star, Heart, ShoppingCart, Flame, Tag } from 'lucide-react'
import Link from 'next/link'
import axios from "axios"

type Product = {
  id: string;
  title: string;
  thumbnail?: string;
  categories?: { id: string; name: string }[]; // id eklendi!
  variants?: { prices?: { amount: number }[]; metadata?: { [key: string]: any } }[];
  metadata?: { [key: string]: any };
};




const page = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)



  const getFirsatUrunleri = async (limit = 20) => {
    try {
      // 1. Kategori ID'sini al
      const categoryRes = await axios.get(
        `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?handle=firsat-urunleri`,
        {
          headers: {
            "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
          },
        }
      );

      const categoryId = categoryRes.data.product_categories?.[0]?.id;
      
      // DEBUG: Alınan kategori ID'sini konsola yazdır
      console.log("Alınan Kategori ID:", categoryId);

      if (!categoryId) {
        console.error("Fırsat ürünleri kategorisi bulunamadı");
        return [];
      }

      // DEBUG: Ürünleri çekmek için oluşturulan tam URL'yi konsola yazdır
      const requestUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?category_id[]=${categoryId}&limit=${limit}`;
      console.log("API İstek URL:", requestUrl);

      // 2. Sadece bu kategoriye ait ürünleri çek
      const productsRes = await axios.get(requestUrl, {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
      });
      
      // DEBUG: API'den gelen ürün sayısını kontrol et
      console.log("Gelen ürün sayısı:", productsRes.data.products.length);


      // Gelen ürünleri döndür
      const parsedProducts = (productsRes.data.products || []).map((product: Product) => {
        const metadata = product.metadata || {};
        return { ...product, metadata };
      });

      return parsedProducts;
    } catch (error) {
      console.error("API hatası:", error);
      return [];
    }
  };

  useEffect(() => {
    getFirsatUrunleri().then(products => {
      console.log("Fırsat ürünleri:", products)
      setProducts(products)
      setLoading(false)
    })
  }, [])

  const subKategoriler = [
    { name: "İndirimli", href: "/firsat-urunleri/indirimli", count: 45 },
    { name: "%50'ye Varan", href: "/firsat-urunleri/50ye-varan", count: 32 },
    { name: "Son Fırsat", href: "/firsat-urunleri/son-firsat", count: 12 }
  ]

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Fırsat ürünleri yükleniyor...</p>
        </div>
      </div>
    )
  }

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
                  <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1 shadow-lg">
                    <Tag className="h-3 w-3" />
                    <span>
                      %{product.metadata?.discount ??
                        product.variants?.[0]?.metadata?.discount ?? 0}
                    </span>
                  </div>
                  
                  {/* Son Fırsat Badge */}
                  {(product.metadata?.isLastChance === "True" || 
                    product.variants?.[0]?.metadata?.isLastChance === "True") && (
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
                <div className="absolute bottom-3 left-3 right-3">
                  <div className="bg-black/70 backdrop-blur text-white px-3 py-2 rounded-lg text-center">
                    <div className="flex items-center justify-center space-x-1 text-sm">
                      <Clock className="h-3 w-3" />
                      {product.metadata?.discount_end ||
                      product.variants?.[0]?.metadata?.discount_end ? (
                        <span>
                          Son gün: {
                            (() => {
                              const tarih =
                                product.metadata?.discount_end ||
                                product.variants?.[0]?.metadata?.discount_end;
                              const dateObj = !isNaN(Date.parse(tarih))
                                ? new Date(tarih)
                                : new Date(tarih.replace(/-/g, '/'));
                              return dateObj.toLocaleDateString("tr-TR");
                            })()
                          }
                        </span>
                      ) : null}
                    </div>
                  </div>
                </div>
              </div>

              {/* Ürün Bilgileri */}
              <div className="p-4">
                <div className="text-sm text-gray-500 mb-1">
                  {product.categories?.[0]?.name || "Kategori"}
                </div>
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.title}
                </h3>
                
                {/* Rating */}
                <div className="flex items-center space-x-1 mb-3">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < 4 ? "text-yellow-400 fill-current" : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-500">(128)</span>
                </div>

                {/* Fiyat */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-2xl font-bold text-pink-600">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? Math.floor(product.variants[0].prices[0].amount / 100)
                      : 149}₺
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {product.variants?.[0]?.prices?.[0]?.amount 
                      ? Math.floor(product.variants[0].prices[0].amount / 50)
                      : 299}₺
                  </span>
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

export default page