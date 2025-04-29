"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Trash2, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const customers = [
  { id: "CUST-001", name: "Acme Corporation" },
  { id: "CUST-002", name: "TechStart Inc" },
  { id: "CUST-003", name: "Global Logistics Ltd" },
  { id: "CUST-004", name: "Retail Solutions Co" },
]

const projects = [
  { id: "PRJ-2023-001", name: "Website Redesign", customerId: "CUST-001" },
  { id: "PRJ-2023-002", name: "Mobile App Development", customerId: "CUST-002" },
  { id: "PRJ-2023-003", name: "ERP Implementation", customerId: "CUST-003" },
  { id: "PRJ-2023-004", name: "POS System Upgrade", customerId: "CUST-004" },
  { id: "PRJ-2023-005", name: "Annual IT Maintenance", customerId: "CUST-001" },
]

const products = [
  { id: "PROD-001", name: "Web Development Services", price: 10000 },
  { id: "PROD-002", name: "Mobile App Development", price: 7500 },
  { id: "PROD-003", name: "Custom ERP Implementation", price: 15000 },
  { id: "PROD-004", name: "POS System Setup", price: 4500 },
  { id: "PROD-005", name: "Hosting (Annual)", price: 2500 },
  { id: "PROD-006", name: "Support Package (3 months)", price: 1250 },
  { id: "PROD-007", name: "Staff Training", price: 250 },
]

interface DeliveryNoteDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  deliveryNote?: any
}

export function DeliveryNoteDialog({ open, onOpenChange, deliveryNote }: DeliveryNoteDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    customerId: "",
    projectId: "",
    orderReference: "",
    date: new Date(),
    status: "pending",
    items: [{ id: "1", productId: "", description: "", quantity: 1 }],
    notes: "",
  })

  const [availableProjects, setAvailableProjects] = useState(projects)

  useEffect(() => {
    if (deliveryNote) {
      setFormData({
        ...deliveryNote,
        date: new Date(deliveryNote.date),
        items: deliveryNote.items.map((item: any) => ({
          ...item,
          productId: item.productId || "",
        })),
      })
    } else {
      // Reset form for new delivery note
      setFormData({
        id: `DN-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        customerId: "",
        projectId: "",
        orderReference: "",
        date: new Date(),
        status: "pending",
        items: [{ id: "1", productId: "", description: "", quantity: 1 }],
        notes: "",
      })
    }
  }, [deliveryNote, open])

  const handleCustomerChange = (value: string) => {
    setFormData({ ...formData, customerId: value })
    // Filter projects by customer
    setAvailableProjects(projects.filter((project) => project.customerId === value))
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date })
    }
  }

  const handleProductChange = (value: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === value)
    const updatedItems = [...formData.items]

    updatedItems[index] = {
      ...updatedItems[index],
      productId: value,
      description: selectedProduct ? selectedProduct.name : "",
    }

    setFormData({ ...formData, items: updatedItems })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    setFormData({ ...formData, items: updatedItems })
  }

  const addItem = () => {
    setFormData({
      ...formData,
      items: [
        ...formData.items,
        {
          id: String(formData.items.length + 1),
          productId: "",
          description: "",
          quantity: 1,
        },
      ],
    })
  }

  const removeItem = (index: number) => {
    if (formData.items.length > 1) {
      const updatedItems = [...formData.items]
      updatedItems.splice(index, 1)
      setFormData({ ...formData, items: updatedItems })
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting delivery note:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{deliveryNote ? "Edit Delivery Note" : "Create New Delivery Note"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="deliveryNoteId">Delivery Note #</Label>
                <Input
                  id="deliveryNoteId"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!deliveryNote}
                />
              </div>
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="project">Project</Label>
                <Select
                  value={formData.projectId}
                  onValueChange={(value) => setFormData({ ...formData, projectId: value })}
                  disabled={!formData.customerId}
                >
                  <SelectTrigger id="project">
                    <SelectValue placeholder="Select project" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableProjects.map((project) => (
                      <SelectItem key={project.id} value={project.id}>
                        {project.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="orderReference">Order Reference</Label>
                <Input
                  id="orderReference"
                  value={formData.orderReference}
                  onChange={(e) => setFormData({ ...formData, orderReference: e.target.value })}
                  placeholder="e.g., PO-12345"
                />
              </div>
              <div>
                <Label>Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.date} onSelect={handleDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData({ ...formData, status: value })}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-transit">In Transit</SelectItem>
                    <SelectItem value="delivered">Delivered</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Items</Label>
              <div className="space-y-4">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-12 md:col-span-8">
                      <Select value={item.productId} onValueChange={(value) => handleProductChange(value, index)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select product" />
                        </SelectTrigger>
                        <SelectContent>
                          {products.map((product) => (
                            <SelectItem key={product.id} value={product.id}>
                              {product.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="col-span-10 md:col-span-3">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                        placeholder="Quantity"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1 flex justify-end">
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeItem(index)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" className="mt-2" onClick={addItem}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>

            <div>
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional delivery instructions or notes"
                rows={3}
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{deliveryNote ? "Update Delivery Note" : "Create Delivery Note"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
