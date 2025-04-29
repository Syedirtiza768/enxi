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
import { MoreHorizontal, FileEdit, Eye, Printer, DollarSign, CheckCircle } from "lucide-react"
import { InvoiceDialog } from "./invoice-dialog"
import { formatDate, formatCurrency } from "@/lib/utils"

// Mock data
const invoices = [
  {
    id: "INV-2023-001",
    customerId: "CUST-001",
    customerName: "Acme Corporation",
    projectId: "PRJ-2023-001",
    projectName: "Website Redesign",
    date: "2023-07-10",
    dueDate: "2023-08-10",
    status: "paid",
    total: 12500.0,
    amountPaid: 12500.0,
    amountDue: 0,
    items: [
      { id: "1", description: "Web Development Services", quantity: 1, unitPrice: 10000, total: 10000 },
      { id: "2", description: "Hosting (Annual)", quantity: 1, unitPrice: 2500, total: 2500 },
    ],
  },
  {
    id: "INV-2023-002",
    customerId: "CUST-002",
    customerName: "TechStart Inc",
    projectId: "PRJ-2023-002",
    projectName: "Mobile App Development",
    date: "2023-07-15",
    dueDate: "2023-08-15",
    status: "partially-paid",
    total: 8750.0,
    amountPaid: 4375.0,
    amountDue: 4375.0,
    items: [
      { id: "1", description: "Mobile App Development", quantity: 1, unitPrice: 7500, total: 7500 },
      { id: "2", description: "Support Package (3 months)", quantity: 1, unitPrice: 1250, total: 1250 },
    ],
  },
  {
    id: "INV-2023-003",
    customerId: "CUST-003",
    customerName: "Global Logistics Ltd",
    projectId: "PRJ-2023-003",
    projectName: "ERP Implementation",
    date: "2023-07-20",
    dueDate: "2023-08-20",
    status: "pending",
    total: 15000.0,
    amountPaid: 0,
    amountDue: 15000.0,
    items: [{ id: "1", description: "Custom ERP Implementation", quantity: 1, unitPrice: 15000, total: 15000 }],
  },
  {
    id: "INV-2023-004",
    customerId: "CUST-004",
    customerName: "Retail Solutions Co",
    projectId: "PRJ-2023-004",
    projectName: "POS System Upgrade",
    date: "2023-07-25",
    dueDate: "2023-08-25",
    status: "overdue",
    total: 5250.0,
    amountPaid: 0,
    amountDue: 5250.0,
    items: [
      { id: "1", description: "POS System Setup", quantity: 1, unitPrice: 4500, total: 4500 },
      { id: "2", description: "Staff Training", quantity: 3, unitPrice: 250, total: 750 },
    ],
  },
]

export function InvoiceList() {
  const [editingInvoice, setEditingInvoice] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (invoice: any) => {
    setEditingInvoice(invoice)
    setDialogOpen(true)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "Invoice #",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "projectName",
      header: "Project",
    },
    {
      accessorKey: "date",
      header: "Date",
      cell: ({ row }: any) => formatDate(row.getValue("date")),
    },
    {
      accessorKey: "dueDate",
      header: "Due Date",
      cell: ({ row }: any) => formatDate(row.getValue("dueDate")),
    },
    {
      accessorKey: "total",
      header: "Total",
      cell: ({ row }: any) => formatCurrency(row.getValue("total")),
    },
    {
      accessorKey: "amountDue",
      header: "Amount Due",
      cell: ({ row }: any) => formatCurrency(row.getValue("amountDue")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")

        return (
          <Badge
            variant={
              status === "paid"
                ? "success"
                : status === "partially-paid"
                  ? "default"
                  : status === "overdue"
                    ? "destructive"
                    : "outline"
            }
          >
            {status === "partially-paid" ? "Partially Paid" : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const invoice = row.original

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
              <DropdownMenuItem onClick={() => handleEdit(invoice)}>
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
                <DollarSign className="mr-2 h-4 w-4" />
                Record Payment
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CheckCircle className="mr-2 h-4 w-4" />
                Mark as Paid
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={invoices} />
      {editingInvoice && <InvoiceDialog open={dialogOpen} onOpenChange={setDialogOpen} invoice={editingInvoice} />}
    </div>
  )
}
