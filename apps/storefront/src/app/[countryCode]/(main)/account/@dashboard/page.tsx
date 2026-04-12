import { Metadata } from "next"

import AccountDashboard from "@modules/account/components/account-dashboard"
import { notFound } from "next/navigation"
import { retrieveCustomer } from "@lib/data/customer"
import { listOrders } from "@lib/data/orders"

export const metadata: Metadata = {
  title: "My Account",
  description: "Manage your account",
}

export default async function AccountPage() {
  const customer = await retrieveCustomer().catch(() => null)
  const orders = (await listOrders().catch(() => null)) || null

  if (!customer) {
    notFound()
  }

  return <AccountDashboard customer={customer} orders={orders} />
}