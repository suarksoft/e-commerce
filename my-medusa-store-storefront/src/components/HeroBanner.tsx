"use client"
import React, { useEffect, useState } from "react"

interface Product {
  id: string
  title: string
  thumbnail?: string
  variants?: { prices?: { amount: number }[] }[]
}

export default function HeroBanner() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/products?limit=6`, {
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

  return (
    <section className="w-full bg-gradient-to-r from-pink-200 to-orange-100 py-8 md:py-12 mb-8">
      <div className="max-w-7xl mx-auto px-4">
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <div className="w-12 h-12 border-4 border-pink-200 border-t-pink-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {products.map((product) => {
              const price = product.variants?.[0]?.prices?.[0]?.amount
              return (
                <a
                  key={product.id}
                  href={`/products/${product.id}`}
                  className="bg-white rounded-xl shadow hover:shadow-lg transition p-2 flex flex-col items-center group border border-pink-50 hover:border-pink-200"
                >
                  <div className="w-full aspect-[3/4] bg-pink-50 rounded-lg overflow-hidden mb-2 flex items-center justify-center">
                    <img
                      src={product.thumbnail || "/placeholder.svg"}
                      alt={product.title}
                      className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="w-full text-center">
                    <h3 className="text-xs font-semibold text-gray-800 mb-1 line-clamp-2 group-hover:text-pink-600 transition-colors">
                      {product.title}
                    </h3>
                    <span className="text-pink-600 font-bold text-base">
                      {price ? `${Math.floor(price / 100)}₺` : ""}
                    </span>
                  </div>
                </a>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
} 