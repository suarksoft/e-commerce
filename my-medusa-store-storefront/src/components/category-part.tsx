"use client"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function CategoryPart() {
  // Öne çıkan elbise kategorileri
  const featuredDresses = [
    {
      name: "Abiye Elbiseler",
      handle: "elbise",
      image: "http://localhost:9000/static/1748560860830-o%C3%8C%C2%88rnek-elbise.jpg",
      description: "Özel davetler için"
    },
    {
      name: "Günlük Elbiseler", 
      handle: "elbise",
      image: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Her gün için rahat"
    },
    {
      name: "Kokteyl Elbiseleri",
      handle: "elbise", 
      image: "https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Parti ve davet"
    },
    {
      name: "Uzun Elbiseler",
      handle: "elbise",
      image: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80", 
      description: "Zarif ve şık"
    },
    {
      name: "Mini Elbiseler",
      handle: "elbise",
      image: "https://images.unsplash.com/photo-1554568218-0f1715e72254?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80",
      description: "Genç ve dinamik"
    }
  ]

  // Ana koleksiyonlar
  const collections = [
    {
      name: "Yaz Koleksiyonu",
      handle: "yeni-gelenler",
      image: "https://images.unsplash.com/photo-1469334031218-e382a71b716b?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Hafif ve ferah"
    },
    {
      name: "İş Kıyafetleri",
      handle: "ust-giyim", 
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Profesyonel görünüm"
    },
    {
      name: "Gece Koleksiyonu",
      handle: "elbise",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Büyüleyici ve zarif"
    },
    {
      name: "Casual Stil",
      handle: "alt-giyim",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80", 
      description: "Günlük konfor"
    },
    {
      name: "Trend Parçalar",
      handle: "firsat-urunleri",
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Sezonun favorileri"
    },
    {
      name: "Aksesuar Dünyası",
      handle: "aksesuar", 
      image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
      description: "Tamamlayıcı detaylar"
    }
  ]

    return (
    <div className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        
        {/* Öne Çıkan Elbiseler */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Senin İçin Seçtiğimiz Elbiseler</h2>
            <LocalizedClientLink 
              href="/elbise" 
              className="text-sm text-rose-600 font-medium hover:text-rose-700 flex items-center"
            >
              Tümünü Gör 
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </LocalizedClientLink>
          </div>
  
          {/* Horizontal Scroll Container */}
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 pb-2">
              {featuredDresses.map((dress, index) => (
                <LocalizedClientLink 
                  key={index} 
                  href={`/${dress.handle}`}
                  className="flex-shrink-0 group"
                >
                                     <div className="w-48 bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300">
                     <div className="relative aspect-[3/4]">
                       <img
                         src={dress.image}
                         alt={dress.name}
                         className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                       <div className="absolute bottom-4 left-4 right-4 text-white">
                         <h3 className="font-semibold text-lg leading-tight">{dress.name}</h3>
                         <p className="text-sm text-white/90 mt-1">{dress.description}</p>
                </div>
              </div>
            </div>
                </LocalizedClientLink>
              ))}
                </div>
              </div>
            </div>

        {/* Koleksiyonlar */}
        <div>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Koleksiyonlar</h2>
            <LocalizedClientLink 
              href="/categories" 
              className="text-sm text-rose-600 font-medium hover:text-rose-700 flex items-center"
            >
              Tüm Kategoriler
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </LocalizedClientLink>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {collections.map((collection, index) => (
              <LocalizedClientLink 
                key={index} 
                href={`/${collection.handle}`}
                className="group"
              >
                <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 hover:border-rose-200">
                  <div className="relative aspect-square">
                    <img
                      src={collection.image}
                      alt={collection.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-60" />
                    <div className="absolute bottom-3 left-3 right-3 text-white">
                      <h3 className="font-semibold text-sm leading-tight mb-1">{collection.name}</h3>
                      <p className="text-xs text-white/90">{collection.description}</p>
                </div>
              </div>
            </div>
              </LocalizedClientLink>
            ))}
          </div>
        </div>

        {/* Mobile CTA */}
        <div className="mt-8 sm:hidden">
          <LocalizedClientLink 
            href="/categories" 
            className="block w-full text-center py-4 bg-rose-600 text-white font-semibold rounded-xl hover:bg-rose-700 transition-colors"
          >
            Tüm Kategorileri Keşfet
          </LocalizedClientLink>
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
      `}</style>
      </div>
    )
  }
  