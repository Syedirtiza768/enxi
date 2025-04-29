"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Users, Building2, BarChart3, Package, FileText, Briefcase, Truck, LineChart, X, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAuth } from "@/lib/auth/use-auth"

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user } = useAuth()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return null
  }

  const navigation = [
    { name: "Dashboard", href: "/", icon: Home },
    { name: "User Management", href: "/users", icon: Users, module: "user-management" },
    { name: "Customers", href: "/customers", icon: Building2, module: "customer-management" },
    { name: "Accounting", href: "/accounting", icon: BarChart3, module: "accounting" },
    { name: "Inventory", href: "/inventory", icon: Package, module: "inventory" },
    { name: "Quotations", href: "/quotations", icon: FileText, module: "quotation" },
    { name: "Projects", href: "/projects", icon: Briefcase, module: "project" },
    { name: "Delivery & Invoicing", href: "/delivery-invoicing", icon: Truck, module: "delivery-invoicing" },
    { name: "Reports", href: "/reports", icon: LineChart, module: "reporting" },
  ]

  // Filter navigation based on user permissions
  const filteredNavigation = navigation.filter((item) => {
    if (!item.module) return true
    if (!user?.permissions) return false
    return user.permissions.includes(item.module)
  })

  return (
    <>
      {/* Mobile backdrop */}
      {open && <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden" onClick={onClose} />}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background shadow-lg transform transition-transform duration-200 ease-in-out md:translate-x-0 md:static md:z-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-4 border-b">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">ERP System</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <ScrollArea className="h-[calc(100vh-4rem)]">
          <div className="px-3 py-2">
            <nav className="space-y-1">
              {filteredNavigation.map((item) => {
                const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md",
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                    onClick={() => {
                      if (window.innerWidth < 768) {
                        onClose()
                      }
                    }}
                  >
                    <item.icon className={cn("mr-3 h-5 w-5")} />
                    {item.name}
                  </Link>
                )
              })}
            </nav>
          </div>
        </ScrollArea>
      </div>
    </>
  )
}
