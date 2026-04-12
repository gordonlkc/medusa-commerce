"use client"

import Image from "next/image"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { AddToCartButton } from "./AddToCartButton"

function formatPrice(amount: number | null | undefined, region: HttpTypes.StoreRegion) {
  if (amount === null || amount === undefined) return "0.00"
  const currency = region.currency_code?.toUpperCase() || "USD"
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount / 100)
}

export function ProductCard({
  product,
  region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const firstVariant = product.variants?.[0]
  const calculatedPrice = firstVariant?.calculated_price as any
  const price = calculatedPrice?.calculated_amount
  const originalPrice = calculatedPrice?.original_amount
  const isOnSale = originalPrice && originalPrice > (price || 0)
  const isNew = product.created_at
    ? new Date(product.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    : false
  const countryCode = region.countries?.[0]?.iso_2 || "us"

  return (
    <div className="group">
      <div className="relative h-[280px] rounded-md overflow-hidden bg-gray-1 mb-4">
        <Image
          src={product.thumbnail || "/images/products/placeholder.jpg"}
          alt={product.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {isNew && (
          <span className="absolute top-3 left-3 bg-blue text-white text-2xs px-2 py-1 rounded">
            NEW
          </span>
        )}
        {isOnSale && (
          <span className="absolute top-3 right-3 bg-red-500 text-white text-2xs px-2 py-1 rounded">
            SALE
          </span>
        )}
        <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
          <AddToCartButton variantId={firstVariant?.id} countryCode={countryCode} />
        </div>
      </div>
      <Link href={`/${countryCode}/products/${product.handle}`}>
        <h3 className="text-custom-sm font-medium text-dark hover:text-blue transition-colors mb-2">
          {product.title}
        </h3>
      </Link>
      <div className="flex items-center gap-2">
        <span className="text-custom-sm font-medium text-dark">
          {formatPrice(price, region)}
        </span>
        {isOnSale && (
          <span className="text-custom-sm text-dark-4 line-through">
            {formatPrice(originalPrice, region)}
          </span>
        )}
      </div>
    </div>
  )
}