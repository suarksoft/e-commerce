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
    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gradient-to-r from-rose-50 to-pink-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1 transition-all duration-300">
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(-7rem,calc(50%-52rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#ff6b9d] opacity-40"
        />
      </div>
      <div
        aria-hidden="true"
        className="absolute top-1/2 left-[max(45rem,calc(50%+8rem))] -z-10 -translate-y-1/2 transform-gpu blur-2xl"
      >
        <div
          style={{
            clipPath:
              "polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)",
          }}
          className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff6b9d] to-[#ff80b5] opacity-40"
        />
      </div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm/6 text-gray-900">
          <strong className="font-semibold">🌸 Bahar Koleksiyonu</strong>
          <svg viewBox="0 0 2 2" aria-hidden="true" className="mx-2 inline size-0.5 fill-current">
            <circle r={1} cx={1} cy={1} />
          </svg>
          Yeni sezon parçalarında %40'a varan indirim! Ücretsiz kargo fırsatını kaçırmayın.
        </p>
        <a
          href="#"
          className="flex-none rounded-full bg-gradient-to-r from-rose-500 to-pink-500 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:from-rose-600 hover:to-pink-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rose-500 transition-all duration-300"
        >
          Hemen Keşfet <span aria-hidden="true">✨</span>
        </a>
      </div>
      <div className="flex flex-1 justify-end">
        <button
          type="button"
          onClick={handleClose}
          className="-m-3 p-3 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-4 focus-visible:outline-rose-500 hover:bg-rose-100 rounded-full transition-all duration-200"
        >
          <span className="sr-only">Kapat</span>
          <XMarkIcon
            aria-hidden="true"
            className="size-5 text-gray-700 hover:text-rose-600 transition-colors duration-200"
          />
        </button>
      </div>
    </div>
  )
}
