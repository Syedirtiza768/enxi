"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { InventoryItems } from "@/components/inventory/inventory-items"
import { InventoryMovements } from "@/components/inventory/inventory-movements"
import { ReplenishmentAlerts } from "@/components/inventory/replenishment-alerts"

export function InventoryDashboard() {
  const [activeTab, setActiveTab] = useState("inventory-items")

  return (
    <Tabs defaultValue="inventory-items" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="inventory-items">Inventory Items</TabsTrigger>
        <TabsTrigger value="inventory-movements">Inventory Movements</TabsTrigger>
        <TabsTrigger value="replenishment-alerts">Replenishment Alerts</TabsTrigger>
      </TabsList>
      <TabsContent value="inventory-items" className="mt-6">
        <InventoryItems />
      </TabsContent>
      <TabsContent value="inventory-movements" className="mt-6">
        <InventoryMovements />
      </TabsContent>
      <TabsContent value="replenishment-alerts" className="mt-6">
        <ReplenishmentAlerts />
      </TabsContent>
    </Tabs>
  )
}
