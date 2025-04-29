"use client"

import { useState } from "react"
import { PlusCircle, MoreHorizontal, Pencil, Trash2, ArrowUpDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { DataTable } from "@/components/data-table/data-table"
import { InventoryItemDialog } from "@/components/inventory/inventory-item-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import type { InventoryItem } from "@/lib/types"

// Mock data for inventory items
const mockInventoryItems: InventoryItem[] = [
  {
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
  {
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
  {
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
  {
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
  {
    id: "5",
    sku: "PL-001",
    name: "Plywood Sheets (4x8)",
    description: "4x8 feet plywood sheets",
    category: "Construction Materials",
    unitOfMeasure: "sheet",
    costPrice: 25,
    sellingPrice: 35,
    quantity: 30,
    reorderLevel: 20,
    location: "Warehouse A",
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function InventoryItems() {
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>(mockInventoryItems)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const { toast } = useToast()

  const handleEdit = (item: InventoryItem) => {
    setSelectedItem(item)
    setIsDialogOpen(true)
  }

  const handleDelete = (itemId: string) => {
    setInventoryItems(inventoryItems.filter((item) => item.id !== itemId))
    toast({
      title: "Inventory item deleted",
      description: "The inventory item has been successfully deleted",
    })
  }

  const handleSave = (itemData: Partial<InventoryItem>) => {
    if (selectedItem) {
      // Update existing item
      const updatedItem = { ...selectedItem, ...itemData, updatedAt: new Date().toISOString() }
      setInventoryItems(inventoryItems.map((item) => (item.id === selectedItem.id ? updatedItem : item)))
      toast({
        title: "Inventory item updated",
        description: "The inventory item has been successfully updated",
      })
    } else {
      // Create new item
      const newItem: InventoryItem = {
        id: Math.random().toString(36).substring(7),
        sku: itemData.sku || "",
        name: itemData.name || "",
        description: itemData.description || "",
        category: itemData.category || "",
        unitOfMeasure: itemData.unitOfMeasure || "",
        costPrice: itemData.costPrice || 0,
        sellingPrice: itemData.sellingPrice || 0,
        quantity: itemData.quantity || 0,
        reorderLevel: itemData.reorderLevel || 0,
        location: itemData.location || "",
        isActive: itemData.isActive !== undefined ? itemData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setInventoryItems([...inventoryItems, newItem])
      toast({
        title: "Inventory item created",
        description: "The inventory item has been successfully created",
      })
    }
    setIsDialogOpen(false)
    setSelectedItem(null)
  }

  const columns: ColumnDef<InventoryItem>[] = [
    {
      accessorKey: "sku",
      header: "SKU",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "category",
      header: "Category",
    },
    {
      accessorKey: "quantity",
      header: ({ column }) => {
        return (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
            Quantity
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => {
        const quantity = Number.parseFloat(row.getValue("quantity"))
        const reorderLevel = Number.parseFloat(row.getValue("reorderLevel"))
        return (
          <div className="flex items-center">
            <span className="font-medium">{quantity}</span>
            {quantity <= reorderLevel && (
              <Badge variant="outline" className="ml-2 text-red-500 border-red-500">
                Low Stock
              </Badge>
            )}
          </div>
        )
      },
    },
    {
      accessorKey: "reorderLevel",
      header: "Reorder Level",
    },
    {
      accessorKey: "costPrice",
      header: "Cost Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("costPrice"))
        return <span className="font-medium">${amount.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "sellingPrice",
      header: "Selling Price",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("sellingPrice"))
        return <span className="font-medium">${amount.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "location",
      header: "Location",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const item = row.original
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
              <DropdownMenuItem onClick={() => handleEdit(item)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(item.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
          <CardTitle>Inventory Items</CardTitle>
          <CardDescription>Manage your inventory items</CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedItem(null)
            setIsDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Item
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={inventoryItems}
          searchColumn="name"
          searchPlaceholder="Search inventory items..."
        />
      </CardContent>
      <InventoryItemDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        inventoryItem={selectedItem}
        onSave={handleSave}
      />
    </Card>
  )
}
