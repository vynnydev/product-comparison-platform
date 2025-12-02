"use client"

import { useState } from "react"
import { Machines3DCardCarousel } from "@/components/machines-3d-card-carousel"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { KanbanBoard } from "@/components/kanban-board"
import { MetricsReportModal } from "@/components/metrics-report-modal"
import {
  Filter,
  Download,
  Users,
  FolderKanban,
  Clock,
  TrendingUp,
  LayoutGrid,
  List,
  Search,
  X,
  Calendar,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"

export default function TasksPage() {
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban")
  const [periodFilter, setPeriodFilter] = useState("30days")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [stageFilter, setStageFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [openMetricDetail, setOpenMetricDetail] = useState<string | null>(null)
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false)
  const [filterPanelOpen, setFilterPanelOpen] = useState(false)
  const [metricsReportOpen, setMetricsReportOpen] = useState(false)

  const periodData = {
    "7days": {
      total: 8,
      inProgress: 3,
      completed: 4,
      delayed: 1,
      teamMembers: 18,
      activeProjects: 6,
      hoursWorked: 320,
      completionRate: 82,
    },
    "30days": {
      total: 16,
      inProgress: 5,
      completed: 8,
      delayed: 2,
      teamMembers: 24,
      activeProjects: 12,
      hoursWorked: 1248,
      completionRate: 87,
    },
    "3months": {
      total: 42,
      inProgress: 11,
      completed: 28,
      delayed: 3,
      teamMembers: 28,
      activeProjects: 18,
      hoursWorked: 3850,
      completionRate: 89,
    },
    "6months": {
      total: 89,
      inProgress: 15,
      completed: 68,
      delayed: 5,
      teamMembers: 32,
      activeProjects: 25,
      hoursWorked: 7520,
      completionRate: 91,
    },
    year: {
      total: 156,
      inProgress: 22,
      completed: 124,
      delayed: 8,
      teamMembers: 35,
      activeProjects: 32,
      hoursWorked: 14500,
      completionRate: 93,
    },
    all: {
      total: 245,
      inProgress: 28,
      completed: 205,
      delayed: 10,
      teamMembers: 40,
      activeProjects: 45,
      hoursWorked: 28000,
      completionRate: 95,
    },
  }

  const currentPeriodData = periodData[periodFilter as keyof typeof periodData]

  const metrics = {
    teamMembers: {
      total: currentPeriodData.teamMembers,
      change: "+2",
      previousPeriod: 22,
      distribution: [
        { role: "Técnicos de Manutenção", count: 8, color: "bg-blue-500" },
        { role: "Engenheiros", count: 6, color: "bg-orange-500" },
        { role: "Operadores", count: 10, color: "bg-purple-500" },
      ],
    },
    activeProjects: {
      total: currentPeriodData.activeProjects,
      change: "+10.4%",
      previousPeriod: 9,
      trend: [65, 72, 68, 78, 85, 82, 90],
    },
    hoursWorked: {
      total: currentPeriodData.hoursWorked,
      change: "+15%",
      previousPeriod: 1085,
      avgPerMember: Math.round(currentPeriodData.hoursWorked / currentPeriodData.teamMembers),
    },
    completionRate: {
      total: currentPeriodData.completionRate,
      change: "+3%",
      previousPeriod: 84,
      onTime: 75,
      delayed: 12,
    },
  }

  const stats = [
    {
      label: "Total de Tarefas",
      value: currentPeriodData.total,
      color: "blue",
    },
    {
      label: "Em Progresso",
      value: currentPeriodData.inProgress,
      color: "orange",
    },
    {
      label: "Concluídas Hoje",
      value: currentPeriodData.completed,
      color: "green",
    },
    {
      label: "Atrasadas",
      value: currentPeriodData.delayed,
      color: "red",
    },
  ]

  const activeMachines = [
    {
      id: "M001",
      name: "Robô Industrial CNC-X500",
      status: "running" as const,
      task: "Corte de peças de precisão - Padrão ST/I-3",
      speed: 85,
      efficiency: 92,
      temperature: 45,
      location: "Linha de Produção 1",
    },
    {
      id: "M002",
      name: "Torno Automático TA-2000",
      status: "running" as const,
      task: "Usinagem de eixos metálicos",
      speed: 78,
      efficiency: 88,
      temperature: 52,
      location: "Linha de Produção 2",
    },
    {
      id: "M003",
      name: "Fresadora CNC F-800",
      status: "idle" as const,
      task: "Aguardando próximo lote",
      speed: 0,
      efficiency: 0,
      temperature: 28,
      location: "Linha de Produção 3",
    },
    {
      id: "M004",
      name: "Prensa Hidráulica PH-1500",
      status: "running" as const,
      task: "Conformação de chapas metálicas",
      speed: 72,
      efficiency: 85,
      temperature: 48,
      location: "Linha de Produção 4",
    },
    {
      id: "M005",
      name: "Centro de Usinagem CU-400",
      status: "running" as const,
      task: "Produção de peças complexas",
      speed: 88,
      efficiency: 94,
      temperature: 42,
      location: "Linha de Produção 5",
    },
  ]

  const tasks = [
    {
      id: "MT-001",
      title: "Inspeção de bomba centrífuga",
      priority: "high",
      status: "backlog",
      list: "Manutenção",
      tags: ["urgente", "preventiva"],
      dueDate: "19/11/2025",
      assignees: ["João Silva"],
      createdDaysAgo: 2,
    },
    {
      id: "MT-002",
      title: "Calibração de sensores",
      priority: "normal",
      status: "backlog",
      list: "Automação",
      tags: ["rotina"],
      dueDate: "21/11/2025",
      assignees: ["Carlos Oliveira"],
      createdDaysAgo: 5,
    },
    {
      id: "MT-003",
      title: "Troca de óleo do compressor",
      priority: "high",
      status: "in-progress",
      list: "Manutenção",
      tags: ["urgente"],
      dueDate: "18/11/2025",
      assignees: ["Ana Costa"],
      createdDaysAgo: 3,
    },
    {
      id: "MT-004",
      title: "Implementar automação de lubrificação",
      priority: "normal",
      status: "in-progress",
      list: "Automação",
      tags: ["upgrade"],
      dueDate: "24/11/2025",
      assignees: ["Fernanda Lima"],
      createdDaysAgo: 12,
    },
    {
      id: "MT-005",
      title: "Revisão de motor elétrico",
      priority: "high",
      status: "review",
      list: "Inspeção",
      tags: ["qualidade"],
      dueDate: "17/11/2025",
      assignees: ["Juliana Rocha"],
      createdDaysAgo: 6,
    },
    {
      id: "MT-006",
      title: "Teste de válvula de segurança",
      priority: "normal",
      status: "review",
      list: "Teste",
      tags: ["segurança"],
      dueDate: "20/11/2025",
      assignees: ["Patrícia Souza"],
      createdDaysAgo: 8,
    },
    {
      id: "MT-007",
      title: "Atualização de firmware CNC",
      priority: "low",
      status: "done",
      list: "Automação",
      tags: ["atualização"],
      dueDate: "16/11/2025",
      assignees: ["Ricardo Gomes"],
      createdDaysAgo: 4,
    },
    {
      id: "MT-008",
      title: "Manutenção preventiva torno CNC",
      priority: "high",
      status: "backlog",
      list: "Manutenção",
      tags: ["preventiva"],
      dueDate: "25/11/2025",
      assignees: ["João Silva"],
      createdDaysAgo: 15,
    },
    {
      id: "MT-009",
      title: "Instalação de novos sensores",
      priority: "normal",
      status: "in-progress",
      list: "Instalação",
      tags: ["upgrade"],
      dueDate: "26/11/2025",
      assignees: ["Ana Costa"],
      createdDaysAgo: 45,
    },
    {
      id: "MT-010",
      title: "Revisão sistema hidráulico",
      priority: "high",
      status: "done",
      list: "Manutenção",
      tags: ["qualidade"],
      dueDate: "10/11/2025",
      assignees: ["Carlos Oliveira"],
      createdDaysAgo: 95,
    },
  ]

  const getPeriodDays = (period: string) => {
    switch (period) {
      case "7days":
        return 7
      case "30days":
        return 30
      case "3months":
        return 90
      case "6months":
        return 180
      case "year":
        return 365
      default:
        return Number.POSITIVE_INFINITY
    }
  }

  const periodDays = getPeriodDays(periodFilter)

  const filteredTasks = tasks.filter((task) => {
    if (periodFilter !== "all" && task.createdDaysAgo > periodDays) return false

    if (priorityFilter !== "all" && task.priority !== priorityFilter) return false

    if (stageFilter !== "all" && task.status !== stageFilter) return false

    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false

    return true
  })

  const filteredMachines = activeMachines.filter((_, index) => {
    if (periodFilter === "7days") return index < 3
    if (periodFilter === "30days") return index < 5
    return true
  })

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400"
      case "normal":
        return "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400"
      case "low":
        return "text-gray-600 bg-gray-50 dark:bg-gray-800 dark:text-gray-400"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "backlog":
        return "bg-gray-100 dark:bg-gray-800"
      case "in-progress":
        return "bg-green-50 dark:bg-green-950"
      case "review":
        return "bg-purple-50 dark:bg-purple-950"
      case "done":
        return "bg-blue-50 dark:bg-blue-950"
      default:
        return "bg-gray-100"
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "backlog":
        return "A Fazer"
      case "in-progress":
        return "Em Progresso"
      case "review":
        return "Em Revisão"
      case "done":
        return "Concluído"
      default:
        return status
    }
  }

  const getPeriodLabel = (period: string) => {
    switch (period) {
      case "7days":
        return "7 Dias"
      case "30days":
        return "30 Dias"
      case "3months":
        return "3 Meses"
      case "6months":
        return "6 Meses"
      case "year":
        return "Este Ano"
      case "all":
        return "Todo Período"
      default:
        return "30 Dias"
    }
  }

  const activeFiltersCount = [
    periodFilter !== "30days" ? 1 : 0,
    priorityFilter !== "all" ? 1 : 0,
    stageFilter !== "all" ? 1 : 0,
    searchQuery ? 1 : 0,
  ].reduce((a, b) => a + b, 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Quadro de Tarefas</h1>
          <p className="text-muted-foreground mt-1">Gerencie tarefas de automação e manutenção de equipamentos</p>
        </div>
        <div className="flex gap-2">
          <Popover open={filterPanelOpen} onOpenChange={setFilterPanelOpen}>
            <PopoverTrigger asChild>
              <Button variant="outline" className="relative bg-transparent">
                <Filter className="h-4 w-4 mr-2" />
                Filtros
                {activeFiltersCount > 0 && (
                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600">
                    {activeFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-96" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-lg">Filtros</h3>
                  {activeFiltersCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setPeriodFilter("30days")
                        setPriorityFilter("all")
                        setStageFilter("all")
                        setSearchQuery("")
                      }}
                      className="text-xs h-7"
                    >
                      Limpar tudo
                    </Button>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="space-y-2">
                    <label className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Período
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: "7days", label: "7 Dias" },
                        { value: "30days", label: "30 Dias" },
                        { value: "3months", label: "3 Meses" },
                        { value: "6months", label: "6 Meses" },
                        { value: "year", label: "Este Ano" },
                        { value: "all", label: "Todo Período" },
                      ].map((period) => (
                        <Button
                          key={period.value}
                          variant={periodFilter === period.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => setPeriodFilter(period.value)}
                          className={periodFilter === period.value ? "bg-blue-600 hover:bg-blue-700" : ""}
                        >
                          {period.label}
                        </Button>
                      ))}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      Período selecionado: <strong>{getPeriodLabel(periodFilter)}</strong>
                    </p>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <label className="text-sm font-medium">Prioridade</label>
                    <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas prioridades" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas prioridades</SelectItem>
                        <SelectItem value="high">Alta</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="low">Baixa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Estágio</label>
                    <Select value={stageFilter} onValueChange={setStageFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todos estágios" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos estágios</SelectItem>
                        <SelectItem value="backlog">A Fazer</SelectItem>
                        <SelectItem value="in-progress">Em Progresso</SelectItem>
                        <SelectItem value="review">Em Revisão</SelectItem>
                        <SelectItem value="done">Concluído</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="border-t pt-3 space-y-2">
                    <label className="text-sm font-medium">Buscar</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar por título..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                      />
                      {searchQuery && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0"
                          onClick={() => setSearchQuery("")}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t pt-3">
                  <Button className="w-full" onClick={() => setFilterPanelOpen(false)}>
                    Aplicar Filtros
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
          <Button
            onClick={() => setMetricsReportOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          >
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                  <p className="text-3xl font-bold text-foreground">{stat.value}</p>
                </div>
                <div className={`h-12 w-12 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                  <div className={`h-6 w-6 rounded-full bg-${stat.color}-500`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Machines3DCardCarousel machines={filteredMachines} />

      <Dialog open={openMetricDetail === "team"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Detalhes da Equipe
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.teamMembers.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Membros</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.teamMembers.change} desde último mês
            </Badge>

            <div className="space-y-3 mt-6">
              <h3 className="font-semibold">Distribuição por Função</h3>
              {metrics.teamMembers.distribution.map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{item.role}</span>
                    <span className="font-medium">{item.count} Pessoas</span>
                  </div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${(item.count / metrics.teamMembers.total) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "projects"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Detalhes dos Projetos
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.activeProjects.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Projetos</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.activeProjects.change} 9 projetos no último mês
            </Badge>

            <div className="mt-6">
              <h3 className="font-semibold mb-4">Tendência Semanal</h3>
              <div className="h-32 flex items-end gap-2">
                {metrics.activeProjects.trend.map((value, idx) => (
                  <div key={idx} className="flex-1 bg-blue-500/20 dark:bg-blue-500/30 rounded-t relative group">
                    <div
                      className="absolute bottom-0 w-full bg-blue-500 rounded-t transition-all"
                      style={{ height: `${value}%` }}
                    />
                    <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs text-muted-foreground">
                      {["Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set"][idx]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "hours"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Detalhes das Horas Trabalhadas
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.hoursWorked.total}</span>
              <span className="text-lg text-muted-foreground mb-2">Horas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.hoursWorked.change} vs período anterior
            </Badge>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Média por membro</span>
                <span className="font-bold text-lg">{metrics.hoursWorked.avgPerMember}h</span>
              </div>
              <div className="flex justify-between p-4 bg-muted rounded-lg">
                <span className="text-muted-foreground">Período anterior</span>
                <span className="font-bold text-lg">{metrics.hoursWorked.previousPeriod}h</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Progresso do período</span>
                  <span className="font-medium">75%</span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-cyan-500" style={{ width: "75%" }} />
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={openMetricDetail === "completion"} onOpenChange={() => setOpenMetricDetail(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Detalhes da Taxa de Conclusão
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="flex items-end gap-2">
              <span className="text-5xl font-bold">{metrics.completionRate.total}%</span>
              <span className="text-lg text-muted-foreground mb-2">Concluídas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400">
              {metrics.completionRate.change} vs período anterior
            </Badge>

            <div className="mt-6 space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarefas no prazo</span>
                  <span className="font-bold text-green-600 dark:text-green-400">
                    {metrics.completionRate.onTime} tarefas
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${(metrics.completionRate.onTime / (metrics.completionRate.onTime + metrics.completionRate.delayed)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tarefas atrasadas</span>
                  <span className="font-bold text-red-600 dark:text-red-400">
                    {metrics.completionRate.delayed} tarefas
                  </span>
                </div>
                <div className="h-3 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-red-500"
                    style={{
                      width: `${(metrics.completionRate.delayed / (metrics.completionRate.onTime + metrics.completionRate.delayed)) * 100}%`,
                    }}
                  />
                </div>
              </div>
              <div className="p-4 bg-blue-50 dark:bg-blue-950 rounded-lg mt-4">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  <strong>Desempenho excelente!</strong> A equipe está mantendo {metrics.completionRate.total}% das
                  tarefas concluídas, com {metrics.completionRate.onTime} entregas no prazo.
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <div className="space-y-4 mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Tarefas de Manutenção</h2>

          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "kanban" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("kanban")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Kanban
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="h-4 w-4 mr-2" />
              Lista
            </Button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex items-center gap-3 flex-wrap">
          {periodFilter !== "30days" && (
            <Badge variant="secondary" className="gap-1">
              Período: {getPeriodLabel(periodFilter)}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setPeriodFilter("30days")} />
            </Badge>
          )}

          {priorityFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Prioridade: {priorityFilter === "high" ? "Alta" : priorityFilter === "normal" ? "Normal" : "Baixa"}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setPriorityFilter("all")} />
            </Badge>
          )}

          {stageFilter !== "all" && (
            <Badge variant="secondary" className="gap-1">
              Estágio: {getStatusLabel(stageFilter)}
              <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setStageFilter("all")} />
            </Badge>
          )}
        </div>

        {/* Kanban Board */}
        {viewMode === "kanban" && <KanbanBoard tasks={filteredTasks} />}
      </div>

      <MetricsReportModal
        open={metricsReportOpen}
        onClose={() => setMetricsReportOpen(false)}
        reportType="tasks"
        filters={{
          period: getPeriodLabel(periodFilter),
          priority: priorityFilter !== "all" ? priorityFilter : undefined,
          status: stageFilter !== "all" ? getStatusLabel(stageFilter) : undefined,
        }}
        data={{
          periodData: currentPeriodData,
          machines: filteredMachines,
          tasks: filteredTasks,
        }}
      />
    </div>
  )
}
