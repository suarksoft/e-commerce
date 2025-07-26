"use client"

import { sdk } from "@lib/config"

export interface FavoriteProduct {
  id: string
  title: string
  handle: string
  thumbnail: string
  created_at: string
  variants?: Array<{
    id: string
    title: string
  }>
}

// LocalStorage tabanlı favori yönetimi
const FAVORITES_KEY = 'user_favorites'

const getFavoritesFromStorage = (): string[] => {
  if (typeof window === 'undefined') return []
  try {
    const stored = localStorage.getItem(FAVORITES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveFavoritesToStorage = (favorites: string[]) => {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites))
  } catch (error) {
    console.error('Favoriler kaydedilirken hata:', error)
  }
}

export const getFavorites = async (): Promise<FavoriteProduct[]> => {
  try {
    const favoriteIds = getFavoritesFromStorage()
    
    if (favoriteIds.length === 0) {
      return []
    }

    // Medusa API'den gerçek ürün verilerini al (varyant bilgileri dahil)
    const { products } = await sdk.client.fetch<{ products: any[] }>(
      `/store/products`,
      {
        method: "GET",
        query: {
          id: favoriteIds,
          limit: 100,
          fields: "id,title,handle,thumbnail,created_at,variants.id,variants.title"
        }
      }
    )
    
    // Favori ID'lerine göre sırala
    const favorites = favoriteIds
      .map(id => products?.find((p: any) => p.id === id))
      .filter(Boolean)
      .map((product: any) => ({
        id: product.id,
        title: product.title,
        handle: product.handle,
        thumbnail: product.thumbnail || "/placeholder.svg",
        created_at: product.created_at,
        variants: product.variants || []
      }))

    return favorites
  } catch (error) {
    console.error("Favori ürünler alınırken hata:", error)
    return []
  }
}

export const addToFavorites = async (productId: string): Promise<boolean> => {
  try {
    const favorites = getFavoritesFromStorage()
    if (!favorites.includes(productId)) {
      favorites.push(productId)
      saveFavoritesToStorage(favorites)
    }
    return true
  } catch (error) {
    console.error("Favori eklenirken hata:", error)
    return false
  }
}

export const removeFromFavorites = async (productId: string): Promise<boolean> => {
  try {
    const favorites = getFavoritesFromStorage()
    const updatedFavorites = favorites.filter(id => id !== productId)
    saveFavoritesToStorage(updatedFavorites)
    return true
  } catch (error) {
    console.error("Favori kaldırılırken hata:", error)
    return false
  }
}

export const isProductFavorited = async (productId: string): Promise<boolean> => {
  try {
    const favorites = getFavoritesFromStorage()
    return favorites.includes(productId)
  } catch (error) {
    console.error("Favori durumu kontrol edilirken hata:", error)
    return false
  }
} 