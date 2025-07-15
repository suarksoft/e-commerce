"use server"

import { sdk } from "@lib/config"
import { getAuthHeaders } from "./cookies"

export interface FavoriteProduct {
  id: string
  title: string
  handle: string
  thumbnail: string
  created_at: string
}

export const getFavorites = async (): Promise<FavoriteProduct[]> => {
  const headers = await getAuthHeaders()

  if (!headers) {
    return []
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/favorites`, {
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      return []
    }

    const data = await response.json()
    return data.favorites || []
  } catch (error) {
    console.error("Favori ürünler alınırken hata:", error)
    return []
  }
}

export const addToFavorites = async (productId: string): Promise<boolean> => {
  const headers = await getAuthHeaders()

  if (!headers) {
    return false
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/favorites`, {
      method: "POST",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    })

    return response.ok
  } catch (error) {
    console.error("Favori eklenirken hata:", error)
    return false
  }
}

export const removeFromFavorites = async (productId: string): Promise<boolean> => {
  const headers = await getAuthHeaders()

  if (!headers) {
    return false
  }

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/favorites`, {
      method: "DELETE",
      headers: {
        ...headers,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    })

    return response.ok
  } catch (error) {
    console.error("Favori kaldırılırken hata:", error)
    return false
  }
}

export const isProductFavorited = async (productId: string): Promise<boolean> => {
  const favorites = await getFavorites()
  return favorites.some(fav => fav.id === productId)
} 