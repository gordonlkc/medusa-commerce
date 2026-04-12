import { retrieveCart } from "@lib/data/cart"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { redirect } from "next/navigation"
import { convertToLocale } from "@lib/util/money"
import { deleteLineItem, updateLineItem } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

type CartItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
}

async function CartItem({ item, currencyCode }: CartItemProps) {
  const updateQuantity = async (quantity: number) => {
    "use server"
    await updateLineItem({ lineId: item.id, quantity })
  }

  const removeItem = async () => {
    "use server"
    await deleteLineItem(item.id)
  }

  return (
    <div className="flex gap-4 p-4 bg-white border border-gray-3 rounded-md">
      <div className="relative w-[120px] h-[120px] flex-shrink-0">
        <Image
          src={item.thumbnail || "/images/products/placeholder.jpg"}
          alt={item.product_title || "Product"}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <Link
          href={`/products/${item.product_handle}`}
          className="text-custom-sm font-medium text-dark hover:text-blue"
        >
          {item.product_title}
        </Link>
        {item.variant && item.variant.title !== "Default" && (
          <p className="text-custom-xs text-body mt-1">{item.variant.title}</p>
        )}
        <div className="flex items-center gap-3 mt-3">
          <form action={async () => {
            "use server"
            await updateQuantity(Math.max(1, item.quantity - 1))
          }}>
            <button type="submit" className="w-8 h-8 flex items-center justify-center hover:text-blue border border-gray-3 rounded-l">-</button>
          </form>
          <span className="w-10 text-center text-custom-sm">{item.quantity}</span>
          <form action={async () => {
            "use server"
            await updateQuantity(item.quantity + 1)
          }}>
            <button type="submit" className="w-8 h-8 flex items-center justify-center hover:text-blue border border-gray-3 rounded-r">+</button>
          </form>
          <form action={removeItem}>
            <button type="submit" className="text-red text-custom-sm hover:underline">
              Remove
            </button>
          </form>
        </div>
      </div>
      <div className="text-right">
        <p className="text-custom-sm font-medium text-dark">
          {convertToLocale({ amount: (item.total ?? 0), currency_code: currencyCode })}
        </p>
      </div>
    </div>
  )
}

type CartSummaryProps = {
  cart: HttpTypes.StoreCart
}

function CartSummary({ cart }: CartSummaryProps) {
  const currencyCode = cart.currency_code || "usd"
  const subtotal = cart.item_subtotal ?? cart.subtotal ?? 0
  const total = cart.total ?? 0

  return (
    <div className="bg-white border border-gray-3 rounded-md p-6 sticky top-24">
      <h3 className="text-custom-sm font-medium text-dark mb-5">Order Summary</h3>
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-custom-sm">
          <span className="text-body">Subtotal</span>
          <span className="text-dark font-medium">
            {convertToLocale({ amount: subtotal, currency_code: currencyCode })}
          </span>
        </div>
        <div className="flex justify-between text-custom-sm">
          <span className="text-body">Shipping</span>
          <span className="text-dark font-medium">Calculated at checkout</span>
        </div>
      </div>
      <div className="border-t border-gray-3 pt-4 mb-6">
        <div className="flex justify-between">
          <span className="text-custom-sm font-medium text-dark">Total</span>
          <span className="text-heading-5 font-medium text-dark">
            {convertToLocale({ amount: total, currency_code: currencyCode })}
          </span>
        </div>
      </div>
      <Link href="/checkout" className="btn btn-primary w-full text-center">
        Proceed to Checkout
      </Link>
      <Link href="/store" className="block text-center text-custom-sm text-blue hover:underline mt-4">
        Continue Shopping
      </Link>
    </div>
  )
}

export default async function CartPage(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params
  const cart = await retrieveCart()

  if (!cart) {
    redirect(`/${params.countryCode}/store`)
  }

  const items = cart.items || []
  const currencyCode = cart.currency_code || "usd"

  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="mb-8">
          <h1 className="text-heading-4 font-medium text-dark">Shopping Cart</h1>
          <p className="text-custom-sm text-body mt-2">
            {items.length} items in your cart
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            {items.length === 0 ? (
              <div className="text-center py-15">
                <p className="text-custom-lg text-body mb-4">Your cart is empty</p>
                <Link href="/store" className="btn btn-primary">Continue Shopping</Link>
              </div>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem key={item.id} item={item} currencyCode={currencyCode} />
                ))}
              </div>
            )}
          </div>

          {items.length > 0 && (
            <div className="w-full lg:w-[370px] flex-shrink-0">
              <CartSummary cart={cart} />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
