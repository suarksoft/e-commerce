"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
}

const ImageGallery = ({ images }: ImageGalleryProps) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  
  if (!images || images.length === 0) {
    return (
      <div className="flex h-96 w-full items-center justify-center bg-gray-200 sm:rounded-lg">
        <span className="text-gray-400">No image available</span>
      </div>
    )
  }

  const currentImage = images[selectedImageIndex]

  return (
    <div className="flex flex-col-reverse">
      {/* Thumbnail Selector */}
      {images.length > 1 && (
        <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
          <div className="grid grid-cols-4 gap-6">
            {images.map((image, index) => (
              <button
                key={image.id || index}
                onClick={() => setSelectedImageIndex(index)}
                className={`group relative flex h-24 cursor-pointer items-center justify-center rounded-md bg-white text-sm font-medium uppercase hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4 ${
                  selectedImageIndex === index
                    ? 'ring-2 ring-rose-500'
                    : 'ring-2 ring-transparent'
                }`}
              >
                <span className="sr-only">Image {index + 1}</span>
                <span className="absolute inset-0 overflow-hidden rounded-md">
                  {image.url && (
                    <Image
                      src={image.url}
                      alt={`Product thumbnail ${index + 1}`}
                      fill
                      className="h-full w-full object-cover object-center"
                    />
                  )}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Image */}
      <div className="aspect-h-1 aspect-w-1 w-full">
        {currentImage?.url ? (
          <Image
            src={currentImage.url}
            alt="Product image"
            width={600}
            height={600}
            className="h-full w-full object-cover object-center sm:rounded-lg"
            priority
          />
        ) : (
          <div className="flex h-96 w-full items-center justify-center bg-gray-200 sm:rounded-lg">
            <span className="text-gray-400">No image available</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default ImageGallery
