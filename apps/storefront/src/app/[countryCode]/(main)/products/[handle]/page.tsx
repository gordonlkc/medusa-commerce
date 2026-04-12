import { Metadata } from "next"
export const dynamicParams = true
import { notFound } from "next/navigation"
import { listProducts } from "@lib/data/products"
import { getRegion } from "@lib/data/regions"
import ProductGallery from "@modules/products/components/product-gallery"
import ProductInfo from "@modules/products/components/product-info-new"
import RelatedProducts from "@modules/products/components/related-products"
import { HttpTypes } from "@medusajs/types"
import { Suspense } from "react"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
  searchParams: Promise<{ v_id?: string }>
}

function getImagesForVariant(
  product: HttpTypes.StoreProduct,
  selectedVariantId?: string
) {
  if (!selectedVariantId || !product.variants) {
    return product.images
  }

  const variant = product.variants?.find((v) => v.id === selectedVariantId)
  if (!variant || !variant.images?.length) {
    return product.images
  }

  const imageIdsMap = new Map(variant.images.map((i) => [i.id, true]))
  return product.images?.filter((i) => imageIdsMap.has(i.id))
}

export async function generateMetadata(props: Props): Promise<Metadata> {
  const params = await props.params
  const { handle } = params
  const region = await getRegion(params.countryCode)

  if (!region) {
    notFound()
  }

  const product = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle },
  }).then(({ response }) => response.products[0])

  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    openGraph: {
      title: `${product.title} | Medusa Store`,
      description: `${product.title}`,
      images: product.thumbnail ? [product.thumbnail] : [],
    },
  }
}

export default async function ProductPage(props: Props) {
  const params = await props.params
  const region = await getRegion(params.countryCode)
  const searchParams = await props.searchParams

  const selectedVariantId = searchParams.v_id

  if (!region) {
    notFound()
  }

  const pricedProduct = await listProducts({
    countryCode: params.countryCode,
    queryParams: { handle: params.handle },
  }).then(({ response }) => response.products[0])

  const images = getImagesForVariant(pricedProduct, selectedVariantId)

  if (!pricedProduct) {
    notFound()
  }

  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <nav className="mb-8">
          <ol className="flex items-center gap-2 text-custom-sm">
            <li>
              <a href={`/${params.countryCode}`} className="hover:text-blue">
                Home
              </a>
            </li>
            <li>/</li>
            <li>
              <a
                href={`/${params.countryCode}/store`}
                className="hover:text-blue"
              >
                Shop
              </a>
            </li>
            <li>/</li>
            <li className="text-dark">{pricedProduct.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 xl:gap-15">
          <ProductGallery images={images || []} productTitle={pricedProduct.title} />
          <ProductInfo product={pricedProduct} region={region} />
        </div>

        <div className="my-16 small:my-32">
          <Suspense fallback={<SkeletonRelatedProducts />}>
            <RelatedProducts
              product={pricedProduct}
              countryCode={params.countryCode}
            />
          </Suspense>
        </div>
      </div>
    </section>
  )
}