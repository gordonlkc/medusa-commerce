"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { retrieveCart } from "@lib/data/cart"
import { retrieveCustomer } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [cart, setCart] = useState<HttpTypes.StoreCart | null>(null)
  const [customer, setCustomer] = useState<HttpTypes.StoreCustomer | null>(null)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    const fetchData = async () => {
      const cartData = await retrieveCart().catch(() => null)
      const customerData = await retrieveCustomer().catch(() => null)
      setCart(cartData)
      setCustomer(customerData)
    }
    fetchData()
  }, [])

  const totalItems = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0
  const subtotal = cart?.subtotal ?? 0

  const formatPrice = (amount: number, currencyCode?: string) => {
    if (!currencyCode) return `$${(amount / 100).toFixed(2)}`
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currencyCode,
    }).format(amount / 100)
  }

  const navItems = [
    { label: "Shop", href: "/shop" },
    { label: "Wishlist", href: "/wishlist" },
    { label: "My Account", href: "/account" },
    { label: "Contact", href: "/contact" },
  ]

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-9999 bg-white transition-all duration-300 ${
        isScrolled ? "shadow-md" : ""
      }`}
    >
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <div className="py-6">
          <div className="flex items-center justify-between gap-5.5">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-dark">NextMerce</span>
            </Link>

            <div className="hidden md:flex flex-1 max-w-[500px] mx-4">
              <div className="flex w-full rounded-lg border border-gray-300 overflow-hidden">
                <select className="bg-gray-1 border-r border-gray-300 px-3 py-2.5 text-sm text-dark-4 focus:outline-none rounded-l-lg cursor-pointer">
                  <option>All Categories</option>
                  <option>Desktop</option>
                  <option>Laptop</option>
                  <option>Components</option>
                  <option>Accessories</option>
                </select>
                <input
                  type="text"
                  placeholder="Search for products..."
                  className="flex-1 px-4 py-2.5 text-sm text-dark focus:outline-none"
                />
                <button className="bg-blue px-5 py-2.5 text-white hover:bg-blue/90 transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                    />
                  </svg>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-6">
              <div className="hidden lg:block text-sm">
                <p className="text-dark-4">Support</p>
                <p className="text-dark font-medium">+1 (555) 123-4567</p>
              </div>

              <div className="flex items-center gap-4">
                {customer ? (
                  <Link href="/account" className="text-dark hover:text-blue transition-colors">
                    <span className="text-sm font-medium">My Account</span>
                  </Link>
                ) : (
                  <Link href="/account/login" className="text-dark hover:text-blue transition-colors">
                    <span className="text-sm font-medium">Sign In</span>
                  </Link>
                )}

                <button className="relative text-dark hover:text-blue transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                    />
                  </svg>
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-blue text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>

                <div className="hidden md:block text-sm">
                  <span className="text-dark-4">Cart</span>
                  <p className="text-dark font-medium">{formatPrice(subtotal, cart?.currency_code)}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="hidden xl:flex items-center justify-between mt-6 pt-4 border-t border-gray-300">
            <div className="flex items-center gap-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="relative text-dark hover:text-blue transition-colors py-2 group"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="absolute top-0 left-0 w-full h-0.5 bg-blue scale-x-0 group-hover:scale-x-100 transition-transform origin-left" />
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-6">
              <Link href="/recently-viewed" className="text-sm text-dark-4 hover:text-blue transition-colors">
                Recently Viewed
              </Link>
              <Link href="/wishlist" className="text-sm text-dark-4 hover:text-blue transition-colors">
                Wishlist
              </Link>
            </div>
          </div>
        </div>
      </div>

      <button
        className="xl:hidden absolute top-7 right-4 p-2 text-dark"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-5">
          <span
            className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
              mobileMenuOpen ? "top-2 rotate-45" : "top-0"
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-current transition-all duration-300 ${
              mobileMenuOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute left-0 w-full h-0.5 bg-current transition-all duration-300 ${
              mobileMenuOpen ? "bottom-2 -rotate-45" : "bottom-0"
            }`}
          />
        </div>
      </button>

      <div
        className={`xl:hidden absolute top-full left-0 right-0 bg-white shadow-lg transition-all duration-300 ${
          mobileMenuOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
      >
        <div className="px-4 py-4 border-t border-gray-300">
          <div className="mb-4">
            <div className="flex rounded-lg border border-gray-300 overflow-hidden">
              <select className="bg-gray-1 border-r border-gray-300 px-3 py-2 text-sm text-dark-4 focus:outline-none">
                <option>All Categories</option>
                <option>Desktop</option>
                <option>Laptop</option>
                <option>Components</option>
                <option>Accessories</option>
              </select>
              <input
                type="text"
                placeholder="Search..."
                className="flex-1 px-3 py-2 text-sm text-dark focus:outline-none"
              />
              <button className="bg-blue px-4 py-2 text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"
                  />
                </svg>
              </button>
            </div>
          </div>

          <nav className="flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="px-3 py-2 text-dark hover:text-blue hover:bg-gray-1 rounded-lg transition-colors"
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="mt-4 pt-4 border-t border-gray-300 flex flex-col gap-2">
            <Link
              href="/recently-viewed"
              className="px-3 py-2 text-dark-4 hover:text-blue hover:bg-gray-1 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Recently Viewed
            </Link>
            <Link
              href="/wishlist"
              className="px-3 py-2 text-dark-4 hover:text-blue hover:bg-gray-1 rounded-lg transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              Wishlist
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}