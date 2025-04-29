"use client"

import { useState } from "react"
import { DataTable } from "@/components/data-table/data-table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, FileEdit, Eye, PlayCircle, PauseCircle, CheckCircle } from "lucide-react"
import { ProjectDialog } from "./project-dialog"
import { formatDate } from "@/lib/utils"

// Mock data
const projects = [
  {
    id: "PRJ-2023-001",
    name: "Website Redesign",
    customerId: "CUST-001",
    customerName: "Acme Corporation",
    startDate: "2023-05-01",
    endDate: "2023-07-15",
    status: "in-progress",
    progress: 65,
    budget: 25000,
    manager: "John Smith",
    team: ["Alice Johnson", "Bob Williams", "Carol Davis"],
  },
  {
    id: "PRJ-2023-002",
    name: "Mobile App Development",
    customerId: "CUST-002",
    customerName: "TechStart Inc",
    startDate: "2023-04-15",
    endDate: "2023-08-30",
    status: "in-progress",
    progress: 40,
    budget: 45000,
    manager: "Sarah Johnson",
    team: ["David Wilson", "Emma Brown", "Frank Miller"],
  },
  {
    id: "PRJ-2023-003",
    name: "ERP Implementation",
    customerId: "CUST-003",
    customerName: "Global Logistics Ltd",
    startDate: "2023-03-01",
    endDate: "2023-09-30",
    status: "in-progress",
    progress: 30,
    budget: 120000,
    manager: "Michael Brown",
    team: ["Grace Lee", "Henry Garcia", "Isabella Martinez", "Jack Thompson"],
  },
  {
    id: "PRJ-2023-004",
    name: "POS System Upgrade",
    customerId: "CUST-004",
    customerName: "Retail Solutions Co",
    startDate: "2023-06-01",
    endDate: "2023-07-15",
    status: "not-started",
    progress: 0,
    budget: 15000,
    manager: "Emily Davis",
    team: ["Kevin Wilson", "Laura Thomas"],
  },
  {
    id: "PRJ-2023-005",
    name: "Annual IT Maintenance",
    customerId: "CUST-001",
    customerName: "Acme Corporation",
    startDate: "2023-01-01",
    endDate: "2023-12-31",
    status: "in-progress",
    progress: 50,
    budget: 36000,
    manager: "Robert Johnson",
    team: ["Megan White", "Nathan Clark"],
  },
  {
    id: "PRJ-2023-006",
    name: "Data Migration",
    customerId: "CUST-003",
    customerName: "Global Logistics Ltd",
    startDate: "2023-05-15",
    endDate: "2023-06-30",
    status: "completed",
    progress: 100,
    budget: 18000,
    manager: "Jennifer Wilson",
    team: ["Oliver Martin", "Patricia Lewis"],
  },
]

export function ProjectList() {
  const [editingProject, setEditingProject] = useState<any>(null)
  const [dialogOpen, setDialogOpen] = useState(false)

  const handleEdit = (project: any) => {
    setEditingProject(project)
    setDialogOpen(true)
  }

  const columns = [
    {
      accessorKey: "id",
      header: "Project ID",
      cell: ({ row }: any) => <div className="font-medium">{row.getValue("id")}</div>,
    },
    {
      accessorKey: "name",
      header: "Project Name",
    },
    {
      accessorKey: "customerName",
      header: "Customer",
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      cell: ({ row }: any) => formatDate(row.getValue("startDate")),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      cell: ({ row }: any) => formatDate(row.getValue("endDate")),
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => {
        const status = row.getValue("status")

        return (
          <Badge
            variant={
              status === "completed"
                ? "success"
                : status === "in-progress"
                  ? "default"
                  : status === "on-hold"
                    ? "warning"
                    : "outline"
            }
          >
            {status === "in-progress"
              ? "In Progress"
              : status === "not-started"
                ? "Not Started"
                : status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        )
      },
    },
    {
      accessorKey: "progress",
      header: "Progress",
      cell: ({ row }: any) => {
        const progress = row.getValue("progress")

        return (
          <div className="w-full">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
        )
      },
    },
    {
      accessorKey: "manager",
      header: "Manager",
    },
    {
      id: "actions",
      cell: ({ row }: any) => {
        const project = row.original

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
              <DropdownMenuItem onClick={() => handleEdit(project)}>
                <FileEdit className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              {project.status !== "completed" && (
                <>
                  {project.status === "in-progress" ? (
                    <DropdownMenuItem>
                      <PauseCircle className="mr-2 h-4 w-4" />
                      Pause Project
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuItem>
                      <PlayCircle className="mr-2 h-4 w-4" />
                      Start Project
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Completed
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div>
      <DataTable columns={columns} data={projects} />
      {editingProject && <ProjectDialog open={dialogOpen} onOpenChange={setDialogOpen} project={editingProject} />}
    </div>
  )
}
