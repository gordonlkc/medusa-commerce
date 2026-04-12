"use client"

import Image from "next/image"
import Link from "next/link"
import { useParams } from "next/navigation"

const Hero = () => {
  const { countryCode } = useParams() as { countryCode: string }

  return (
    <div className="relative h-[600px] lg:h-[750px] w-full">
      <Image
        src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1920"
        alt="Hero"
        fill
        className="object-cover"
        priority
      />

      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-[1170px] mx-auto px-4 w-full">
          <span className="text-custom-xs text-white mb-4 block uppercase tracking-wider">
            NEW COLLECTION
          </span>
          <h1 className="text-heading-1 text-white font-medium mb-4">
            Discover The Best
            <br />
            Collections
          </h1>
          <p className="text-custom-lg text-white mb-8">
            There are many variations of passages of Lorem Ipsum available
          </p>
          <Link
            href={`/${countryCode}/store`}
            className="btn btn-primary"
          >
            Shop Now
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Hero