"use client"

import Link from "next/link"
import { ArrowRight, Clock, CheckCircle2, AlertCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

export function RecentProjects() {
  const projects = [
    {
      id: "1",
      name: "Office Renovation",
      customer: "Acme Corporation",
      status: "in-progress",
      progress: 65,
      dueDate: "2023-12-15",
    },
    {
      id: "2",
      name: "Warehouse Equipment Installation",
      customer: "Globex Industries",
      status: "on-hold",
      progress: 30,
      dueDate: "2023-11-30",
    },
    {
      id: "3",
      name: "IT Infrastructure Upgrade",
      customer: "Initech LLC",
      status: "completed",
      progress: 100,
      dueDate: "2023-10-15",
    },
    {
      id: "4",
      name: "Security System Implementation",
      customer: "Acme Corporation",
      status: "planned",
      progress: 0,
      dueDate: "2024-01-10",
    },
  ]

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Badge className="bg-blue-500 hover:bg-blue-600">In Progress</Badge>
      case "on-hold":
        return (
          <Badge variant="outline" className="text-amber-500 border-amber-500">
            On Hold
          </Badge>
        )
      case "completed":
        return <Badge className="bg-green-500 hover:bg-green-600">Completed</Badge>
      case "planned":
        return <Badge variant="outline">Planned</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "in-progress":
        return <Clock className="h-4 w-4 text-blue-500" />
      case "on-hold":
        return <AlertCircle className="h-4 w-4 text-amber-500" />
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />
      case "planned":
        return <Clock className="h-4 w-4 text-gray-500" />
      default:
        return null
    }
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Recent Projects</CardTitle>
        <CardDescription>Overview of your latest projects</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="flex items-center justify-between space-x-4">
            <div className="flex items-start space-x-4">
              <div className="pt-1">{getStatusIcon(project.status)}</div>
              <div>
                <p className="text-sm font-medium leading-none">{project.name}</p>
                <p className="text-sm text-muted-foreground">{project.customer}</p>
                <div className="mt-1 flex items-center">
                  {getStatusBadge(project.status)}
                  <span className="ml-2 text-xs text-muted-foreground">
                    Due: {new Date(project.dueDate).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex h-2 w-24 overflow-hidden rounded-full bg-muted">
              <div
                className={`flex h-full ${
                  project.status === "completed"
                    ? "bg-green-500"
                    : project.status === "on-hold"
                      ? "bg-amber-500"
                      : "bg-blue-500"
                }`}
                style={{ width: `${project.progress}%` }}
              />
            </div>
          </div>
        ))}
      </CardContent>
      <CardFooter>
        <Button variant="ghost" className="w-full" asChild>
          <Link href="/projects">
            View all projects
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
