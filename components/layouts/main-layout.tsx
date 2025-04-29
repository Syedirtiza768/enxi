"use client"

import type React from "react"

import { useState } from "react"
import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/layouts/sidebar"
import { Header } from "@/components/layouts/header"
import { useAuth } from "@/lib/auth/use-auth"

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()
  const { user, isLoading } = useAuth()

  // If path is login or register, don't show the layout
  if (pathname === "/login" || pathname === "/register" || pathname === "/forgot-password") {
    return <>{children}</>
  }

  // If user is not authenticated and not loading, redirect to login
  if (!user && !isLoading && pathname !== "/login") {
    return <div className="flex items-center justify-center h-screen">Redirecting to login...</div>
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        <main className="flex-1 overflow-y-auto bg-muted/20">{children}</main>
      </div>
    </div>
  )
}
