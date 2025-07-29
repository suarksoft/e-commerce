"use client"

import { useState, useEffect, useRef } from "react"
import { Search, Heart, ShoppingBag, User, Menu, X, ChevronDown, Star, TrendingUp } from "lucide-react"
import { Button } from "@medusajs/ui"
import { Input } from "@medusajs/ui"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { retrieveCart } from "@lib/data/cart"
import { getFavorites } from "@lib/data/favorites"
import { HttpTypes } from "@medusajs/types"

const categories = [
  {
    name: "Yeni Gelenler",
    href: "/yeni-gelenler",
    featured: true,
    subcategories: ["Bu Hafta", "Bu Ay", "Trend Ürünler"],
  },
  {
    name: "Fırsat Ürünleri",
    href: "/firsat-urunleri",
    featured: true,
    subcategories: ["İndirimli", "%50'ye Varan", "Son Fırsat"],
  },
  {
    name: "Elbise",
    href: "/elbise",
    subcategories: ["Günlük", "Gece", "İş", "Özel Gün"],
  },
  {
    name: "Takım",
    href: "/takim",
    subcategories: ["İş Takımları", "Casual", "Şık Takımlar"],
  },
  {
    name: "Üst Giyim",
    href: "/ust-giyim",
    subcategories: ["Bluz", "Gömlek", "T-shirt", "Kazak"],
  },
  {
    name: "Alt Giyim",
    href: "/alt-giyim",
    subcategories: ["Pantolon", "Etek", "Şort", "Jean"],
  },
  {
    name: "Dış Giyim",
    href: "/dis-giyim",
    subcategories: ["Ceket", "Mont", "Hırka", "Blazer"],
  },
  {
    name: "Aksesuar",
    href: "/aksesuar",
    subcategories: ["Çanta", "Takı", "Ayakkabı", "Şapka"],
  },
]



const searchSuggestions = [
  { text: "elbise", icon: TrendingUp, type: "trend", href: "/elbise" },
  { text: "jean pantolon", icon: Star, type: "popular", href: "/alt-giyim" },
  { text: "blazer ceket", icon: TrendingUp, type: "trend", href: "/dis-giyim" },
  { text: "ayakkabı", icon: Star, type: "popular", href: "/aksesuar" },
  { text: "yeni gelenler", icon: TrendingUp, type: "trend", href: "/yeni-gelenler" },
  { text: "fırsat ürünleri", icon: Star, type: "popular", href: "/firsat-urunleri" },
]

