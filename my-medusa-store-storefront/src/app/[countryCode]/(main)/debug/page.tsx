import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Debug - Kategoriler",
}

export default async function DebugPage() {
  try {
    // Basit bir test sayfası
    return (
      <div className="content-container py-6">
        <h1>Debug - Kategoriler</h1>
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Mevcut Kategoriler</h2>
          <div className="bg-green-100 p-4 rounded">
            <p><strong>Elbise:</strong> handle: elbise</p>
            <p><strong>Yeni Gelenler:</strong> handle: yeni-gelenler</p>
          </div>
        </div>
        
        <div className="mt-6">
          <h2 className="text-xl font-bold mb-4">Test Linkleri</h2>
          <div className="space-y-2">
            <a href="/tr/elbise" className="block text-blue-600 hover:underline">Elbise Sayfası</a>
            <a href="/tr/yeni-gelenler" className="block text-blue-600 hover:underline">Yeni Gelenler Sayfası</a>
          </div>
        </div>
      </div>
    )
  } catch (error) {
    return (
      <div className="content-container py-6">
        <h1>Debug - Hata</h1>
        <pre className="bg-red-100 p-4 rounded mt-4">
          {error instanceof Error ? error.message : 'Bilinmeyen hata'}
        </pre>
      </div>
    )
  }
} 