"use client"

import { useState } from "react"
import { FileText, Download, BarChart2, PieChart, TrendingUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function FinancialReports() {
  const [reportType, setReportType] = useState("profit-loss")
  const [dateRange, setDateRange] = useState({
    from: new Date(new Date().getFullYear(), 0, 1), // January 1st of current year
    to: new Date(),
  })
  const [period, setPeriod] = useState("current-year")

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
              <SelectItem value="profit-loss">Profit & Loss</SelectItem>
              <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
              <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
              <SelectItem value="income-by-customer">Income by Customer</SelectItem>
              <SelectItem value="expense-by-category">Expense by Category</SelectItem>
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
          <label className="block text-sm font-medium mb-1">Date Range</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <span>{format(dateRange.from, "PPP")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.from}
                    onSelect={(date) => date && setDateRange({ ...dateRange, from: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <span>{format(dateRange.to, "PPP")}</span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dateRange.to}
                    onSelect={(date) => date && setDateRange({ ...dateRange, to: date })}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="chart">Chart</TabsTrigger>
          <TabsTrigger value="history">Report History</TabsTrigger>
        </TabsList>
        <TabsContent value="preview" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {reportType === "profit-loss" && "Profit & Loss Statement"}
                  {reportType === "balance-sheet" && "Balance Sheet"}
                  {reportType === "cash-flow" && "Cash Flow Statement"}
                  {reportType === "income-by-customer" && "Income by Customer"}
                  {reportType === "expense-by-category" && "Expense by Category"}
                </h2>
                <p className="text-muted-foreground">
                  {format(dateRange.from, "MMMM d, yyyy")} - {format(dateRange.to, "MMMM d, yyyy")}
                </p>
              </div>

              {reportType === "profit-loss" && (
                <div className="space-y-4">
                  <div className="border-b pb-2">
                    <h3 className="text-lg font-semibold">Income</h3>
                    <div className="grid grid-cols-2 py-1">
                      <span>Service Revenue</span>
                      <span className="text-right">$125,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <span>Product Sales</span>
                      <span className="text-right">$75,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 font-medium">
                      <span>Total Income</span>
                      <span className="text-right">$200,000.00</span>
                    </div>
                  </div>

                  <div className="border-b pb-2">
                    <h3 className="text-lg font-semibold">Expenses</h3>
                    <div className="grid grid-cols-2 py-1">
                      <span>Salaries & Wages</span>
                      <span className="text-right">$85,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <span>Rent & Utilities</span>
                      <span className="text-right">$12,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <span>Materials & Supplies</span>
                      <span className="text-right">$35,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <span>Marketing & Advertising</span>
                      <span className="text-right">$8,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1">
                      <span>Other Expenses</span>
                      <span className="text-right">$10,000.00</span>
                    </div>
                    <div className="grid grid-cols-2 py-1 font-medium">
                      <span>Total Expenses</span>
                      <span className="text-right">$150,000.00</span>
                    </div>
                  </div>

                  <div className="pt-2">
                    <div className="grid grid-cols-2 py-1 text-lg font-bold">
                      <span>Net Profit</span>
                      <span className="text-right">$50,000.00</span>
                    </div>
                  </div>
                </div>
              )}

              {reportType !== "profit-loss" && (
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
                <Button variant="outline" size="sm">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  Line Chart
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
        <TabsContent value="history" className="mt-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-muted-foreground py-12">
                <p>No recent reports found</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
