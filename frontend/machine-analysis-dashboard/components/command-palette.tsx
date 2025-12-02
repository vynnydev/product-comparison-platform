"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from 'next/navigation'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, ArrowUp, ArrowDown, CornerDownLeft, X, ListChecks, LayoutDashboard, Activity, Wrench, Truck, Workflow, Package, BarChart3, CreditCard, Settings, Sparkles, Eye, Clock, AlertCircle, CheckCircle, Gauge, Cpu, Zap, DollarSign, ShoppingCart, TrendingUp, FileText, Calendar, Crown, Users, Award, BarChart, UserPlus } from 'lucide-react'
import { cn } from "@/lib/utils"

interface SearchItem {
  id: string
  title: string
  description: string
  category: string
  page: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  keywords: string[]
}

interface CommandPaletteProps {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: CommandPaletteProps) {
  const router = useRouter()
  const [search, setSearch] = useState("")
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)

  const searchItems: SearchItem[] = [
    // Tarefas
    { id: "tasks-board", title: "Quadro de Tarefas", description: "Visualize e gerencie todas as tarefas", category: "Tarefas", page: "Tarefas", href: "/dashboard/tasks", icon: ListChecks, keywords: ["tarefas", "kanban", "board", "gerenciar"] },
    { id: "tasks-machines", title: "Máquinas em Operação", description: "Acompanhe máquinas ativas em tempo real", category: "Tarefas", page: "Tarefas", href: "/dashboard/tasks", icon: Activity, keywords: ["máquinas", "operação", "ativas", "tempo real"] },
    { id: "tasks-ai", title: "Analisar Tarefa com IA", description: "Use IA para análise preditiva de tarefas", category: "Tarefas", page: "Tarefas", href: "/dashboard/tasks", icon: Sparkles, keywords: ["ia", "inteligência", "artificial", "análise"] },
    
    // Análise de Máquinas
    { id: "analysis-main", title: "Análise de Máquinas", description: "Monitoramento inteligente em tempo real", category: "Análise", page: "Análise de Máquinas", href: "/dashboard/analysis", icon: LayoutDashboard, keywords: ["análise", "máquinas", "monitoramento", "preditiva"] },
    { id: "analysis-3d", title: "Visualização 3D", description: "Explore modelos 3D interativos das máquinas", category: "Análise", page: "Análise de Máquinas", href: "/dashboard/analysis", icon: Cpu, keywords: ["3d", "visualização", "modelo", "interativo"] },
    { id: "analysis-parts", title: "Peças Disponíveis", description: "Consulte estoque de peças e componentes", category: "Análise", page: "Análise de Máquinas", href: "/dashboard/analysis", icon: Package, keywords: ["peças", "componentes", "estoque", "disponível"] },
    { id: "analysis-ai-price", title: "Verificar Preços com IA", description: "Consulte preços e fornecedores com IA", category: "Análise", page: "Análise de Máquinas", href: "/dashboard/analysis", icon: Sparkles, keywords: ["preço", "fornecedor", "ia", "compra"] },
    
    // Relatórios
    { id: "reports-main", title: "Relatórios de Máquinas", description: "Acesse relatórios detalhados de análises", category: "Relatórios", page: "Relatórios", href: "/dashboard/reports", icon: FileText, keywords: ["relatórios", "reports", "análises", "histórico", "documentos"] },
    { id: "reports-history", title: "Histórico de Relatórios", description: "Visualize relatórios anteriores", category: "Relatórios", page: "Relatórios", href: "/dashboard/reports", icon: Clock, keywords: ["histórico", "anterior", "passado", "arquivado"] },
    { id: "reports-ai", title: "Relatórios com IA", description: "Relatórios gerados com inteligência artificial", category: "Relatórios", page: "Relatórios", href: "/dashboard/reports", icon: Sparkles, keywords: ["ia", "inteligência", "artificial", "automático"] },
    { id: "reports-print", title: "Imprimir Relatório", description: "Gere relatórios em PDF para impressão", category: "Relatórios", page: "Relatórios", href: "/dashboard/reports", icon: FileText, keywords: ["imprimir", "pdf", "exportar", "download"] },
    
    // Monitoramento
    { id: "monitoring-main", title: "Monitoramento", description: "Painel de monitoramento em tempo real", category: "Monitoramento", page: "Monitoramento", href: "/dashboard/monitoring", icon: Activity, keywords: ["monitoramento", "tempo real", "dashboard", "métricas"] },
    { id: "monitoring-performance", title: "Performance de Máquinas", description: "Veja métricas de desempenho", category: "Monitoramento", page: "Monitoramento", href: "/dashboard/monitoring", icon: Gauge, keywords: ["performance", "desempenho", "eficiência", "velocidade"] },
    { id: "monitoring-alerts", title: "Alertas e Avisos", description: "Configure alertas de manutenção", category: "Monitoramento", page: "Monitoramento", href: "/dashboard/monitoring", icon: AlertCircle, keywords: ["alertas", "avisos", "notificações", "manutenção"] },
    
    // Oficina Virtual
    { id: "workshop-main", title: "Oficina Virtual", description: "Gerencie oficinas e máquinas", category: "Oficina", page: "Oficina Virtual", href: "/dashboard/workshops", icon: Wrench, keywords: ["oficina", "virtual", "gestão", "máquinas"] },
    { id: "workshop-locations", title: "Localizações de Oficinas", description: "Veja todas as oficinas no mapa", category: "Oficina", page: "Oficina Virtual", href: "/dashboard/workshops", icon: LayoutDashboard, keywords: ["localização", "mapa", "endereço", "oficina"] },
    { id: "workshop-parts", title: "Peças de Oficina", description: "Consulte peças disponíveis em oficinas", category: "Oficina", page: "Oficina Virtual", href: "/dashboard/workshops", icon: Package, keywords: ["peças", "oficina", "estoque", "componentes"] },
    
    // Transporte & Reboque
    { id: "transport-main", title: "Transporte & Reboque", description: "Gerencie transporte de equipamentos", category: "Logística", page: "Transporte & Reboque", href: "/dashboard/transport", icon: Truck, keywords: ["transporte", "reboque", "logística", "entrega"] },
    { id: "transport-schedule", title: "Agendamentos", description: "Agende transportes e entregas", category: "Logística", page: "Transporte & Reboque", href: "/dashboard/transport", icon: Calendar, keywords: ["agenda", "agendamento", "schedule", "horário"] },
    { id: "transport-tracking", title: "Rastreamento", description: "Rastreie equipamentos em trânsito", category: "Logística", page: "Transporte & Reboque", href: "/dashboard/transport", icon: Activity, keywords: ["rastreamento", "tracking", "localização", "gps"] },
    
    // Automatizar Fluxos
    { id: "workflows-main", title: "Automatizar Fluxos", description: "Crie automações e integrações", category: "Automação", page: "Automatizar Fluxos", href: "/dashboard/workflows", icon: Workflow, keywords: ["automação", "fluxo", "workflow", "integração"] },
    { id: "workflows-create", title: "Criar Automação", description: "Configure novos fluxos automáticos", category: "Automação", page: "Automatizar Fluxos", href: "/dashboard/workflows", icon: Zap, keywords: ["criar", "novo", "automação", "configurar"] },
    
    // Inventário
    { id: "inventory-main", title: "Inventário", description: "Gerencie estoque e peças", category: "Estoque", page: "Inventário", href: "/dashboard/inventory", icon: Package, keywords: ["inventário", "estoque", "peças", "gestão"] },
    { id: "inventory-low-stock", title: "Baixo Estoque", description: "Veja itens com estoque baixo", category: "Estoque", page: "Inventário", href: "/dashboard/inventory", icon: AlertCircle, keywords: ["baixo", "estoque", "alerta", "reposição"] },
    { id: "inventory-orders", title: "Pedidos", description: "Gerencie pedidos de peças", category: "Estoque", page: "Inventário", href: "/dashboard/inventory", icon: ShoppingCart, keywords: ["pedidos", "compra", "ordem", "solicitar"] },
    
    // Diagnósticos
    { id: "diagnostics-main", title: "Diagnósticos", description: "Análise técnica de problemas", category: "Diagnóstico", page: "Diagnósticos", href: "/dashboard/diagnostics", icon: BarChart3, keywords: ["diagnóstico", "análise", "problema", "técnico"] },
    { id: "diagnostics-history", title: "Histórico de Diagnósticos", description: "Veja diagnósticos anteriores", category: "Diagnóstico", page: "Diagnósticos", href: "/dashboard/diagnostics", icon: Clock, keywords: ["histórico", "anterior", "passado", "registro"] },
    { id: "diagnostics-report", title: "Relatórios", description: "Gere relatórios técnicos", category: "Diagnóstico", page: "Diagnósticos", href: "/dashboard/diagnostics", icon: FileText, keywords: ["relatório", "report", "documento", "pdf"] },
    
    // Faturamento
    { id: "billing-main", title: "Faturamento", description: "Gerencie pagamentos e cartões", category: "Financeiro", page: "Faturamento", href: "/dashboard/billing", icon: CreditCard, keywords: ["faturamento", "pagamento", "cartão", "financeiro"] },
    { id: "billing-balance", title: "Saldo Disponível", description: "Consulte seu saldo atual", category: "Financeiro", page: "Faturamento", href: "/dashboard/billing", icon: DollarSign, keywords: ["saldo", "dinheiro", "disponível", "valor"] },
    { id: "billing-cards", title: "Meus Cartões", description: "Gerencie métodos de pagamento", category: "Financeiro", page: "Faturamento", href: "/dashboard/billing", icon: CreditCard, keywords: ["cartões", "pagamento", "crédito", "débito"] },
    { id: "billing-expenses", title: "Despesas", description: "Acompanhe gastos de manutenção", category: "Financeiro", page: "Faturamento", href: "/dashboard/billing", icon: TrendingUp, keywords: ["despesas", "gastos", "custos", "manutenção"] },
    
    // Planos
    { id: "pricing-main", title: "Planos e Preços", description: "Compare e escolha o melhor plano para sua operação", category: "Financeiro", page: "Planos", href: "/dashboard/pricing", icon: CreditCard, keywords: ["planos", "preços", "assinatura", "upgrade", "premium", "starter", "enterprise"] },
    { id: "pricing-starter", title: "Plano Starter", description: "Ideal para pequenas operações", category: "Financeiro", page: "Planos", href: "/dashboard/pricing", icon: DollarSign, keywords: ["starter", "básico", "pequeno", "inicial"] },
    { id: "pricing-professional", title: "Plano Professional", description: "Perfeito para operações em crescimento", category: "Financeiro", page: "Planos", href: "/dashboard/pricing", icon: Zap, keywords: ["professional", "premium", "crescimento", "popular"] },
    { id: "pricing-enterprise", title: "Plano Enterprise", description: "Solução completa para grandes operações", category: "Financeiro", page: "Planos", href: "/dashboard/pricing", icon: Crown, keywords: ["enterprise", "completo", "grande", "ilimitado"] },
    
    // Configurações
    { id: "settings-main", title: "Configurações", description: "Configure sua conta e preferências", category: "Sistema", page: "Configurações", href: "/dashboard/settings", icon: Settings, keywords: ["configurações", "settings", "preferências", "conta"] },
    { id: "settings-profile", title: "Meu Perfil", description: "Edite informações do perfil", category: "Sistema", page: "Configurações", href: "/dashboard/settings", icon: Settings, keywords: ["perfil", "usuário", "dados", "editar"] },
    { id: "settings-notifications", title: "Notificações", description: "Configure alertas e notificações", category: "Sistema", page: "Configurações", href: "/dashboard/settings", icon: Activity, keywords: ["notificações", "alertas", "avisos", "email"] },
    
    // Equipe & Usuários
    { id: "team-dashboard", title: "Dashboard de Equipe", description: "Métricas e performance da equipe com insights de IA", category: "Equipe", page: "Equipe", href: "/dashboard/team", icon: Users, keywords: ["equipe", "time", "team", "funcionários", "colaboradores", "métricas", "performance"] },
    { id: "team-members", title: "Membros da Equipe", description: "Visualize distribuição e estatísticas de membros", category: "Equipe", page: "Equipe", href: "/dashboard/team", icon: Users, keywords: ["membros", "funcionários", "técnicos", "engenheiros", "operadores"] },
    { id: "team-attendance", title: "Relatório de Presença", description: "Acompanhe presença e pontualidade da equipe", category: "Equipe", page: "Equipe", href: "/dashboard/team", icon: Calendar, keywords: ["presença", "attendance", "ponto", "horário", "pontualidade"] },
    { id: "team-salary", title: "Salário Total", description: "Visualize custos com folha de pagamento", category: "Equipe", page: "Equipe", href: "/dashboard/team", icon: DollarSign, keywords: ["salário", "pagamento", "folha", "custos", "despesas"] },
    { id: "team-ai-insights", title: "Insights de IA da Equipe", description: "Análises preditivas sobre performance da equipe", category: "Equipe", page: "Equipe", href: "/dashboard/team", icon: Sparkles, keywords: ["ia", "insights", "análise", "preditiva", "inteligência"] },
    { id: "users-management", title: "Gerenciar Usuários", description: "Adicione, edite e gerencie usuários do sistema", category: "Equipe", page: "Usuários", href: "/dashboard/users", icon: UserPlus, keywords: ["usuários", "users", "gerenciar", "adicionar", "permissões", "roles"] },
    { id: "users-roles", title: "Funções e Permissões", description: "Configure funções e permissões de usuários", category: "Equipe", page: "Usuários", href: "/dashboard/users", icon: Award, keywords: ["funções", "roles", "permissões", "acesso", "admin", "manager"] },
  ]

  const categories = [
    { id: "all", name: "Todos", icon: LayoutDashboard },
    { id: "Tarefas", name: "Tarefas", icon: ListChecks },
    { id: "Análise", name: "Análise", icon: LayoutDashboard },
    { id: "Relatórios", name: "Relatórios", icon: FileText },
    { id: "Equipe", name: "Equipe", icon: Users },
    { id: "Monitoramento", name: "Monitoramento", icon: Activity },
    { id: "Oficina", name: "Oficina", icon: Wrench },
    { id: "Logística", name: "Logística", icon: Truck },
    { id: "Estoque", name: "Estoque", icon: Package },
    { id: "Financeiro", name: "Financeiro", icon: CreditCard },
  ]

  const filteredItems = useMemo(() => {
    let items = searchItems

    if (selectedCategory && selectedCategory !== "all") {
      items = items.filter((item) => item.category === selectedCategory)
    }

    if (search) {
      const searchLower = search.toLowerCase()
      items = items.filter(
        (item) =>
          item.title.toLowerCase().includes(searchLower) ||
          item.description.toLowerCase().includes(searchLower) ||
          item.keywords.some((keyword) => keyword.includes(searchLower)) ||
          item.page.toLowerCase().includes(searchLower)
      )
    }

    return items
  }, [search, selectedCategory])

  const groupedItems = useMemo(() => {
    const groups: Record<string, SearchItem[]> = {}
    filteredItems.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = []
      }
      groups[item.category].push(item)
    })
    return groups
  }, [filteredItems])

  useEffect(() => {
    setSelectedIndex(0)
  }, [search, selectedCategory])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return

      if (e.key === "ArrowDown") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev + 1) % filteredItems.length)
      } else if (e.key === "ArrowUp") {
        e.preventDefault()
        setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % filteredItems.length)
      } else if (e.key === "Enter") {
        e.preventDefault()
        if (filteredItems[selectedIndex]) {
          handleSelect(filteredItems[selectedIndex])
        }
      } else if (e.key === "Escape") {
        e.preventDefault()
        onClose()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [open, selectedIndex, filteredItems])

  const handleSelect = (item: SearchItem) => {
    router.push(item.href)
    onClose()
    setSearch("")
    setSelectedCategory(null)
  }

  const handleClose = () => {
    onClose()
    setSearch("")
    setSelectedCategory(null)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl p-0 gap-0 overflow-hidden">
        <div className="flex items-center border-b border-border px-4 py-3">
          <Search className="h-5 w-5 text-muted-foreground mr-3" />
          <Input
            placeholder="Buscar funcionalidades, páginas, ações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 text-base"
            autoFocus
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="ml-2 hover:bg-muted"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center justify-between px-4 py-2 border-b border-border text-sm text-muted-foreground bg-muted/30">
          <div className="flex items-center gap-2">
            <span>Navegar</span>
            <div className="flex gap-1">
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">
                <ArrowUp className="h-3 w-3" />
              </kbd>
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">
                <ArrowDown className="h-3 w-3" />
              </kbd>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span>Selecionar</span>
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs flex items-center gap-1">
                <CornerDownLeft className="h-3 w-3" />
              </kbd>
            </div>
            <div className="flex items-center gap-2">
              <span>Fechar</span>
              <kbd className="px-2 py-1 bg-background border border-border rounded text-xs">
                esc
              </kbd>
            </div>
          </div>
        </div>

        <div className="px-4 py-3 border-b border-border">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => {
              const Icon = category.icon
              const isSelected = selectedCategory === category.id || (!selectedCategory && category.id === "all")
              
              return (
                <Button
                  key={category.id}
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id === "all" ? null : category.id)}
                  className={cn(
                    "gap-2",
                    !isSelected && "bg-background hover:bg-muted"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </Button>
              )
            })}
          </div>
        </div>

        <div className="max-h-[500px] overflow-y-auto">
          {Object.keys(groupedItems).length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">
              <Search className="h-12 w-12 mx-auto mb-4 opacity-20" />
              <p className="text-sm">Nenhum resultado encontrado</p>
              <p className="text-xs mt-1">Tente buscar por outra palavra-chave</p>
            </div>
          ) : (
            Object.entries(groupedItems).map(([category, items], categoryIndex) => (
              <div key={category} className={cn(categoryIndex > 0 && "border-t border-border")}>
                <div className="px-4 py-2 bg-muted/30">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      {category}
                    </span>
                    <Badge variant="secondary" className="text-xs">
                      {items.length}
                    </Badge>
                  </div>
                </div>
                <div className="p-2">
                  {items.map((item, index) => {
                    const globalIndex = filteredItems.indexOf(item)
                    const isSelected = globalIndex === selectedIndex
                    const Icon = item.icon

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleSelect(item)}
                        onMouseEnter={() => setSelectedIndex(globalIndex)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted/50"
                        )}
                      >
                        <div
                          className={cn(
                            "h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0",
                            isSelected
                              ? "bg-primary-foreground/10"
                              : "bg-muted"
                          )}
                        >
                          <Icon className={cn("h-5 w-5", isSelected ? "" : "text-muted-foreground")} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-sm truncate">{item.title}</div>
                          <div
                            className={cn(
                              "text-xs truncate mt-0.5",
                              isSelected ? "text-primary-foreground/70" : "text-muted-foreground"
                            )}
                          >
                            {item.description}
                          </div>
                        </div>
                        <Badge
                          variant={isSelected ? "secondary" : "outline"}
                          className={cn(
                            "text-xs flex-shrink-0",
                            isSelected && "bg-primary-foreground/10 border-primary-foreground/20"
                          )}
                        >
                          {item.page}
                        </Badge>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
