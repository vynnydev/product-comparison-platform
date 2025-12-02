"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  FileText,
  Calendar,
  Clock,
  MapPin,
  Wrench,
  Factory,
  Building2,
  Activity,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Download,
  Filter,
  Search,
  Brain,
  Thermometer,
  Zap,
  Gauge,
  X,
  Sparkles,
  BarChart3,
  Users,
} from "lucide-react"
import { Machine3DViewer } from "@/components/machine-3d-viewer"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const locations = [
  { id: "oficina-centro", name: "Oficina Centro Automotiva", type: "workshop" },
  { id: "industria-textil", name: "Indústria Textil São Paulo", type: "industry" },
  { id: "hospital-equipamentos", name: "Hospital Santa Maria", type: "medical" },
  { id: "garagem-frota", name: "Garagem de Frota Volvo", type: "garage" },
]

const machinesByLocation: Record<string, any[]> = {
  "oficina-centro": [
    { id: "1", name: "Bomba Centrífuga BC-2000", type: "centrifugal-pump", reportsCount: 12 },
    { id: "2", name: "Torno CNC T-3000", type: "cnc-lathe", reportsCount: 8 },
    { id: "3", name: "Motor V8 Turbo", type: "car-engine", reportsCount: 15 },
  ],
  "industria-textil": [
    { id: "5", name: "Fresadora Universal FU-500", type: "milling-machine", reportsCount: 10 },
    { id: "6", name: "Prensa Hidráulica PH-3000", type: "hydraulic-press", reportsCount: 6 },
  ],
  "hospital-equipamentos": [
    { id: "9", name: "Ressonância Magnética MRI-2000", type: "mri-machine", reportsCount: 20 },
    { id: "10", name: "Tomógrafo CT-5000", type: "ct-scanner", reportsCount: 18 },
  ],
  "garagem-frota": [{ id: "12", name: "Ônibus Elétrico Volvo 7900", type: "electric-bus", reportsCount: 14 }],
}

const mockReportsByMachine: Record<string, any[]> = {
  "1": [
    { id: "R-2025-001", date: "15 Jan 2025", time: "14:30", status: "excellent", healthScore: 98 },
    { id: "R-2025-002", date: "10 Jan 2025", time: "09:15", status: "good", healthScore: 92 },
    { id: "R-2024-089", date: "28 Dez 2024", time: "16:45", status: "warning", healthScore: 78 },
    { id: "R-2024-085", date: "20 Dez 2024", time: "11:20", status: "excellent", healthScore: 96 },
    { id: "R-2024-080", date: "15 Dez 2024", time: "08:30", status: "good", healthScore: 91 },
  ],
}

const generatedMetricsReports = [
  {
    id: "MR-2025-001",
    type: "tasks",
    title: "Relatório de Tarefas e Máquinas",
    date: "20 Jan 2025",
    time: "10:30",
    period: "30 Dias",
    summary: "24 máquinas monitoradas, 87% taxa de operação, 145 tarefas concluídas",
  },
  {
    id: "MR-2025-002",
    type: "team",
    title: "Relatório de Equipe e Performance",
    date: "18 Jan 2025",
    time: "14:15",
    period: "3 Meses",
    summary: "51 funcionários, 68% taxa de presença, 387 candidatos a vagas",
  },
  {
    id: "MR-2025-003",
    type: "inventory",
    title: "Relatório de Inventário e Equipamentos",
    date: "15 Jan 2025",
    time: "09:00",
    period: "30 Dias",
    summary: "6 equipamentos totais, 3 operacionais, 1 em manutenção",
  },
  {
    id: "MR-2024-089",
    type: "tasks",
    title: "Relatório de Tarefas e Máquinas",
    date: "28 Dez 2024",
    time: "16:45",
    period: "6 Meses",
    summary: "89 tarefas totais, 91% taxa de conclusão, 25 projetos ativos",
  },
]

