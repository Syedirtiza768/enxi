"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartOfAccounts } from "@/components/accounting/chart-of-accounts"
import { JournalEntries } from "@/components/accounting/journal-entries"
import { FinancialReports } from "@/components/accounting/financial-reports"
import { CurrencySettings } from "@/components/accounting/currency-settings"

export function AccountingDashboard() {
  const [activeTab, setActiveTab] = useState("chart-of-accounts")

  return (
    <Tabs defaultValue="chart-of-accounts" value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="chart-of-accounts">Chart of Accounts</TabsTrigger>
        <TabsTrigger value="journal-entries">General Ledger</TabsTrigger>
        <TabsTrigger value="financial-reports">Financial Reports</TabsTrigger>
        <TabsTrigger value="currency-settings">Currency Settings</TabsTrigger>
      </TabsList>
      <TabsContent value="chart-of-accounts" className="mt-6">
        <ChartOfAccounts />
      </TabsContent>
      <TabsContent value="journal-entries" className="mt-6">
        <JournalEntries />
      </TabsContent>
      <TabsContent value="financial-reports" className="mt-6">
        <FinancialReports />
      </TabsContent>
      <TabsContent value="currency-settings" className="mt-6">
        <CurrencySettings />
      </TabsContent>
    </Tabs>
  )
}
