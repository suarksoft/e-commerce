"use client"

import Link from "next/link"

const featuredCategories = [
  {
    name: "Yeni Sezon",
    image: "/placeholder.svg?height=120&width=120",
    href: "/yeni-sezon",
    badge: "YENİ",
  },
  {
    name: "Elbise Modelleri",
    image: "/placeholder.svg?height=120&width=120",
    href: "/elbise",
    badge: "POPÜLER",
  },
  {
    name: "Takım Modelleri",
    image: "/placeholder.svg?height=120&width=120",
    href: "/takim",
  },
  {
    name: "Casual Giyim",
    image: "/placeholder.svg?height=120&width=120",
    href: "/casual",
    badge: "TREND",
  },
  {
    name: "Aksesuar",
    image: "/placeholder.svg?height=120&width=120",
    href: "/aksesuar",
  },
  {
    name: "Ayakkabı",
    image: "/placeholder.svg?height=120&width=120",
    href: "/ayakkabi",
  },
]

export default function FeaturedCategories() {
  return (
    <div className="bg-gradient-to-r from-pink-50 to-orange-50 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-xl font-bold text-gray-900 mb-6 flex items-center justify-center gap-2">
          <span className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-orange-400"></span>
          Öne Çıkan Kategoriler
          <span className="w-8 h-0.5 bg-gradient-to-r from-pink-400 to-orange-400"></span>
        </h3>
        <div className="flex justify-center space-x-8 overflow-x-auto pb-4 scrollbar-hide">
          {featuredCategories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="flex flex-col items-center space-y-3 min-w-[120px] group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-full border-4 border-transparent bg-gradient-to-r from-pink-400 to-orange-400 p-0.5 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-xl">
                  <div className="h-full w-full rounded-full overflow-hidden bg-white p-0.5">
                    <img
                      src={category.image || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full rounded-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                </div>
                {category.badge && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-orange-400 text-white text-xs px-3 py-1 rounded-full font-bold animate-pulse shadow-lg">
                    {category.badge}
                  </span>
                )}
              </div>
              <span className="text-sm font-semibold text-gray-700 text-center group-hover:text-pink-600 transition-colors">
                {category.name}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
} 