export default function ReportsPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>(locations[0].id)
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [selectedReport, setSelectedReport] = useState<any>(null)
  const [searchQuery, setSearchQuery] = useState("")

  const [filterOpen, setFilterOpen] = useState(false)
  const [dateFilter, setDateFilter] = useState<string>("all")
  const [statusFilters, setStatusFilters] = useState<string[]>(["excellent", "good", "warning", "critical"])
  const [sortBy, setSortBy] = useState<string>("date-desc")
  const [reportIdSearch, setReportIdSearch] = useState("")
  const [activeTab, setActiveTab] = useState<"machine-analysis" | "metrics">("machine-analysis")

  const [selectedMetricsReport, setSelectedMetricsReport] = useState<any>(null)
  const [showMetricsReportModal, setShowMetricsReportModal] = useState(false)

  const currentMachines = machinesByLocation[selectedLocation] || []

  const currentReports = selectedMachine
    ? (() => {
        let reports = mockReportsByMachine[selectedMachine.id] || []

        if (reportIdSearch.trim()) {
          reports = reports.filter((r) => r.id.toLowerCase().includes(reportIdSearch.toLowerCase()))
        }

        reports = reports.filter((r) => statusFilters.includes(r.status))

        if (dateFilter !== "all") {
          const now = new Date()
          reports = reports.filter((r) => {
            const reportDate = new Date(r.date)
            const daysDiff = Math.floor((now.getTime() - reportDate.getTime()) / (1000 * 60 * 60 * 24))

            switch (dateFilter) {
              case "7days":
                return daysDiff <= 7
              case "30days":
                return daysDiff <= 30
              case "3months":
                return daysDiff <= 90
              default:
                return true
            }
          })
        }

        reports = [...reports].sort((a, b) => {
          switch (sortBy) {
            case "date-desc":
              return new Date(b.date).getTime() - new Date(a.date).getTime()
            case "date-asc":
              return new Date(a.date).getTime() - new Date(b.date).getTime()
            case "health-desc":
              return b.healthScore - a.healthScore
            case "health-asc":
              return a.healthScore - b.healthScore
            default:
              return 0
          }
        })

        return reports
      })()
    : []

  const toggleStatusFilter = (status: string) => {
    setStatusFilters((prev) => (prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]))
  }

  const clearFilters = () => {
    setDateFilter("all")
    setStatusFilters(["excellent", "good", "warning", "critical"])
    setSortBy("date-desc")
    setReportIdSearch("")
  }

  const activeFiltersCount = [
    dateFilter !== "all" ? 1 : 0,
    statusFilters.length < 4 ? 1 : 0,
    sortBy !== "date-desc" ? 1 : 0,
    reportIdSearch.trim() ? 1 : 0,
  ].filter(Boolean).length

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent":
        return "bg-green-600"
      case "good":
        return "bg-blue-600"
      case "warning":
        return "bg-yellow-600"
      case "critical":
        return "bg-red-600"
      default:
        return "bg-gray-600"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent":
        return <CheckCircle2 className="h-5 w-5" />
      case "good":
        return <TrendingUp className="h-5 w-5" />
      case "warning":
        return <AlertTriangle className="h-5 w-5" />
      case "critical":
        return <AlertTriangle className="h-5 w-5" />
      default:
        return <Activity className="h-5 w-5" />
    }
  }

  const getReportTypeIcon = (type: string) => {
    switch (type) {
      case "tasks":
        return <BarChart3 className="h-5 w-5" />
      case "team":
        return <Users className="h-5 w-5" />
      case "inventory":
        return <Wrench className="h-5 w-5" />
      default:
        return <FileText className="h-5 w-5" />
    }
  }

  const getReportTypeColor = (type: string) => {
    switch (type) {
      case "tasks":
        return "bg-blue-600"
      case "team":
        return "bg-purple-600"
      case "inventory":
        return "bg-green-600"
      default:
        return "bg-gray-600"
    }
  }

  const handleViewMetricsReport = (report: any) => {
    setSelectedMetricsReport(report)
    setShowMetricsReportModal(true)
  }

  const handleDownloadMetricsReport = (report: any) => {
    // Create a printable version
    const printWindow = window.open("", "_blank")
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Relatório ${report.id} - ${report.title}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              h1 { color: #1e40af; border-bottom: 3px solid #1e40af; padding-bottom: 10px; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
              .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin: 20px 0; }
              .info-item { padding: 15px; background: #f3f4f6; border-radius: 8px; }
              .info-label { font-weight: bold; color: #374151; margin-bottom: 5px; }
              .info-value { font-size: 18px; color: #111827; }
              .summary { background: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0; }
              .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; }
              @media print {
                body { padding: 20px; }
              }
            </style>
          </head>
          <body>
            <h1>${report.title}</h1>
            <div class="header">
              <div>
                <strong>ID do Relatório:</strong> ${report.id}<br>
                <strong>Data:</strong> ${report.date}<br>
                <strong>Hora:</strong> ${report.time}
              </div>
              <div>
                <strong>Período:</strong> ${report.period}<br>
                <strong>Gerado em:</strong> ${new Date().toLocaleString("pt-BR")}
              </div>
            </div>
            <div class="summary">
              <h3>Resumo</h3>
              <p>${report.summary}</p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Cognitiva Analytics - Análise Preditiva</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  const handleExportMachineReport = () => {
    if (!selectedReport || !selectedMachine) return

    const printWindow = window.open("", "_blank")
    if (printWindow) {
      const statusText =
        selectedReport.status === "excellent"
          ? "Excelente"
          : selectedReport.status === "good"
            ? "Bom"
            : selectedReport.status === "warning"
              ? "Atenção"
              : "Crítico"

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Relatório ${selectedReport.id} - ${selectedMachine.name}</title>
            <style>
              body { 
                font-family: Arial, sans-serif; 
                padding: 40px; 
                max-width: 900px; 
                margin: 0 auto; 
                color: #111827;
              }
              h1 { 
                color: #1e40af; 
                border-bottom: 3px solid #1e40af; 
                padding-bottom: 10px;
                margin-bottom: 20px;
              }
              .header { 
                display: flex; 
                justify-content: space-between; 
                margin-bottom: 30px;
                padding: 20px;
                background: #f3f4f6;
                border-radius: 8px;
              }
              .header-section { flex: 1; }
              .header-label { 
                font-weight: bold; 
                color: #374151; 
                font-size: 12px;
                text-transform: uppercase;
                margin-bottom: 4px;
              }
              .header-value { 
                font-size: 16px; 
                color: #111827;
                margin-bottom: 12px;
              }
              .metrics-grid { 
                display: grid; 
                grid-template-columns: repeat(4, 1fr); 
                gap: 20px; 
                margin: 30px 0; 
              }
              .metric-card { 
                padding: 20px; 
                background: #f9fafb; 
                border-radius: 8px;
                border: 1px solid #e5e7eb;
              }
              .metric-label { 
                font-weight: 600; 
                color: #374151; 
                font-size: 12px;
                margin-bottom: 8px;
                text-transform: uppercase;
              }
              .metric-value { 
                font-size: 28px; 
                font-weight: bold;
                color: #111827;
                margin-bottom: 4px;
              }
              .metric-status { 
                font-size: 12px; 
                color: #059669;
                font-weight: 500;
              }
              .health-score {
                background: linear-gradient(135deg, #d1fae5 0%, #a7f3d0 100%);
                border: 2px solid #059669;
              }
              .health-score .metric-value { color: #059669; }
              .analysis-section {
                background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                border: 2px solid #7c3aed;
              }
              .analysis-title {
                font-weight: bold;
                color: #7c3aed;
                font-size: 16px;
                margin-bottom: 15px;
              }
              .analysis-item {
                display: flex;
                align-items: start;
                gap: 10px;
                margin-bottom: 10px;
                font-size: 14px;
              }
              .check-icon { color: #059669; font-weight: bold; }
              .actions-section {
                background: #fef3c7;
                padding: 20px;
                border-radius: 8px;
                margin: 30px 0;
                border: 2px solid #f59e0b;
              }
              .actions-title {
                font-weight: bold;
                color: #f59e0b;
                font-size: 16px;
                margin-bottom: 15px;
              }
              .action-item {
                display: flex;
                align-items: start;
                gap: 10px;
                margin-bottom: 10px;
                font-size: 14px;
              }
              .footer { 
                margin-top: 50px; 
                padding-top: 20px; 
                border-top: 2px solid #e5e7eb; 
                text-align: center; 
                color: #6b7280;
                font-size: 12px;
              }
              @media print {
                body { padding: 20px; }
                .header { break-inside: avoid; }
                .metric-card { break-inside: avoid; }
              }
            </style>
          </head>
          <body>
            <h1>${selectedMachine.name}</h1>
            
            <div class="header">
              <div class="header-section">
                <div class="header-label">ID do Relatório</div>
                <div class="header-value">${selectedReport.id}</div>
                <div class="header-label">Status</div>
                <div class="header-value">${statusText}</div>
              </div>
              <div class="header-section">
                <div class="header-label">Data de Análise</div>
                <div class="header-value">${selectedReport.date}</div>
                <div class="header-label">Hora</div>
                <div class="header-value">${selectedReport.time}</div>
              </div>
              <div class="header-section">
                <div class="header-label">Gerado em</div>
                <div class="header-value">${new Date().toLocaleString("pt-BR")}</div>
              </div>
            </div>

            <div class="metrics-grid">
              <div class="metric-card health-score">
                <div class="metric-label">Saúde Geral</div>
                <div class="metric-value">${selectedReport.healthScore}%</div>
                <div class="metric-status">✓ ${statusText}</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-label">Temperatura</div>
                <div class="metric-value">72°C</div>
                <div class="metric-status">✓ Normal</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-label">Vibração</div>
                <div class="metric-value">2.3 mm/s</div>
                <div class="metric-status">✓ Dentro do limite</div>
              </div>
              
              <div class="metric-card">
                <div class="metric-label">Consumo</div>
                <div class="metric-value">8.5 kW</div>
                <div class="metric-status">✓ Eficiente</div>
              </div>
            </div>

            <div class="analysis-section">
              <div class="analysis-title">🧠 Análise IA</div>
              <div class="analysis-item">
                <span class="check-icon">✓</span>
                <span>Todos os sistemas operacionais</span>
              </div>
              <div class="analysis-item">
                <span class="check-icon">✓</span>
                <span>Componentes críticos verificados</span>
              </div>
              <div class="analysis-item">
                <span class="check-icon">✓</span>
                <span>Operando em condições ideais</span>
              </div>
            </div>

            <div class="actions-section">
              <div class="actions-title">🔧 Próximas Ações</div>
              <div class="action-item">
                <span>•</span>
                <span>Manutenção preventiva agendada para 30 Jan 2025</span>
              </div>
              <div class="action-item">
                <span>•</span>
                <span>Verificar nível de lubrificação semanalmente</span>
              </div>
              <div class="action-item">
                <span>•</span>
                <span>Monitorar temperatura durante operação contínua</span>
              </div>
            </div>

            <div class="footer">
              <p><strong>Cognitiva Analytics</strong> - Análise Preditiva</p>
              <p>© ${new Date().getFullYear()} Todos os direitos reservados</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.focus()
      setTimeout(() => {
        printWindow.print()
      }, 250)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Relatórios de Análise
            </h1>
            <p className="text-lg text-muted-foreground">Histórico completo de análises e diagnósticos preditivos</p>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="machine-analysis" className="gap-2">
              <Wrench className="h-4 w-4" />
              Análises de Máquinas
            </TabsTrigger>
            <TabsTrigger value="metrics" className="gap-2">
              <Sparkles className="h-4 w-4" />
              Relatórios de Métricas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="machine-analysis" className="space-y-6">
            {!selectedReport ? (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-blue-600" />
                        Selecionar Localização
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Select
                        value={selectedLocation}
                        onValueChange={(value) => {
                          setSelectedLocation(value)
                          setSelectedMachine(null)
                          setSelectedReport(null)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {locations.map((loc) => (
                            <SelectItem key={loc.id} value={loc.id}>
                              <div className="flex items-center gap-2">
                                {loc.type === "workshop" && <Wrench className="h-4 w-4" />}
                                {loc.type === "industry" && <Factory className="h-4 w-4" />}
                                {loc.type === "garage" && <Building2 className="h-4 w-4" />}
                                {loc.type === "medical" && <Activity className="h-4 w-4" />}
                                {loc.name}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Wrench className="h-5 w-5 text-purple-600" />
                        Máquinas ({currentMachines.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {currentMachines.map((machine) => (
                          <Card
                            key={machine.id}
                            className={`cursor-pointer transition-all hover:shadow-md ${
                              selectedMachine?.id === machine.id ? "ring-2 ring-blue-600" : ""
                            }`}
                            onClick={() => {
                              setSelectedMachine(machine)
                              setSelectedReport(null)
                            }}
                          >
                            <CardContent className="p-3">
                              <p className="font-medium text-sm">{machine.name}</p>
                              <div className="flex items-center justify-between mt-2">
                                <Badge variant="outline" className="text-xs">
                                  {machine.reportsCount} relatórios
                                </Badge>
                                <FileText className="h-4 w-4 text-muted-foreground" />
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="lg:col-span-2">
                  {selectedMachine ? (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                          <span className="flex items-center gap-2">
                            <FileText className="h-5 w-5 text-green-600" />
                            Relatórios - {selectedMachine.name}
                          </span>
                          <Popover open={filterOpen} onOpenChange={setFilterOpen}>
                            <PopoverTrigger asChild>
                              <Button variant="outline" size="sm" className="relative bg-transparent">
                                <Filter className="h-4 w-4 mr-2" />
                                Filtrar
                                {activeFiltersCount > 0 && (
                                  <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-blue-600 text-white">
                                    {activeFiltersCount}
                                  </Badge>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80" align="end">
                              <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                  <h4 className="font-semibold">Filtros</h4>
                                  {activeFiltersCount > 0 && (
                                    <Button variant="ghost" size="sm" onClick={clearFilters} className="h-8 text-xs">
                                      Limpar tudo
                                    </Button>
                                  )}
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Buscar por ID</Label>
                                  <div className="relative">
                                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                      placeholder="R-2025-001"
                                      value={reportIdSearch}
                                      onChange={(e) => setReportIdSearch(e.target.value)}
                                      className="pl-8"
                                    />
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Período</Label>
                                  <RadioGroup value={dateFilter} onValueChange={setDateFilter}>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="all" id="all" />
                                      <Label htmlFor="all" className="font-normal cursor-pointer">
                                        Todos os períodos
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="7days" id="7days" />
                                      <Label htmlFor="7days" className="font-normal cursor-pointer">
                                        Últimos 7 dias
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="30days" id="30days" />
                                      <Label htmlFor="30days" className="font-normal cursor-pointer">
                                        Últimos 30 dias
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <RadioGroupItem value="3months" id="3months" />
                                      <Label htmlFor="3months" className="font-normal cursor-pointer">
                                        Últimos 3 meses
                                      </Label>
                                    </div>
                                  </RadioGroup>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Status de Saúde</Label>
                                  <div className="space-y-2">
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="excellent"
                                        checked={statusFilters.includes("excellent")}
                                        onCheckedChange={() => toggleStatusFilter("excellent")}
                                      />
                                      <Label
                                        htmlFor="excellent"
                                        className="font-normal cursor-pointer flex items-center gap-2"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-green-600"></div>
                                        Excelente (95-100%)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="good"
                                        checked={statusFilters.includes("good")}
                                        onCheckedChange={() => toggleStatusFilter("good")}
                                      />
                                      <Label
                                        htmlFor="good"
                                        className="font-normal cursor-pointer flex items-center gap-2"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                                        Bom (85-94%)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="warning"
                                        checked={statusFilters.includes("warning")}
                                        onCheckedChange={() => toggleStatusFilter("warning")}
                                      />
                                      <Label
                                        htmlFor="warning"
                                        className="font-normal cursor-pointer flex items-center gap-2"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-yellow-600"></div>
                                        Atenção (70-84%)
                                      </Label>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                      <Checkbox
                                        id="critical"
                                        checked={statusFilters.includes("critical")}
                                        onCheckedChange={() => toggleStatusFilter("critical")}
                                      />
                                      <Label
                                        htmlFor="critical"
                                        className="font-normal cursor-pointer flex items-center gap-2"
                                      >
                                        <div className="w-3 h-3 rounded-full bg-red-600"></div>
                                        Crítico (&lt;70%)
                                      </Label>
                                    </div>
                                  </div>
                                </div>

                                <div className="space-y-2">
                                  <Label className="text-sm font-medium">Ordenar por</Label>
                                  <Select value={sortBy} onValueChange={setSortBy}>
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="date-desc">Data (mais recente)</SelectItem>
                                      <SelectItem value="date-asc">Data (mais antigo)</SelectItem>
                                      <SelectItem value="health-desc">Saúde (maior)</SelectItem>
                                      <SelectItem value="health-asc">Saúde (menor)</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {(activeFiltersCount > 0 || reportIdSearch.trim()) && (
                          <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium">
                                {currentReports.length} relatório{currentReports.length !== 1 ? "s" : ""} encontrado
                                {currentReports.length !== 1 ? "s" : ""}
                              </p>
                              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-7 text-xs">
                                <X className="h-3 w-3 mr-1" />
                                Limpar filtros
                              </Button>
                            </div>
                          </div>
                        )}

                        {currentReports.length > 0 ? (
                          <div className="space-y-3">
                            {currentReports.map((report) => (
                              <Card
                                key={report.id}
                                className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
                                onClick={() => setSelectedReport(report)}
                              >
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                      <div className={`p-2 rounded-lg ${getStatusColor(report.status)} text-white`}>
                                        {getStatusIcon(report.status)}
                                      </div>
                                      <div>
                                        <p className="font-semibold">{report.id}</p>
                                        <div className="flex items-center gap-3 text-sm text-muted-foreground mt-1">
                                          <span className="flex items-center gap-1">
                                            <Calendar className="h-3 w-3" />
                                            {report.date}
                                          </span>
                                          <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {report.time}
                                          </span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="text-right">
                                      <div className="text-2xl font-bold text-green-600">{report.healthScore}%</div>
                                      <p className="text-xs text-muted-foreground">Saúde</p>
                                    </div>
                                  </div>
                                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                                    Ver Relatório Completo
                                  </Button>
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <Filter className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                            <p className="text-lg font-medium">Nenhum relatório encontrado</p>
                            <p className="text-muted-foreground mt-1">Ajuste os filtros para ver mais resultados</p>
                            <Button variant="outline" className="mt-4 bg-transparent" onClick={clearFilters}>
                              Limpar filtros
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ) : (
                    <Card className="h-full flex items-center justify-center">
                      <CardContent className="text-center p-12">
                        <Wrench className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <p className="text-lg font-medium">Selecione uma máquina</p>
                        <p className="text-muted-foreground mt-2">
                          Escolha uma máquina para visualizar seus relatórios
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            ) : (
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold">{selectedMachine.name}</h2>
                      <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {selectedReport.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {selectedReport.time}
                        </span>
                        <Badge className={getStatusColor(selectedReport.status)}>{selectedReport.id}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" onClick={handleExportMachineReport}>
                        <Download className="h-4 w-4 mr-2" />
                        Exportar PDF
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setSelectedReport(null)}>
                        Voltar
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-4 gap-4">
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Saúde Geral</span>
                            <Gauge className="h-4 w-4 text-green-600" />
                          </div>
                          <div className="text-3xl font-bold text-green-600">{selectedReport.healthScore}%</div>
                          <div className="text-xs text-muted-foreground mt-1">Excelente</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Temperatura</span>
                            <Thermometer className="h-4 w-4 text-orange-500" />
                          </div>
                          <div className="text-2xl font-bold">72°C</div>
                          <div className="text-xs text-green-600 mt-1">✓ Normal</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Vibração</span>
                            <Activity className="h-4 w-4 text-blue-500" />
                          </div>
                          <div className="text-2xl font-bold">2.3 mm/s</div>
                          <div className="text-xs text-green-600 mt-1">✓ Dentro do limite</div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium">Consumo</span>
                            <Zap className="h-4 w-4 text-yellow-500" />
                          </div>
                          <div className="text-2xl font-bold">8.5 kW</div>
                          <div className="text-xs text-green-600 mt-1">✓ Eficiente</div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="col-span-2">
                      <Card className="h-full">
                        <CardContent className="p-4">
                          <div className="relative w-full h-[600px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden">
                            <Machine3DViewer machineName={selectedMachine.name} machineType={selectedMachine.type} />
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Brain className="h-4 w-4 text-purple-600" />
                            Análise IA
                          </h3>
                          <div className="space-y-2 text-xs">
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Todos os sistemas operacionais</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Componentes críticos verificados</span>
                            </div>
                            <div className="flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                              <span>Operando em condições ideais</span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-3 flex items-center gap-2">
                            <Wrench className="h-4 w-4 text-blue-600" />
                            Próximas Ações
                          </h3>
                          <div className="space-y-2 text-xs">
                            <div className="p-2 bg-yellow-50 dark:bg-yellow-950 rounded">
                              <p className="font-medium">Manutenção em 30 dias</p>
                              <p className="text-muted-foreground mt-1">Lubrificação dos rolamentos</p>
                            </div>
                            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded">
                              <p className="font-medium">Calibração em 15 dias</p>
                              <p className="text-muted-foreground mt-1">Sensores de temperatura</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="metrics" className="space-y-6">
            {showMetricsReportModal && selectedMetricsReport && (
              <>
                <div
                  className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                  onClick={() => setShowMetricsReportModal(false)}
                />
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                  <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                    <CardHeader className="border-b">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg ${getReportTypeColor(selectedMetricsReport.type)}`}>
                            {getReportTypeIcon(selectedMetricsReport.type)}
                          </div>
                          <div>
                            <CardTitle className="text-2xl">{selectedMetricsReport.title}</CardTitle>
                            <p className="text-sm text-muted-foreground mt-1">
                              {selectedMetricsReport.id} • {selectedMetricsReport.date} às {selectedMetricsReport.time}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadMetricsReport(selectedMetricsReport)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Imprimir
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => setShowMetricsReportModal(false)}>
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="p-6 space-y-6">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Período Analisado</div>
                          <div className="text-xl font-semibold">{selectedMetricsReport.period}</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Data de Geração</div>
                          <div className="text-xl font-semibold">{selectedMetricsReport.date}</div>
                        </div>
                        <div className="p-4 bg-muted rounded-lg">
                          <div className="text-sm text-muted-foreground mb-1">Horário</div>
                          <div className="text-xl font-semibold">{selectedMetricsReport.time}</div>
                        </div>
                      </div>

                      <div className="border-l-4 border-blue-600 bg-blue-50 dark:bg-blue-950 p-4 rounded">
                        <h3 className="font-semibold mb-2 flex items-center gap-2">
                          <Sparkles className="h-5 w-5 text-blue-600" />
                          Resumo do Relatório
                        </h3>
                        <p className="text-sm leading-relaxed">{selectedMetricsReport.summary}</p>
                      </div>

                      {selectedMetricsReport.type === "tasks" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Detalhes de Tarefas e Máquinas</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-blue-600">24</div>
                                <div className="text-sm text-muted-foreground">Máquinas Monitoradas</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-green-600">87%</div>
                                <div className="text-sm text-muted-foreground">Taxa de Operação</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-purple-600">145</div>
                                <div className="text-sm text-muted-foreground">Tarefas Concluídas</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-orange-600">12</div>
                                <div className="text-sm text-muted-foreground">Tarefas Pendentes</div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {selectedMetricsReport.type === "team" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Detalhes de Equipe e Performance</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-blue-600">51</div>
                                <div className="text-sm text-muted-foreground">Funcionários Ativos</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-green-600">68%</div>
                                <div className="text-sm text-muted-foreground">Taxa de Presença</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-purple-600">387</div>
                                <div className="text-sm text-muted-foreground">Candidatos a Vagas</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-orange-600">92%</div>
                                <div className="text-sm text-muted-foreground">Satisfação da Equipe</div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}

                      {selectedMetricsReport.type === "inventory" && (
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold">Detalhes de Inventário e Equipamentos</h3>
                          <div className="grid grid-cols-2 gap-4">
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-blue-600">6</div>
                                <div className="text-sm text-muted-foreground">Equipamentos Totais</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-green-600">3</div>
                                <div className="text-sm text-muted-foreground">Operacionais</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-orange-600">1</div>
                                <div className="text-sm text-muted-foreground">Em Manutenção</div>
                              </CardContent>
                            </Card>
                            <Card>
                              <CardContent className="p-4">
                                <div className="text-3xl font-bold text-purple-600">2</div>
                                <div className="text-sm text-muted-foreground">Aguardando Reparo</div>
                              </CardContent>
                            </Card>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                  Relatórios de Métricas Gerados
                </CardTitle>
                <p className="text-sm text-muted-foreground mt-2">
                  Relatórios gerados automaticamente das páginas de Tarefas, Equipe e Inventário
                </p>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generatedMetricsReports.map((report) => (
                    <Card key={report.id} className="hover:shadow-md transition-all">
                      <CardContent className="p-6 space-y-4">
                        <div className="flex items-start gap-4">
                          <div className={`p-3 rounded-lg ${getReportTypeColor(report.type)}`}>
                            {getReportTypeIcon(report.type)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{report.title}</h3>
                            <Badge variant="outline" className="mt-1 font-mono text-xs">
                              {report.id}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>{report.date}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span>{report.time}</span>
                          </div>
                        </div>

                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                          Período: {report.period}
                        </Badge>

                        <p className="text-sm text-muted-foreground leading-relaxed">{report.summary}</p>

                        <div className="flex items-center gap-2 pt-2">
                          <Button
                            variant="outline"
                            className="flex-1 bg-transparent"
                            onClick={() => handleViewMetricsReport(report)}
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            Visualizar
                          </Button>
                          <Button variant="outline" size="icon" onClick={() => handleDownloadMetricsReport(report)}>
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {generatedMetricsReports.length > 0 && (
                  <div className="mt-6 flex justify-end">
                    <p className="text-sm text-muted-foreground">
                      {generatedMetricsReports.length} relatórios disponíveis
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
