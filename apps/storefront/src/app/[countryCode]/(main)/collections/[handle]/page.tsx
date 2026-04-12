import { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import { getCollectionByHandle } from "@lib/data/collections"
import { getRegion } from "@lib/data/regions"
import { listProducts } from "@lib/data/products"
import { ProductCard } from "@/components/home/ProductCard"

export const dynamicParams = true

type Props = {
  params: Promise<{ handle: string; countryCode: string }>
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const metadata = {
    title: `${collection.title} | Medusa Store`,
    description: `${collection.title} collection`,
  } as Metadata

  return metadata
}

export default async function CollectionPage(props: Props) {
  const params = await props.params
  const countryCode = params.countryCode

  const collection = await getCollectionByHandle(params.handle)

  if (!collection) {
    notFound()
  }

  const region = await getRegion(countryCode)

  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 12,
      collection_id: [collection.id],
    },
    regionId: region?.id,
  })

  const products = response.products || []
  const categories = [
    { id: "1", name: "Electronics", handle: "electronics" },
    { id: "2", name: "Clothing", handle: "clothing" },
    { id: "3", name: "Home & Garden", handle: "home-garden" },
    { id: "4", name: "Sports", handle: "sports" },
    { id: "5", name: "Books", handle: "books" },
  ]

  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="mb-8 text-center">
          <h1 className="text-heading-3 font-medium text-dark mb-3">
            {collection.title}
          </h1>
          {collection.description && (
            <p className="text-body text-custom-sm max-w-2xl mx-auto">
              {collection.description}
            </p>
          )}
        </div>

        <nav className="mb-8">
          <ol className="flex items-center justify-center gap-2 text-custom-sm">
            <li>
              <Link href={`/${countryCode}`} className="hover:text-blue">
                Home
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href={`/${countryCode}/store`} className="hover:text-blue">
                Shop
              </Link>
            </li>
            <li>/</li>
            <li className="text-dark">{collection.title}</li>
          </ol>
        </nav>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[280px] flex-shrink-0">
            <div className="bg-white p-6 rounded-md border border-gray-3">
              <h3 className="text-custom-sm font-medium text-dark mb-5">
                Filters
              </h3>

              <div className="mb-6">
                <h4 className="text-custom-sm font-medium text-dark mb-3">
                  Categories
                </h4>
                <ul className="space-y-2">
                  {categories.map((cat) => (
                    <li key={cat.id}>
                      <Link
                        href={`/${countryCode}/categories/${cat.handle}`}
                        className="text-body text-custom-sm hover:text-blue"
                      >
                        {cat.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h4 className="text-custom-sm font-medium text-dark mb-3">
                  Price Range
                </h4>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    className="w-full border border-gray-3 rounded px-3 py-2 text-custom-sm"
                  />
                  <span className="text-body">-</span>
                  <input
                    type="number"
                    placeholder="Max"
                    className="w-full border border-gray-3 rounded px-3 py-2 text-custom-sm"
                  />
                </div>
              </div>

              <button className="text-custom-sm text-blue hover:underline">
                Clear All Filters
              </button>
            </div>
          </aside>

          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <p className="text-custom-sm text-body">
                Showing <span className="text-dark font-medium">{products.length}</span> products
              </p>
              <select className="border border-gray-3 rounded px-3 py-2 text-custom-sm">
                <option>Default Sorting</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
              </select>
            </div>

            {products.length === 0 ? (
              <div className="text-center py-15">
                <p className="text-custom-lg text-body mb-4">
                  No products found in this collection
                </p>
                <Link
                  href={`/${countryCode}/store`}
                  className="btn btn-primary"
                >
                  View All Products
                </Link>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                  {products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      region={region as HttpTypes.StoreRegion}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 mt-10">
                  <button className="w-10 h-10 rounded border border-gray-3 flex items-center justify-center hover:border-blue hover:text-blue">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5 8.25 12l7.5-7.5"
                      />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded border border-gray-3 flex items-center justify-center bg-blue text-white">
                    1
                  </button>
                  <button className="w-10 h-10 rounded border border-gray-3 flex items-center justify-center hover:border-blue hover:text-blue">
                    2
                  </button>
                  <button className="w-10 h-10 rounded border border-gray-3 flex items-center justify-center hover:border-blue hover:text-blue">
                    3
                  </button>
                  <button className="w-10 h-10 rounded border border-gray-3 flex items-center justify-center hover:border-blue hover:text-blue">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="size-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="m8.25 4.5 7.5 7.5-7.5 7.5"
                      />
                    </svg>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
