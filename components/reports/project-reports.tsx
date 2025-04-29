"use client"

import { useState } from "react"
import { FileText, Download, BarChart2, PieChart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"

export function ProjectReports() {
  const [reportType, setReportType] = useState("project-profitability")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
    to: new Date(),
  })
  const [period, setPeriod] = useState("current-year")
  const [projectManager, setProjectManager] = useState("all")

  const handlePeriodChange = (value: string) => {
    setPeriod(value)
    const now = new Date()

    switch (value) {
      case "current-month":
        setDateRange({
          from: new Date(now.getFullYear(), now.getMonth(), 1),
          to: now,
        })
        break
      case "current-quarter":
        const quarter = Math.floor(now.getMonth() / 3)
        setDateRange({
          from: new Date(now.getFullYear(), quarter * 3, 1),
          to: now,
        })
        break
      case "current-year":
        setDateRange({
          from: new Date(now.getFullYear(), 0, 1),
          to: now,
        })
        break
      case "last-month":
        const lastMonth = now.getMonth() - 1
        const year = lastMonth < 0 ? now.getFullYear() - 1 : now.getFullYear()
        const month = lastMonth < 0 ? 11 : lastMonth
        setDateRange({
          from: new Date(year, month, 1),
          to: new Date(year, month + 1, 0),
        })
        break
      case "last-quarter":
        const lastQuarter = Math.floor((now.getMonth() - 3) / 3)
        const yearLQ = lastQuarter < 0 ? now.getFullYear() - 1 : now.getFullYear()
        const quarterLQ = lastQuarter < 0 ? 3 + lastQuarter : lastQuarter
        setDateRange({
          from: new Date(yearLQ, quarterLQ * 3, 1),
          to: new Date(yearLQ, (quarterLQ + 1) * 3, 0),
        })
        break
      case "last-year":
        setDateRange({
          from: new Date(now.getFullYear() - 1, 0, 1),
          to: new Date(now.getFullYear() - 1, 11, 31),
        })
        break
      case "custom":
        // Keep the current date range
        break
    }
  }

  const generateReport = () => {
    // In a real app, this would call an API to generate the report
    console.log("Generating report:", {
      type: reportType,
      dateRange,
      projectManager,
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
              <SelectItem value="project-profitability">Project Profitability</SelectItem>
              <SelectItem value="project-status">Project Status</SelectItem>
              <SelectItem value="time-tracking">Time Tracking</SelectItem>
              <SelectItem value="resource-allocation">Resource Allocation</SelectItem>
              <SelectItem value="budget-variance">Budget Variance</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Period</label>
          <Select value={period} onValueChange={handlePeriodChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current-month">Current Month</SelectItem>
              <SelectItem value="current-quarter">Current Quarter</SelectItem>
              <SelectItem value="current-year">Current Year</SelectItem>
              <SelectItem value="last-month">Last Month</SelectItem>
              <SelectItem value="last-quarter">Last Quarter</SelectItem>
              <SelectItem value="last-year">Last Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Project Manager</label>
          <Select value={projectManager} onValueChange={setProjectManager}>
            <SelectTrigger>
              <SelectValue placeholder="Select project manager" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Managers</SelectItem>
              <SelectItem value="john-smith">John Smith</SelectItem>
              <SelectItem value="sarah-johnson">Sarah Johnson</SelectItem>
              <SelectItem value="michael-brown">Michael Brown</SelectItem>
              <SelectItem value="emily-davis">Emily Davis</SelectItem>
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
                  {reportType === "project-profitability" && "Project Profitability"}
                  {reportType === "project-status" && "Project Status"}
                  {reportType === "time-tracking" && "Time Tracking"}
                  {reportType === "resource-allocation" && "Resource Allocation"}
                  {reportType === "budget-variance" && "Budget Variance"}
                </h2>
                <p className="text-muted-foreground">
                  {format(dateRange.from, "MMMM d, yyyy")} - {format(dateRange.to, "MMMM d, yyyy")} |{" "}
                  {projectManager === "all" ? "All Project Managers" : projectManager.replace(/-/g, " ")}
                </p>
              </div>

              {reportType === "project-profitability" && (
                <div className="space-y-4">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Project</th>
                          <th className="text-left py-2">Customer</th>
                          <th className="text-right py-2">Budget</th>
                          <th className="text-right py-2">Actual Cost</th>
                          <th className="text-right py-2">Revenue</th>
                          <th className="text-right py-2">Profit</th>
                          <th className="text-right py-2">Margin %</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">Website Redesign</td>
                          <td className="py-2">Acme Corporation</td>
                          <td className="text-right py-2">$25,000.00</td>
                          <td className="text-right py-2">$22,500.00</td>
                          <td className="text-right py-2">$30,000.00</td>
                          <td className="text-right py-2">$7,500.00</td>
                          <td className="text-right py-2">25.0%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Mobile App Development</td>
                          <td className="py-2">TechStart Inc</td>
                          <td className="text-right py-2">$45,000.00</td>
                          <td className="text-right py-2">$48,000.00</td>
                          <td className="text-right py-2">$55,000.00</td>
                          <td className="text-right py-2">$7,000.00</td>
                          <td className="text-right py-2">12.7%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">ERP Implementation</td>
                          <td className="py-2">Global Logistics Ltd</td>
                          <td className="text-right py-2">$120,000.00</td>
                          <td className="text-right py-2">$105,000.00</td>
                          <td className="text-right py-2">$150,000.00</td>
                          <td className="text-right py-2">$45,000.00</td>
                          <td className="text-right py-2">30.0%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">POS System Upgrade</td>
                          <td className="py-2">Retail Solutions Co</td>
                          <td className="text-right py-2">$15,000.00</td>
                          <td className="text-right py-2">$14,500.00</td>
                          <td className="text-right py-2">$18,000.00</td>
                          <td className="text-right py-2">$3,500.00</td>
                          <td className="text-right py-2">19.4%</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">Annual IT Maintenance</td>
                          <td className="py-2">Acme Corporation</td>
                          <td className="text-right py-2">$36,000.00</td>
                          <td className="text-right py-2">$32,000.00</td>
                          <td className="text-right py-2">$42,000.00</td>
                          <td className="text-right py-2">$10,000.00</td>
                          <td className="text-right py-2">23.8%</td>
                        </tr>
                      </tbody>
                      <tfoot>
                        <tr className="font-bold">
                          <td colSpan={2} className="text-right py-2">
                            Totals:
                          </td>
                          <td className="text-right py-2">$241,000.00</td>
                          <td className="text-right py-2">$222,000.00</td>
                          <td className="text-right py-2">$295,000.00</td>
                          <td className="text-right py-2">$73,000.00</td>
                          <td className="text-right py-2">24.7%</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>
                </div>
              )}

              {reportType !== "project-profitability" && (
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
