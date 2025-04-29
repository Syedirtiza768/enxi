import { InventoryDashboard } from "@/components/inventory/inventory-dashboard"

export default function InventoryPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Inventory Management</h1>
      </div>
      <InventoryDashboard />
    </div>
  )
}
