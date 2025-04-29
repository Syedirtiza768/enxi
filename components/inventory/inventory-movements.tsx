"use client"

import { useState } from "react"
import { PlusCircle, MoreHorizontal, Eye, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { InventoryMovementDialog } from "@/components/inventory/inventory-movement-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import type { InventoryMovement } from "@/lib/types"

// Mock data for inventory movements
const mockInventoryMovements: InventoryMovement[] = [
  {
    id: "1",
    date: "2023-10-01",
    type: "purchase",
    reference: "PO-001",
    inventoryItemId: "1",
    inventoryItem: {
      id: "1",
      sku: "SB-10M",
      name: "Steel Beams (10m)",
      description: "10-meter steel I-beams for construction",
      category: "Construction Materials",
      unitOfMeasure: "piece",
      costPrice: 120,
      sellingPrice: 150,
      quantity: 5,
      reorderLevel: 20,
      location: "Warehouse A",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 10,
    unitCost: 120,
    totalCost: 1200,
    notes: "Initial stock purchase",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    date: "2023-10-05",
    type: "sale",
    reference: "SO-001",
    inventoryItemId: "1",
    inventoryItem: {
      id: "1",
      sku: "SB-10M",
      name: "Steel Beams (10m)",
      description: "10-meter steel I-beams for construction",
      category: "Construction Materials",
      unitOfMeasure: "piece",
      costPrice: 120,
      sellingPrice: 150,
      quantity: 5,
      reorderLevel: 20,
      location: "Warehouse A",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: -5,
    unitCost: 120,
    totalCost: -600,
    notes: "Sale to Acme Corp",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    date: "2023-10-10",
    type: "adjustment",
    reference: "ADJ-001",
    inventoryItemId: "2",
    inventoryItem: {
      id: "2",
      sku: "EW-100M",
      name: "Electrical Wiring (100m)",
      description: "100-meter electrical copper wiring",
      category: "Electrical",
      unitOfMeasure: "roll",
      costPrice: 45,
      sellingPrice: 65,
      quantity: 3,
      reorderLevel: 15,
      location: "Warehouse B",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: -2,
    unitCost: 45,
    totalCost: -90,
    notes: "Inventory adjustment due to damage",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    date: "2023-10-15",
    type: "transfer",
    reference: "TR-001",
    inventoryItemId: "3",
    inventoryItem: {
      id: "3",
      sku: "CM-50KG",
      name: "Concrete Mix (50kg)",
      description: "50kg bags of ready-mix concrete",
      category: "Construction Materials",
      unitOfMeasure: "bag",
      costPrice: 15,
      sellingPrice: 22,
      quantity: 8,
      reorderLevel: 30,
      location: "Warehouse A",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 0,
    unitCost: 15,
    totalCost: 0,
    notes: "Transfer from Warehouse A to Warehouse B",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    date: "2023-10-20",
    type: "purchase",
    reference: "PO-002",
    inventoryItemId: "4",
    inventoryItem: {
      id: "4",
      sku: "SH-001",
      name: "Safety Helmets",
      description: "Standard safety helmets",
      category: "Safety Equipment",
      unitOfMeasure: "piece",
      costPrice: 12,
      sellingPrice: 18,
      quantity: 4,
      reorderLevel: 25,
      location: "Warehouse C",
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    quantity: 30,
    unitCost: 12,
    totalCost: 360,
    notes: "Restocking safety equipment",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function InventoryMovements() {
  const [movements, setMovements] = useState<InventoryMovement[]>(mockInventoryMovements)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedMovement, setSelectedMovement] = useState<InventoryMovement | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const { toast } = useToast()

  const handleView = (movement: InventoryMovement) => {
    setSelectedMovement(movement)
    setViewMode(true)
    setIsDialogOpen(true)
  }

  const handleSave = (movementData: Partial<InventoryMovement>) => {
    // Create new movement
    const newMovement: InventoryMovement = {
      id: Math.random().toString(36).substring(7),
      date: movementData.date || new Date().toISOString().split("T")[0],
      type: movementData.type || "purchase",
      reference: movementData.reference || `REF-${movements.length + 1}`.padStart(6, "0"),
      inventoryItemId: movementData.inventoryItemId || "",
      inventoryItem: movementData.inventoryItem || {
        id: "",
        sku: "",
        name: "",
        description: "",
        category: "",
        unitOfMeasure: "",
        costPrice: 0,
        sellingPrice: 0,
        quantity: 0,
        reorderLevel: 0,
        location: "",
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      quantity: movementData.quantity || 0,
      unitCost: movementData.unitCost || 0,
      totalCost: movementData.totalCost || 0,
      notes: movementData.notes || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    setMovements([...movements, newMovement])
    toast({
      title: "Inventory movement recorded",
      description: "The inventory movement has been successfully recorded",
    })
    setIsDialogOpen(false)
    setSelectedMovement(null)
    setViewMode(false)
  }

  const getMovementTypeColor = (type: string) => {
    switch (type) {
      case "purchase":
        return "bg-green-500 hover:bg-green-600"
      case "sale":
        return "bg-blue-500 hover:bg-blue-600"
      case "adjustment":
        return "bg-amber-500 hover:bg-amber-600"
      case "transfer":
        return "bg-purple-500 hover:bg-purple-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  const columns: ColumnDef<InventoryMovement>[] = [
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }) => {
        const date = new Date(row.getValue("date"))
        return <span>{date.toLocaleDateString()}</span>
      },
    },
    {
      accessorKey: "reference",
      header: "Reference",
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        return <Badge className={getMovementTypeColor(type)}>{type.charAt(0).toUpperCase() + type.slice(1)}</Badge>
      },
    },
    {
      accessorKey: "inventoryItem.name",
      header: "Item",
      cell: ({ row }) => {
        const item = row.original.inventoryItem
        return (
          <div>
            <div className="font-medium">{item.name}</div>
            <div className="text-xs text-muted-foreground">{item.sku}</div>
          </div>
        )
      },
    },
    {
      accessorKey: "quantity",
      header: "Quantity",
      cell: ({ row }) => {
        const quantity = Number.parseFloat(row.getValue("quantity"))
        const type = row.getValue("type") as string

        return (
          <span className={`font-medium ${quantity < 0 ? "text-red-500" : quantity > 0 ? "text-green-500" : ""}`}>
            {type === "transfer" ? "±" : quantity < 0 ? "" : "+"}
            {quantity}
          </span>
        )
      },
    },
    {
      accessorKey: "totalCost",
      header: "Total Cost",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("totalCost"))
        return <span className="font-medium">${Math.abs(amount).toFixed(2)}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const movement = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleView(movement)}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Inventory Movements</CardTitle>
          <CardDescription>Track inventory changes over time</CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedMovement(null)
            setViewMode(false)
            setIsDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Record Movement
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={movements}
          searchColumn="reference"
          searchPlaceholder="Search by reference..."
        />
      </CardContent>
      <InventoryMovementDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        movement={selectedMovement}
        viewOnly={viewMode}
        onSave={handleSave}
      />
    </Card>
  )
}
