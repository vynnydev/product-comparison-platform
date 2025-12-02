"use client"

import { useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronDown, UserPlus } from 'lucide-react'

interface Account {
  id: string
  name: string
  email: string
  role: "master" | "admin" | "manager" | "technician" | "viewer"
  avatar: string
  status: "active" | "inactive"
}

const roleLabels = {
  master: "Master",
  admin: "Administrador",
  manager: "Gerente",
  technician: "Técnico",
  viewer: "Visualizador",
}

const roleColors = {
  master: "bg-purple-500",
  admin: "bg-blue-500",
  manager: "bg-green-500",
  technician: "bg-orange-500",
  viewer: "bg-gray-500",
}

export function AccountSwitcher() {
  // Mock accounts for testing
  const accounts: Account[] = [
    {
      id: "1",
      name: "João Silva",
      email: "joao.silva@cognitiva.com",
      role: "master",
      avatar: "JS",
      status: "active",
    },
    {
      id: "2",
      name: "Maria Santos",
      email: "maria.santos@cognitiva.com",
      role: "technician",
      avatar: "MS",
      status: "active",
    },
    {
      id: "3",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@cognitiva.com",
      role: "viewer",
      avatar: "CO",
      status: "active",
    },
  ]

  const [currentAccountId, setCurrentAccountId] = useState(accounts[0].id)
  const currentAccount = accounts.find((acc) => acc.id === currentAccountId) || accounts[0]

  const handleSwitchAccount = (accountId: string) => {
    setCurrentAccountId(accountId)
    // Store in localStorage for persistence
    localStorage.setItem("currentAccountId", accountId)
    // Reload to apply role-based permissions
    window.location.reload()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-between gap-2 bg-blue-700/30 border-blue-600/30 hover:bg-blue-700/50 text-white"
        >
          <div className="flex items-center gap-3 min-w-0">
            <Avatar className={`h-8 w-8 ${roleColors[currentAccount.role]}`}>
              <AvatarFallback className="text-white font-semibold text-sm">
                {currentAccount.avatar}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 text-left min-w-0">
              <p className="text-sm font-medium truncate">{currentAccount.name}</p>
              <p className="text-xs text-blue-200 truncate">{roleLabels[currentAccount.role]}</p>
            </div>
          </div>
          <ChevronDown className="h-4 w-4 shrink-0 text-blue-200" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[280px]">
        <DropdownMenuLabel>Trocar de Conta</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {accounts.map((account) => (
          <DropdownMenuItem
            key={account.id}
            onClick={() => handleSwitchAccount(account.id)}
            className="cursor-pointer"
          >
            <div className="flex items-center gap-3 flex-1">
              <Avatar className={`h-10 w-10 ${roleColors[account.role]}`}>
                <AvatarFallback className="text-white font-semibold">
                  {account.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{account.name}</p>
                <p className="text-xs text-muted-foreground truncate">{account.email}</p>
                <Badge variant="secondary" className="mt-1 text-xs">
                  {roleLabels[account.role]}
                </Badge>
              </div>
              {account.id === currentAccountId && (
                <Check className="h-4 w-4 text-green-500 shrink-0" />
              )}
            </div>
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem className="cursor-pointer text-blue-600">
          <UserPlus className="h-4 w-4 mr-2" />
          Adicionar Conta
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
