"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PlusCircle, Copy, Pencil, Trash } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

// Mock data
const templates = [
  {
    id: "TPL-001",
    name: "Standard Web Development",
    description: "Template for web development projects",
    items: [
      { description: "Website Design", quantity: 1, unitPrice: 2500 },
      { description: "Frontend Development", quantity: 1, unitPrice: 3500 },
      { description: "Backend Development", quantity: 1, unitPrice: 4000 },
      { description: "Hosting Setup", quantity: 1, unitPrice: 500 },
    ],
  },
  {
    id: "TPL-002",
    name: "Mobile App Package",
    description: "Template for mobile app development",
    items: [
      { description: "UI/UX Design", quantity: 1, unitPrice: 3000 },
      { description: "Mobile App Development", quantity: 1, unitPrice: 7500 },
      { description: "API Integration", quantity: 1, unitPrice: 2000 },
      { description: "App Store Submission", quantity: 1, unitPrice: 500 },
    ],
  },
  {
    id: "TPL-003",
    name: "Maintenance Contract",
    description: "Annual maintenance and support",
    items: [
      { description: "Technical Support (Annual)", quantity: 1, unitPrice: 2400 },
      { description: "Security Updates", quantity: 12, unitPrice: 100 },
      { description: "Performance Monitoring", quantity: 12, unitPrice: 50 },
      { description: "Content Updates (5 per month)", quantity: 60, unitPrice: 25 },
    ],
  },
]

export function QuotationTemplates() {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<any>(null)

  const handleEdit = (template: any) => {
    setEditingTemplate(template)
    setDialogOpen(true)
  }

  const handleCreate = () => {
    setEditingTemplate(null)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCreate}>
          <PlusCircle className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => (
          <Card key={template.id} className="overflow-hidden">
            <CardContent className="p-0">
              <div className="p-6">
                <h3 className="font-semibold text-lg">{template.name}</h3>
                <p className="text-sm text-muted-foreground mb-4">{template.description}</p>
                <div className="text-sm text-muted-foreground">{template.items.length} items</div>
              </div>
              <div className="border-t flex divide-x">
                <Button variant="ghost" className="flex-1 rounded-none" onClick={() => handleEdit(template)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="ghost" className="flex-1 rounded-none">
                  <Copy className="mr-2 h-4 w-4" />
                  Use
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <TemplateDialog open={dialogOpen} onOpenChange={setDialogOpen} template={editingTemplate} />
    </div>
  )
}

interface TemplateDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: any
}

function TemplateDialog({ open, onOpenChange, template }: TemplateDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    description: "",
    items: [{ description: "", quantity: 1, unitPrice: 0 }],
  })

  useState(() => {
    if (template) {
      setFormData(template)
    } else {
      setFormData({
        id: `TPL-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        name: "",
        description: "",
        items: [{ description: "", quantity: 1, unitPrice: 0 }],
      })
    }
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting template:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Create Template"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div>
                <Label htmlFor="name">Template Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Standard Web Development"
                />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of this template"
                />
              </div>
            </div>

            <div>
              <Label className="mb-2 block">Items</Label>
              <div className="space-y-2">
                {formData.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-12 gap-2 items-center">
                    <div className="col-span-6">
                      <Input
                        value={item.description}
                        onChange={(e) => {
                          const updatedItems = [...formData.items]
                          updatedItems[index].description = e.target.value
                          setFormData({ ...formData, items: updatedItems })
                        }}
                        placeholder="Item description"
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) => {
                          const updatedItems = [...formData.items]
                          updatedItems[index].quantity = Number.parseInt(e.target.value) || 1
                          setFormData({ ...formData, items: updatedItems })
                        }}
                        placeholder="Qty"
                      />
                    </div>
                    <div className="col-span-3">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.unitPrice}
                        onChange={(e) => {
                          const updatedItems = [...formData.items]
                          updatedItems[index].unitPrice = Number.parseFloat(e.target.value) || 0
                          setFormData({ ...formData, items: updatedItems })
                        }}
                        placeholder="Unit Price"
                      />
                    </div>
                    <div className="col-span-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          if (formData.items.length > 1) {
                            const updatedItems = [...formData.items]
                            updatedItems.splice(index, 1)
                            setFormData({ ...formData, items: updatedItems })
                          }
                        }}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      items: [...formData.items, { description: "", quantity: 1, unitPrice: 0 }],
                    })
                  }}
                >
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{template ? "Update Template" : "Create Template"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
