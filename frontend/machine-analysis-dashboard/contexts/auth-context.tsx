"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { loginUser, registerUser, type LoginRequest, type RegisterRequest } from "@/lib/api"

interface User {
  user_id: string
  username: string
  email: string
  name: string
  location_id: string
  email_verified: boolean
}

interface AuthTokens {
  access_token: string
  id_token: string
  refresh_token: string
  expires_in: number
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const storedUser = localStorage.getItem("user")
      const storedTokens = localStorage.getItem("auth_tokens")

      if (storedUser && storedTokens) {
        setUser(JSON.parse(storedUser))
      }
      setIsLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (username: string, password: string) => {
    try {
      const loginData: LoginRequest = { username, password }
      const response = await loginUser(loginData)

      // Store user data
      setUser(response.user)
      localStorage.setItem("user", JSON.stringify(response.user))

      // Store tokens
      const tokens: AuthTokens = {
        access_token: response.access_token,
        id_token: response.id_token,
        refresh_token: response.refresh_token,
        expires_in: response.expires_in,
      }
      localStorage.setItem("auth_tokens", JSON.stringify(tokens))

      router.push("/dashboard")
    } catch (error) {
      console.error("[v0] Login failed:", error)
      throw error
    }
  }

  const register = async (data: RegisterRequest) => {
    try {
      const response = await registerUser(data)
      console.log("[v0] Registration successful:", response)

      // After successful registration, redirect to login
      router.push("/login")
    } catch (error) {
      console.error("[v0] Registration failed:", error)
      throw error
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    localStorage.removeItem("auth_tokens")
    router.push("/login")
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
