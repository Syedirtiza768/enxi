"use client"

import { useState } from "react"
import { FileText, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"

export function FinancialReports() {
  const [reportType, setReportType] = useState("trial-balance")
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

  // This function is no longer needed since we're handling date changes directly
  // in the Calendar component's onSelect prop
  // Removing handleDateRangeChange function

  const generateReport = () => {
    // In a real app, this would call an API to generate the report
    console.log("Generating report:", {
      type: reportType,
      dateRange,
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Financial Reports</CardTitle>
        <CardDescription>Generate and view financial reports</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select report type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="trial-balance">Trial Balance</SelectItem>
                  <SelectItem value="profit-loss">Profit & Loss</SelectItem>
                  <SelectItem value="balance-sheet">Balance Sheet</SelectItem>
                  <SelectItem value="cash-flow">Cash Flow Statement</SelectItem>
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
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preview">Preview</TabsTrigger>
              <TabsTrigger value="history">Report History</TabsTrigger>
            </TabsList>
            <TabsContent value="preview" className="mt-4">
              <div className="border rounded-md p-6">
                <div className="text-center mb-6">
                  <h2 className="text-2xl font-bold">
                    {reportType === "trial-balance" && "Trial Balance"}
                    {reportType === "profit-loss" && "Profit & Loss Statement"}
                    {reportType === "balance-sheet" && "Balance Sheet"}
                    {reportType === "cash-flow" && "Cash Flow Statement"}
                  </h2>
                  <p className="text-muted-foreground">
                    {format(dateRange.from, "MMMM d, yyyy")} - {format(dateRange.to, "MMMM d, yyyy")}
                  </p>
                </div>
                <div className="text-center text-muted-foreground py-12">
                  <FileText className="mx-auto h-12 w-12 opacity-30" />
                  <p className="mt-2">Generate a report to see the preview</p>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="history" className="mt-4">
              <div className="border rounded-md p-6">
                <div className="text-center text-muted-foreground py-12">
                  <p>No recent reports found</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  )
}
