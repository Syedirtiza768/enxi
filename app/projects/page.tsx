import type { Metadata } from "next"
import { ProjectDashboard } from "@/components/projects/project-dashboard"

export const metadata: Metadata = {
  title: "Projects | ERP System",
  description: "Manage and track all your projects",
}

export default function ProjectsPage() {
  return <ProjectDashboard />
}
