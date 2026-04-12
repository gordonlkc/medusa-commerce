"use client"

import { HttpTypes } from "@medusajs/types"
import Image from "next/image"
import { useState } from "react"

type ProductGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  productTitle: string
}

export default function ProductGallery({
  images,
  productTitle,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(
    images?.[0]?.url || null
  )

  const displayImage = selectedImage || images?.[0]?.url

  if (!displayImage) {
    return (
      <div className="relative h-[400px] lg:h-[500px] rounded-md overflow-hidden bg-gray-1" />
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative h-[400px] lg:h-[500px] rounded-md overflow-hidden bg-gray-1">
        <Image
          src={displayImage}
          alt={productTitle}
          fill
          className="object-cover"
          priority
        />
      </div>
      {images && images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((img, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedImage(img.url)}
              className={`relative h-20 rounded overflow-hidden border-2 ${
                selectedImage === img.url ? "border-blue" : "border-transparent"
              }`}
            >
              <Image
                src={img.url}
                alt={`${productTitle} thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}