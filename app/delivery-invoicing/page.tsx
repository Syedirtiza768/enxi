import type { Metadata } from "next"
import { DeliveryInvoicingDashboard } from "@/components/delivery-invoicing/delivery-invoicing-dashboard"

export const metadata: Metadata = {
  title: "Delivery & Invoicing | ERP System",
  description: "Manage delivery notes and invoices",
}

export default function DeliveryInvoicingPage() {
  return <DeliveryInvoicingDashboard />
}
