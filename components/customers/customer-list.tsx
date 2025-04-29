"use client"

import { useState } from "react"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, Building } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTable } from "@/components/data-table/data-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import type { Customer } from "@/lib/types"
import { CustomerDialog } from "@/components/customers/customer-dialog"
import { useToast } from "@/components/ui/use-toast"

// This would normally come from an API call
const mockCustomers: Customer[] = [
  {
    id: "1",
    name: "Acme Corporation",
    contactPerson: "John Smith",
    email: "john@acme.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main St",
    city: "New York",
    state: "NY",
    country: "USA",
    postalCode: "10001",
    taxId: "TAX123456",
    notes: "Important client",
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Globex Industries",
    contactPerson: "Jane Doe",
    email: "jane@globex.com",
    phone: "+1 (555) 987-6543",
    address: "456 Park Ave",
    city: "Los Angeles",
    state: "CA",
    country: "USA",
    postalCode: "90001",
    taxId: "TAX789012",
    notes: "New client",
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Initech LLC",
    contactPerson: "Michael Johnson",
    email: "michael@initech.com",
    phone: "+1 (555) 456-7890",
    address: "789 Broadway",
    city: "Chicago",
    state: "IL",
    country: "USA",
    postalCode: "60007",
    taxId: "TAX345678",
    notes: "",
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
]

export function CustomerList() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null)
  const { toast } = useToast()

  const handleEdit = (customer: Customer) => {
    setSelectedCustomer(customer)
    setIsDialogOpen(true)
  }

  const handleDelete = async (customerId: string) => {
    try {
      // In a real app, this would be an API call
      // await apiClient.delete(`/customers/${customerId}`)
      setCustomers(customers.filter((customer) => customer.id !== customerId))
      toast({
        title: "Customer deleted",
        description: "The customer has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete customer",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (customerData: Partial<Customer>) => {
    try {
      if (selectedCustomer) {
        // Update existing customer
        // In a real app, this would be an API call
        // const response = await apiClient.put(`/customers/${selectedCustomer.id}`, customerData)
        const updatedCustomer = { ...selectedCustomer, ...customerData, updatedAt: new Date().toISOString() }
        setCustomers(customers.map((customer) => (customer.id === selectedCustomer.id ? updatedCustomer : customer)))
        toast({
          title: "Customer updated",
          description: "The customer has been successfully updated",
        })
      } else {
        // Create new customer
        // In a real app, this would be an API call
        // const response = await apiClient.post('/customers', customerData)
        const newCustomer: Customer = {
          id: Math.random().toString(36).substring(7),
          name: customerData.name || "",
          contactPerson: customerData.contactPerson || "",
          email: customerData.email || "",
          phone: customerData.phone || "",
          address: customerData.address || "",
          city: customerData.city || "",
          state: customerData.state || "",
          country: customerData.country || "",
          postalCode: customerData.postalCode || "",
          taxId: customerData.taxId || "",
          notes: customerData.notes || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setCustomers([...customers, newCustomer])
        toast({
          title: "Customer created",
          description: "The customer has been successfully created",
        })
      }
      setIsDialogOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save customer",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "name",
      header: "Company Name",
    },
    {
      accessorKey: "contactPerson",
      header: "Contact Person",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "phone",
      header: "Phone",
    },
    {
      accessorKey: "city",
      header: "City",
    },
    {
      accessorKey: "country",
      header: "Country",
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleEdit(customer)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(customer.id)} className="text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button
          onClick={() => {
            setSelectedCustomer(null)
            setIsDialogOpen(true)
          }}
        >
          <Building className="mr-2 h-4 w-4" />
          Add Customer
        </Button>
      </div>
      <DataTable columns={columns} data={customers} searchColumn="name" searchPlaceholder="Search customers..." />
      <CustomerDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        customer={selectedCustomer}
        onSave={handleSave}
      />
    </div>
  )
}
