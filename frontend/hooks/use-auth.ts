"use client"

import { useState, useEffect } from "react"

interface User {
  firstName: string
  lastName: string
  email: string
}

interface AuthContextType {
  isAuthenticated: boolean
  user: User | null
  signIn: (email: string, password: string) => void
  signOut: () => void
}

export function useAuth(): AuthContextType {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    // Simulate checking for a user session (e.g., from a cookie or localStorage)
    const storedUser = localStorage.getItem("intellplan_user")
    if (storedUser) {
      try {
        const parsedUser: User = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsAuthenticated(true)
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
        setIsAuthenticated(false)
        setUser(null)
      }
    }
  }, [])

  const signIn = (email: string, password: string) => {
    // In a real application, you would send credentials to a backend for verification.
    // For this mock, we'll just set a dummy user.
    if (email === "test@example.com" && password === "password") {
      const mockUser: User = {
        firstName: "John",
        lastName: "Doe",
        email: "test@example.com",
      }
      localStorage.setItem("intellplan_user", JSON.stringify(mockUser))
      // Simulate setting a cookie for middleware (though localStorage is used here for simplicity)
      document.cookie = "intellplan_user=true; path=/; max-age=3600" // Mock cookie for middleware
      setUser(mockUser)
      setIsAuthenticated(true)
      return true
    }
    return false
  }

  const signOut = () => {
    localStorage.removeItem("intellplan_user")
    document.cookie = "intellplan_user=; path=/; max-age=0" // Clear mock cookie
    setUser(null)
    setIsAuthenticated(false)
  }

  return { isAuthenticated, user, signIn, signOut }
}
