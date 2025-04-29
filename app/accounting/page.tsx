import { AccountingDashboard } from "@/components/accounting/accounting-dashboard"

export default function AccountingPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Accounting</h1>
      </div>
      <AccountingDashboard />
    </div>
  )
}
