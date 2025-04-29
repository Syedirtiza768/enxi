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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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

interface InvoiceDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: any
}

export function InvoiceDialog({ open, onOpenChange, invoice }: InvoiceDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    customerId: "",
    projectId: "",
    date: new Date(),
    dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: "pending",
    items: [{ id: "1", productId: "", description: "", quantity: 1, unitPrice: 0, total: 0 }],
    notes: "",
    terms: "Payment due within 30 days of invoice date.",
  })

  const [availableProjects, setAvailableProjects] = useState(projects)

  useEffect(() => {
    if (invoice) {
      setFormData({
        ...invoice,
        date: new Date(invoice.date),
        dueDate: new Date(invoice.dueDate),
        items: invoice.items.map((item: any) => ({
          ...item,
          productId: item.productId || "",
        })),
      })
    } else {
      // Reset form for new invoice
      setFormData({
        id: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        customerId: "",
        projectId: "",
        date: new Date(),
        dueDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "pending",
        items: [{ id: "1", productId: "", description: "", quantity: 1, unitPrice: 0, total: 0 }],
        notes: "",
        terms: "Payment due within 30 days of invoice date.",
      })
    }
  }, [invoice, open])

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

  const handleDueDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, dueDate: date })
    }
  }

  const handleProductChange = (value: string, index: number) => {
    const selectedProduct = products.find((p) => p.id === value)
    const updatedItems = [...formData.items]

    updatedItems[index] = {
      ...updatedItems[index],
      productId: value,
      description: selectedProduct ? selectedProduct.name : "",
      unitPrice: selectedProduct ? selectedProduct.price : 0,
      total: selectedProduct ? selectedProduct.price * updatedItems[index].quantity : 0,
    }

    setFormData({ ...formData, items: updatedItems })
  }

  const handleItemChange = (index: number, field: string, value: any) => {
    const updatedItems = [...formData.items]

    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
    }

    // Recalculate total if quantity or unitPrice changes
    if (field === "quantity" || field === "unitPrice") {
      updatedItems[index].total = updatedItems[index].quantity * updatedItems[index].unitPrice
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
          unitPrice: 0,
          total: 0,
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

  const calculateSubtotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting invoice:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{invoice ? "Edit Invoice" : "Create New Invoice"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="details" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="details">Invoice Details</TabsTrigger>
              <TabsTrigger value="items">Items & Payments</TabsTrigger>
            </TabsList>
            <TabsContent value="details" className="space-y-4 py-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="invoiceId">Invoice #</Label>
                  <Input
                    id="invoiceId"
                    value={formData.id}
                    onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                    disabled={!!invoice}
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
                  <Label>Due Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.dueDate && "text-muted-foreground",
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.dueDate ? format(formData.dueDate, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar mode="single" selected={formData.dueDate} onSelect={handleDueDateChange} initialFocus />
                    </PopoverContent>
                  </Popover>
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="sent">Sent</SelectItem>
                      <SelectItem value="partially-paid">Partially Paid</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="notes">Notes</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    placeholder="Additional notes for the customer"
                    rows={3}
                  />
                </div>
                <div>
                  <Label htmlFor="terms">Terms & Conditions</Label>
                  <Textarea
                    id="terms"
                    value={formData.terms}
                    onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                    rows={3}
                  />
                </div>
              </div>
            </TabsContent>
            <TabsContent value="items" className="space-y-4 py-4">
              <div>
                <Label className="mb-2 block">Invoice Items</Label>
                <div className="space-y-4">
                  {formData.items.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-center">
                      <div className="col-span-12 md:col-span-5">
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
                      <div className="col-span-12 md:col-span-2">
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity}
                          onChange={(e) => handleItemChange(index, "quantity", Number.parseInt(e.target.value) || 1)}
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-12 md:col-span-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.unitPrice}
                          onChange={(e) => handleItemChange(index, "unitPrice", Number.parseFloat(e.target.value) || 0)}
                          placeholder="Unit Price"
                        />
                      </div>
                      <div className="col-span-10 md:col-span-2">
                        <Input type="number" value={item.total} disabled placeholder="Total" />
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

              <div className="flex justify-end">
                <div className="w-1/3 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Total:</span>
                    <span>${calculateSubtotal().toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{invoice ? "Update Invoice" : "Create Invoice"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
