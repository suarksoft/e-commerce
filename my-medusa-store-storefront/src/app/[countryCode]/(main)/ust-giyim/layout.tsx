import Link from "next/link"

export default function UstGiyimLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="content-container py-6">
      <div className="mb-8 text-2xl-semi">
        <h1>Üst Giyim</h1>
        <p className="text-sm text-gray-600 mt-2">
          En şık üst giyim ürünlerimizi ve alt kategorileri keşfedin
        </p>
      </div>
      <nav className="mb-8 flex gap-4">
        <Link href="./kazak" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 transition-colors">Kazak</Link>
        <Link href="./gomlek" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 transition-colors">Gömlek</Link>
        <Link href="./ceket" className="px-4 py-2 rounded-full bg-gray-100 hover:bg-pink-100 text-gray-700 hover:text-pink-600 transition-colors">Ceket</Link>
      </nav>
      {children}
    </div>
  )
}
