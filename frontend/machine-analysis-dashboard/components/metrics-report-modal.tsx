"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  X,
  Download,
  Printer,
  FileText,
  TrendingUp,
  TrendingDown,
  Activity,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Wrench,
  BarChart3,
  PieChart,
  Sparkles,
} from "lucide-react"

interface MetricsReportModalProps {
  open: boolean
  onClose: () => void
  reportType: "tasks" | "team" | "inventory"
  filters?: any
  data?: any
}

export function MetricsReportModal({ open, onClose, reportType, filters, data }: MetricsReportModalProps) {
  const [isScanning, setIsScanning] = useState(true)
  const [scanProgress, setScanProgress] = useState(0)

  useEffect(() => {
    if (open) {
      setIsScanning(true)
      setScanProgress(0)

      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setTimeout(() => setIsScanning(false), 500)
            return 100
          }
          return prev + 2
        })
      }, 30)

      return () => clearInterval(interval)
    }
  }, [open])

  if (!open) return null

  const handlePrint = () => {
    window.print()
  }

  const handleExport = () => {
    // Export logic here
    console.log("[v0] Exporting report...")
  }

  const getReportTitle = () => {
    switch (reportType) {
      case "tasks":
        return "Relatório de Tarefas e Máquinas"
      case "team":
        return "Relatório de Equipe e Performance"
      case "inventory":
        return "Relatório de Inventário e Equipamentos"
      default:
        return "Relatório de Métricas"
    }
  }

  const getReportData = () => {
    if (reportType === "tasks") {
      return {
        primaryMetrics: [
          { label: "Máquinas Monitoradas", value: "24", change: "+12.5%", trend: "up", icon: Wrench },
          { label: "Taxa de Operação", value: "87%", change: "+3.2%", trend: "up", icon: Activity },
          { label: "Tarefas Concluídas", value: "145", change: "+8.4%", trend: "up", icon: CheckCircle2 },
          { label: "Tempo Médio", value: "2.4h", change: "-15%", trend: "up", icon: Clock },
        ],
        taskDistribution: [
          { status: "Concluídas", count: 8, percentage: 50, color: "bg-green-500" },
          { status: "Em Progresso", count: 5, percentage: 31, color: "bg-blue-500" },
          { status: "A Fazer", count: 2, percentage: 13, color: "bg-gray-500" },
          { status: "Atrasadas", count: 1, percentage: 6, color: "bg-red-500" },
        ],
        efficiencyTrend: [
          { month: "Jan", value: 82 },
          { month: "Fev", value: 85 },
          { month: "Mar", value: 83 },
          { month: "Abr", value: 87 },
          { month: "Mai", value: 89 },
          { month: "Jun", value: 91 },
        ],
        topMachines: [
          { name: "Robô Industrial CNC-X500", efficiency: 92, hours: 2450 },
          { name: "Torno Automático TA-2000", efficiency: 88, hours: 3200 },
          { name: "Fresadora CNC F-800", efficiency: 85, hours: 1850 },
        ],
      }
    }
    // Add data for other report types
    return {}
  }

  const reportData = getReportData()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop with blur */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-[96vw] h-[95vh] bg-background rounded-2xl shadow-2xl overflow-hidden border-2 border-border">
        {isScanning ? (
          // Scanner Animation
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-950 via-blue-950 to-cyan-950">
            {/* Animated gradient border */}
            <div className="absolute inset-0 opacity-50">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-pulse" />
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-500 animate-pulse" />
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500 animate-pulse" />
              <div className="absolute top-0 bottom-0 right-0 w-1 bg-gradient-to-b from-blue-500 via-cyan-500 to-blue-500 animate-pulse" />
            </div>

            {/* Scanner beam */}
            <div
              className="absolute left-0 right-0 h-24 bg-gradient-to-b from-transparent via-cyan-500/30 to-transparent"
              style={{
                top: `${scanProgress}%`,
                transform: "translateY(-50%)",
                transition: "top 0.03s linear",
              }}
            />

            {/* Center content */}
            <div className="relative z-10 text-center space-y-6">
              <div className="flex items-center justify-center">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse flex items-center justify-center">
                    <Sparkles className="w-12 h-12 text-white animate-spin" style={{ animationDuration: "3s" }} />
                  </div>
                  <div className="absolute inset-0 rounded-full border-4 border-cyan-500/30 animate-ping" />
                </div>
              </div>

              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-white">Analisando Métricas com IA</h2>
                <p className="text-cyan-300">Processando dados e gerando insights...</p>
              </div>

              {/* Progress bar */}
              <div className="w-96 mx-auto">
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 transition-all duration-300"
                    style={{ width: `${scanProgress}%` }}
                  />
                </div>
                <p className="text-cyan-400 text-sm mt-2">{scanProgress}%</p>
              </div>
            </div>
          </div>
        ) : (
          // Report Content
          <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex-shrink-0 p-6 border-b bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    <FileText className="h-6 w-6 text-blue-600" />
                    {getReportTitle()}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Gerado em {new Date().toLocaleDateString("pt-BR")} às {new Date().toLocaleTimeString("pt-BR")}
                  </p>
                  {filters && Object.keys(filters).length > 0 && (
                    <div className="flex gap-2 mt-2">
                      <Badge variant="outline">Período: {filters.period || "30 dias"}</Badge>
                      {filters.priority && <Badge variant="outline">Prioridade: {filters.priority}</Badge>}
                      {filters.status && <Badge variant="outline">Status: {filters.status}</Badge>}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={handleExport} className="bg-gradient-to-r from-blue-600 to-cyan-600">
                    <Download className="h-4 w-4 mr-2" />
                    Exportar PDF
                  </Button>
                  <Button onClick={handlePrint} variant="outline">
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button onClick={onClose} variant="ghost" size="icon">
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-7xl mx-auto space-y-6">
                {/* Primary Metrics */}
                <div className="grid grid-cols-4 gap-4">
                  {reportData.primaryMetrics?.map((metric: any, index: number) => {
                    const Icon = metric.icon
                    return (
                      <Card key={index}>
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm text-muted-foreground">{metric.label}</span>
                            <Icon className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div className="flex items-end justify-between">
                            <div>
                              <div className="text-3xl font-bold">{metric.value}</div>
                              <Badge
                                variant="secondary"
                                className={`mt-2 ${
                                  metric.trend === "up"
                                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                    : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                                }`}
                              >
                                {metric.trend === "up" ? (
                                  <TrendingUp className="h-3 w-3 mr-1" />
                                ) : (
                                  <TrendingDown className="h-3 w-3 mr-1" />
                                )}
                                {metric.change}
                              </Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>

                {/* Charts Section */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Task Distribution */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <PieChart className="h-5 w-5 text-blue-600" />
                          Distribuição de Tarefas
                        </h3>
                      </div>

                      <div className="relative w-48 h-48 mx-auto mb-6">
                        <svg viewBox="0 0 100 100" className="transform -rotate-90">
                          {reportData.taskDistribution?.map((item: any, index: number) => {
                            const prevPercentage = reportData.taskDistribution
                              ?.slice(0, index)
                              .reduce((sum: number, i: any) => sum + i.percentage, 0)
                            const strokeDasharray = `${item.percentage} ${100 - item.percentage}`
                            const strokeDashoffset = -prevPercentage

                            return (
                              <circle
                                key={index}
                                cx="50"
                                cy="50"
                                r="15.915"
                                fill="none"
                                stroke={`hsl(var(--${item.color.replace("bg-", "")}))`}
                                strokeWidth="12"
                                strokeDasharray={strokeDasharray}
                                strokeDashoffset={strokeDashoffset}
                                className="transition-all duration-500"
                              />
                            )
                          })}
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <div className="text-2xl font-bold">
                              {reportData.taskDistribution?.reduce((sum: number, i: any) => sum + i.count, 0)}
                            </div>
                            <div className="text-xs text-muted-foreground">Total</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {reportData.taskDistribution?.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <div className={`w-3 h-3 rounded-full ${item.color}`} />
                              <span className="text-sm">{item.status}</span>
                            </div>
                            <span className="font-medium">{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Efficiency Trend */}
                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-blue-600" />
                          Tendência de Eficiência
                        </h3>
                      </div>

                      <div className="h-48 flex items-end justify-between gap-2 mt-8">
                        {reportData.efficiencyTrend?.map((item: any, index: number) => (
                          <div key={index} className="flex-1 flex flex-col items-center gap-2">
                            <div className="relative w-full">
                              <div
                                className="w-full bg-gradient-to-t from-blue-500 to-cyan-500 rounded-t transition-all duration-500 hover:opacity-80"
                                style={{ height: `${item.value * 2}px` }}
                              />
                              <div className="absolute -top-6 left-0 right-0 text-center text-xs font-medium">
                                {item.value}%
                              </div>
                            </div>
                            <span className="text-xs text-muted-foreground">{item.month}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Top Machines Table */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Wrench className="h-5 w-5 text-blue-600" />
                      Máquinas com Melhor Performance
                    </h3>
                    <div className="border rounded-lg overflow-hidden">
                      <table className="w-full">
                        <thead className="bg-muted/50">
                          <tr>
                            <th className="text-left p-3 font-medium">Máquina</th>
                            <th className="text-left p-3 font-medium">Eficiência</th>
                            <th className="text-left p-3 font-medium">Horas Operacionais</th>
                            <th className="text-left p-3 font-medium">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {reportData.topMachines?.map((machine: any, index: number) => (
                            <tr key={index} className="border-t">
                              <td className="p-3 font-medium">{machine.name}</td>
                              <td className="p-3">
                                <div className="flex items-center gap-2">
                                  <div className="w-24 h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
                                    <div
                                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-500"
                                      style={{ width: `${machine.efficiency}%` }}
                                    />
                                  </div>
                                  <span className="text-sm font-medium">{machine.efficiency}%</span>
                                </div>
                              </td>
                              <td className="p-3">{machine.hours}h</td>
                              <td className="p-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                                >
                                  <CheckCircle2 className="h-3 w-3 mr-1" />
                                  Excelente
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </CardContent>
                </Card>

                {/* AI Insights */}
                <Card className="border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-950 dark:to-blue-950">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      Insights de IA
                    </h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                        <CheckCircle2 className="h-5 w-5 text-green-500 mb-2" />
                        <p className="font-medium text-sm">Performance em Alta</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Eficiência operacional 18% acima da média do setor
                        </p>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                        <TrendingUp className="h-5 w-5 text-blue-500 mb-2" />
                        <p className="font-medium text-sm">Tendência Positiva</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Crescimento consistente nos últimos 6 meses
                        </p>
                      </div>
                      <div className="p-4 bg-white dark:bg-gray-900 rounded-lg border">
                        <AlertTriangle className="h-5 w-5 text-yellow-500 mb-2" />
                        <p className="font-medium text-sm">Atenção Recomendada</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          2 máquinas precisam de manutenção preventiva
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
