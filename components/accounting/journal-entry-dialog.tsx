"use client"

import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { PlusCircle, Trash2 } from "lucide-react"
import type { JournalEntry, JournalLine, Account } from "@/lib/types"
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
import { Card, CardContent } from "@/components/ui/card"

// Mock accounts for the select dropdown
const mockAccounts: Account[] = [
  {
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
  {
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
  {
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
  {
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
  {
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
]

const formSchema = z.object({
  date: z.string().min(1, { message: "Date is required" }),
  reference: z.string().min(1, { message: "Reference is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  status: z.enum(["draft", "posted"]),
})

interface JournalEntryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  journalEntry: JournalEntry | null
  viewOnly?: boolean
  onSave: (data: Partial<JournalEntry>) => void
}

export function JournalEntryDialog({
  open,
  onOpenChange,
  journalEntry,
  viewOnly = false,
  onSave,
}: JournalEntryDialogProps) {
  const [lines, setLines] = useState<JournalLine[]>([])
  const [debitTotal, setDebitTotal] = useState(0)
  const [creditTotal, setCreditTotal] = useState(0)

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      reference: "",
      description: "",
      status: "draft",
    },
  })

  useEffect(() => {
    if (journalEntry) {
      form.reset({
        date: journalEntry.date,
        reference: journalEntry.reference,
        description: journalEntry.description,
        status: journalEntry.status,
      })
      setLines(journalEntry.lines)
    } else {
      form.reset({
        date: new Date().toISOString().split("T")[0],
        reference: `JE-${Math.floor(Math.random() * 1000)}`.padStart(6, "0"),
        description: "",
        status: "draft",
      })
      setLines([])
    }
  }, [journalEntry, form])

  useEffect(() => {
    // Calculate totals
    const debit = lines.reduce((sum, line) => sum + line.debit, 0)
    const credit = lines.reduce((sum, line) => sum + line.credit, 0)
    setDebitTotal(debit)
    setCreditTotal(credit)
  }, [lines])

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Check if debits equal credits
    if (debitTotal !== creditTotal) {
      form.setError("root", {
        type: "manual",
        message: "Debits must equal credits",
      })
      return
    }

    onSave({
      ...values,
      debitTotal,
      creditTotal,
      lines,
    })
  }

  const addLine = () => {
    const newLine: JournalLine = {
      id: Math.random().toString(36).substring(7),
      journalEntryId: journalEntry?.id || "",
      accountId: "",
      account: mockAccounts[0],
      description: "",
      debit: 0,
      credit: 0,
    }
    setLines([...lines, newLine])
  }

  const updateLine = (index: number, field: keyof JournalLine, value: any) => {
    const updatedLines = [...lines]

    if (field === "accountId") {
      const account = mockAccounts.find((a) => a.id === value)
      updatedLines[index] = {
        ...updatedLines[index],
        accountId: value,
        account: account || updatedLines[index].account,
      }
    } else {
      updatedLines[index] = {
        ...updatedLines[index],
        [field]: value,
      }
    }

    setLines(updatedLines)
  }

  const removeLine = (index: number) => {
    const updatedLines = [...lines]
    updatedLines.splice(index, 1)
    setLines(updatedLines)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>
            {viewOnly ? "View Journal Entry" : journalEntry ? "Edit Journal Entry" : "New Journal Entry"}
          </DialogTitle>
          <DialogDescription>
            {viewOnly
              ? "View journal entry details"
              : journalEntry
                ? "Edit journal entry details"
                : "Create a new journal entry"}
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
                name="reference"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Reference</FormLabel>
                    <FormControl>
                      <Input {...field} disabled={viewOnly} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input {...field} disabled={viewOnly} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} disabled={viewOnly}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="posted">Posted</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Journal Lines</h3>
                {!viewOnly && (
                  <Button type="button" variant="outline" size="sm" onClick={addLine}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Line
                  </Button>
                )}
              </div>

              <Card>
                <CardContent className="p-0">
                  <div className="grid grid-cols-12 gap-2 p-2 font-medium text-sm bg-muted">
                    <div className="col-span-4">Account</div>
                    <div className="col-span-4">Description</div>
                    <div className="col-span-1">Debit</div>
                    <div className="col-span-1">Credit</div>
                    {!viewOnly && <div className="col-span-2">Actions</div>}
                  </div>
                  {lines.map((line, index) => (
                    <div key={line.id} className="grid grid-cols-12 gap-2 p-2 border-t">
                      <div className="col-span-4">
                        <Select
                          value={line.accountId}
                          onValueChange={(value) => updateLine(index, "accountId", value)}
                          disabled={viewOnly}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select account" />
                          </SelectTrigger>
                          <SelectContent>
                            {mockAccounts.map((account) => (
                              <SelectItem key={account.id} value={account.id}>
                                {account.code} - {account.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="col-span-4">
                        <Input
                          value={line.description}
                          onChange={(e) => updateLine(index, "description", e.target.value)}
                          placeholder="Description"
                          disabled={viewOnly}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          value={line.debit}
                          onChange={(e) => updateLine(index, "debit", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          disabled={viewOnly || line.credit > 0}
                        />
                      </div>
                      <div className="col-span-1">
                        <Input
                          type="number"
                          value={line.credit}
                          onChange={(e) => updateLine(index, "credit", Number.parseFloat(e.target.value) || 0)}
                          placeholder="0.00"
                          disabled={viewOnly || line.debit > 0}
                        />
                      </div>
                      {!viewOnly && (
                        <div className="col-span-2 flex items-center">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLine(index)}
                            className="h-8 w-8 p-0"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span className="sr-only">Remove line</span>
                          </Button>
                        </div>
                      )}
                    </div>
                  ))}
                  <div className="grid grid-cols-12 gap-2 p-2 border-t font-medium">
                    <div className="col-span-8 text-right">Totals:</div>
                    <div className="col-span-1">${debitTotal.toFixed(2)}</div>
                    <div className="col-span-1">${creditTotal.toFixed(2)}</div>
                    {!viewOnly && <div className="col-span-2"></div>}
                  </div>
                  {debitTotal !== creditTotal && (
                    <div className="p-2 text-destructive text-sm">
                      Warning: Debits and credits are not balanced. Difference: $
                      {Math.abs(debitTotal - creditTotal).toFixed(2)}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {form.formState.errors.root && (
              <div className="text-destructive text-sm">{form.formState.errors.root.message}</div>
            )}

            <DialogFooter>
              {!viewOnly && <Button type="submit">Save</Button>}
              {viewOnly && (
                <Button type="button" onClick={() => onOpenChange(false)}>
                  Close
                </Button>
              )}
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
