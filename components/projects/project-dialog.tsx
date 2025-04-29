"use client"

import { Badge } from "@/components/ui/badge"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { CalendarIcon, Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Textarea } from "@/components/ui/textarea"

// Mock data
const customers = [
  { id: "CUST-001", name: "Acme Corporation" },
  { id: "CUST-002", name: "TechStart Inc" },
  { id: "CUST-003", name: "Global Logistics Ltd" },
  { id: "CUST-004", name: "Retail Solutions Co" },
]

const users = [
  { id: "USER-001", name: "John Smith" },
  { id: "USER-002", name: "Sarah Johnson" },
  { id: "USER-003", name: "Michael Brown" },
  { id: "USER-004", name: "Emily Davis" },
  { id: "USER-005", name: "Robert Johnson" },
  { id: "USER-006", name: "Jennifer Wilson" },
  { id: "USER-007", name: "Alice Johnson" },
  { id: "USER-008", name: "Bob Williams" },
  { id: "USER-009", name: "Carol Davis" },
  { id: "USER-010", name: "David Wilson" },
  { id: "USER-011", name: "Emma Brown" },
  { id: "USER-012", name: "Frank Miller" },
]

interface ProjectDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: any
}

export function ProjectDialog({ open, onOpenChange, project }: ProjectDialogProps) {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    customerId: "",
    startDate: new Date(),
    endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
    status: "not-started",
    progress: 0,
    budget: 0,
    manager: "",
    team: [] as string[],
    description: "",
  })

  useEffect(() => {
    if (project) {
      setFormData({
        ...project,
        startDate: new Date(project.startDate),
        endDate: new Date(project.endDate),
      })
    } else {
      // Reset form for new project
      setFormData({
        id: `PRJ-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 1000)).padStart(3, "0")}`,
        name: "",
        customerId: "",
        startDate: new Date(),
        endDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        status: "not-started",
        progress: 0,
        budget: 0,
        manager: "",
        team: [],
        description: "",
      })
    }
  }, [project, open])

  const handleCustomerChange = (value: string) => {
    setFormData({ ...formData, customerId: value })
  }

  const handleStartDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, startDate: date })
    }
  }

  const handleEndDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, endDate: date })
    }
  }

  const handleStatusChange = (value: string) => {
    let progress = formData.progress

    if (value === "completed") {
      progress = 100
    } else if (value === "not-started") {
      progress = 0
    }

    setFormData({ ...formData, status: value, progress })
  }

  const handleManagerChange = (value: string) => {
    setFormData({ ...formData, manager: value })
  }

  const handleTeamMemberAdd = (value: string) => {
    const user = users.find((u) => u.id === value)
    if (user && !formData.team.includes(user.name)) {
      setFormData({ ...formData, team: [...formData.team, user.name] })
    }
  }

  const handleTeamMemberRemove = (member: string) => {
    setFormData({ ...formData, team: formData.team.filter((m) => m !== member) })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the data to your API
    console.log("Submitting project:", formData)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{project ? "Edit Project" : "Create New Project"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="projectId">Project ID</Label>
                <Input
                  id="projectId"
                  value={formData.id}
                  onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                  disabled={!!project}
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter project name"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customer">Customer</Label>
                <Select value={formData.customerId} onValueChange={handleCustomerChange}>
                  <SelectTrigger id="customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="not-started">Not Started</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="on-hold">On Hold</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Start Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.startDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.startDate ? format(formData.startDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.startDate}
                      onSelect={handleStartDateChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div>
                <Label>End Date</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.endDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.endDate ? format(formData.endDate, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar mode="single" selected={formData.endDate} onSelect={handleEndDateChange} initialFocus />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="budget">Budget ($)</Label>
                <Input
                  id="budget"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: Number.parseFloat(e.target.value) || 0 })}
                  placeholder="Enter project budget"
                />
              </div>
              <div>
                <Label htmlFor="progress">Progress (%)</Label>
                <Input
                  id="progress"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.progress}
                  onChange={(e) => setFormData({ ...formData, progress: Number.parseInt(e.target.value) || 0 })}
                  placeholder="Enter project progress"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter project description"
                rows={3}
              />
            </div>

            <div>
              <Label htmlFor="manager">Project Manager</Label>
              <Select value={formData.manager} onValueChange={handleManagerChange}>
                <SelectTrigger id="manager">
                  <SelectValue placeholder="Select project manager" />
                </SelectTrigger>
                <SelectContent>
                  {users
                    .filter((u) =>
                      ["USER-001", "USER-002", "USER-003", "USER-004", "USER-005", "USER-006"].includes(u.id),
                    )
                    .map((user) => (
                      <SelectItem key={user.id} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Team Members</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {formData.team.map((member) => (
                  <Badge key={member} variant="secondary" className="flex items-center gap-1">
                    {member}
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-4 w-4 p-0 hover:bg-transparent"
                      onClick={() => handleTeamMemberRemove(member)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Select onValueChange={handleTeamMemberAdd}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Add team member" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.map((user) => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button type="button" size="icon" variant="outline">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit">{project ? "Update Project" : "Create Project"}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
