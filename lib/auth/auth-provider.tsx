"use client"

import type React from "react"

import { createContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import type { User } from "@/lib/types"
import { apiClient } from "@/lib/api-client"
import { useToast } from "@/components/ui/use-toast"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  register: (userData: any) => Promise<void>
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => {},
  logout: () => {},
  register: async () => {},
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()
  const { toast } = useToast()

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token")
        if (!token) {
          setIsLoading(false)
          if (pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
            router.push("/login")
          }
          return
        }

        // Instead of making an API call, create a mock user
        const mockUser = {
          id: "1",
          name: "Mock User",
          email: "user@example.com",
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
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }

        setUser(mockUser)

        if (pathname === "/login" || pathname === "/register") {
          router.push("/")
        }
      } catch (error) {
        localStorage.removeItem("token")
        if (pathname !== "/login" && pathname !== "/register" && pathname !== "/forgot-password") {
          router.push("/login")
        }
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [pathname, router])

  // Replace the login function with this mock implementation
  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true)

      // Mock authentication - in a real app, this would be an API call
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Simple validation
      if (!email || !password) {
        throw new Error("Email and password are required")
      }

      // Create a mock token and user
      const mockToken = "mock-jwt-token-" + Math.random().toString(36).substring(2)
      const mockUser = {
        id: "1",
        name: email.split("@")[0], // Use part of email as name
        email,
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
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      // Store token and user in state and localStorage
      localStorage.setItem("token", mockToken)
      setUser(mockUser)

      router.push("/")
      toast({
        title: "Login successful",
        description: "Welcome back!",
      })
    } catch (error: any) {
      toast({
        title: "Login failed",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem("token")
    setUser(null)
    router.push("/login")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    })
  }

  const register = async (userData: any) => {
    try {
      setIsLoading(true)
      const response = await apiClient.post("/auth/register", userData)
      localStorage.setItem("token", response.data.token)
      setUser(response.data.user)
      router.push("/")
      toast({
        title: "Registration successful",
        description: "Your account has been created",
      })
    } catch (error: any) {
      toast({
        title: "Registration failed",
        description: error.response?.data?.message || "An error occurred during registration",
        variant: "destructive",
      })
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}
