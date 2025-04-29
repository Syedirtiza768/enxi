"use client"

import { useState } from "react"
import { PlusCircle, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
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
import { CurrencyDialog } from "@/components/accounting/currency-dialog"
import { useToast } from "@/components/ui/use-toast"
import type { ColumnDef } from "@tanstack/react-table"

interface Currency {
  id: string
  code: string
  name: string
  symbol: string
  exchangeRate: number
  isBaseCurrency: boolean
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// Mock data for currencies
const mockCurrencies: Currency[] = [
  {
    id: "1",
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    exchangeRate: 1,
    isBaseCurrency: true,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "2",
    code: "EUR",
    name: "Euro",
    symbol: "€",
    exchangeRate: 0.85,
    isBaseCurrency: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "3",
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    exchangeRate: 0.75,
    isBaseCurrency: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "4",
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    exchangeRate: 110.5,
    isBaseCurrency: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "5",
    code: "CAD",
    name: "Canadian Dollar",
    symbol: "C$",
    exchangeRate: 1.25,
    isBaseCurrency: false,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
]

export function CurrencySettings() {
  const [currencies, setCurrencies] = useState<Currency[]>(mockCurrencies)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState<Currency | null>(null)
  const { toast } = useToast()

  const handleEdit = (currency: Currency) => {
    setSelectedCurrency(currency)
    setIsDialogOpen(true)
  }

  const handleDelete = (currencyId: string) => {
    // Check if it's the base currency
    const currency = currencies.find((c) => c.id === currencyId)
    if (currency?.isBaseCurrency) {
      toast({
        title: "Cannot delete base currency",
        description: "Please set another currency as the base currency first.",
        variant: "destructive",
      })
      return
    }

    setCurrencies(currencies.filter((c) => c.id !== currencyId))
    toast({
      title: "Currency deleted",
      description: "The currency has been successfully deleted",
    })
  }

  const handleSave = (currencyData: Partial<Currency>) => {
    // If setting a new base currency, update all other currencies
    if (currencyData.isBaseCurrency && !selectedCurrency?.isBaseCurrency) {
      setCurrencies(currencies.map((c) => ({ ...c, isBaseCurrency: false })))
    }

    if (selectedCurrency) {
      // Update existing currency
      const updatedCurrency = { ...selectedCurrency, ...currencyData, updatedAt: new Date().toISOString() }
      setCurrencies(currencies.map((c) => (c.id === selectedCurrency.id ? updatedCurrency : c)))
      toast({
        title: "Currency updated",
        description: "The currency has been successfully updated",
      })
    } else {
      // Create new currency
      const newCurrency: Currency = {
        id: Math.random().toString(36).substring(7),
        code: currencyData.code || "",
        name: currencyData.name || "",
        symbol: currencyData.symbol || "",
        exchangeRate: currencyData.exchangeRate || 1,
        isBaseCurrency: currencyData.isBaseCurrency || false,
        isActive: currencyData.isActive !== undefined ? currencyData.isActive : true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      setCurrencies([...currencies, newCurrency])
      toast({
        title: "Currency created",
        description: "The currency has been successfully created",
      })
    }
    setIsDialogOpen(false)
    setSelectedCurrency(null)
  }

  const columns: ColumnDef<Currency>[] = [
    {
      accessorKey: "code",
      header: "Code",
    },
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "symbol",
      header: "Symbol",
    },
    {
      accessorKey: "exchangeRate",
      header: "Exchange Rate",
      cell: ({ row }) => {
        const rate = Number.parseFloat(row.getValue("exchangeRate"))
        return <span className="font-medium">{rate.toFixed(4)}</span>
      },
    },
    {
      accessorKey: "isBaseCurrency",
      header: "Base Currency",
      cell: ({ row }) => {
        const isBase = row.getValue("isBaseCurrency")
        return isBase ? <Badge>Base Currency</Badge> : null
      },
    },
    {
      accessorKey: "isActive",
      header: "Status",
      cell: ({ row }) => {
        const isActive = row.getValue("isActive")
        return (
          <Badge variant={isActive ? "default" : "outline"} className={!isActive ? "text-muted-foreground" : ""}>
            {isActive ? "Active" : "Inactive"}
          </Badge>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const currency = row.original
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
              <DropdownMenuItem onClick={() => handleEdit(currency)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(currency.id)} className="text-destructive">
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
          <CardTitle>Currency Settings</CardTitle>
          <CardDescription>Manage currencies and exchange rates</CardDescription>
        </div>
        <Button
          onClick={() => {
            setSelectedCurrency(null)
            setIsDialogOpen(true)
          }}
        >
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Currency
        </Button>
      </CardHeader>
      <CardContent>
        <DataTable columns={columns} data={currencies} searchColumn="name" searchPlaceholder="Search currencies..." />
      </CardContent>
      <CurrencyDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        currency={selectedCurrency}
        onSave={handleSave}
      />
    </Card>
  )
}
