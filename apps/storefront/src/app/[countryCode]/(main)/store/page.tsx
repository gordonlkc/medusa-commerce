import { Metadata } from "next"
import Link from "next/link"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import { ProductCard } from "../../../../components/home/ProductCard"

export const metadata: Metadata = {
  title: "Store",
  description: "Explore all of our products.",
}

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const countryCode = params.countryCode

  const region = await getRegion(countryCode)

  const { response } = await listProducts({
    pageParam: 1,
    queryParams: {
      limit: 12,
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
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-custom-sm">
            <li>
              <Link href={`/${countryCode}`} className="hover:text-blue">
                Home
              </Link>
            </li>
            <li>/</li>
            <li className="text-dark">Shop</li>
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
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <p className="text-custom-sm text-body">
                Showing{" "}
                <span className="text-dark font-medium">{products.length}</span>{" "}
                products
              </p>
              <select className="border border-gray-3 rounded px-3 py-2 text-custom-sm">
                <option>Default Sorting</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>

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
          </div>
        </div>
      </div>
    </section>
  )
}