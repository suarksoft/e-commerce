"use client"

import { useState } from "react"
import { XMarkIcon } from "@heroicons/react/20/solid"

export default function AnnouncementBanner() {
  const [isVisible, setIsVisible] = useState(true)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) {
    return null
  }

  return (
    <div className="bg-gradient-to-r from-pink-500 to-orange-400 text-white text-center py-3 text-sm font-medium relative overflow-hidden border-b border-pink-400/20">
    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse"></div>
    <div className="relative z-10 flex items-center justify-center gap-2">
      <span className="animate-bounce">🎉</span>
      <span>Yeni sezon koleksiyonunda %40'a varan indirim! Ücretsiz kargo fırsatını kaçırma</span>
      <span className="animate-bounce">✨</span>
    </div>
  </div>
  )
}
