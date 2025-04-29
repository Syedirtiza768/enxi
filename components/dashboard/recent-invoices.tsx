"use client"

import Link from "next/link"
import { ArrowRight, AlertCircle, CheckCircle, Clock } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RecentInvoices() {
  const invoices = [
    {
      id: "1",
      number: "INV-001",
      customer: "Acme Corporation",
      amount: 12500.0,
      status: "paid",
      date: "2023-10-15",
    },
    {
      id: "2",
      number: "INV-002",
      customer: "Globex Industries",
      amount: 8750.5,
      status: "pending",
      date: "2023-10-20",
    },
    {
      id: "3",
      number: "INV-003",
      customer: "Initech LLC",
      amount: 5200.75,
      status: "overdue",
      date: "2023-09-30",
    },
    {
      id: "4",
      number: "INV-004",
      customer: "Acme Corporation",
      amount: 3450.25,
      status: "paid",
      date: "2023-10-05",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-500 hover:bg-green-600">Paid</Badge>
      case "pending":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            Pending
          </Badge>
        )
      case "overdue":
        return <Badge className="bg-red-500 hover:bg-red-600">Overdue</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "paid":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "pending":
        return <Clock className="h-4 w-4 text-amber-500" />
      case "overdue":
        return <AlertCircle className="h-4 w-4 text-red-500" />
      default:
        return null
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Invoices</CardTitle>
        <CardDescription>Overview of your latest invoices</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {invoices.map((invoice) => (
          <div key={invoice.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-start space-x-4">
              <div className="pt-1">{getStatusIcon(invoice.status)}</div>
              <div>
                <p className="text-sm font-medium leading-none">{invoice.number}</p>
                <p className="text-sm text-muted-foreground">{invoice.customer}</p>
                <div className="mt-1 flex items-center">
                  {getStatusBadge(invoice.status)}
                  <span className="ml-2 text-xs text-muted-foreground">
                    {new Date(invoice.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-sm font-medium">${invoice.amount.toFixed(2)}</div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/delivery-invoicing">
            View all invoices
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
