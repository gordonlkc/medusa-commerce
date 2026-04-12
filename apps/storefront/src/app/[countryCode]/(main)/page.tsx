import { Metadata } from "next"
import Hero from "@/components/home/Hero"
import Categories from "@/components/home/Categories"
import FeaturedProducts from "@/components/home/FeaturedProducts"
import { getRegion } from "@lib/data/regions"

export const metadata: Metadata = {
  title: "Medusa Store | Shop the Best Products",
  description: "Discover amazing products at Medusa Store. Shop electronics, fashion, home goods and more.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const { countryCode } = params

  const region = await getRegion(countryCode)

  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts region={region} />
    </>
  )
}