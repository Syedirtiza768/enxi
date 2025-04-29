import type { Metadata } from "next"
import { QuotationDashboard } from "@/components/quotations/quotation-dashboard"

export const metadata: Metadata = {
  title: "Quotations | ERP System",
  description: "Manage customer quotations and proposals",
}

export default function QuotationsPage() {
  return <QuotationDashboard />
}
