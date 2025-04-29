"use client"

import { useState } from "react"
import { FileText, Download, BarChart2, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

export function InventoryReports() {
  const [reportType, setReportType] = useState("inventory-valuation")
  const [category, setCategory] = useState("all")
  const [location, setLocation] = useState("all")

  const generateReport = () => {
    // In a real app, this would call an API to generate the report
    console.log("Generating report:", {
      type: reportType,
      category,
      location,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Report Type</label>
          <Select value={reportType} onValueChange={setReportType}>
            <SelectTrigger>
              <SelectValue placeholder="Select report type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="inventory-valuation">Inventory Valuation</SelectItem>
              <SelectItem value="stock-levels">Stock Levels</SelectItem>
              <SelectItem value="inventory-movement">Inventory Movement</SelectItem>
              <SelectItem value="slow-moving">Slow Moving Items</SelectItem>
              <SelectItem value="reorder-report">Reorder Report</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="construction-materials">Construction Materials</SelectItem>
              <SelectItem value="electrical">Electrical</SelectItem>
              <SelectItem value="plumbing">Plumbing</SelectItem>
              <SelectItem value="safety-equipment">Safety Equipment</SelectItem>
              <SelectItem value="tools">Tools</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="Select location" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Locations</SelectItem>
              <SelectItem value="warehouse-a">Warehouse A</SelectItem>
              <SelectItem value="warehouse-b">Warehouse B</SelectItem>
              <SelectItem value="warehouse-c">Warehouse C</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button onClick={generateReport}>
          <FileText className="mr-2 h-4 w-4" />
          Generate Report
        </Button>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <Tabs defaultValue="preview" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {reportType === "inventory-valuation" && "Inventory Valuation"}
                  {reportType === "stock-levels" && "Stock Levels"}
                  {reportType === "inventory-movement" && "Inventory Movement"}
                  {reportType === "slow-moving" && "Slow Moving Items"}
                  {reportType === "reorder-report" && "Reorder Report"}
                </h2>
                <p className="text-muted-foreground">
                  {category === "all" ? "All Categories" : category.replace(/-/g, " ")} |{" "}
                  {location === "all" ? "All Locations" : location.replace(/-/g, " ")}
                </p>
              </div>

              {reportType === "inventory-valuation" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-left py-2">SKU</th>
                          <th className="text-left py-2">Category</th>
                          <th className="text-right py-2">Quantity</th>
                          <th className="text-right py-2">Cost Price</th>
                          <th className="text-right py-2">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Steel Beams (10m)</td>
                          <td className="py-2">SB-10M</td>
                          <td className="py-2">Construction Materials</td>
                          <td className="text-right py-2">5</td>
                          <td className="text-right py-2">$120.00</td>
                          <td className="text-right py-2">$600.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Electrical Wiring (100m)</td>
                          <td className="py-2">EW-100M</td>
                          <td className="py-2">Electrical</td>
                          <td className="text-right py-2">3</td>
                          <td className="text-right py-2">$45.00</td>
                          <td className="text-right py-2">$135.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Concrete Mix (50kg)</td>
                          <td className="py-2">CM-50KG</td>
                          <td className="py-2">Construction Materials</td>
                          <td className="text-right py-2">8</td>
                          <td className="text-right py-2">$15.00</td>
                          <td className="text-right py-2">$120.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Safety Helmets</td>
                          <td className="py-2">SH-001</td>
                          <td className="py-2">Safety Equipment</td>
                          <td className="text-right py-2">4</td>
                          <td className="text-right py-2">$12.00</td>
                          <td className="text-right py-2">$48.00</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Plywood Sheets (4x8)</td>
                          <td className="py-2">PL-001</td>
                          <td className="py-2">Construction Materials</td>
                          <td className="text-right py-2">30</td>
                          <td className="text-right py-2">$25.00</td>
                          <td className="text-right py-2">$750.00</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="font-bold">
                          <td colSpan={5} className="text-right py-2">
                            Total Inventory Value:
                          </td>
                          <td className="text-right py-2">$1,653.00</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {reportType === "reorder-report" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Item</th>
                          <th className="text-left py-2">SKU</th>
                          <th className="text-right py-2">Current Qty</th>
                          <th className="text-right py-2">Reorder Level</th>
                          <th className="text-center py-2">Status</th>
                          <th className="text-right py-2">Suggested Order</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Steel Beams (10m)</td>
                          <td className="py-2">SB-10M</td>
                          <td className="text-right py-2">5</td>
                          <td className="text-right py-2">20</td>
                          <td className="text-center py-2">
                            <Badge variant="destructive">Low Stock</Badge>
                          </td>
                          <td className="text-right py-2">15</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Electrical Wiring (100m)</td>
                          <td className="py-2">EW-100M</td>
                          <td className="text-right py-2">3</td>
                          <td className="text-right py-2">15</td>
                          <td className="text-center py-2">
                            <Badge variant="destructive">Low Stock</Badge>
                          </td>
                          <td className="text-right py-2">12</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Concrete Mix (50kg)</td>
                          <td className="py-2">CM-50KG</td>
                          <td className="text-right py-2">8</td>
                          <td className="text-right py-2">30</td>
                          <td className="text-center py-2">
                            <Badge variant="destructive">Low Stock</Badge>
                          </td>
                          <td className="text-right py-2">22</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Safety Helmets</td>
                          <td className="py-2">SH-001</td>
                          <td className="text-right py-2">4</td>
                          <td className="text-right py-2">25</td>
                          <td className="text-center py-2">
                            <Badge variant="destructive">Low Stock</Badge>
                          </td>
                          <td className="text-right py-2">21</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Plywood Sheets (4x8)</td>
                          <td className="py-2">PL-001</td>
                          <td className="text-right py-2">30</td>
                          <td className="text-right py-2">20</td>
                          <td className="text-center py-2">
                            <Badge variant="success">OK</Badge>
                          </td>
                          <td className="text-right py-2">0</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {reportType !== "inventory-valuation" && reportType !== "reorder-report" && (
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="mx-auto h-12 w-12 opacity-30" />
                  <p className="mt-2">Generate a report to see the preview</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="chart" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-center space-x-4 mb-6">
                <Button variant="outline" size="sm">
                  <BarChart2 className="mr-2 h-4 w-4" />
                  Bar Chart
                </Button>
                <Button variant="outline" size="sm">
                  <PieChart className="mr-2 h-4 w-4" />
                  Pie Chart
                </Button>
              </div>
              <div className="h-80 flex items-center justify-center border rounded-md bg-muted/20">
                <div className="text-center text-muted-foreground">
                  <p>Chart visualization will appear here</p>
                  <p className="text-sm">Generate a report to see the chart</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
