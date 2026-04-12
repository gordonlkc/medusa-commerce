import Image from "next/image"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

const placeholderCategories = [
  {
    id: "1",
    name: "Electronics",
    handle: "electronics",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400",
  },
  {
    id: "2",
    name: "Fashion",
    handle: "fashion",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
  },
  {
    id: "3",
    name: "Home & Garden",
    handle: "home-garden",
    image: "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400",
  },
  {
    id: "4",
    name: "Sports",
    handle: "sports",
    image: "https://images.unsplash.com/photo-1461896836934-ffc781c79616?w=400",
  },
]

export default async function Categories() {
  const productCategories = await listCategories({ limit: 4 })

  const categories =
    productCategories.length > 0
      ? productCategories.map((category) => ({
          id: category.id,
          name: category.name,
          handle: category.handle,
          image: category.thumbnail || category.category_image?.[0]?.url,
        }))
      : placeholderCategories

  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-5 mb-10">
          <div>
            <span className="text-custom-xs text-blue uppercase tracking-wider mb-2 block">
              SPECIAL OFFER
            </span>
            <h2 className="text-heading-4 font-medium text-dark">
              Featured Categories
            </h2>
          </div>
          <LocalizedClientLink
            href="/shop"
            className="text-custom-sm font-medium text-dark hover:text-blue transition-colors"
          >
            View All Categories
          </LocalizedClientLink>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {categories.map((category) => (
            <LocalizedClientLink
              key={category.id}
              href={`/categories/${category.handle}`}
              className="group relative h-[280px] overflow-hidden rounded-md block"
            >
              <Image
                src={category.image || "/images/categories/default.jpg"}
                alt={category.name || ""}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 transition-opacity group-hover:bg-black/50" />
              <div className="absolute inset-0 flex items-center justify-center">
                <h3 className="text-custom-1 font-medium text-white text-center">
                  {category.name}
                </h3>
              </div>
            </LocalizedClientLink>
          ))}
        </div>
      </div>
    </section>
  )
}