"\"use client"

import Link from "next/link"
import { ArrowRight, PackageCheck } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function ReplenishmentAlerts() {
  const itemsNeedingReplenishment = [
    {
      id: "1",
      name: "Steel Beams (10m)",
      sku: "SB-10M",
      quantity: 5,
      reorderLevel: 20,
    },
    {
      id: "2",
      name: "Electrical Wiring (100m)",
      sku: "EW-100M",
      quantity: 3,
      reorderLevel: 15,
    },
    {
      id: "3",
      name: "Concrete Mix (50kg)",
      sku: "CM-50KG",
      quantity: 8,
      reorderLevel: 30,
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-1">
          <CardTitle>Replenishment Alerts</CardTitle>
          <CardDescription>Items that are below reorder level</CardDescription>
        </div>
        <PackageCheck className="ml-auto h-5 w-5 text-yellow-500" />
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {itemsNeedingReplenishment.length > 0 ? (
            itemsNeedingReplenishment.map((item) => (
              <div key={item.id} className="grid gap-2">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
                  </div>
                  <div className="text-sm font-medium">
                    {item.quantity} / {item.reorderLevel}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">No items need replenishment.</div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/inventory">
            View inventory
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
