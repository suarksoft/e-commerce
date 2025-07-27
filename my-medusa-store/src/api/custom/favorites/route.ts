import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Basit session yönetimi (gerçek uygulamada Redis veya database kullanılmalı)
const sessionFavorites = new Map<string, string[]>()

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  try {
    // Session ID'yi al (cookie'den veya header'dan)
    const sessionId = req.headers['x-session-id'] as string || 'default-session'
    
    // Session'dan favorileri getir
    const sessionFavs = sessionFavorites.get(sessionId) || []
    
    // Mock ürün verileri (gerçek uygulamada database'den gelecek)
    const mockProducts = [
      {
        id: "prod_1",
        title: "Örnek Ürün 1",
        handle: "ornek-urun-1",
        thumbnail: "/placeholder.svg",
        created_at: new Date().toISOString()
      },
      {
        id: "prod_2", 
        title: "Örnek Ürün 2",
        handle: "ornek-urun-2",
        thumbnail: "/placeholder.svg",
        created_at: new Date().toISOString()
      }
    ]
    
    // Session'da olan ürünleri filtrele
    const favorites = mockProducts.filter(product => sessionFavs.includes(product.id))
    
    res.json({ favorites })
  } catch (error) {
    console.error("Favoriler getirilirken hata:", error)
    res.status(500).json({ message: "Internal server error", error: error.message })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const body = req.body as { productId?: string }
  const { productId } = body

  if (!productId) {
    res.status(400).json({ message: "Product ID is required" })
    return
  }

  try {
    const sessionId = req.headers['x-session-id'] as string || 'default-session'
    
    // Session'a ekle
    const sessionFavs = sessionFavorites.get(sessionId) || []
    if (!sessionFavs.includes(productId)) {
      sessionFavs.push(productId)
      sessionFavorites.set(sessionId, sessionFavs)
    }

    res.status(201).json({ message: "Added to favorites" })
  } catch (error) {
    console.error("Favori eklenirken hata:", error)
    res.status(500).json({ message: "Failed to add to favorites", error: error.message })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const body = req.body as { productId?: string }
  const { productId } = body

  if (!productId) {
    res.status(400).json({ message: "Product ID is required" })
    return
  }

  try {
    const sessionId = req.headers['x-session-id'] as string || 'default-session'
    
    // Session'dan kaldır
    const sessionFavs = sessionFavorites.get(sessionId) || []
    const updatedFavs = sessionFavs.filter(id => id !== productId)
    sessionFavorites.set(sessionId, updatedFavs)

    res.json({ message: "Removed from favorites" })
  } catch (error) {
    console.error("Favori kaldırılırken hata:", error)
    res.status(500).json({ message: "Failed to remove from favorites", error: error.message })
  }
} 