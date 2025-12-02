"use client"

import type React from "react"
import { useState, useMemo } from "react"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MoreVertical,
  Plus,
  MessageSquare,
  Users,
  Clock,
  Calendar,
  Tag,
  Star,
  FileText,
  AlertCircle,
  Search,
  ChevronDown,
  TrendingUp,
  Activity,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { NewTaskModal } from "@/components/new-task-modal"

interface Task {
  id: string
  title: string
  description?: string
  tags: string[]
  priority: "low" | "medium" | "high"
  progress: number
  comments: number
  attachments: number
  assignees: { name: string; avatar?: string }[]
  dueDate: string
  createdAt: string
  status: string
  machine?: string
  location?: string
  notes?: string
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const availableProjects = [
  { id: "manutencao", name: "Manutenção Preventiva" },
  { id: "corretiva", name: "Manutenção Corretiva" },
  { id: "automacao", name: "Automação Industrial" },
  { id: "upgrade", name: "Upgrade de Equipamentos" },
  { id: "calibracao", name: "Calibração de Sensores" },
]

const teamMembers = [
  { id: "1", name: "João Silva", avatar: undefined },
  { id: "2", name: "Maria Santos", avatar: undefined },
  { id: "3", name: "Carlos Oliveira", avatar: undefined },
  { id: "4", name: "Ana Costa", avatar: undefined },
  { id: "5", name: "Pedro Alves", avatar: undefined },
  { id: "6", name: "Lucas Mendes", avatar: undefined },
  { id: "7", name: "Fernanda Lima", avatar: undefined },
  { id: "8", name: "Roberto Santos", avatar: undefined },
  { id: "9", name: "Juliana Rocha", avatar: undefined },
  { id: "10", name: "Marcos Ferreira", avatar: undefined },
]

export function KanbanBoard() {
  const [selectedProject, setSelectedProject] = useState(availableProjects[0])
  const [showProjectList, setShowProjectList] = useState(false)
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false)

  const [selectedPeriod, setSelectedPeriod] = useState<"30days" | "3months" | "6months">("30days")
  const [selectedPriority, setSelectedPriority] = useState<string>("all")
  const [selectedStage, setSelectedStage] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const [selectedMetric, setSelectedMetric] = useState<string | null>(null)

  const [activeTab, setActiveTab] = useState<"manual" | "automated">("manual")

  const metrics = useMemo(() => {
    const baseMetrics = {
      "30days": {
        members: 24,
        membersDelta: "+2 desde último mês",
        projects: 12,
        projectsDelta: "+10.4% 9 projetos no último mês",
        hours: 1248,
        hoursDelta: "+15% vs período anterior",
        completion: 87,
        completionDelta: "+3% vs período anterior",
      },
      "3months": {
        members: 28,
        membersDelta: "+6 desde 3 meses atrás",
        projects: 35,
        projectsDelta: "+18.2% 30 projetos nos últimos 3 meses",
        hours: 3840,
        hoursDelta: "+22% vs trimestre anterior",
        completion: 84,
        completionDelta: "+5% trimestre anterior",
      },
      "6months": {
        members: 32,
        membersDelta: "+8 desde 6 meses atrás",
        projects: 68,
        projectsDelta: "+25.4% 54 projetos nos últimos 6 meses",
        hours: 7520,
        hoursDelta: "+28% vs semestre anterior",
        completion: 82,
        completionDelta: "+7% vs semestre anterior",
      },
    }
    return baseMetrics[selectedPeriod]
  }, [selectedPeriod])

