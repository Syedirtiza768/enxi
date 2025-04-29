import type { Metadata } from "next"
import { ReportsDashboard } from "@/components/reports/reports-dashboard"

export const metadata: Metadata = {
  title: "Reports | ERP System",
  description: "Generate and view business reports and analytics",
}

export default function ReportsPage() {
  return <ReportsDashboard />
}
