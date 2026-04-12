"use client"

import { addToCart } from "@lib/data/cart"
import { useState } from "react"
import { HttpTypes } from "@medusajs/types"

export function AddToCartButton({
  variantId,
  countryCode,
}: {
  variantId?: string
  countryCode: string
}) {
  const [isAdding, setIsAdding] = useState(false)

  const handleAddToCart = async () => {
    if (!variantId) return
    setIsAdding(true)
    await addToCart({
      variantId,
      quantity: 1,
      countryCode,
    })
    setIsAdding(false)
  }

  return (
    <button
      onClick={handleAddToCart}
      disabled={!variantId || isAdding}
      className="w-full bg-white text-dark py-2 rounded text-custom-sm font-medium hover:bg-blue hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isAdding ? "Adding..." : "Add to Cart"}
    </button>
  )
}