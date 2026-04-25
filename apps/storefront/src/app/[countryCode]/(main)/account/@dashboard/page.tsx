import { Metadata } from "next"

import AccountDashboard from "@modules/account/components/account-dashboard"
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
    return null
  }

  return <AccountDashboard customer={customer} orders={orders} />
}