  const [columns, setColumns] = useState<Column[]>([
    {
      id: "todo",
      title: "A Fazer",
      tasks: [
        {
          id: "1",
          title: "Inspeção de bomba centrífuga",
          description: "Verificar condição do impelidor e selo mecânico",
          tags: ["manutenção", "urgente"],
          priority: "high",
          progress: 0,
          comments: 3,
          attachments: 2,
          assignees: [
            { name: "João Silva", avatar: undefined },
            { name: "Maria Santos", avatar: undefined },
          ],
          dueDate: "2025-11-20",
          createdAt: "2025-11-15",
          status: "A Fazer",
          machine: "Bomba Centrífuga BC-101",
          location: "Setor de Produção A",
        },
        {
          id: "2",
          title: "Calibração de sensores",
          description: "Calibrar sensores de temperatura e pressão",
          tags: ["automação", "preventiva"],
          priority: "medium",
          progress: 15,
          comments: 1,
          attachments: 1,
          assignees: [{ name: "Carlos Oliveira", avatar: undefined }],
          dueDate: "2025-11-22",
          createdAt: "2025-11-16",
          status: "A Fazer",
          machine: "Sensor Industrial SI-205",
          location: "Linha de Montagem 3",
        },
      ],
    },
    {
      id: "in-progress",
      title: "Em Progresso",
      tasks: [
        {
          id: "3",
          title: "Troca de óleo do compressor",
          description: "Substituir óleo e filtros do compressor industrial",
          tags: ["manutenção", "rotina"],
          priority: "medium",
          progress: 65,
          comments: 5,
          attachments: 3,
          assignees: [
            { name: "Ana Costa", avatar: undefined },
            { name: "Pedro Alves", avatar: undefined },
            { name: "Lucas Mendes", avatar: undefined },
          ],
          dueDate: "2025-11-19",
          createdAt: "2025-11-12",
          status: "Em Progresso",
          machine: "Compressor Industrial CI-450",
          location: "Oficina Central",
        },
        {
          id: "4",
          title: "Implementar automação de lubrificação",
          description: "Instalar sistema automático de lubrificação",
          tags: ["automação", "upgrade"],
          priority: "low",
          progress: 40,
          comments: 8,
          attachments: 5,
          assignees: [
            { name: "Fernanda Lima", avatar: undefined },
            { name: "Roberto Santos", avatar: undefined },
          ],
          dueDate: "2025-11-25",
          createdAt: "2025-11-10",
          status: "Em Progresso",
          machine: "Sistema de Lubrificação SL-320",
          location: "Galpão B",
        },
      ],
    },
    {
      id: "review",
      title: "Em Revisão",
      tasks: [
        {
          id: "5",
          title: "Revisão de motor elétrico",
          description: "Análise completa após manutenção",
          tags: ["inspeção", "qualidade"],
          priority: "medium",
          progress: 90,
          comments: 4,
          attachments: 2,
          assignees: [
            { name: "Juliana Rocha", avatar: undefined },
            { name: "Marcos Ferreira", avatar: undefined },
          ],
          dueDate: "2025-11-18",
          createdAt: "2025-11-08",
          status: "Em Revisão",
          machine: "Motor Elétrico ME-780",
          location: "Setor de Produção B",
        },
        {
          id: "6",
          title: "Teste de válvula de segurança",
          description: "Testes de pressão e vazão",
          tags: ["teste", "segurança"],
          priority: "high",
          progress: 85,
          comments: 2,
          attachments: 1,
          assignees: [{ name: "Patrícia Souza", avatar: undefined }],
          dueDate: "2025-11-21",
          createdAt: "2025-11-14",
          status: "Em Revisão",
          machine: "Válvula de Segurança VS-112",
          location: "Sistema de Vapor",
        },
      ],
    },
    {
      id: "done",
      title: "Concluído",
      tasks: [
        {
          id: "7",
          title: "Atualização de firmware CNC",
          description: "Firmware atualizado com sucesso",
          tags: ["automação", "atualização"],
          priority: "low",
          progress: 100,
          comments: 6,
          attachments: 4,
          assignees: [
            { name: "Ricardo Gomes", avatar: undefined },
            { name: "Camila Dias", avatar: undefined },
          ],
          dueDate: "2025-11-17",
          createdAt: "2025-11-05",
          status: "Concluído",
          machine: "CNC CNC-950",
          location: "Oficina de Usinagem",
        },
      ],
    },
  ])

