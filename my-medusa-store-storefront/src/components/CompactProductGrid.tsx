"use client"

import React, { useEffect, useState } from "react"

interface Product {
  id: string
  title: string
  thumbnail?: string
  variants?: { prices?: { amount: number }[] }[]
}

export default function CompactProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=8`, {
      headers: {
        "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="py-8 flex justify-center items-center">
        <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!products.length) {
    return null
  }

  return (
    <section className="max-w-7xl mx-auto px-4 py-6">
      <h2 className="text-2xl font-bold text-pink-700 mb-4 text-center">Öne Çıkan Ürünler</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
        {products.slice(0, 8).map((product) => {
          const price = product.variants?.[0]?.prices?.[0]?.amount
          return (
            <a
              key={product.id}
              href={`/products/${product.id}`}
              className="bg-white rounded-xl shadow hover:shadow-lg transition p-3 flex flex-col items-center group border border-pink-50 hover:border-pink-200"
            >
              <div className="w-full aspect-[3/4] bg-pink-50 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                <img
                  src={product.thumbnail || "/placeholder.svg"}
                  alt={product.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="w-full text-center">
                <h3 className="text-sm font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors">
                  {product.title}
                </h3>
                <span className="text-pink-600 font-bold text-lg">
                  {price ? `${Math.floor(price / 100)}₺` : ""}
                </span>
              </div>
            </a>
          )
        })}
      </div>
    </section>
  )
} 