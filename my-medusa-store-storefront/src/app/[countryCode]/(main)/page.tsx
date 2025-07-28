import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
import { getRegion } from "@lib/data/regions"
import AnnouncementBanner from "components/announcement-banner"
import FeaturedCategories from "@modules/home/components/featured-categories"
import CategoryPart from "components/category-part"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Moda Es Es - Kadın Giyim ve Aksesuar",
  description: "En yeni moda trendleri, kaliteli kadın giyim ve aksesuar modelleri. Elbise, üst giyim, alt giyim kategorilerinde binlerce ürün seçeneği.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params
  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <div className="min-h-screen">
      {/* Duyuru banner'ı */}
   
      
    

      {/* Kategori bölümü */}
      <CategoryPart />
      
      {/* Öne çıkan kategorilerden ürünler */}
      <FeaturedCategories region={region} />
      
      {/* Newsletter kayıt bölümü */}
      <section className="bg-rose-600">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Yenilikleri Kaçırma
            </h2>
            <p className="mt-4 text-lg text-rose-100">
              Yeni koleksiyonlar ve özel kampanyalardan ilk sen haberdar ol.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center max-w-md mx-auto">
              <input
                type="email"
                placeholder="E-posta adresiniz"
                className="w-full px-4 py-3 rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-white"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-white text-rose-600 font-semibold rounded-md hover:bg-gray-50 transition-colors duration-200"
              >
                Kayıt Ol
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