export default function EnhancedNavbar() {
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [isScrolled, setIsScrolled] = useState(false)
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [favorites, setFavorites] = useState<any[]>([])
  const searchRef = useRef<HTMLDivElement>(null)
  
  // Gerçek favori sayısı
  const favoritesCount = favorites.length
  
  // Sepet verilerini al
  const cartCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0

  // Arama fonksiyonu
  const handleSearch = (query: string) => {
    if (!query.trim()) return
    
    // Önce önerilerde ara
    const suggestionMatch = searchSuggestions.find(suggestion => 
      suggestion.text.toLowerCase() === query.toLowerCase()
    )
    
    if (suggestionMatch) {
      router.push(suggestionMatch.href)
      setSearchQuery("")
      setIsSearchFocused(false)
      return
    }
    
    // Önerilerde bulunamazsa kategorilerde ara
    const categoryMatch = categories.find(cat => 
      cat.name.toLowerCase().includes(query.toLowerCase()) ||
      cat.subcategories.some(sub => sub.toLowerCase().includes(query.toLowerCase()))
    )
    
    if (categoryMatch) {
      router.push(categoryMatch.href)
      setSearchQuery("")
      setIsSearchFocused(false)
      return
    }
    
    // Kategori bulunamazsa uyarı göster
    showSearchNotification()
    setSearchQuery("")
    setIsSearchFocused(false)
  }

  // Arama uyarısı gösterme fonksiyonu
  const showSearchNotification = () => {
    // Mevcut uyarıyı temizle
    const existingNotification = document.getElementById('search-notification')
    if (existingNotification) {
      existingNotification.remove()
    }

    // Yeni uyarı oluştur
    const notification = document.createElement('div')
    notification.id = 'search-notification'
    notification.className = 'fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-pink-500 text-white px-6 py-3 rounded-lg shadow-lg animate-in slide-in-from-top-2 duration-300'
    notification.innerHTML = `
      <div class="flex items-center space-x-2">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <span class="font-medium">Ürün arama özelliği çok yakında sizlerle!</span>
      </div>
    `

    // Uyarıyı sayfaya ekle
    document.body.appendChild(notification)

    // 5 saniye sonra kaldır
    setTimeout(() => {
      if (notification.parentNode) {
        notification.classList.add('animate-out', 'slide-out-to-top-2', 'duration-300')
        setTimeout(() => {
          if (notification.parentNode) {
            notification.remove()
          }
        }, 300)
      }
    }, 5000)
  }

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isMenuOpen])

 
  // Sepet ve favori verilerini yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        // Sepet verilerini yükle
        const cartData = await retrieveCart()
        setCart(cartData)
      } catch (error) {
        // 401 hatası normal 
        if (error && typeof error === 'object' && 'toString' in error && error.toString().includes('401')) {
          setCart(null)
        } else {
          console.error("Sepet yüklenirken hata:", error)
        }
      }

      try {
        // Favori verilerini yükle
        const favoritesData = await getFavorites()
        setFavorites(favoritesData)
      } catch (error) {
        console.error("Favori ürünler yüklenirken hata:", error)
        setFavorites([])
      }
    }
    
    loadData()
    
    // Her 10 saniyede bir verileri güncelle
    const interval = setInterval(loadData, 10000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <>
      <header
        className={`sticky top-0 z-50 bg-white transition-all duration-300 ${
          isScrolled ? "shadow-lg backdrop-blur-sm bg-white/95" : "shadow-sm"
        }`}
      >
      
       

       
        <div className="border-b border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center justify-between">
             
              <Button
                variant="transparent"
                size="small"
                className="md:hidden hover:bg-pink-50 transition-colors"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <div className="relative">
                  <Menu
                    className={`h-5 w-5 transition-all duration-300 ${isMenuOpen ? "rotate-90 opacity-0" : "rotate-0 opacity-100"}`}
                  />
                  <X
                    className={`h-5 w-5 absolute top-0 left-0 transition-all duration-300 ${isMenuOpen ? "rotate-0 opacity-100" : "-rotate-90 opacity-0"}`}
                  />
                </div>
              </Button>

              {/* Logo */}
              <Link href="/" className="flex items-center space-x-3 group">
                <img
                  src="/moda_es_es_logo.jpg"
                  alt="Moda Es Es Logo"
                  width={48}
                  height={48}
                  className="h-12 w-12 rounded-full object-cover shadow-lg group-hover:scale-110 transition-all duration-300 group-hover:shadow-xl"
                />
                <div className="flex flex-col">
                  <span className="hidden text-xl font-bold text-gray-900 sm:block group-hover:text-pink-600 transition-colors">
                    Moda Es Es
                  </span>
                  <span className="hidden text-xs text-gray-500 sm:block group-hover:text-pink-400 transition-colors">
                    Modanın Kalbi
                  </span>
                </div>
              </Link>

              {/* Search Bar */}
              <div className="hidden flex-1 max-w-lg mx-8 md:block" ref={searchRef}>
                <div className="relative">
                  {/* Overlay for search suggestions */}
                  {isSearchFocused && (
                    <div className="fixed inset-0 z-40" onClick={() => setIsSearchFocused(false)} />
                  )}
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                  <Input
                    type="text"
                    placeholder="Ürün, marka veya kategori ara..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleSearch(searchQuery)
                      }
                    }}
                    className="pl-12 pr-4 py-3 w-full rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200 transition-all duration-300 hover:border-pink-200 shadow-sm hover:shadow-md"
                  />

                  {/* Search Suggestions */}
                  {isSearchFocused && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in slide-in-from-top-2 duration-200 z-50 backdrop-blur-sm">
                      {searchQuery === "" ? (
                        <>
                          <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                            Popüler Aramalar
                          </div>
                          {searchSuggestions.map((suggestion, index) => (
                            <button
                              key={index}
                              className="w-full px-4 py-2 text-left hover:bg-pink-50 flex items-center space-x-3 transition-colors relative z-10"
                              onClick={() => {
                                handleSearch(suggestion.text)
                              }}
                            >
                              <suggestion.icon className="h-4 w-4 text-pink-500" />
                              <span className="text-sm text-gray-700">{suggestion.text}</span>
                              <span
                                className={`text-xs px-2 py-1 rounded-full ${
                                  suggestion.type === "trend"
                                    ? "bg-orange-100 text-orange-600"
                                    : "bg-pink-100 text-pink-600"
                                }`}
                              >
                                {suggestion.type === "trend" ? "Trend" : "Popüler"}
                              </span>
                            </button>
                          ))}
                        </>
                      ) : (
                        <div className="px-4 py-2 text-sm text-gray-500">"{searchQuery}" için arama yapılıyor...</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Right Actions */}
              <div className="flex items-center space-x-3">
                <Link href="/account">
                <Button variant="transparent" size="small" className="hidden sm:flex hover:bg-pink-50 transition-all duration-300 group rounded-full px-4 py-2">
                  <User className="h-5 w-5 mr-2 group-hover:text-pink-600 transition-colors" />
                  <span className="hidden lg:inline group-hover:text-pink-600 transition-colors font-medium">Giriş</span>
                </Button>
                </Link>
                <Link href="/favorites">
                  <Button variant="transparent" size="small" className="relative hover:bg-pink-50 transition-all duration-300 group rounded-full px-4 py-2">
                    <Heart className="h-5 w-5 group-hover:text-pink-600 transition-colors" />
                    <span className="hidden lg:inline ml-2 group-hover:text-pink-600 transition-colors font-medium">Favoriler</span>
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-xs text-white flex items-center justify-center font-bold animate-pulse shadow-lg">
                        {favoritesCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/sepet">
                <Button variant="transparent" size="small" className="relative hover:bg-pink-50 transition-all duration-300 group rounded-full px-4 py-2">
                  <ShoppingBag className="h-5 w-5 group-hover:text-pink-600 transition-colors" />
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-6 w-6 rounded-full bg-gradient-to-r from-pink-500 to-orange-400 text-xs text-white flex items-center justify-center font-bold animate-bounce shadow-lg">
                      {cartCount}
                    </span>
                  )}
                  <span className="hidden lg:inline ml-2 group-hover:text-pink-600 transition-colors font-medium">Sepet</span>
                </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

      {/* Navigation Menu */}
      <nav className="border-b border-gray-100 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-center space-x-10">
            {categories.map((category) => (
              <div
                key={category.name}
                className="relative group"
                onMouseEnter={() => setActiveCategory(category.name)}
                onMouseLeave={() => setActiveCategory(null)}
              >
                <Link
                  href={category.href}
                  className={`whitespace-nowrap text-sm font-semibold transition-all duration-300 hover:text-pink-600 flex items-center space-x-2 py-4 px-2 rounded-lg hover:bg-pink-50 ${
                    category.featured ? "text-pink-600 border-b-2 border-pink-600" : "text-gray-700"
                  }`}
                >
                  <span>{category.name}</span>
                  {category.subcategories && <ChevronDown className="h-4 w-4 group-hover:rotate-180 transition-transform duration-300" />}
                </Link>

                {/* Dropdown Menu */}
                {activeCategory === category.name && category.subcategories && (
                  <div 
                    className="absolute top-full left-1/2 -ml-24 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 animate-in slide-in-from-top-2 duration-200"
                    onMouseEnter={() => setActiveCategory(category.name)}
                    onMouseLeave={() => setActiveCategory(null)}
                  >
                  {category.subcategories.map((sub, index) => {
                    // URL'yi temizle - adım adım
                    let cleanUrl = sub.toLowerCase()  // küçük harf yap
                    
                    // Özel karakterleri değiştir
                    if (cleanUrl.includes("%50'ye varan")) {
                      cleanUrl = "50ye-varan"
                    } else if (cleanUrl.includes("son fırsat")) {
                      cleanUrl = "son-firsat"
                    } else if (cleanUrl.includes("i̇ndirimli")) {
                      cleanUrl = "indirimli"
                    } else {
                      // Genel temizlik
                      cleanUrl = cleanUrl
                        .replace(/[^a-z0-9\s]/g, "")  // özel karakterleri kaldır
                        .replace(/\s+/g, "-")         // boşlukları tire yap
                        .replace(/-+/g, "-")          // çoklu tireleri tek tire yap
                        .replace(/^-|-$/g, "")        // başta/sonda tire varsa kaldır
                    }
                    
                    return (
                      <Link
                        key={index}
                        href={`${category.href}/${cleanUrl}`}
                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-pink-50 hover:text-pink-600 transition-colors"
                        onClick={() => setActiveCategory(null)}
                      >
                        {sub}
                      </Link>
                    )
                  })}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </nav>


      </header>

      {/* Mobile Sidebar */}
      <div
        className={`fixed inset-0 z-50 md:hidden transition-all duration-300 ${isMenuOpen ? "visible" : "invisible"}`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black transition-opacity duration-300 ${
            isMenuOpen ? "opacity-50" : "opacity-0"
          }`}
          onClick={() => setIsMenuOpen(false)}
        />

        {/* Sidebar */}
        <div
          className={`absolute left-0 top-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-100 bg-gradient-to-r from-pink-500 to-orange-400">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white">
                  <span className="text-sm font-bold text-pink-600">ME</span>
                </div>
                <span className="text-lg font-bold text-white">Moda Es Es</span>
              </div>
              <Button
                variant="transparent"
                size="small"
                onClick={() => setIsMenuOpen(false)}
                className="text-white hover:bg-white/20"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Mobile Search */}
            <div className="p-4 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleSearch(searchQuery)
                      setIsMenuOpen(false)
                    }
                  }}
                  className="pl-10 pr-4 py-2 w-full rounded-full border-gray-200 focus:border-pink-300 focus:ring-pink-200"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {categories.map((category, index) => (
                  <div
                    key={category.name}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-in slide-in-from-left duration-300"
                  >
                    <Link
                      href={category.href}
                      className={`flex items-center justify-between py-3 px-4 rounded-lg text-sm font-medium transition-all duration-200 ${
                        category.featured
                          ? "bg-gradient-to-r from-pink-50 to-orange-50 text-pink-600 border border-pink-200"
                          : "text-gray-700 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{category.name}</span>
                      {category.featured && (
                        <span className="bg-pink-500 text-white text-xs px-2 py-1 rounded-full">YENİ</span>
                      )}
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50">
              <div className="flex items-center justify-around">
                <Button variant="transparent" size="small" className="flex flex-col items-center space-y-1">
                  <User className="h-5 w-5" />
                  <span className="text-xs">Hesabım</span>
                </Button>
                <Link href="/favorites" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="transparent" size="small" className="flex flex-col items-center space-y-1 relative">
                    <Heart className="h-5 w-5" />
                    <span className="text-xs">Favoriler</span>
                    {favoritesCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-500 text-xs text-white flex items-center justify-center">
                        {favoritesCount}
                      </span>
                    )}
                  </Button>
                </Link>
                <Link href="/cart" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="transparent" size="small" className="flex flex-col items-center space-y-1 relative">
                    <ShoppingBag className="h-5 w-5" />
                    <span className="text-xs">Sepetim</span>
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-pink-500 text-xs text-white flex items-center justify-center">
                        {cartCount}
                      </span>
                    )}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
} 