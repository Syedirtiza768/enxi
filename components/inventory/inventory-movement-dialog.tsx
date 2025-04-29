"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import type { InventoryMovement, InventoryItem } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"

// Mock inventory items for the select dropdown
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
]

const formSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  type: z.enum(["purchase", "sale", "adjustment", "transfer"]),
  reference: z.string().min(1, { message: "Reference is required" }),
  inventoryItemId: z.string().min(1, { message: "Inventory item is required" }),
  quantity: z.number(),
  unitCost: z.number().min(0, { message: "Unit cost must be non-negative" }),
  notes: z.string().optional(),
})

interface InventoryMovementDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  movement: InventoryMovement | null
  viewOnly?: boolean
  onSave: (data: Partial<InventoryMovement>) => void
}

export function InventoryMovementDialog({
  open,
  onOpenChange,
  movement,
  viewOnly = false,
  onSave,
}: InventoryMovementDialogProps) {
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null)
  const [totalCost, setTotalCost] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      type: "purchase",
      reference: "",
      inventoryItemId: "",
      quantity: 0,
      unitCost: 0,
      notes: "",
    },
  })

  useEffect(() => {
    if (movement) {
      form.reset({
        date: movement.date,
        type: movement.type,
        reference: movement.reference,
        inventoryItemId: movement.inventoryItemId,
        quantity: Math.abs(movement.quantity), // Always show positive in the form
        unitCost: movement.unitCost,
        notes: movement.notes,
      })

      // Find the selected item from the mock data
      const item = mockInventoryItems.find((item) => item.id === movement.inventoryItemId) || null
      setSelectedItem(item)

      // Calculate total cost
      setTotalCost(Math.abs(movement.quantity) * movement.unitCost)
    }
  }, [movement, form])

  // Update total cost when quantity or unit cost changes
  useEffect(() => {
    const quantity = form.watch("quantity")
    const unitCost = form.watch("unitCost")
    setTotalCost(quantity * unitCost)
  }, [form.watch("quantity"), form.watch("unitCost"), form])

  // Handle item selection
  const handleItemChange = (itemId: string) => {
    const item = mockInventoryItems.find((item) => item.id === itemId) || null
    setSelectedItem(item)
    if (item) {
      form.setValue("unitCost", item.costPrice)
    }
  }

  // Handle form submission
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Adjust quantity sign based on movement type
    let adjustedQuantity = data.quantity
    if (data.type === "sale" || (data.type === "adjustment" && adjustedQuantity > 0)) {
      adjustedQuantity = -adjustedQuantity
    }

    const movementData: Partial<InventoryMovement> = {
      ...data,
      quantity: adjustedQuantity,
      totalCost: data.quantity * data.unitCost,
      inventoryItem: selectedItem || undefined,
    }

    onSave(movementData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{movement ? (viewOnly ? "View" : "Edit") : "Create"} Inventory Movement</DialogTitle>
          <DialogDescription>
            {viewOnly ? "View details of this inventory movement." : "Enter the details for this inventory movement."}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} disabled={viewOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type</FormLabel>
                    <Select disabled={viewOnly} onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="purchase">Purchase</SelectItem>
                        <SelectItem value="sale">Sale</SelectItem>
                        <SelectItem value="adjustment">Adjustment</SelectItem>
                        <SelectItem value="transfer">Transfer</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="reference"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reference</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="PO-12345 or INV-6789" disabled={viewOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="inventoryItemId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Inventory Item</FormLabel>
                  <Select
                    disabled={viewOnly}
                    onValueChange={(value) => {
                      field.onChange(value)
                      handleItemChange(value)
                    }}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select an item" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {mockInventoryItems.map((item) => (
                        <SelectItem key={item.id} value={item.id}>
                          {item.name} ({item.sku})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantity</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="unitCost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unit Cost</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        {...field}
                        onChange={(e) => field.onChange(Number.parseFloat(e.target.value) || 0)}
                        disabled={viewOnly}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="bg-muted p-3 rounded-md">
              <div className="flex justify-between">
                <span className="font-medium">Total Cost:</span>
                <span className="font-bold">${totalCost.toFixed(2)}</span>
              </div>
              {selectedItem && (
                <div className="text-sm text-muted-foreground mt-2">
                  <div>SKU: {selectedItem.sku}</div>
                  <div>
                    Current Stock: {selectedItem.quantity} {selectedItem.unitOfMeasure}
                  </div>
                  <div>Location: {selectedItem.location}</div>
                </div>
              )}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Additional information about this movement" disabled={viewOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {!viewOnly && (
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Cancel
                </Button>
                <Button type="submit">{movement ? "Update" : "Create"}</Button>
              </DialogFooter>
            )}
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
