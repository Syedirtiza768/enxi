"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal, Pencil, Trash2, UserPlus } from "lucide-react"
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
import { Badge } from "@/components/ui/badge"
import type { User } from "@/lib/types"
import { UserDialog } from "@/components/users/user-dialog"
import { useToast } from "@/components/ui/use-toast"

// This would normally come from an API call
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    permissions: [
      "user-management",
      "customer-management",
      "accounting",
      "inventory",
      "quotation",
      "project",
      "delivery-invoicing",
      "reporting",
    ],
    createdAt: "2023-01-01T00:00:00.000Z",
    updatedAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Project Manager",
    permissions: ["customer-management", "quotation", "project", "delivery-invoicing"],
    createdAt: "2023-01-02T00:00:00.000Z",
    updatedAt: "2023-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Accountant",
    permissions: ["accounting", "reporting"],
    createdAt: "2023-01-03T00:00:00.000Z",
    updatedAt: "2023-01-03T00:00:00.000Z",
  },
]

export function UserList() {
  const [users, setUsers] = useState<User[]>(mockUsers)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  const handleEdit = (user: User) => {
    setSelectedUser(user)
    setIsDialogOpen(true)
  }

  const handleDelete = async (userId: string) => {
    try {
      // In a real app, this would be an API call
      // await apiClient.delete(`/users/${userId}`)
      setUsers(users.filter((user) => user.id !== userId))
      toast({
        title: "User deleted",
        description: "The user has been successfully deleted",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      })
    }
  }

  const handleSave = async (userData: Partial<User>) => {
    try {
      if (selectedUser) {
        // Update existing user
        // In a real app, this would be an API call
        // const response = await apiClient.put(`/users/${selectedUser.id}`, userData)
        const updatedUser = { ...selectedUser, ...userData, updatedAt: new Date().toISOString() }
        setUsers(users.map((user) => (user.id === selectedUser.id ? updatedUser : user)))
        toast({
          title: "User updated",
          description: "The user has been successfully updated",
        })
      } else {
        // Create new user
        // In a real app, this would be an API call
        // const response = await apiClient.post('/users', userData)
        const newUser: User = {
          id: Math.random().toString(36).substring(7),
          name: userData.name || "",
          email: userData.email || "",
          role: userData.role || "",
          permissions: userData.permissions || [],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }
        setUsers([...users, newUser])
        toast({
          title: "User created",
          description: "The user has been successfully created",
        })
      }
      setIsDialogOpen(false)
      setSelectedUser(null)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save user",
        variant: "destructive",
      })
    }
  }

  const columns: ColumnDef<User>[] = [
    {
      accessorKey: "name",
      header: "Name",
    },
    {
      accessorKey: "email",
      header: "Email",
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const role = row.getValue("role") as string
        return <Badge variant="outline">{role}</Badge>
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = new Date(row.getValue("createdAt") as string)
        return <span>{date.toLocaleDateString()}</span>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original
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
              <DropdownMenuItem onClick={() => handleEdit(user)}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => handleDelete(user.id)} className="text-destructive">
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
            setSelectedUser(null)
            setIsDialogOpen(true)
          }}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <DataTable columns={columns} data={users} searchColumn="name" searchPlaceholder="Search users..." />
      <UserDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} user={selectedUser} onSave={handleSave} />
    </div>
  )
}
