"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileEdit, Eye, Printer, FileText, TruckIcon } from "lucide-react"
import { DeliveryNoteDialog } from "./delivery-note-dialog"
import { formatDate } from "@/lib/utils"

// Mock data
const deliveryNotes = [
  {
    id: "DN-2023-001",
    customerId: "CUST-001",
    customerName: "Acme Corporation",
    orderReference: "ORD-2023-001",
    date: "2023-07-05",
    status: "delivered",
    items: [
      { id: "1", productId: "PROD-001", description: "Web Development Services", quantity: 1 },
      { id: "2", productId: "PROD-005", description: "Hosting (Annual)", quantity: 1 },
    ],
  },
  {
    id: "DN-2023-002",
    customerId: "CUST-002",
    customerName: "TechStart Inc",
    orderReference: "ORD-2023-002",
    date: "2023-07-10",
    status: "in-transit",
    items: [
      { id: "1", productId: "PROD-002", description: "Mobile App Development", quantity: 1 },
      { id: "2", productId: "PROD-006", description: "Support Package (3 months)", quantity: 1 },
    ],
  },
  {
    id: "DN-2023-003",
    customerId: "CUST-003",
    customerName: "Global Logistics Ltd",
    orderReference: "ORD-2023-003",
    date: "2023-07-15",
    status: "pending",
    items: [{ id: "1", productId: "PROD-003", description: "Custom ERP Implementation", quantity: 1 }],
  },
  {
    id: "DN-2023-004",
    customerId: "CUST-004",
    customerName: "Retail Solutions Co",
    orderReference: "ORD-2023-004",
    date: "2023-07-20",
    status: "pending",
    items: [
      { id: "1", productId: "PROD-004", description: "POS System Setup", quantity: 1 },
      { id: "2", productId: "PROD-007", description: "Staff Training", quantity: 3 },
    ],
  },
]

export function DeliveryNoteList() {
  const [editingDeliveryNote, setEditingDeliveryNote] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (deliveryNote: any) => {
    setEditingDeliveryNote(deliveryNote)
    setDialogOpen(true)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "Delivery Note #",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "orderReference",
      header: "Order Reference",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => formatDate(row.getValue("date")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")

        return (
          <Badge variant={status === "delivered" ? "success" : status === "in-transit" ? "default" : "outline"}>
            {status === "in-transit" ? "In Transit" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const deliveryNote = row.original

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
              <DropdownMenuItem onClick={() => handleEdit(deliveryNote)}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Printer className="mr-2 h-4 w-4" />
                Print
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                Create Invoice
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TruckIcon className="mr-2 h-4 w-4" />
                Update Status
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={deliveryNotes} />
      {editingDeliveryNote && (
        <DeliveryNoteDialog open={dialogOpen} onOpenChange={setDialogOpen} deliveryNote={editingDeliveryNote} />
      )}
    </div>
  )
}
