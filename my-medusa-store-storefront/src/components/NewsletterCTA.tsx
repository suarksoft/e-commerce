import React from "react"

export default function NewsletterCTA() {
  return (
    <section className="bg-white rounded-xl shadow p-8 flex flex-col items-center text-center mb-12">
      <h2 className="text-2xl font-bold text-pink-700 mb-2">Moda Es Es Bültenine Katıl!</h2>
      <p className="text-pink-900 mb-4">
        En yeni trendler, indirimler ve fırsatlar için e-posta adresini bırak.
      </p>
      <form className="flex flex-col sm:flex-row gap-2 w-full max-w-md">
        <input
          type="email"
          placeholder="E-posta adresin"
          className="flex-1 px-4 py-2 rounded-full border border-pink-200 focus:outline-none"
        />
        <button
          type="submit"
          className="bg-pink-600 text-white px-6 py-2 rounded-full font-semibold hover:bg-pink-700 transition"
        >
          Katıl
        </button>
      </form>
    </section>
  )
} 