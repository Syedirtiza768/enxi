"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FinancialReports } from "@/components/reports/financial-reports"
import { SalesReports } from "@/components/reports/sales-reports"
import { InventoryReports } from "@/components/reports/inventory-reports"
import { ProjectReports } from "@/components/reports/project-reports"

export function ReportsDashboard() {
  const [activeTab, setActiveTab] = useState("financial")

  return (
    <div className="flex flex-col gap-5 p-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Reports</h1>
        <p className="text-muted-foreground">Generate and view business reports and analytics</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>
        <TabsContent value="financial" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Financial Reports</CardTitle>
              <CardDescription>View financial statements and performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <FinancialReports />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="sales" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Reports</CardTitle>
              <CardDescription>Analyze sales performance and customer metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <SalesReports />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="inventory" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Reports</CardTitle>
              <CardDescription>Track inventory levels, movements, and valuations</CardDescription>
            </CardHeader>
            <CardContent>
              <InventoryReports />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="projects" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Project Reports</CardTitle>
              <CardDescription>Monitor project performance, timelines, and profitability</CardDescription>
            </CardHeader>
            <CardContent>
              <ProjectReports />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
