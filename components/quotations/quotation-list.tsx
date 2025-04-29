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
import { MoreHorizontal, FileText, Send, Check, X, FileEdit } from "lucide-react"
import { QuotationDialog } from "./quotation-dialog"
import { formatCurrency, formatDate } from "@/lib/utils"

// Mock data
const quotations = [
  {
    id: "QT-2023-001",
    customerId: "CUST-001",
    customerName: "Acme Corporation",
    date: "2023-04-15",
    validUntil: "2023-05-15",
    total: 12500.0,
    status: "pending",
    items: [
      { id: "1", description: "Web Development Services", quantity: 1, unitPrice: 10000, total: 10000 },
      { id: "2", description: "Hosting (Annual)", quantity: 1, unitPrice: 2500, total: 2500 },
    ],
  },
  {
    id: "QT-2023-002",
    customerId: "CUST-002",
    customerName: "TechStart Inc",
    date: "2023-04-18",
    validUntil: "2023-05-18",
    total: 8750.0,
    status: "sent",
    items: [
      { id: "1", description: "Mobile App Development", quantity: 1, unitPrice: 7500, total: 7500 },
      { id: "2", description: "Support Package (3 months)", quantity: 1, unitPrice: 1250, total: 1250 },
    ],
  },
  {
    id: "QT-2023-003",
    customerId: "CUST-003",
    customerName: "Global Logistics Ltd",
    date: "2023-04-20",
    validUntil: "2023-05-20",
    total: 15000.0,
    status: "accepted",
    items: [{ id: "1", description: "Custom ERP Implementation", quantity: 1, unitPrice: 15000, total: 15000 }],
  },
  {
    id: "QT-2023-004",
    customerId: "CUST-004",
    customerName: "Retail Solutions Co",
    date: "2023-04-22",
    validUntil: "2023-05-22",
    total: 5250.0,
    status: "rejected",
    items: [
      { id: "1", description: "POS System Setup", quantity: 1, unitPrice: 4500, total: 4500 },
      { id: "2", description: "Staff Training", quantity: 3, unitPrice: 250, total: 750 },
    ],
  },
]

export function QuotationList() {
  const [editingQuotation, setEditingQuotation] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (quotation: any) => {
    setEditingQuotation(quotation)
    setDialogOpen(true)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "Quotation #",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => formatDate(row.getValue("date")),
    },
    {
      accessorKey: "validUntil",
      header: "Valid Until",
      cell: ({ row }: any) => formatDate(row.getValue("validUntil")),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }: any) => formatCurrency(row.getValue("total")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")

        return (
          <Badge
            variant={
              status === "accepted"
                ? "success"
                : status === "rejected"
                  ? "destructive"
                  : status === "sent"
                    ? "default"
                    : "outline"
            }
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const quotation = row.original

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
              <DropdownMenuItem onClick={() => handleEdit(quotation)}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <FileText className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <Send className="mr-2 h-4 w-4" />
                Send to Customer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Check className="mr-2 h-4 w-4" />
                Mark as Accepted
              </DropdownMenuItem>
              <DropdownMenuItem>
                <X className="mr-2 h-4 w-4" />
                Mark as Rejected
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={quotations} />
      {editingQuotation && (
        <QuotationDialog open={dialogOpen} onOpenChange={setDialogOpen} quotation={editingQuotation} />
      )}
    </div>
  )
}
