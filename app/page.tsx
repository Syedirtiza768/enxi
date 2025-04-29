import { DashboardMetrics } from "@/components/dashboard/dashboard-metrics"
import { RecentProjects } from "@/components/dashboard/recent-projects"
import { RecentInvoices } from "@/components/dashboard/recent-invoices"
import { InventoryAlerts } from "@/components/dashboard/inventory-alerts"

export default function Home() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <DashboardMetrics />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RecentProjects />
        <RecentInvoices />
      </div>
      <InventoryAlerts />
    </div>
  )
}
