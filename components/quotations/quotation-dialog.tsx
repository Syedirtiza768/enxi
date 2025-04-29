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

// Mock data
const customers = [
  { id: "CUST-001", name: "Acme Corporation" },
  { id: "CUST-002", name: "TechStart Inc" },
  { id: "CUST-003", name: "Global Logistics Ltd" },
  { id: "CUST-004", name: "Retail Solutions Co" },
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

interface QuotationDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  quotation?: any
}

export function QuotationDialog({ open, onOpenChange, quotation }: QuotationDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    customerId: "",
    date: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    items: [{ id: "1", productId: "", description: "", quantity: 1, unitPrice: 0, total: 0 }],
    notes: "",
    terms: "Payment due within 30 days of acceptance. Quotation valid for 30 days.",
  })

  useEffect(() => {
    if (quotation) {
      setFormData({
        ...quotation,
        date: new Date(quotation.date),
        validUntil: new Date(quotation.validUntil),
        items: quotation.items.map((item: any) => ({
          ...item,
          productId: item.productId || "",
        })),
      })
    } else {
      // Reset form for new quotation
      setFormData({
        id: `QT-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        customerId: "",
        date: new Date(),
        validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        items: [{ id: "1", productId: "", description: "", quantity: 1, unitPrice: 0, total: 0 }],
        notes: "",
        terms: "Payment due within 30 days of acceptance. Quotation valid for 30 days.",
      })
    }
  }, [quotation, open])

  const handleCustomerChange = (value: string) => {
    setFormData({ ...formData, customerId: value })
  }

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, date })
    }
  }

  const handleValidUntilChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, validUntil: date })
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

  const calculateTotal = () => {
    return formData.items.reduce((sum, item) => sum + item.total, 0)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting quotation:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{quotation ? "Edit Quotation" : "Create New Quotation"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="quotationId">Quotation #</Label>
                <Input
                  id="quotationId"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!quotation}
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
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-start-3">
                <Label>Valid Until</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.validUntil && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.validUntil ? format(formData.validUntil, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.validUntil}
                      onSelect={handleValidUntilChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Items</Label>
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional notes for the customer"
                />
              </div>
              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Input
                  id="terms"
                  value={formData.terms}
                  onChange={(e) => setFormData({ ...formData, terms: e.target.value })}
                />
              </div>
            </div>

            <div className="flex justify-end">
              <div className="w-1/3 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>${calculateTotal().toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{quotation ? "Update Quotation" : "Create Quotation"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
