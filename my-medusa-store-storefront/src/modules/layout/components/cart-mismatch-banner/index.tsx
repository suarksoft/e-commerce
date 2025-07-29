"use client"

import { transferCart } from "@lib/data/customer"
import { ExclamationCircleSolid } from "@medusajs/icons"
import { StoreCart, StoreCustomer } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import { useState } from "react"
import { ShoppingCart, RefreshCw } from "lucide-react"

function CartMismatchBanner(props: {
  customer: StoreCustomer
  cart: StoreCart
}) {
  const { customer, cart } = props
  const [isPending, setIsPending] = useState(false)
  const [actionText, setActionText] = useState("Sepeti Güncelle")
  const [isRetrying, setIsRetrying] = useState(false)

  if (!customer || !!cart.customer_id) {
    return
  }

  const handleSubmit = async () => {
    try {
      setIsPending(true)
      setIsRetrying(true)
      setActionText("Güncelleniyor...")

      await transferCart()
      
      // Başarılı olursa sayfayı yenile
      window.location.reload()
    } catch (error) {
      console.error("Cart transfer error:", error)
      setActionText("Tekrar Dene")
      setIsPending(false)
      setIsRetrying(false)
    }
  }

  return (
    <div className="flex items-center justify-center p-3 text-center bg-blue-50 border border-blue-200 text-blue-800 rounded-lg mx-4 my-3">
      <div className="flex flex-col sm:flex-row sm:gap-3 gap-2 items-center">
        <span className="flex items-center gap-2 text-sm">
          <ShoppingCart className="h-4 w-4" />
          <span>
            Sepetiniz hesabınızla eşitlenmedi. Güncellemek için butona tıklayın.
          </span>
        </span>

        <span className="hidden sm:block text-blue-400">•</span>

        <Button
          variant="transparent"
          className="hover:bg-blue-100 active:bg-blue-100 focus:bg-blue-100 disabled:text-blue-400 text-blue-700 p-2 bg-transparent rounded-md border border-blue-300 hover:border-blue-400 transition-colors text-sm font-medium"
          size="base"
          disabled={isPending}
          onClick={handleSubmit}
        >
          <div className="flex items-center gap-1">
            {isRetrying && (
              <RefreshCw className="h-3 w-3 animate-spin" />
            )}
            {actionText}
          </div>
        </Button>
      </div>
    </div>
  )
}

export default CartMismatchBanner
