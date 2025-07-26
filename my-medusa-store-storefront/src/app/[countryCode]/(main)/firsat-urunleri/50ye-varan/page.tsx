import React from 'react'
import { Clock, Star, Heart, ShoppingCart, Flame, Tag } from 'lucide-react'
import Link from 'next/link'

type Product = {
  id: string;
  title: string;
  thumbnail?: string;
  categories?: { id: string; name: string }[];
  variants?: { prices?: { amount: number }[]; metadata?: { [key: string]: any } }[];
  metadata?: { [key: string]: any };
};

async function getYuzde50veUzeriIndirimliUrunler(limit = 20): Promise<Product[]> {
  try {
    // 1. Kategori ID'sini al
    const categoryRes = await fetch(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/product-categories?handle=firsat-urunleri`,
      {
        headers: {
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
        },
        cache: 'no-store',
      }
    );
    const categoryData = await categoryRes.json();
    const categoryId = categoryData.product_categories?.[0]?.id;
    if (!categoryId) {
      return [];
    }
    // Tüm ürünleri çek, kategori alanı zaten dönüyorsa filtrele
    const allProductsUrl = `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=${limit}`;
    const allProductsRes = await fetch(allProductsUrl, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
      cache: 'no-store',
    });
    const allProductsData = await allProductsRes.json();
    const parsedProducts = (allProductsData.products || [])
      .filter((product: Product) =>
        product.categories &&
        product.categories.some(cat => cat && cat.id === categoryId) &&
        (
          (typeof product.metadata?.discount === 'number' && product.metadata.discount >= 50) ||
          (typeof product.metadata?.discount === 'string' && parseFloat(product.metadata.discount) >= 50) ||
          (product.variants && product.variants.some(v =>
            (typeof v.metadata?.discount === 'number' && v.metadata.discount >= 50) ||
            (typeof v.metadata?.discount === 'string' && parseFloat(v.metadata.discount) >= 50)
          ))
        )
      )
      .map((product: Product) => {
        const metadata = product.metadata || {};
        return { ...product, metadata };
      });
    return parsedProducts;
  } catch (error) {
    return [];
  }
}

const Page = async () => {
  const products = await getYuzde50veUzeriIndirimliUrunler();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Flame className="h-8 w-8 animate-pulse" />
              <h1 className="text-4xl font-bold">%50'ye Varan İndirimli Ürünler</h1>
              <Flame className="h-8 w-8 animate-pulse" />
            </div>
            <p className="text-xl opacity-90 mb-6">
              Kadın giyiminde %50 ve üzeri indirimli fırsatlar!
            </p>
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur rounded-full px-6 py-3">
              <Clock className="h-5 w-5" />
              <span className="font-semibold">Kampanya bitiş: 2 gün 8 saat</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Ürün Sayısı */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium">{products.length} ürün bulundu</p>
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
                <div className="flex flex-col space-y-1 mb-4">
                  {product.variants?.map((variant, vIdx) => (
                    <div key={vIdx} className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-pink-600">
                        {variant.prices && variant.prices.length > 0
                          ? `${Math.floor(variant.prices[0].amount / 100)}₺`
                          : 'Fiyat Yok'}
                      </span>
                      {variant.prices && variant.prices.length > 1 && (
                        <span className="text-lg text-gray-400 line-through">
                          {Math.floor(variant.prices[1].amount / 100)}₺
                        </span>
                      )}
                    </div>
                  ))}
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
            <p className="text-gray-500 text-lg">Henüz %50 ve üzeri indirimli ürün bulunmuyor.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default Page