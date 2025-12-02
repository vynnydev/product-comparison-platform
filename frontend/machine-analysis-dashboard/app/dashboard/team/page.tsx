"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Users,
  Briefcase,
  Clock,
  TrendingUp,
  FileText,
  Award,
  Calendar,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Download,
  Sparkles,
  ExternalLink,
} from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"
import { NewTaskModal } from "@/components/new-task-modal"
import { MetricsReportModal } from "@/components/metrics-report-modal"

export default function TeamDashboardPage() {
  const { user } = useAuth()
  const [selectedPeriod, setSelectedPeriod] = useState<"30days" | "3months" | "6months">("30days")
  const [taskView, setTaskView] = useState<"kanban" | "table" | "list">("kanban")
  const [newTaskModalOpen, setNewTaskModalOpen] = useState(false)
  const [newTaskColumn, setNewTaskColumn] = useState<"new" | "in_progress" | "completed">("new")
  const router = useRouter()
  const [metricsReportOpen, setMetricsReportOpen] = useState(false)

  const metricsByPeriod = {
    "30days": {
      totalEmployees: 43,
      employeeChange: 2.8,
      employeeChangeText: "+8 desde o último mês",
      jobApplicants: 130,
      applicantChange: 13.9,
      applicantChangeText: "+48 desde o último mês",
      totalSalary: 98842.0,
      salaryChange: 24,
      salaryChangeText: "+R$ 4.214,00 desde o último mês",
      attendanceRate: 56,
      attendanceChange: -17,
      attendanceChangeText: "-16.4% desde o último mês",
    },
    "3months": {
      totalEmployees: 51,
      employeeChange: 18.6,
      employeeChangeText: "+15 desde 3 meses atrás",
      jobApplicants: 387,
      applicantChange: 29.8,
      applicantChangeText: "+142 desde 3 meses atrás",
      totalSalary: 287456.0,
      salaryChange: 31,
      salaryChangeText: "+R$ 12.845,00 desde 3 meses atrás",
      attendanceRate: 68,
      attendanceChange: 8,
      attendanceChangeText: "+8.2% desde 3 meses atrás",
    },
    "6months": {
      totalEmployees: 63,
      employeeChange: 46.5,
      employeeChangeText: "+28 desde 6 meses atrás",
      jobApplicants: 742,
      applicantChange: 54.2,
      applicantChangeText: "+278 desde 6 meses atrás",
      totalSalary: 562890.0,
      salaryChange: 47,
      salaryChangeText: "+R$ 24.560,00 desde 6 meses atrás",
      attendanceRate: 73,
      attendanceChange: 15,
      attendanceChangeText: "+15.3% desde 6 meses atrás",
    },
  }

  const teamMetrics = metricsByPeriod[selectedPeriod]

  const teamDistribution = [
    { role: "Técnicos de Manutenção", count: 8, color: "bg-blue-500" },
    { role: "Engenheiros", count: 6, color: "bg-orange-500" },
    { role: "Operadores", count: 10, color: "bg-purple-500" },
    { role: "Analistas", count: 5, color: "bg-green-500" },
    { role: "Supervisores", count: 4, color: "bg-yellow-500" },
  ]

  const attendanceHeatmap = Array.from({ length: 12 }, (_, month) =>
    Array.from({ length: 4 }, (_, week) => ({
      month,
      week,
      value: Math.floor(Math.random() * 100),
    })),
  ).flat()

  const [tasks, setTasks] = useState([
    {
      id: "1",
      title: "Finalizar Documentos de Onboarding",
      description: "Review and complete the digital onboarding documents for Emma Clarkson (Marketing Department).",
      tags: ["Documents", "Marketings", "Emma Clarkson"],
      status: "new" as const,
      color: "blue",
    },
    {
      id: "2",
      title: "Publicar Vaga: Designer UI/UX",
      description:
        "Prepare and publish a compelling job listing for the UI/UX Designer role under the Product Design team.",
      tags: ["Job Opening", "Designer", "Published"],
      status: "in_progress" as const,
      color: "orange",
    },
    {
      id: "3",
      title: "Aprovar Pedido de Férias Anual",
      description:
        "Daniel has submitted a leave request from April 20 to April 25 (5 business days) for personal reasons.",
      tags: ["Annual", "Report", "Daniel Rodriguez"],
      status: "completed" as const,
      color: "green",
    },
  ])

  const isAdmin = user?.role === "master" || user?.role === "admin"

  const handleAddTask = (column: "new" | "in_progress" | "completed") => {
    setNewTaskColumn(column)
    setNewTaskModalOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
            Dashboard de Equipe
          </h1>
          <p className="text-muted-foreground mt-1">
            {isAdmin
              ? "Visão completa de todas as equipes e métricas da empresa"
              : `Métricas e desempenho da sua equipe`}
          </p>
        </div>
        <Button
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
          onClick={() => setMetricsReportOpen(true)}
        >
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Period Filter */}
      <div className="flex items-center gap-2">
        {(["30days", "3months", "6months"] as const).map((period) => (
          <Button
            key={period}
            variant={selectedPeriod === period ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedPeriod(period)}
          >
            {period === "30days" ? "30 Dias" : period === "3months" ? "3 Meses" : "6 Meses"}
          </Button>
        ))}
      </div>

      {/* Top Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Employees */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4 text-muted-foreground" />
              Total de Funcionários
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.totalEmployees}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.employeeChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">{teamMetrics.employeeChangeText}</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Detalhes →
            </Button>
          </CardContent>
        </Card>

        {/* Job Applicants */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              Candidatos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.jobApplicants}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.applicantChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">{teamMetrics.applicantChangeText}</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Detalhes →
            </Button>
          </CardContent>
        </Card>

        {/* Total Salary */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
              Salário Total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">
              R$ {teamMetrics.totalSalary.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                <ArrowUp className="h-3 w-3 mr-1" />
                {teamMetrics.salaryChange}%
              </Badge>
              <span className="text-xs text-muted-foreground">{teamMetrics.salaryChangeText}</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Detalhes →
            </Button>
          </CardContent>
        </Card>

        {/* Attendance Rate */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              Taxa de Presença
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{teamMetrics.attendanceRate}%</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className={
                  teamMetrics.attendanceChange < 0
                    ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                    : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                }
              >
                {teamMetrics.attendanceChange < 0 ? (
                  <ArrowDown className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowUp className="h-3 w-3 mr-1" />
                )}
                {Math.abs(teamMetrics.attendanceChange)}%
              </Badge>
              <span className="text-xs text-muted-foreground">{teamMetrics.attendanceChangeText}</span>
            </div>
            <Button variant="link" size="sm" className="mt-2 p-0 h-auto text-blue-600">
              Detalhes →
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Middle Section: Team Distribution & Attendance Report */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Team Distribution */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Membros da Equipe</CardTitle>
              </div>
              <Button variant="outline" size="sm" onClick={() => router.push("/dashboard/employees")} className="gap-2">
                <ExternalLink className="h-4 w-4" />
                Ver Todos
              </Button>
            </div>
            <CardDescription>Distribuição por função</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {teamDistribution.map((team) => (
              <div key={team.role} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{team.role}</span>
                  <span className="font-medium">{team.count} Pessoas</span>
                </div>
                <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${team.color}`}
                    style={{ width: `${(team.count / teamMetrics.totalEmployees) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Attendance Heatmap */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-muted-foreground" />
                <CardTitle>Relatório de Presença</CardTitle>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="font-bold text-2xl">{teamMetrics.totalEmployees}</span>
                  <span className="text-muted-foreground ml-2">Total</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">22</span>
                  <span className="text-muted-foreground ml-2">No Horário</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">19</span>
                  <span className="text-muted-foreground ml-2">Ausente</span>
                </div>
                <div>
                  <span className="font-bold text-2xl">05</span>
                  <span className="text-muted-foreground ml-2">Atrasado</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-12 gap-1">
              {attendanceHeatmap.map((cell, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-sm"
                  style={{
                    backgroundColor:
                      cell.value > 75
                        ? "rgb(99, 102, 241)"
                        : cell.value > 50
                          ? "rgb(139, 92, 246)"
                          : cell.value > 25
                            ? "rgb(168, 85, 247)"
                            : "rgb(192, 132, 252)",
                    opacity: cell.value / 100,
                  }}
                />
              ))}
            </div>
            <div className="flex items-center justify-between mt-4 text-xs text-muted-foreground">
              <span>Jan</span>
              <span>Fev</span>
              <span>Mar</span>
              <span>Abr</span>
              <span>Mai</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
        <CardHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <CardTitle>Insights de IA</CardTitle>
              <CardDescription>Análise preditiva da performance da equipe</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <TrendingUp className="h-5 w-5 text-green-500 mt-0.5" />
            <div>
              <p className="font-medium">Performance em Alta</p>
              <p className="text-sm text-muted-foreground mt-1">
                A equipe de técnicos aumentou a produtividade em 18% no último mês, com 95% das manutenções preventivas
                concluídas no prazo.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <Award className="h-5 w-5 text-blue-500 mt-0.5" />
            <div>
              <p className="font-medium">Sugestão de Reconhecimento</p>
              <p className="text-sm text-muted-foreground mt-1">
                Carlos Oliveira completou 15 análises de máquinas esta semana, 40% acima da média. Considere um
                reconhecimento formal.
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3 p-4 bg-white dark:bg-gray-900 rounded-lg border">
            <FileText className="h-5 w-5 text-orange-500 mt-0.5" />
            <div>
              <p className="font-medium">Atenção Necessária</p>
              <p className="text-sm text-muted-foreground mt-1">
                Taxa de presença abaixo do esperado na última semana. Recomenda-se revisar cronogramas e identificar
                possíveis causas.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Tarefas</CardTitle>
            <div className="flex items-center gap-2">
              <Tabs value={taskView} onValueChange={(v) => setTaskView(v as any)}>
                <TabsList>
                  <TabsTrigger value="kanban">Kanban</TabsTrigger>
                  <TabsTrigger value="table">Tabela</TabsTrigger>
                  <TabsTrigger value="list">Lista</TabsTrigger>
                </TabsList>
              </Tabs>
              <Button variant="outline" size="sm">
                Filtrar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {taskView === "kanban" && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* New Request */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <span className="font-medium">Novas Solicitações</span>
                    <Badge variant="secondary">{tasks.filter((t) => t.status === "new").length}</Badge>
                  </div>
                </div>
                {tasks
                  .filter((t) => t.status === "new")
                  .map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-blue-500">
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                <Button variant="ghost" className="w-full border-2 border-dashed" onClick={() => handleAddTask("new")}>
                  + Adicionar
                </Button>
              </div>

              {/* In Progress */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-orange-500" />
                    <span className="font-medium">Em Progresso</span>
                    <Badge variant="secondary">{tasks.filter((t) => t.status === "in_progress").length}</Badge>
                  </div>
                </div>
                {tasks
                  .filter((t) => t.status === "in_progress")
                  .map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-orange-500">
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed"
                  onClick={() => handleAddTask("in_progress")}
                >
                  + Adicionar
                </Button>
              </div>

              {/* Completed */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-green-500" />
                    <span className="font-medium">Concluídas</span>
                    <Badge variant="secondary">{tasks.filter((t) => t.status === "completed").length}</Badge>
                  </div>
                </div>
                {tasks
                  .filter((t) => t.status === "completed")
                  .map((task) => (
                    <Card key={task.id} className="border-l-4 border-l-green-500">
                      <CardContent className="pt-4 space-y-2">
                        <div className="flex gap-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                        <h4 className="font-medium">{task.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{task.description}</p>
                      </CardContent>
                    </Card>
                  ))}
                <Button
                  variant="ghost"
                  className="w-full border-2 border-dashed"
                  onClick={() => handleAddTask("completed")}
                >
                  + Adicionar
                </Button>
              </div>
            </div>
          )}

          {taskView === "table" && (
            <div className="border rounded-lg">
              <table className="w-full">
                <thead className="bg-muted/50">
                  <tr>
                    <th className="text-left p-3 font-medium">Status</th>
                    <th className="text-left p-3 font-medium">Título</th>
                    <th className="text-left p-3 font-medium">Etiquetas</th>
                    <th className="text-left p-3 font-medium">Descrição</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => (
                    <tr key={task.id} className="border-t hover:bg-muted/30 transition-colors">
                      <td className="p-3">
                        <Badge
                          variant="secondary"
                          className={
                            task.status === "new"
                              ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                              : task.status === "in_progress"
                                ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {task.status === "new"
                            ? "Nova"
                            : task.status === "in_progress"
                              ? "Em Progresso"
                              : "Concluída"}
                        </Badge>
                      </td>
                      <td className="p-3 font-medium">{task.title}</td>
                      <td className="p-3">
                        <div className="flex gap-1 flex-wrap">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted-foreground">{task.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {taskView === "list" && (
            <div className="space-y-3">
              {tasks.map((task) => (
                <Card key={task.id}>
                  <CardContent className="pt-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge
                            variant="secondary"
                            className={
                              task.status === "new"
                                ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                : task.status === "in_progress"
                                  ? "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
                                  : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            }
                          >
                            {task.status === "new"
                              ? "Nova Solicitação"
                              : task.status === "in_progress"
                                ? "Em Progresso"
                                : "Concluída"}
                          </Badge>
                        </div>
                        <h4 className="font-semibold text-lg">{task.title}</h4>
                        <p className="text-sm text-muted-foreground">{task.description}</p>
                        <div className="flex gap-2">
                          {task.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <NewTaskModal open={newTaskModalOpen} onOpenChange={setNewTaskModalOpen} defaultStatus={newTaskColumn} />

      <MetricsReportModal
        open={metricsReportOpen}
        onClose={() => setMetricsReportOpen(false)}
        reportType="team"
        filters={{
          period: selectedPeriod === "30days" ? "30 Dias" : selectedPeriod === "3months" ? "3 Meses" : "6 Meses",
        }}
        data={{
          metrics: teamMetrics,
          distribution: teamDistribution,
          tasks,
        }}
      />
    </div>
  )
}
