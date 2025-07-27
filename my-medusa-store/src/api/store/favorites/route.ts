import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

// Mock favoriler verisi (gerçek uygulamada database'den gelecek)
const mockFavorites = new Map<string, string[]>()

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  try {
    // JWT token'dan customer ID'yi al (şimdilik basit)
    const customerId = "temp_customer_id" // Gerçek uygulamada JWT'den alınacak
    
    // Mock favorileri getir
    const customerFavorites = mockFavorites.get(customerId) || []
    
    // Mock ürün verileri
    const favorites = customerFavorites.map(productId => ({
      id: `fav_${productId}`,
      product_id: productId,
      title: `Ürün ${productId}`,
      handle: `urun-${productId}`,
      thumbnail: "/placeholder.svg",
      created_at: new Date().toISOString()
    }))

    res.json({ favorites })
  } catch (error) {
    console.error("Favoriler getirilirken hata:", error)
    res.status(500).json({ message: "Internal server error" })
  }
}

export async function POST(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const body = req.body as { productId?: string }
  const { productId } = body

  if (!productId) {
    res.status(400).json({ message: "Product ID is required" })
    return
  }

  try {
    const customerId = "temp_customer_id" // Gerçek uygulamada JWT'den alınacak
    
    // Mock favorilere ekle
    const customerFavorites = mockFavorites.get(customerId) || []
    if (!customerFavorites.includes(productId)) {
      customerFavorites.push(productId)
      mockFavorites.set(customerId, customerFavorites)
    }

    res.status(201).json({ message: "Added to favorites" })
  } catch (error) {
    console.error("Favori eklenirken hata:", error)
    res.status(500).json({ message: "Failed to add to favorites" })
  }
}

export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
): Promise<void> {
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const body = req.body as { productId?: string }
  const { productId } = body

  if (!productId) {
    res.status(400).json({ message: "Product ID is required" })
    return
  }

  try {
    const customerId = "temp_customer_id" // Gerçek uygulamada JWT'den alınacak
    
    // Mock favorilerden kaldır
    const customerFavorites = mockFavorites.get(customerId) || []
    const updatedFavorites = customerFavorites.filter(id => id !== productId)
    mockFavorites.set(customerId, updatedFavorites)

    res.json({ message: "Removed from favorites" })
  } catch (error) {
    console.error("Favori kaldırılırken hata:", error)
    res.status(500).json({ message: "Failed to remove from favorites" })
  }
} 