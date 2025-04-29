"use client"

import { useState } from "react"
import { PlusCircle, MoreHorizontal, Pencil, Trash2, ChevronRight, ChevronDown } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { AccountDialog } from "@/components/accounting/account-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { Account } from "@/lib/types"

// Mock data for chart of accounts
const mockAccounts: Account[] = [
  {
    id: "1",
    code: "1000",
    name: "Assets",
    type: "asset",
    parentId: null,
    balance: 0,
    currency: "USD",
    description: "Asset accounts",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    code: "1100",
    name: "Current Assets",
    type: "asset",
    parentId: "1",
    balance: 0,
    currency: "USD",
    description: "Current asset accounts",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
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
    id: "5",
    code: "2000",
    name: "Liabilities",
    type: "liability",
    parentId: null,
    balance: 0,
    currency: "USD",
    description: "Liability accounts",
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

export function ChartOfAccounts() {
  const [accounts, setAccounts] = useState<Account[]>(mockAccounts)
  const [expandedAccounts, setExpandedAccounts] = useState<Record<string, boolean>>({
    "1": true,
    "2": true,
  })
  const [searchTerm, setSearchTerm] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null)
  const { toast } = useToast()

  const handleEdit = (account: Account) => {
    setSelectedAccount(account)
    setIsDialogOpen(true)
  }

  const handleDelete = (accountId: string) => {
    // Check if account has children
    const hasChildren = accounts.some((account) => account.parentId === accountId)
    if (hasChildren) {
      toast({
        title: "Cannot delete account",
        description: "This account has sub-accounts. Please delete them first.",
        variant: "destructive",
      })
      return
    }

    setAccounts(accounts.filter((account) => account.id !== accountId))
    toast({
      title: "Account deleted",
      description: "The account has been successfully deleted",
    })
  }

  const handleSave = (accountData: Partial<Account>) => {
    if (selectedAccount) {
      // Update existing account
      const updatedAccount = { ...selectedAccount, ...accountData, updatedAt: new Date().toISOString() }
      setAccounts(accounts.map((account) => (account.id === selectedAccount.id ? updatedAccount : account)))
      toast({
        title: "Account updated",
        description: "The account has been successfully updated",
      })
    } else {
      // Create new account
      const newAccount: Account = {
        id: Math.random().toString(36).substring(7),
        code: accountData.code || "",
        name: accountData.name || "",
        type: accountData.type || "asset",
        parentId: accountData.parentId,
        balance: accountData.balance || 0,
        currency: accountData.currency || "USD",
        description: accountData.description || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setAccounts([...accounts, newAccount])
      toast({
        title: "Account created",
        description: "The account has been successfully created",
      })
    }
    setIsDialogOpen(false)
    setSelectedAccount(null)
  }

  const toggleExpand = (accountId: string) => {
    setExpandedAccounts({
      ...expandedAccounts,
      [accountId]: !expandedAccounts[accountId],
    })
  }

  const getAccountTypeColor = (type: string) => {
    switch (type) {
      case "asset":
        return "bg-blue-500 hover:bg-blue-600"
      case "liability":
        return "bg-red-500 hover:bg-red-600"
      case "equity":
        return "bg-green-500 hover:bg-green-600"
      case "revenue":
        return "bg-emerald-500 hover:bg-emerald-600"
      case "expense":
        return "bg-amber-500 hover:bg-amber-600"
      default:
        return "bg-gray-500 hover:bg-gray-600"
    }
  }

  // Build account hierarchy
  const rootAccounts = accounts.filter((account) => account.parentId === null)

  const renderAccount = (account: Account, level = 0) => {
    const hasChildren = accounts.some((a) => a.parentId === account.id)
    const isExpanded = expandedAccounts[account.id] || false
    const childAccounts = accounts.filter((a) => a.parentId === account.id)

    // Filter by search term
    if (
      searchTerm &&
      !account.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !account.code.toLowerCase().includes(searchTerm.toLowerCase())
    ) {
      // If this account doesn't match but has children that might match, render it
      if (hasChildren) {
        const matchingChildren = childAccounts.filter(
          (child) =>
            child.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            child.code.toLowerCase().includes(searchTerm.toLowerCase()),
        )
        if (matchingChildren.length === 0) return null
      } else {
        return null
      }
    }

    return (
      <div key={account.id} className="mb-1">
        <div
          className={`flex items-center justify-between rounded-md border p-2 ${
            level > 0 ? "ml-" + level * 6 : ""
          } hover:bg-muted/50`}
        >
          <div className="flex items-center">
            {hasChildren && (
              <Button variant="ghost" size="sm" className="mr-1 p-0 h-6 w-6" onClick={() => toggleExpand(account.id)}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </Button>
            )}
            <span className="font-medium mr-2">{account.code}</span>
            <span>{account.name}</span>
            <Badge className={`ml-2 ${getAccountTypeColor(account.type)}`}>{account.type}</Badge>
          </div>
          <div className="flex items-center">
            <span className="mr-4 font-medium">
              {account.balance.toLocaleString("en-US", { style: "currency", currency: account.currency })}
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <span className="sr-only">Open menu</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleEdit(account)}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleDelete(account.id)} className="text-destructive">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        {isExpanded && hasChildren && childAccounts.map((childAccount) => renderAccount(childAccount, level + 1))}
      </div>
    )
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Chart of Accounts</CardTitle>
          <CardDescription>Manage your financial accounts</CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedAccount(null)
            setIsDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Account
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Input
            placeholder="Search accounts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <div className="space-y-1">{rootAccounts.map((account) => renderAccount(account))}</div>
      </CardContent>
      <AccountDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        account={selectedAccount}
        accounts={accounts}
        onSave={handleSave}
      />
    </Card>
  )
}
