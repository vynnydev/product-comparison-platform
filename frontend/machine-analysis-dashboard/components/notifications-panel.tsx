"use client"

import { X, Check, AlertTriangle, Info, Wrench, TrendingUp } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useState } from "react"

interface Notification {
  id: string
  type: "success" | "warning" | "info" | "maintenance"
  title: string
  message: string
  time: string
  read: boolean
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    type: "warning",
    title: "Manutenção Necessária",
    message: "Bomba Centrífuga BC-2000 requer atenção. Eficiência abaixo de 85%.",
    time: "Há 5 minutos",
    read: false,
  },
  {
    id: "2",
    type: "maintenance",
    title: "Manutenção Agendada",
    message: "Compressor Industrial CI-5000 - Manutenção preventiva agendada para amanhã às 14h.",
    time: "Há 1 hora",
    read: false,
  },
  {
    id: "3",
    type: "success",
    title: "Análise Concluída",
    message: "Análise de IA completa para Motor Elétrico ME-750. Tudo funcionando perfeitamente.",
    time: "Há 2 horas",
    read: true,
  },
  {
    id: "4",
    type: "info",
    title: "Nova Solicitação de Transporte",
    message: "Nova solicitação de reboque recebida - Setor Automotivo, 2.5 km de distância.",
    time: "Há 3 horas",
    read: true,
  },
  {
    id: "5",
    type: "success",
    title: "Eficiência Melhorada",
    message: "Sistema de refrigeração otimizado. Eficiência aumentou 12% após última manutenção.",
    time: "Ontem",
    read: true,
  },
]

interface NotificationsPanelProps {
  open: boolean
  onClose: () => void
}

export function NotificationsPanel({ open, onClose }: NotificationsPanelProps) {
  const [notifications, setNotifications] = useState(mockNotifications)

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <Check className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-orange-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "maintenance":
        return <Wrench className="h-5 w-5 text-purple-500" />
    }
  }

  const markAsRead = (id: string) => {
    setNotifications(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })))
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  if (!open) return null

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50" onClick={onClose} />
      <div className="fixed top-0 right-0 h-full w-full max-w-md bg-background border-l border-border z-50 shadow-2xl animate-in slide-in-from-right">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <h2 className="text-lg font-semibold">Notificações</h2>
              {unreadCount > 0 && (
                <p className="text-sm text-muted-foreground">{unreadCount} não lida{unreadCount > 1 ? "s" : ""}</p>
              )}
            </div>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>

          {unreadCount > 0 && (
            <div className="p-4 border-b border-border">
              <Button variant="outline" size="sm" onClick={markAllAsRead} className="w-full">
                Marcar todas como lidas
              </Button>
            </div>
          )}

          <div className="flex-1 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={cn(
                  "p-4 border-b border-border cursor-pointer transition-colors hover:bg-accent/50",
                  !notification.read && "bg-blue-500/5",
                )}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className="flex-shrink-0 mt-0.5">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-medium text-sm">{notification.title}</h3>
                      {!notification.read && <div className="h-2 w-2 bg-blue-500 rounded-full flex-shrink-0 mt-1" />}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-2">{notification.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
