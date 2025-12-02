"use client"

import React, { Suspense } from "react"
import { Sun, Moon, Bell, Sparkles, Search, Menu } from "lucide-react"
import { useTheme } from "@/contexts/theme-context"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NotificationsPanel } from "@/components/notifications-panel"
import { AIAssistantPopup } from "@/components/ai-assistant-popup"
import { CommandPalette } from "@/components/command-palette"
import { DashboardSidebar } from "@/components/dashboard-sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [aiAssistantOpen, setAiAssistantOpen] = useState(false)
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false)
  const { theme, toggleTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setCommandPaletteOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const handleCollapseSidebar = (e: CustomEvent) => {
      setSidebarCollapsed(e.detail.collapsed)
    }
    window.addEventListener("collapseSidebar" as any, handleCollapseSidebar)
    return () => window.removeEventListener("collapseSidebar" as any, handleCollapseSidebar)
  }, [])

  return (
    <div className="min-h-screen bg-background flex">
      <Suspense fallback={null}>
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        <DashboardSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} forceCollapsed={sidebarCollapsed} />

        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <header className="bg-card border-b border-border sticky top-0 z-30">
            <div className="flex items-center justify-between p-4 gap-4">
              <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
                  <Menu className="h-5 w-5" />
                </Button>
              </div>

              <div className="flex-1 flex justify-center max-w-2xl mx-auto">
                <Button
                  variant="outline"
                  onClick={() => setCommandPaletteOpen(true)}
                  className="gap-2 bg-muted/50 hover:bg-blue-600/10 hover:border-blue-500/50 w-full max-w-xl justify-start text-muted-foreground transition-colors"
                >
                  <Search className="h-4 w-4" />
                  <span className="text-sm">Buscar funcionalidades...</span>
                  <kbd className="ml-auto px-2 py-0.5 bg-background border border-border rounded text-xs">⌘K</kbd>
                </Button>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative bg-transparent"
                  title="Notificações"
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setAiAssistantOpen(true)}
                  className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-400/20 hover:from-purple-500/20 hover:to-blue-500/20"
                  title="Assistente de IA"
                >
                  <Sparkles className="h-5 w-5 text-purple-500" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleTheme}
                  className="bg-transparent"
                  title={theme === "dark" ? "Ativar modo claro" : "Ativar modo escuro"}
                >
                  {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
              </div>
            </div>
          </header>

          {/* Main content */}
          <main className="flex-1 p-6 overflow-auto">{children}</main>
        </div>

        {/* Modals */}
        <NotificationsPanel open={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
        <AIAssistantPopup open={aiAssistantOpen} onClose={() => setAiAssistantOpen(false)} />
        <CommandPalette open={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
      </Suspense>
    </div>
  )
}
