"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PlusCircle } from "lucide-react"
import { DeliveryNoteList } from "./delivery-note-list"
import { InvoiceList } from "./invoice-list"
import { DeliveryNoteDialog } from "./delivery-note-dialog"
import { InvoiceDialog } from "./invoice-dialog"

export function DeliveryInvoicingDashboard() {
  const [deliveryDialogOpen, setDeliveryDialogOpen] = useState(false)
  const [invoiceDialogOpen, setInvoiceDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("delivery-notes")

  return (
    <div className="flex flex-col gap-5 p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Delivery & Invoicing</h1>
          <p className="text-muted-foreground">Manage delivery notes and invoices</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setDeliveryDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Delivery Note
          </Button>
          <Button onClick={() => setInvoiceDialogOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Invoice
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList>
          <TabsTrigger value="delivery-notes">Delivery Notes</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        <TabsContent value="delivery-notes" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Delivery Notes</CardTitle>
              <CardDescription>Manage product deliveries to customers</CardDescription>
            </CardHeader>
            <CardContent>
              <DeliveryNoteList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="invoices" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoices</CardTitle>
              <CardDescription>Manage customer invoices and payments</CardDescription>
            </CardHeader>
            <CardContent>
              <InvoiceList />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="analytics" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Invoicing Analytics</CardTitle>
              <CardDescription>View payment and invoicing metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Outstanding Invoices</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$45,250</div>
                    <p className="text-xs text-muted-foreground">8 invoices pending payment</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Average Payment Time</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">18 days</div>
                    <p className="text-xs text-muted-foreground">-2 days from last month</p>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-medium">Revenue This Month</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">$78,350</div>
                    <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <DeliveryNoteDialog open={deliveryDialogOpen} onOpenChange={setDeliveryDialogOpen} />
      <InvoiceDialog open={invoiceDialogOpen} onOpenChange={setInvoiceDialogOpen} />
    </div>
  )
}
