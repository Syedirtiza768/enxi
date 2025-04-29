"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Clock } from "lucide-react"

// Mock data
const tasks = [
  {
    id: "TASK-001",
    title: "Design Homepage Mockup",
    description: "Create wireframes and mockups for the new homepage design",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Alice Johnson",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-10",
  },
  {
    id: "TASK-002",
    title: "Implement User Authentication",
    description: "Set up user login and registration functionality",
    status: "in-progress",
    priority: "high",
    assignee: {
      name: "Bob Williams",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-15",
  },
  {
    id: "TASK-003",
    title: "Database Schema Design",
    description: "Design the database schema for the new features",
    status: "in-progress",
    priority: "high",
    assignee: {
      name: "Carol Davis",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-12",
  },
  {
    id: "TASK-004",
    title: "API Integration",
    description: "Integrate with third-party payment API",
    status: "in-progress",
    priority: "medium",
    assignee: {
      name: "David Wilson",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-20",
  },
  {
    id: "TASK-005",
    title: "Unit Testing",
    description: "Write unit tests for core functionality",
    status: "todo",
    priority: "medium",
    assignee: {
      name: "Emma Brown",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-25",
  },
  {
    id: "TASK-006",
    title: "Responsive Design",
    description: "Ensure the application works on all device sizes",
    status: "todo",
    priority: "low",
    assignee: {
      name: "Frank Miller",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-30",
  },
  {
    id: "TASK-007",
    title: "Performance Optimization",
    description: "Optimize loading times and resource usage",
    status: "done",
    priority: "high",
    assignee: {
      name: "Grace Lee",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-05",
  },
  {
    id: "TASK-008",
    title: "Deployment Setup",
    description: "Configure CI/CD pipeline for automated deployments",
    status: "done",
    priority: "medium",
    assignee: {
      name: "Henry Garcia",
      avatar: "/mystical-forest-spirit.png",
    },
    dueDate: "2023-07-08",
  },
]

export function ProjectKanban() {
  const [taskList, setTaskList] = useState(tasks)

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "done", title: "Done" },
  ]

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {columns.map((column) => (
        <div key={column.id} className="flex flex-col">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="font-medium">{column.title}</h3>
            <Badge variant="outline">{taskList.filter((task) => task.status === column.id).length}</Badge>
          </div>
          <div className="flex flex-col gap-3">
            {taskList
              .filter((task) => task.status === column.id)
              .map((task) => (
                <Card key={task.id} className="shadow-sm">
                  <CardHeader className="p-3 pb-0">
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-sm font-medium">{task.title}</CardTitle>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3">
                    <p className="text-xs text-muted-foreground mb-3">{task.description}</p>
                    <div className="flex items-center justify-between">
                      <Badge variant={getPriorityColor(task.priority) as any}>{task.priority}</Badge>
                      <div className="flex items-center">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assignee.avatar || "/placeholder.svg"} alt={task.assignee.name} />
                          <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      </div>
                    </div>
                    <div className="flex items-center text-xs text-muted-foreground mt-3">
                      <Clock className="h-3 w-3 mr-1" />
                      <span>Due {new Date(task.dueDate).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}
