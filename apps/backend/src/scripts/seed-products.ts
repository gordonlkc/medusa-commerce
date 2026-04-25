import { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules, ProductStatus } from "@medusajs/framework/utils"
import { createProductCategoriesWorkflow, createProductsWorkflow } from "@medusajs/medusa/core-flows"

export default async function seedProducts({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const salesChannelService = container.resolve(Modules.SALES_CHANNEL)
  const fulfillmentService = container.resolve(Modules.FULFILLMENT)

  // Use existing sales channel
  const salesChannels = await salesChannelService.listSalesChannels({})
  if (!salesChannels.length) {
    logger.error("No sales channel found. Run the main seed first or set one up in admin.")
    return
  }
  const salesChannel = salesChannels[0]
  logger.info(`Using sales channel: ${salesChannel.name} (${salesChannel.id})`)

  // Use existing shipping profile
  const shippingProfiles = await fulfillmentService.listShippingProfiles({})
  const shippingProfile = shippingProfiles[0] ?? null

  // Create categories (skip if already exist)
  logger.info("Creating product categories...")
  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: [
        { name: "T-Shirts", is_active: true },
        { name: "Hoodies", is_active: true },
        { name: "Pants", is_active: true },
        { name: "Accessories", is_active: true },
      ],
    },
  })

  const catId = (name: string) => categories.find((c) => c.name === name)!.id

  logger.info("Creating products...")
  await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Classic White Tee",
          handle: "classic-white-tee",
          description: "A timeless white t-shirt made from 100% organic cotton. Soft, breathable, and built to last.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("T-Shirts")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-front.png" },
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-white-back.png" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
          ],
          variants: ["S", "M", "L", "XL"].map((size) => ({
            title: size,
            sku: `WHITE-TEE-${size}`,
            options: { Size: size },
            prices: [
              { currency_code: "usd", amount: 2900 },
              { currency_code: "eur", amount: 2700 },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Vintage Black Tee",
          handle: "vintage-black-tee",
          description: "Washed for a soft vintage feel. Our black tee pairs with anything in your wardrobe.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("T-Shirts")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-front.png" },
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/tee-black-back.png" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
            { title: "Color", values: ["Black", "Charcoal"] },
          ],
          variants: [
            ...["S", "M", "L", "XL"].flatMap((size) =>
              ["Black", "Charcoal"].map((color) => ({
                title: `${size} / ${color}`,
                sku: `BLACK-TEE-${size}-${color.toUpperCase()}`,
                options: { Size: size, Color: color },
                prices: [
                  { currency_code: "usd", amount: 3200 },
                  { currency_code: "eur", amount: 2900 },
                ],
              }))
            ),
          ],
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Essential Hoodie",
          handle: "essential-hoodie",
          description: "Ultra-soft French terry hoodie with a relaxed fit. Perfect for layering on cooler days.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("Hoodies")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-front.png" },
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatshirt-vintage-back.png" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL", "XXL"] },
          ],
          variants: ["S", "M", "L", "XL", "XXL"].map((size) => ({
            title: size,
            sku: `HOODIE-${size}`,
            options: { Size: size },
            prices: [
              { currency_code: "usd", amount: 5900 },
              { currency_code: "eur", amount: 5400 },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Relaxed Sweatpants",
          handle: "relaxed-sweatpants",
          description: "Cozy cotton sweatpants with an elastic waistband and tapered fit. Lounge or gym — your call.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("Pants")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-front.png" },
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/sweatpants-gray-back.png" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
          ],
          variants: ["S", "M", "L", "XL"].map((size) => ({
            title: size,
            sku: `SWEATPANTS-${size}`,
            options: { Size: size },
            prices: [
              { currency_code: "usd", amount: 4900 },
              { currency_code: "eur", amount: 4500 },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Vintage Shorts",
          handle: "vintage-shorts",
          description: "Lightweight cotton shorts with a 5-inch inseam. Built for warm days and easy movement.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("Pants")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png" },
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-back.png" },
          ],
          options: [
            { title: "Size", values: ["S", "M", "L", "XL"] },
          ],
          variants: ["S", "M", "L", "XL"].map((size) => ({
            title: size,
            sku: `SHORTS-${size}`,
            options: { Size: size },
            prices: [
              { currency_code: "usd", amount: 3900 },
              { currency_code: "eur", amount: 3600 },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        },
        {
          title: "Canvas Tote Bag",
          handle: "canvas-tote-bag",
          description: "Heavy-duty canvas tote with reinforced handles. Fits a laptop, groceries, or a weekend away.",
          status: ProductStatus.PUBLISHED,
          category_ids: [catId("Accessories")],
          shipping_profile_id: shippingProfile?.id,
          thumbnail: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png",
          images: [
            { url: "https://medusa-public-images.s3.eu-west-1.amazonaws.com/shorts-vintage-front.png" },
          ],
          options: [
            { title: "Color", values: ["Natural", "Black", "Navy"] },
          ],
          variants: ["Natural", "Black", "Navy"].map((color) => ({
            title: color,
            sku: `TOTE-${color.toUpperCase()}`,
            options: { Color: color },
            prices: [
              { currency_code: "usd", amount: 2400 },
              { currency_code: "eur", amount: 2200 },
            ],
          })),
          sales_channels: [{ id: salesChannel.id }],
        },
      ],
    },
  })

  logger.info("Done! 6 products created across 4 categories.")
}
