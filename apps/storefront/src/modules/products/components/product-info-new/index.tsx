"use client"

import { addToCart } from "@lib/data/cart"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import { isEqual } from "lodash"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useMemo, useState } from "react"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}

const optionsAsKeymap = (
  variantOptions: HttpTypes.StoreProductVariant["options"]
) => {
  return variantOptions?.reduce((acc: Record<string, string>, varopt: any) => {
    acc[varopt.option_id] = varopt.value
    return acc
  }, {})
}

export default function ProductInfo({ product, region }: ProductInfoProps) {
  const router = useRouter()
  const countryCode = useParams().countryCode as string

  const [options, setOptions] = useState<Record<string, string | undefined>>({})
  const [quantity, setQuantity] = useState(1)
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    if (product.variants?.length === 1) {
      const variantOptions = optionsAsKeymap(product.variants[0].options)
      setOptions(variantOptions ?? {})
    }
  }, [product.variants])

  const selectedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) {
      return
    }

    return product.variants.find((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const setOptionValue = (optionId: string, value: string) => {
    setOptions((prev) => ({
      ...prev,
      [optionId]: value,
    }))
  }

  const isValidVariant = useMemo(() => {
    return product.variants?.some((v) => {
      const variantOptions = optionsAsKeymap(v.options)
      return isEqual(variantOptions, options)
    })
  }, [product.variants, options])

  const inStock = useMemo(() => {
    if (selectedVariant && !selectedVariant.manage_inventory) {
      return true
    }
    if (selectedVariant?.allow_backorder) {
      return true
    }
    if (
      selectedVariant?.manage_inventory &&
      (selectedVariant?.inventory_quantity || 0) > 0
    ) {
      return true
    }
    return false
  }, [selectedVariant])

  const { cheapestPrice, variantPrice } = getProductPrice({
    product,
    variantId: selectedVariant?.id,
  })

  const selectedPrice = selectedVariant ? variantPrice : cheapestPrice

  const handleAddToCart = async () => {
    if (!selectedVariant?.id) return

    setIsAdding(true)

    await addToCart({
      variantId: selectedVariant.id,
      quantity,
      countryCode,
    })

    setIsAdding(false)
  }

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= 99) {
      setQuantity(newQty)
    }
  }

  return (
    <div>
      <h1 className="text-heading-4 font-medium text-dark mb-4">
        {product.title}
      </h1>

      {selectedPrice && (
        <div className="flex items-center gap-3 mb-6">
          <span className="text-heading-5 font-medium text-dark">
            {selectedPrice.calculated_price}
          </span>
          {selectedPrice.price_type === "sale" && (
            <span className="text-custom-lg text-dark-4 line-through">
              {selectedPrice.original_price}
            </span>
          )}
        </div>
      )}

      <p className="text-body text-custom-sm mb-6">{product.description}</p>

      {product.options?.map((option) => (
        <div className="mb-6" key={option.id}>
          <label className="block text-custom-sm font-medium text-dark mb-2">
            {option.title}
          </label>
          <div className="flex flex-wrap gap-2">
            {option.values?.map((value) => {
              const isSelected = options[option.id] === value.value
              return (
                <button
                  key={value.id}
                  onClick={() => setOptionValue(option.id, value.value)}
                  className={`px-4 py-2 border rounded text-custom-sm transition-colors ${
                    isSelected
                      ? "border-blue bg-blue text-white"
                      : "border-gray-3 hover:border-blue text-dark"
                  }`}
                >
                  {value.value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      <div className="mb-6">
        <label className="block text-custom-sm font-medium text-dark mb-2">
          Quantity
        </label>
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleQuantityChange(quantity - 1)}
            className="w-10 h-10 border border-gray-3 rounded flex items-center justify-center text-dark hover:border-blue transition-colors"
          >
            -
          </button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
            className="w-16 h-10 border border-gray-3 rounded text-center text-dark focus:outline-none focus:border-blue"
            min="1"
            max="99"
          />
          <button
            onClick={() => handleQuantityChange(quantity + 1)}
            className="w-10 h-10 border border-gray-3 rounded flex items-center justify-center text-dark hover:border-blue transition-colors"
          >
            +
          </button>
        </div>
      </div>

      <button
        onClick={handleAddToCart}
        disabled={
          !inStock ||
          !selectedVariant ||
          isAdding ||
          !isValidVariant
        }
        className="w-full btn btn-primary mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {!selectedVariant && !options
          ? "Select variant"
          : !inStock || !isValidVariant
          ? "Out of stock"
          : isAdding
          ? "Adding..."
          : "Add to Cart"}
      </button>

      <button className="w-full btn btn-secondary">Add to Wishlist</button>
    </div>
  )
}