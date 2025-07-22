import Link from "next/link"

export default function AltGiyimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-container py-6">
      <div className="mb-8 text-2xl-semi">
        <h1>Alt Giyim</h1>
        <p className="text-sm text-gray-600 mt-2">
          En şık alt giyim ürünlerimizi ve alt kategorileri keşfedin
        </p>
      </div>
      <nav className="mb-8 flex gap-4">
        <Link href="./pantolon" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 transition-colors">Pantolon</Link>
        <Link href="./etek" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 transition-colors">Etek</Link>
      </nav>
      {children}
    </div>
  )
}
