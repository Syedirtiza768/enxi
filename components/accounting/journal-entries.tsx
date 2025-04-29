"use client"

import { useState } from "react"
import { PlusCircle, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react"
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
import { JournalEntryDialog } from "@/components/accounting/journal-entry-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { ColumnDef } from "@tanstack/react-table"
import type { JournalEntry } from "@/lib/types"

// Mock data for journal entries
const mockJournalEntries: JournalEntry[] = [
  {
    id: "1",
    date: "2023-10-01",
    reference: "JE-001",
    description: "Initial investment",
    debitTotal: 10000,
    creditTotal: 10000,
    status: "posted",
    lines: [
      {
        id: "1-1",
        journalEntryId: "1",
        accountId: "3",
        account: {
          id: "3",
          code: "1110",
          name: "Cash",
          type: "asset",
          parentId: "2",
          balance: 50000,
          currency: "USD",
          description: "Cash on hand",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Initial cash investment",
        debit: 10000,
        credit: 0,
      },
      {
        id: "1-2",
        journalEntryId: "1",
        accountId: "6",
        account: {
          id: "6",
          code: "3000",
          name: "Equity",
          type: "equity",
          parentId: null,
          balance: 0,
          currency: "USD",
          description: "Equity accounts",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Initial investment",
        debit: 0,
        credit: 10000,
      },
    ],
    createdAt: "2023-10-01T00:00:00.000Z",
    updatedAt: "2023-10-01T00:00:00.000Z",
  },
  {
    id: "2",
    date: "2023-10-05",
    reference: "JE-002",
    description: "Purchase of office supplies",
    debitTotal: 500,
    creditTotal: 500,
    status: "posted",
    lines: [
      {
        id: "2-1",
        journalEntryId: "2",
        accountId: "8",
        account: {
          id: "8",
          code: "5000",
          name: "Expenses",
          type: "expense",
          parentId: null,
          balance: 0,
          currency: "USD",
          description: "Expense accounts",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Office supplies",
        debit: 500,
        credit: 0,
      },
      {
        id: "2-2",
        journalEntryId: "2",
        accountId: "3",
        account: {
          id: "3",
          code: "1110",
          name: "Cash",
          type: "asset",
          parentId: "2",
          balance: 50000,
          currency: "USD",
          description: "Cash on hand",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Payment for office supplies",
        debit: 0,
        credit: 500,
      },
    ],
    createdAt: "2023-10-05T00:00:00.000Z",
    updatedAt: "2023-10-05T00:00:00.000Z",
  },
  {
    id: "3",
    date: "2023-10-10",
    reference: "JE-003",
    description: "Client payment received",
    debitTotal: 2500,
    creditTotal: 2500,
    status: "posted",
    lines: [
      {
        id: "3-1",
        journalEntryId: "3",
        accountId: "4",
        account: {
          id: "4",
          code: "1120",
          name: "Bank Account",
          type: "asset",
          parentId: "2",
          balance: 150000,
          currency: "USD",
          description: "Bank accounts",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Client payment",
        debit: 2500,
        credit: 0,
      },
      {
        id: "3-2",
        journalEntryId: "3",
        accountId: "7",
        account: {
          id: "7",
          code: "4000",
          name: "Revenue",
          type: "revenue",
          parentId: null,
          balance: 0,
          currency: "USD",
          description: "Revenue accounts",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        description: "Service revenue",
        debit: 0,
        credit: 2500,
      },
    ],
    createdAt: "2023-10-10T00:00:00.000Z",
    updatedAt: "2023-10-10T00:00:00.000Z",
  },
]

export function JournalEntries() {
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(mockJournalEntries)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | null>(null)
  const [viewMode, setViewMode] = useState(false)
  const { toast } = useToast()

  const handleView = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setViewMode(true)
    setIsDialogOpen(true)
  }

  const handleEdit = (entry: JournalEntry) => {
    setSelectedEntry(entry)
    setViewMode(false)
    setIsDialogOpen(true)
  }

  const handleDelete = (entryId: string) => {
    setJournalEntries(journalEntries.filter((entry) => entry.id !== entryId))
    toast({
      title: "Journal entry deleted",
      description: "The journal entry has been successfully deleted",
    })
  }

  const handleSave = (entryData: Partial<JournalEntry>) => {
    if (selectedEntry) {
      // Update existing entry
      const updatedEntry = { ...selectedEntry, ...entryData, updatedAt: new Date().toISOString() }
      setJournalEntries(journalEntries.map((entry) => (entry.id === selectedEntry.id ? updatedEntry : entry)))
      toast({
        title: "Journal entry updated",
        description: "The journal entry has been successfully updated",
      })
    } else {
      // Create new entry
      const newEntry: JournalEntry = {
        id: Math.random().toString(36).substring(7),
        date: entryData.date || new Date().toISOString().split("T")[0],
        reference: entryData.reference || `JE-${journalEntries.length + 1}`.padStart(6, "0"),
        description: entryData.description || "",
        debitTotal: entryData.debitTotal || 0,
        creditTotal: entryData.creditTotal || 0,
        status: entryData.status || "draft",
        lines: entryData.lines || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setJournalEntries([...journalEntries, newEntry])
      toast({
        title: "Journal entry created",
        description: "The journal entry has been successfully created",
      })
    }
    setIsDialogOpen(false)
    setSelectedEntry(null)
    setViewMode(false)
  }

  const columns: ColumnDef<JournalEntry>[] = [
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
      accessorKey: "description",
      header: "Description",
    },
    {
      accessorKey: "debitTotal",
      header: "Debit Total",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("debitTotal"))
        return <span className="font-medium">${amount.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "creditTotal",
      header: "Credit Total",
      cell: ({ row }) => {
        const amount = Number.parseFloat(row.getValue("creditTotal"))
        return <span className="font-medium">${amount.toFixed(2)}</span>
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <Badge
            variant={status === "posted" ? "default" : "outline"}
            className={status === "draft" ? "border-amber-500 text-amber-500" : ""}
          >
            {status === "posted" ? "Posted" : "Draft"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const entry = row.original
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
              <DropdownMenuItem onClick={() => handleView(entry)}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleEdit(entry)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(entry.id)} className="text-destructive">
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
          <CardTitle>Journal Entries</CardTitle>
          <CardDescription>Manage your financial transactions</CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedEntry(null)
            setViewMode(false)
            setIsDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          New Entry
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable
          columns={columns}
          data={journalEntries}
          searchColumn="reference"
          searchPlaceholder="Search by reference..."
        />
      </CardContent>
      <JournalEntryDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        journalEntry={selectedEntry}
        viewOnly={viewMode}
        onSave={handleSave}
      />
    </Card>
  )
}
