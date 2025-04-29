import { CustomerList } from "@/components/customers/customer-list"

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Customer Management</h1>
      </div>
      <CustomerList />
    </div>
  )
}
