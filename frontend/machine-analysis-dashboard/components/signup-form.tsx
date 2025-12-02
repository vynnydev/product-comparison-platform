"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Eye, EyeOff, Factory, AlertCircle, CheckCircle } from 'lucide-react'
import Link from "next/link"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { UserRole, JobFunction } from "@/lib/user-roles"
import { roleLabels, jobFunctionLabels } from "@/lib/user-roles"

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    locationId: "",
    role: "" as UserRole,
    jobFunction: "" as JobFunction,
  })
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setSuccess(false)
    setIsLoading(true)

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError("As senhas não coincidem")
      setIsLoading(false)
      return
    }

    if (formData.password.length < 8) {
      setError("A senha deve ter no mínimo 8 caracteres")
      setIsLoading(false)
      return
    }

    try {
      await register({
        name: formData.fullName,
        email: formData.email,
        username: formData.username,
        location_id: formData.locationId,
        password: formData.password,
        role: formData.role,
        jobFunction: formData.jobFunction,
      })

      setSuccess(true)
      setTimeout(() => {
        window.location.href = "/dashboard/pricing"
      }, 2000)
    } catch (error) {
      console.error("[v0] Registration error:", error)
      setError(error instanceof Error ? error.message : "Erro ao criar conta. Tente novamente.")
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-cyan-600 to-green-500 rounded-2xl mb-4">
          <Factory className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-3xl font-bold tracking-tight">Criar Conta</h2>
        <p className="text-muted-foreground">Preencha seus dados para começar</p>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 text-green-900 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription>
            Conta criada com sucesso! Verifique seu email e redirecionando para login...
          </AlertDescription>
        </Alert>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nome Completo</Label>
          <Input
            id="fullName"
            type="text"
            placeholder="Digite seu nome completo"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Nome de Usuário</Label>
          <Input
            id="username"
            type="text"
            placeholder="Digite seu nome de usuário"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
            className="h-11"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="locationId">ID do Local</Label>
          <Input
            id="locationId"
            type="text"
            placeholder="ID da sua indústria/local"
            value={formData.locationId}
            onChange={(e) => setFormData({ ...formData, locationId: e.target.value })}
            required
            className="h-11"
          />
          <p className="text-xs text-muted-foreground">Use o ID do local cadastrado na plataforma de gerenciamento</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Mínimo 8 caracteres"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
              className="h-11 pr-10"
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

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmar Senha</Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Digite a senha novamente"
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              required
              className="h-11 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirmPassword ? "Ocultar senha" : "Mostrar senha"}
            >
              {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="role">Função no Software</Label>
          <Select
            value={formData.role}
            onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            required
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione sua função" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">Visualizador</SelectItem>
              <SelectItem value="operator">Operador</SelectItem>
              <SelectItem value="technician">Técnico</SelectItem>
              <SelectItem value="manager">Gerente</SelectItem>
              <SelectItem value="admin">Administrador</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Define suas permissões no sistema</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="jobFunction">Cargo na Empresa</Label>
          <Select
            value={formData.jobFunction}
            onValueChange={(value) => setFormData({ ...formData, jobFunction: value as JobFunction })}
            required
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Selecione seu cargo" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(jobFunctionLabels).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">Sua função profissional na organização</p>
        </div>

        <Button
          type="submit"
          disabled={isLoading || success}
          className="w-full h-11 bg-gradient-to-r from-cyan-600 to-green-500 hover:from-cyan-700 hover:to-green-600 text-white font-medium"
        >
          {isLoading ? "Criando conta..." : success ? "Conta criada!" : "Criar Conta"}
        </Button>

        <div className="text-center">
          <span className="text-sm text-muted-foreground">Já tem uma conta? </span>
          <Link href="/login" className="text-sm text-cyan-600 hover:text-cyan-700 font-medium transition-colors">
            Entrar
          </Link>
        </div>
      </form>
    </div>
  )
}