  const filteredColumns = useMemo(() => {
    return columns.map((column) => ({
      ...column,
      tasks: column.tasks.filter((task) => {
        // Filter by priority
        if (selectedPriority !== "all" && task.priority !== selectedPriority) {
          return false
        }

        // Filter by stage (column)
        if (selectedStage !== "all" && column.id !== selectedStage) {
          return false
        }

        // Filter by search query
        if (searchQuery.trim() !== "") {
          const query = searchQuery.toLowerCase()
          const matchesTitle = task.title.toLowerCase().includes(query)
          const matchesDescription = task.description?.toLowerCase().includes(query)
          const matchesTags = task.tags.some((tag) => tag.toLowerCase().includes(query))
          const matchesMachine = task.machine?.toLowerCase().includes(query)

          if (!matchesTitle && !matchesDescription && !matchesTags && !matchesMachine) {
            return false
          }
        }

        return true
      }),
    }))
  }, [columns, selectedPriority, selectedStage, searchQuery])

  const [draggedTask, setDraggedTask] = useState<{ task: Task; columnId: string } | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)

  const getPriorityBorderColor = (priority: string) => {
    const colors = {
      low: "border-l-green-500",
      medium: "border-l-orange-500",
      high: "border-l-red-500",
    }
    return colors[priority as keyof typeof colors] || "border-l-gray-400"
  }

  const getPriorityBadgeColor = (priority: string) => {
    const colors = {
      low: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
      medium: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400",
      high: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    }
    return colors[priority as keyof typeof colors] || "bg-gray-100 text-gray-700"
  }

  const getProgressColor = (progress: number) => {
    if (progress < 30) return "bg-orange-500"
    if (progress < 70) return "bg-blue-500"
    return "bg-green-500"
  }

  const handleDragStart = (task: Task, columnId: string) => {
    setDraggedTask({ task, columnId })
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (targetColumnId: string) => {
    if (!draggedTask) return

    const { task, columnId: sourceColumnId } = draggedTask

    if (sourceColumnId === targetColumnId) {
      setDraggedTask(null)
      return
    }

    setColumns((prevColumns) => {
      const newColumns = prevColumns.map((col) => {
        if (col.id === sourceColumnId) {
          return { ...col, tasks: col.tasks.filter((t) => t.id !== task.id) }
        }
        if (col.id === targetColumnId) {
          return { ...col, tasks: [...col.tasks, task] }
        }
        return col
      })
      return newColumns
    })

    setDraggedTask(null)
  }

  const getTagColor = (tag: string) => {
    const tagColors: Record<string, string> = {
      manutenção: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
      urgente: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300",
      automação: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
      preventiva: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
      rotina: "bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300",
      upgrade: "bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300",
      inspeção: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
      qualidade: "bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300",
      teste: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
      segurança: "bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300",
      atualização: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300",
    }
    return tagColors[tag] || "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
  }

  const getInitials = (name: string) => {
    const names = name.split(" ")
    if (names.length >= 2) {
      return `${names[0][0]}${names[names.length - 1][0]}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }

  return (
    <div className="space-y-6 mt-4">
      <div className="flex items-center gap-2">
        <Button
          variant={selectedPeriod === "30days" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("30days")}
          className={cn(
            selectedPeriod === "30days"
              ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              : "dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800",
          )}
        >
          30 Dias
        </Button>
        <Button
          variant={selectedPeriod === "3months" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("3months")}
          className={cn(
            selectedPeriod === "3months"
              ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              : "dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800",
          )}
        >
          3 Meses
        </Button>
        <Button
          variant={selectedPeriod === "6months" ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedPeriod("6months")}
          className={cn(
            selectedPeriod === "6months"
              ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
              : "dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100 dark:hover:bg-gray-800",
          )}
        >
          6 Meses
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card
          className="p-4 bg-background dark:bg-gray-950 border-border dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedMetric("members")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
              <Users className="h-4 w-4" />
              <span className="text-sm">Membros da Equipe</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground dark:text-gray-100">{metrics.members}</span>
              <span className="text-sm text-muted-foreground dark:text-gray-400">Membros</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {metrics.membersDelta}
            </Badge>
          </div>
        </Card>

        <Card
          className="p-4 bg-background dark:bg-gray-950 border-border dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedMetric("projects")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
              <FileText className="h-4 w-4" />
              <span className="text-sm">Projetos Ativos</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground dark:text-gray-100">{metrics.projects}</span>
              <span className="text-sm text-muted-foreground dark:text-gray-400">Projetos</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {metrics.projectsDelta}
            </Badge>
          </div>
        </Card>

        <Card
          className="p-4 bg-background dark:bg-gray-950 border-border dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedMetric("hours")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span className="text-sm">Horas Trabalhadas</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground dark:text-gray-100">{metrics.hours}</span>
              <span className="text-sm text-muted-foreground dark:text-gray-400">Horas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {metrics.hoursDelta}
            </Badge>
          </div>
        </Card>

        <Card
          className="p-4 bg-background dark:bg-gray-950 border-border dark:border-gray-800 cursor-pointer hover:shadow-lg transition-shadow"
          onClick={() => setSelectedMetric("completion")}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 text-muted-foreground dark:text-gray-400">
              <TrendingUp className="h-4 w-4" />
              <span className="text-sm">Taxa de Conclusão</span>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground dark:text-gray-500" />
          </div>
          <div className="space-y-2">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold text-foreground dark:text-gray-100">{metrics.completion}%</span>
              <span className="text-sm text-muted-foreground dark:text-gray-400">Concluídas</span>
            </div>
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {metrics.completionDelta}
            </Badge>
          </div>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "manual" | "automated")} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="manual">Tarefas Manuais</TabsTrigger>
          <TabsTrigger value="automated">Atividades Automáticas</TabsTrigger>
        </TabsList>

        <TabsContent value="manual" className="space-y-4">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            <div className="flex items-center gap-4">
              {/* Project Selector */}
              <div className="relative">
                <Button
                  variant="outline"
                  className="gap-2 bg-background border-blue-500/30 hover:border-blue-500 dark:bg-gray-950 dark:border-blue-500/50 dark:hover:border-blue-400 dark:text-gray-100"
                  onClick={() => setShowProjectList(!showProjectList)}
                >
                  <span className="text-sm text-muted-foreground dark:text-gray-400">Projeto:</span>
                  <span className="font-medium text-foreground dark:text-gray-100">{selectedProject.name}</span>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>

                {showProjectList && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-background dark:bg-gray-950 border border-border dark:border-gray-800 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-border dark:border-gray-800">
                      <div className="relative">
                        <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500" />
                        <input
                          type="text"
                          placeholder="Buscar projeto..."
                          className="w-full pl-8 pr-3 py-2 text-sm border border-border dark:border-gray-800 bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                        />
                      </div>
                    </div>
                    <div className="p-1">
                      {availableProjects.map((project) => (
                        <button
                          key={project.id}
                          onClick={() => {
                            setSelectedProject(project)
                            setShowProjectList(false)
                          }}
                          className={cn(
                            "w-full text-left px-3 py-2 text-sm rounded-md hover:bg-muted dark:hover:bg-gray-900 transition-colors text-foreground dark:text-gray-100",
                            selectedProject.id === project.id && "bg-muted dark:bg-gray-900 font-medium",
                          )}
                        >
                          {project.name}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center -space-x-2">
                {teamMembers.slice(0, 3).map((member) => (
                  <Avatar
                    key={member.id}
                    className="h-9 w-9 border-2 border-background dark:border-gray-950 hover:z-10 transition-transform hover:scale-110 cursor-pointer"
                  >
                    <AvatarImage src={member.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-xs font-semibold bg-gray-200 text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                      {getInitials(member.name)}
                    </AvatarFallback>
                  </Avatar>
                ))}
                <div className="flex items-center justify-center h-9 w-9 rounded-full bg-muted dark:bg-gray-900 border-2 border-background dark:border-gray-950 text-xs font-semibold cursor-pointer hover:bg-muted/80 dark:hover:bg-gray-800 transition-colors text-foreground dark:text-gray-100">
                  +{teamMembers.length - 3}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Select value={selectedPriority} onValueChange={setSelectedPriority}>
                <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100">
                  <SelectValue placeholder="Todas prioridades" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  <SelectItem value="all">Todas prioridades</SelectItem>
                  <SelectItem value="high">Alta prioridade</SelectItem>
                  <SelectItem value="medium">Média prioridade</SelectItem>
                  <SelectItem value="low">Baixa prioridade</SelectItem>
                </SelectContent>
              </Select>

              <Select value={selectedStage} onValueChange={setSelectedStage}>
                <SelectTrigger className="w-[180px] dark:bg-gray-900 dark:border-gray-800 dark:text-gray-100">
                  <SelectValue placeholder="Todos estágios" />
                </SelectTrigger>
                <SelectContent className="dark:bg-gray-950 dark:border-gray-800">
                  <SelectItem value="all">Todos estágios</SelectItem>
                  <SelectItem value="todo">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Buscar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-3 py-2 text-sm border border-border dark:border-gray-800 bg-background dark:bg-gray-900 text-foreground dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <Button
                onClick={() => setNewTaskModalOpen(true)}
                variant="default"
                size="sm"
                className="bg-blue-500 hover:bg-blue-600 text-white dark:bg-blue-600 dark:hover:bg-blue-500"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          <div className="w-full overflow-x-auto">
            <div className="flex gap-4 pb-4 min-w-full">
              {filteredColumns.map((column) => (
                <div
                  key={column.id}
                  className="flex-1 min-w-[320px] rounded-lg p-4 bg-gray-100 dark:bg-gray-900/90 border border-gray-300 dark:border-gray-800"
                  onDragOver={handleDragOver}
                  onDrop={() => handleDrop(column.id)}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900 dark:text-gray-100">{column.title}</h3>
                      <Badge className="rounded-full bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500">
                        {column.tasks.length}
                      </Badge>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 hover:bg-gray-200 dark:hover:bg-gray-800 dark:text-gray-100"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-3 max-h-[calc(100vh-400px)] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-700 scrollbar-track-transparent">
                    {column.tasks.map((task) => (
                      <Card
                        key={task.id}
                        draggable
                        onDragStart={() => handleDragStart(task, column.id)}
                        onClick={() => setSelectedTask(task)}
                        className={cn(
                          "p-3 border-l-4 bg-white dark:bg-gray-950 border border-gray-200 dark:border-gray-800 hover:shadow-lg dark:hover:shadow-gray-950/50 transition-all cursor-pointer",
                          getPriorityBorderColor(task.priority),
                          draggedTask?.task.id === task.id && "opacity-50",
                        )}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex flex-wrap gap-1.5">
                            {task.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className={cn("text-xs font-medium", getTagColor(tag))}
                              >
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 -mt-1 -mr-1 hover:bg-gray-100 dark:hover:bg-gray-900 dark:text-gray-100"
                          >
                            <MoreVertical className="h-3.5 w-3.5" />
                          </Button>
                        </div>

                        <h4 className="font-medium text-sm mb-2 text-gray-900 dark:text-gray-100 line-clamp-2">
                          {task.title}
                        </h4>

                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-2">
                          <div className="flex items-center gap-1.5">
                            {task.assignees[0] && (
                              <Avatar className="h-5 w-5">
                                <AvatarImage src={task.assignees[0].avatar || "/placeholder.svg"} />
                                <AvatarFallback className="text-[10px] font-semibold bg-gray-200 text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                                  {getInitials(task.assignees[0].name)}
                                </AvatarFallback>
                              </Avatar>
                            )}
                            <span className="truncate max-w-[100px]">{task.assignees[0]?.name}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>
                              {new Date(task.dueDate).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" })}
                            </span>
                          </div>
                        </div>

                        <div className="border-t border-gray-200 dark:border-gray-800 my-2" />

                        <div className="space-y-2">
                          <div className="flex justify-between text-xs">
                            <span className="text-gray-600 dark:text-gray-400">Progresso</span>
                            <span className="font-medium text-gray-900 dark:text-gray-100">{task.progress}%</span>
                          </div>
                          <Progress
                            value={task.progress}
                            className="h-1.5 bg-gray-200 dark:bg-gray-800"
                            indicatorClassName={getProgressColor(task.progress)}
                          />
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="automated" className="space-y-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Atividades Automáticas</h3>
                <p className="text-sm text-muted-foreground">
                  Tarefas programadas para execução automática em máquinas
                </p>
              </div>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Nova Atividade Automática
              </Button>
            </div>

            <div className="space-y-3">
              {/* Example automated tasks */}
              <Card className="p-4 border-l-4 border-l-blue-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">Lubrificação Automática - CNC-950</h4>
                      <Badge className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">Ativa</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Sistema de lubrificação programado para executar a cada 4 horas
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Próxima execução: 14:30</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Duração: 15 min</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-emerald-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">Movimentação Empilhadeira E-400</h4>
                      <Badge className="bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                        Em Execução
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Transferência automática de paletes do Corredor 1 para Corredor 3
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>Iniciado: 11:15</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Tempo restante: 45 min</span>
                      </div>
                    </div>
                    <Progress value={35} className="mt-3 h-2" />
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 text-red-600 hover:bg-red-100 dark:bg-red-900/20 dark:text-red-400"
                  >
                    Pausar
                  </Button>
                </div>
              </Card>

              <Card className="p-4 border-l-4 border-l-amber-500">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">Inspeção Robô BR-700</h4>
                      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
                        Agendada
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      Inspeção visual automática de componentes na linha de montagem
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Agendado para: 21/11/2025 08:00</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Activity className="h-3 w-3" />
                        <span>Duração estimada: 2h</span>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </Card>
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <Dialog open={!!selectedMetric} onOpenChange={(open) => !open && setSelectedMetric(null)}>
        <DialogContent className="max-w-2xl bg-background dark:bg-gray-950 border-border dark:border-gray-800">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-foreground dark:text-gray-100 flex items-center gap-2">
                {selectedMetric === "members" && (
                  <>
                    <Users className="h-5 w-5" /> Detalhes da Equipe
                  </>
                )}
                {selectedMetric === "projects" && (
                  <>
                    <FileText className="h-5 w-5" /> Detalhes dos Projetos
                  </>
                )}
                {selectedMetric === "hours" && (
                  <>
                    <Clock className="h-5 w-5" /> Detalhes das Horas
                  </>
                )}
                {selectedMetric === "completion" && (
                  <>
                    <TrendingUp className="h-5 w-5" /> Detalhes da Conclusão
                  </>
                )}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-bold text-foreground dark:text-gray-100">
                {selectedMetric === "members" && metrics.members}
                {selectedMetric === "projects" && metrics.projects}
                {selectedMetric === "hours" && metrics.hours}
                {selectedMetric === "completion" && `${metrics.completion}%`}
              </span>
              <span className="text-lg text-muted-foreground dark:text-gray-400">
                {selectedMetric === "members" && "Membros"}
                {selectedMetric === "projects" && "Projetos"}
                {selectedMetric === "hours" && "Horas"}
                {selectedMetric === "completion" && "Concluídas"}
              </span>
            </div>

            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
              {selectedMetric === "members" && metrics.membersDelta}
              {selectedMetric === "projects" && metrics.projectsDelta}
              {selectedMetric === "hours" && metrics.hoursDelta}
              {selectedMetric === "completion" && metrics.completionDelta}
            </Badge>

            {selectedMetric === "members" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground dark:text-gray-100">Distribuição por Função</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Técnicos de Manutenção</span>
                      <span className="font-medium text-foreground dark:text-gray-100">8 Pessoas</span>
                    </div>
                    <Progress
                      value={33}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Engenheiros</span>
                      <span className="font-medium text-foreground dark:text-gray-100">6 Pessoas</span>
                    </div>
                    <Progress
                      value={25}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Operadores</span>
                      <span className="font-medium text-foreground dark:text-gray-100">10 Pessoas</span>
                    </div>
                    <Progress
                      value={42}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMetric === "projects" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground dark:text-gray-100">Distribuição por Status</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Concluídos</span>
                      <span className="font-medium text-foreground dark:text-gray-100">45 Projetos</span>
                    </div>
                    <Progress
                      value={66}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Em Andamento</span>
                      <span className="font-medium text-foreground dark:text-gray-100">
                        {metrics.projects} Projetos
                      </span>
                    </div>
                    <Progress
                      value={18}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Planejados</span>
                      <span className="font-medium text-foreground dark:text-gray-100">11 Projetos</span>
                    </div>
                    <Progress
                      value={16}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-orange-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMetric === "hours" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground dark:text-gray-100">
                  Distribuição por Departamento
                </h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Manutenção Preventiva</span>
                      <span className="font-medium text-foreground dark:text-gray-100">520 Horas</span>
                    </div>
                    <Progress
                      value={42}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Manutenção Corretiva</span>
                      <span className="font-medium text-foreground dark:text-gray-100">428 Horas</span>
                    </div>
                    <Progress
                      value={34}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Automação</span>
                      <span className="font-medium text-foreground dark:text-gray-100">300 Horas</span>
                    </div>
                    <Progress
                      value={24}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-purple-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {selectedMetric === "completion" && (
              <div className="space-y-4">
                <h4 className="font-semibold text-sm text-foreground dark:text-gray-100">Detalhamento da Taxa</h4>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Tarefas Concluídas no Prazo</span>
                      <span className="font-medium text-foreground dark:text-gray-100">92%</span>
                    </div>
                    <Progress
                      value={92}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Tarefas com Atraso</span>
                      <span className="font-medium text-foreground dark:text-gray-100">8%</span>
                    </div>
                    <Progress value={8} className="h-2 bg-gray-200 dark:bg-gray-800" indicatorClassName="bg-red-500" />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground dark:text-gray-400">Qualidade Média</span>
                      <span className="font-medium text-foreground dark:text-gray-100">94%</span>
                    </div>
                    <Progress
                      value={94}
                      className="h-2 bg-gray-200 dark:bg-gray-800"
                      indicatorClassName="bg-blue-500"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={!!selectedTask} onOpenChange={(open) => !open && setSelectedTask(null)}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto bg-background border-border">
          {selectedTask && (
            <>
              <DialogHeader className="space-y-4">
                <div className="flex items-start justify-between">
                  <DialogTitle className="text-2xl font-bold text-foreground">{selectedTask.title}</DialogTitle>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="hover:bg-muted">
                      <Clock className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="hover:bg-muted">
                      <Star className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-6">
                <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 dark:bg-muted/20 rounded-lg border border-border">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>Criado em</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(selectedTask.createdAt).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Status</span>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 text-orange-700 dark:bg-orange-900/30">
                      {selectedTask.status}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <AlertCircle className="h-4 w-4" />
                      <span>Prioridade</span>
                    </div>
                    <Badge className={getPriorityBadgeColor(selectedTask.priority)}>
                      {selectedTask.priority === "low" && "Baixa"}
                      {selectedTask.priority === "medium" && "Média"}
                      {selectedTask.priority === "high" && "Alta"}
                    </Badge>
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>Prazo</span>
                    </div>
                    <p className="text-sm font-medium">
                      {new Date(selectedTask.dueDate).toLocaleDateString("pt-BR", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Tag className="h-4 w-4" />
                    <span>Tags</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {selectedTask.tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>Responsáveis</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {selectedTask.assignees.map((assignee, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={assignee.avatar || "/placeholder.svg"} />
                          <AvatarFallback className="text-xs font-semibold bg-gray-200 text-blue-600 dark:bg-gray-800 dark:text-blue-400">
                            {getInitials(assignee.name)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{assignee.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {selectedTask.machine && (
                  <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg space-y-3">
                    <h4 className="font-semibold text-sm">Informações do Equipamento</h4>
                    <div className="grid gap-2">
                      <div>
                        <span className="text-xs text-muted-foreground">Máquina:</span>
                        <p className="text-sm font-medium">{selectedTask.machine}</p>
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">Localização:</span>
                        <p className="text-sm font-medium">{selectedTask.location}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Descrição da Tarefa
                  </h4>
                  <p className="text-sm text-muted-foreground bg-muted/50 dark:bg-muted/20 p-4 rounded-lg">
                    {selectedTask.description ||
                      "Esta tarefa de manutenção tem como objetivo garantir o funcionamento adequado do equipamento, seguindo as normas de segurança e qualidade estabelecidas. A equipe responsável deve realizar todas as verificações necessárias e documentar os resultados."}
                  </p>
                </div>

                <Tabs defaultValue="activity" className="w-full">
                  <TabsList className="grid w-full grid-cols-4 bg-muted">
                    <TabsTrigger value="activity">Atividade</TabsTrigger>
                    <TabsTrigger value="reports">Relatórios</TabsTrigger>
                    <TabsTrigger value="notes">Anotações</TabsTrigger>
                    <TabsTrigger value="comments">Comentários</TabsTrigger>
                  </TabsList>

                  <TabsContent value="activity" className="space-y-4 mt-4">
                    <div className="space-y-3">
                      <h4 className="font-semibold text-sm">Hoje</h4>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="text-xs">JS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">João Silva</span>{" "}
                            <span className="text-muted-foreground">
                              alterou o status de "{selectedTask.title}" de{" "}
                            </span>
                            <span className="font-medium">A Fazer</span>
                            <span className="text-muted-foreground"> para </span>
                            <span className="font-medium">{selectedTask.status}</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Há 2 horas</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="text-xs">MS</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <p className="text-sm">
                            <span className="font-medium">Maria Santos</span>{" "}
                            <span className="text-muted-foreground">adicionou 2 anexos</span>
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">Há 4 horas</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="reports" className="space-y-4 mt-4">
                    <div className="p-4 bg-muted/50 dark:bg-muted/20 rounded-lg border border-border">
                      <h4 className="font-semibold text-sm mb-2">Análise Técnica</h4>
                      <p className="text-sm text-muted-foreground mb-3">
                        Última atualização: {new Date().toLocaleDateString("pt-BR")}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Tempo estimado:</span>
                          <span className="font-medium">4-6 horas</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Peças necessárias:</span>
                          <span className="font-medium">3 itens</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Custo estimado:</span>
                          <span className="font-medium">R$ 2.450,00</span>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="notes" className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Adicionar Anotação</Label>
                      <Textarea
                        id="notes"
                        placeholder="Digite suas anotações sobre esta tarefa..."
                        className="min-h-[120px] bg-background border-border"
                      />
                      <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                        Salvar Anotação
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="comments" className="space-y-4 mt-4">
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="text-xs">CO</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="bg-muted/50 dark:bg-muted/20 rounded-lg p-3">
                            <p className="text-sm font-medium mb-1">Carlos Oliveira</p>
                            <p className="text-sm text-muted-foreground">
                              Precisamos verificar também o sistema de refrigeração durante a manutenção.
                            </p>
                          </div>
                          <p className="text-xs text-muted-foreground mt-1 ml-1">Há 1 dia</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Textarea
                          placeholder="Adicionar comentário..."
                          className="min-h-[80px] bg-background border-border"
                        />
                        <Button size="sm" className="bg-blue-500 hover:bg-blue-600 text-white">
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Comentar
                        </Button>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <NewTaskModal open={newTaskModalOpen} onOpenChange={setNewTaskModalOpen} />
    </div>
  )
}
