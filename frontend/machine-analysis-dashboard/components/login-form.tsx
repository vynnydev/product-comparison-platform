"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Layers, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  })
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      await login(formData.username, formData.password)
    } catch (error) {
      console.error("[v0] Login error:", error)
      setError(error instanceof Error ? error.message : "Erro ao fazer login. Verifique suas credenciais.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-2xl mb-4">
          <Layers className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Entrar</h2>
        <p className="text-muted-foreground">Entre com suas informações abaixo</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="username">Nome de Usuário</Label>
          <Input
            id="username"
            type="text"
            placeholder="Digite seu nome de usuário"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="h-12"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Digite sua senha"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-12 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link href="/forgot-password" className="text-sm text-cyan-600 hover:text-cyan-700 transition-colors">
            Esqueceu a senha?
          </Link>
        </div>

        <Button
          type="submit"
          disabled={isLoading}
          className="w-full h-12 bg-cyan-500 hover:bg-cyan-600 active:bg-cyan-700 text-white font-medium text-base transition-colors shadow-lg shadow-cyan-500/30 hover:shadow-xl hover:shadow-cyan-600/40"
        >
          {isLoading ? "Entrando..." : "Entrar"}
        </Button>

        <div className="text-center">
          <Link href="/signup" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
            Criar uma conta
          </Link>
        </div>
      </form>
    </div>
  )
}
