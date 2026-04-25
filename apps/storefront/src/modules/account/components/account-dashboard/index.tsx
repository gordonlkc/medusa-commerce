"use client"

import { useParams } from "next/navigation"
import User from "@modules/common/icons/user"
import Package from "@modules/common/icons/package"
import MapPin from "@modules/common/icons/map-pin"
import { ArrowRightOnRectangle } from "@medusajs/icons"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { signout } from "@lib/data/customer"
import { HttpTypes } from "@medusajs/types"

type AccountDashboardProps = {
  customer: HttpTypes.StoreCustomer | null
  orders: HttpTypes.StoreOrder[] | null
}

export default function AccountDashboard({ customer, orders }: AccountDashboardProps) {
  const { countryCode } = useParams() as { countryCode: string }

  const handleLogout = async () => {
    await signout(countryCode)
  }

  const orderCount = orders?.length || 0
  const recentOrders = orders?.slice(0, 5) || []

  return (
    <section className="py-15 xl:py-20">
      <div className="max-w-[1170px] mx-auto px-4 sm:px-7.5 xl:px-0">
        <h1 className="text-heading-4 font-medium text-dark mb-8">My Account</h1>

        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="w-full lg:w-[250px]">
            <nav className="bg-white border border-gray-3 rounded-md p-4">
              <ul className="space-y-2">
                <li>
                  <LocalizedClientLink
                    href="/account"
                    className="flex items-center gap-3 text-custom-sm text-dark hover:text-blue py-2"
                  >
                    <User className="w-5 h-5" />
                    Profile
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/orders"
                    className="flex items-center gap-3 text-custom-sm text-dark hover:text-blue py-2"
                  >
                    <Package className="w-5 h-5" />
                    My Orders
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink
                    href="/account/addresses"
                    className="flex items-center gap-3 text-custom-sm text-dark hover:text-blue py-2"
                  >
                    <MapPin className="w-5 h-5" />
                    Addresses
                  </LocalizedClientLink>
                </li>
                <li className="border-t border-gray-3 pt-2 mt-2">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-custom-sm text-red hover:text-red-dark py-2 w-full"
                  >
                    <ArrowRightOnRectangle />
                    Sign Out
                  </button>
                </li>
              </ul>
            </nav>
          </aside>

          <div className="flex-1">
            <div className="bg-white border border-gray-3 rounded-md p-6">
              <h2 className="text-custom-lg font-medium text-dark mb-6">
                Welcome back, {customer?.first_name}!
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="bg-gray-1 rounded-md p-4 text-center">
                  <p className="text-heading-5 font-medium text-dark">{orderCount}</p>
                  <p className="text-custom-sm text-body">Total Orders</p>
                </div>
                <div className="bg-gray-1 rounded-md p-4 text-center">
                  <p className="text-heading-5 font-medium text-dark">
                    {customer?.addresses?.length || 0}
                  </p>
                  <p className="text-custom-sm text-body">Saved Addresses</p>
                </div>
                <div className="bg-gray-1 rounded-md p-4 text-center">
                  <p className="text-heading-5 font-medium text-dark">
                    {customer?.addresses?.length || 0}
                  </p>
                  <p className="text-custom-sm text-body">Addresses</p>
                </div>
              </div>

              <h3 className="text-custom-sm font-medium text-dark mb-4">
                Recent Orders
              </h3>
              {recentOrders.length > 0 ? (
                <div className="space-y-3">
                  {recentOrders.map((order) => (
                    <LocalizedClientLink
                      key={order.id}
                      href={`/account/orders/details/${order.id}`}
                      className="flex items-center justify-between p-3 bg-gray-1 rounded block"
                    >
                      <div>
                        <p className="text-custom-sm font-medium text-dark">
                          Order #{order.display_id}
                        </p>
                        <p className="text-custom-xs text-body">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-custom-sm font-medium text-dark">
                          {order.total} {order.currency_code?.toUpperCase()}
                        </p>
                        <span
                          className={`text-2xs px-2 py-1 rounded ${
                            order.status === "completed"
                              ? "bg-green/10 text-green"
                              : order.status === "pending"
                              ? "bg-yellow/10 text-yellow"
                              : "bg-gray-3 text-body"
                          }`}
                        >
                          {order.status}
                        </span>
                      </div>
                    </LocalizedClientLink>
                  ))}
                </div>
              ) : (
                <p className="text-body text-custom-sm text-gray-500">
                  No recent orders
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}