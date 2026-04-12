"use server"

import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { ProductCard } from "./ProductCard"

interface FeaturedProductsProps {
  region: HttpTypes.StoreRegion
  collections?: HttpTypes.StoreCollection[]
}

async function getFeaturedProducts(region: HttpTypes.StoreRegion) {
  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 5,
    },
    regionId: region.id,
  })
  return response.products
}

export default async function FeaturedProducts({
  region,
}: FeaturedProductsProps) {
  const products = await getFeaturedProducts(region)
  const countryCode = region.countries?.[0]?.iso_2 || "us"

  if (!products || products.length === 0) {
    return (
      <section className="py-15 xl:py-20 bg-gray">
        <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
          <div className="flex items-center justify-between mb-10">
            <div>
              <span className="text-custom-xs text-blue uppercase tracking-wider mb-2 block">
                JUST FOR YOU
              </span>
              <h2 className="text-heading-4 font-medium text-dark">
                Featured Products
              </h2>
            </div>
            <Link
              href={`/${countryCode}/store`}
              className="text-custom-sm font-medium text-dark hover:text-blue"
            >
              View All Products
            </Link>
          </div>
          <p className="text-custom-sm text-dark-4">No products available</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-15 xl:py-20 bg-gray">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="flex items-center justify-between mb-10">
          <div>
            <span className="text-custom-xs text-blue uppercase tracking-wider mb-2 block">
              JUST FOR YOU
            </span>
            <h2 className="text-heading-4 font-medium text-dark">
              Featured Products
            </h2>
          </div>
          <Link
            href={`/${countryCode}/store`}
            className="text-custom-sm font-medium text-dark hover:text-blue"
          >
            View All Products
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-5">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} region={region} />
          ))}
        </div>
      </div>
    </section>
  )
}