"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Plus, Clock, Download, Printer, X, AlertTriangle, CheckCircle2, TrendingUp, Wrench, Thermometer, Activity, Zap, Gauge, Brain, Sparkles, Calendar, User, MapPin, Settings } from 'lucide-react'
import { Machine3DViewer } from "@/components/machine-3d-viewer"
import { useRouter } from 'next/navigation'

interface MachineReport {
  id: string
  date: string
  time: string
  status: "excellent" | "good" | "warning" | "critical"
  healthScore: number
  findings: string[]
}

interface MachineReportModalProps {
  isOpen: boolean
  onClose: () => void
  machineName: string
  machineType: string
  machineCategory: string
  locationName: string
}

const mockReports: MachineReport[] = [
  {
    id: "R-2025-001",
    date: "15 Jan 2025",
    time: "14:30",
    status: "excellent",
    healthScore: 98,
    findings: ["Todos os sistemas operacionais", "Manutenção em dia"]
  },
  {
    id: "R-2025-002",
    date: "10 Jan 2025",
    time: "09:15",
    status: "good",
    healthScore: 92,
    findings: ["Vibração ligeiramente elevada", "Recomendado lubrificação"]
  },
  {
    id: "R-2024-089",
    date: "28 Dez 2024",
    time: "16:45",
    status: "warning",
    healthScore: 78,
    findings: ["Temperatura acima do normal", "Necessário verificação"]
  }
]

export function MachineReportModal({ 
  isOpen, 
  onClose, 
  machineName, 
  machineType,
  machineCategory,
  locationName 
}: MachineReportModalProps) {
  const [isScanning, setIsScanning] = useState(false)
  const [showDetailedReport, setShowDetailedReport] = useState(false)
  const [selectedReport, setSelectedReport] = useState<MachineReport | null>(null)
  const [scanProgress, setScanProgress] = useState(0)
  const router = useRouter()

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  // Close on ESC key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleEsc)
    }
    return () => window.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  const handleNewAnalysis = () => {
    setIsScanning(true)
    setScanProgress(0)
    
    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setTimeout(() => {
            setIsScanning(false)
            setShowDetailedReport(true)
            setSelectedReport({
              id: "R-2025-NEW",
              date: new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }),
              time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
              status: "excellent",
              healthScore: 97,
              findings: [
                "Análise completa realizada com sucesso",
                "Todos os componentes críticos verificados",
                "Sistema operando em condições ideais",
                "Próxima manutenção programada em 30 dias"
              ]
            })
          }, 500)
          return 100
        }
        return prev + 2
      })
    }, 50)
  }

  const handleViewReport = (report: MachineReport) => {
    setSelectedReport(report)
    setShowDetailedReport(true)
  }

  const handlePrint = () => {
    window.print()
  }

  const handleViewAllReports = () => {
    router.push('/dashboard/reports')
    onClose()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "excellent": return "text-green-600 bg-green-50 dark:bg-green-950"
      case "good": return "text-blue-600 bg-blue-50 dark:bg-blue-950"
      case "warning": return "text-yellow-600 bg-yellow-50 dark:bg-yellow-950"
      case "critical": return "text-red-600 bg-red-50 dark:bg-red-950"
      default: return "text-gray-600 bg-gray-50 dark:bg-gray-950"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "excellent": return <CheckCircle2 className="h-5 w-5" />
      case "good": return <TrendingUp className="h-5 w-5" />
      case "warning": return <AlertTriangle className="h-5 w-5" />
      case "critical": return <AlertTriangle className="h-5 w-5" />
      default: return <Activity className="h-5 w-5" />
    }
  }

  if (!isOpen) return null

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="relative w-[98vw] max-h-[95vh] bg-background rounded-lg shadow-2xl overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Scanning Animation */}
          {isScanning && (
            <div className="absolute inset-0 bg-background/95 backdrop-blur-md z-50 flex flex-col items-center justify-center rounded-lg">
              <div className="relative w-full max-w-3xl h-96">
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 animate-pulse"
                  style={{ 
                    top: `${scanProgress}%`,
                    transition: 'top 0.05s linear',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
                  }}
                />
                <div 
                  className="absolute left-0 right-0 h-1 bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 animate-pulse"
                  style={{ 
                    bottom: `${scanProgress}%`,
                    transition: 'bottom 0.05s linear',
                    boxShadow: '0 0 20px rgba(139, 92, 246, 0.8)'
                  }}
                />
                
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <Brain className="h-16 w-16 mx-auto text-purple-600 animate-pulse" />
                    <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                      Analisando Máquina
                    </h3>
                    <p className="text-muted-foreground">Escaneando componentes e coletando dados...</p>
                    <div className="text-3xl font-bold text-purple-600">{scanProgress}%</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Report History or Detailed Report */}
          {!showDetailedReport ? (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold flex items-center gap-3">
                    <FileText className="h-8 w-8 text-blue-600" />
                    Relatórios de Análise
                  </h2>
                  <p className="text-muted-foreground mt-2 text-lg">{machineName}</p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose}>
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                <Card 
                  className="cursor-pointer transition-all hover:shadow-lg hover:scale-105 border-2 border-dashed border-purple-300 dark:border-purple-700 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950"
                  onClick={handleNewAnalysis}
                >
                  <CardContent className="p-6 flex flex-col items-center justify-center h-full min-h-[240px] text-center space-y-3">
                    <div className="rounded-full bg-purple-600 p-4">
                      <Plus className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold text-lg">Nova Análise</h3>
                    <p className="text-sm text-muted-foreground">
                      Iniciar varredura completa com IA
                    </p>
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </CardContent>
                </Card>

                {mockReports.map((report) => (
                  <Card 
                    key={report.id}
                    className="cursor-pointer transition-all hover:shadow-lg hover:scale-105"
                    onClick={() => handleViewReport(report)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="font-mono text-xs">
                          {report.id}
                        </Badge>
                        <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${getStatusColor(report.status)}`}>
                          {getStatusIcon(report.status)}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{report.date}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <span>{report.time}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm text-muted-foreground">Saúde Geral</span>
                          <span className="text-2xl font-bold text-green-600">{report.healthScore}%</span>
                        </div>
                        <div className="space-y-1">
                          {report.findings.slice(0, 2).map((finding, idx) => (
                            <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                              <div className="w-1 h-1 rounded-full bg-blue-600 mt-1.5" />
                              <span className="line-clamp-1">{finding}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="outline" size="lg" onClick={handleViewAllReports}>
                  Ver Todos os Relatórios
                  <FileText className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">{machineName}</h2>
                  <div className="flex items-center gap-6 mt-3 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      <span className="text-base">{locationName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span className="text-base">{selectedReport?.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4" />
                      <span className="text-base">{selectedReport?.time}</span>
                    </div>
                    <Badge variant="outline" className="font-mono">
                      {selectedReport?.id}
                    </Badge>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Button variant="outline" size="default" onClick={handlePrint}>
                    <Printer className="h-4 w-4 mr-2" />
                    Imprimir
                  </Button>
                  <Button variant="outline" size="default" onClick={() => setShowDetailedReport(false)}>
                    Voltar
                  </Button>
                  <Button variant="ghost" size="icon" onClick={onClose}>
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-12 gap-6">
                {/* Left Column - Metrics */}
                <div className="col-span-2 space-y-4">
                  <Card className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-2 border-green-200 dark:border-green-800">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Saúde Geral</span>
                        <CheckCircle2 className="h-5 w-5 text-green-600" />
                      </div>
                      <div className="text-4xl font-bold text-green-600 mb-2">
                        {selectedReport?.healthScore}%
                      </div>
                      <Badge className="bg-green-600 text-white">Status Excelente</Badge>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Temperatura</span>
                        <Thermometer className="h-5 w-5 text-orange-500" />
                      </div>
                      <div className="text-3xl font-bold">72°C</div>
                      <div className="text-sm text-muted-foreground mt-2">Normal</div>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-orange-500" style={{ width: '72%' }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Vibração</span>
                        <Activity className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="text-3xl font-bold">2.3</div>
                      <div className="text-sm text-muted-foreground mt-2">mm/s - Dentro do limite</div>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-500" style={{ width: '45%' }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Consumo</span>
                        <Zap className="h-5 w-5 text-yellow-500" />
                      </div>
                      <div className="text-3xl font-bold">8.5</div>
                      <div className="text-sm text-muted-foreground mt-2">kW - Eficiente</div>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-yellow-500" style={{ width: '65%' }} />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-5">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-sm font-medium">Eficiência</span>
                        <Gauge className="h-5 w-5 text-purple-500" />
                      </div>
                      <div className="text-3xl font-bold">94%</div>
                      <div className="text-sm text-muted-foreground mt-2">Acima da média</div>
                      <div className="mt-3 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: '94%' }} />
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Center - 3D Visualization */}
                <div className="col-span-8">
                  <Card className="h-full shadow-xl">
                    <CardContent className="p-6 h-full">
                      <div className="relative w-full h-[750px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden border-2 border-slate-200 dark:border-slate-700">
                        <Machine3DViewer 
                          machineName={machineName}
                          machineType={machineType}
                        />
                        
                        {/* Status Overlay */}
                        <div className="absolute top-4 left-4 flex gap-2">
                          <Badge className="bg-green-600 text-white text-sm py-1 px-3">
                            <CheckCircle2 className="h-4 w-4 mr-1" />
                            Sistema OK
                          </Badge>
                          <Badge variant="outline" className="text-sm py-1 px-3">
                            Última atualização: {new Date().toLocaleTimeString('pt-BR')}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Analysis & Recommendations */}
                <div className="col-span-2 space-y-4">
                  <Card className="shadow-md">
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <Brain className="h-5 w-5 text-purple-600" />
                        Análise IA
                      </h3>
                      <div className="space-y-3 text-sm">
                        {selectedReport?.findings.map((finding, idx) => (
                          <div key={idx} className="flex items-start gap-2 p-2 rounded-lg bg-green-50 dark:bg-green-950">
                            <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                            <span className="text-xs leading-relaxed">{finding}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-200 dark:border-blue-800 shadow-md">
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <Wrench className="h-5 w-5 text-blue-600" />
                        Manutenção
                      </h3>
                      <div className="space-y-4 text-sm">
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Última manutenção</span>
                            <span className="text-sm font-medium">5 dias atrás</span>
                          </div>
                          <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: '85%' }} />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">Próxima programada</span>
                            <span className="text-sm font-medium">Em 30 dias</span>
                          </div>
                          <div className="h-2 bg-blue-200 dark:bg-blue-900 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-600" style={{ width: '15%' }} />
                          </div>
                        </div>
                        
                        <div className="pt-3 border-t border-blue-200 dark:border-blue-800">
                          <Button size="sm" className="w-full bg-blue-600 hover:bg-blue-700">
                            <Calendar className="h-4 w-4 mr-2" />
                            Agendar Manutenção
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-2 border-purple-200 dark:border-purple-800 shadow-md">
                    <CardContent className="p-5">
                      <h3 className="font-semibold mb-4 flex items-center gap-2 text-lg">
                        <Sparkles className="h-5 w-5 text-purple-600" />
                        Recomendações IA
                      </h3>
                      <div className="space-y-3 text-xs">
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900">
                          <div className="flex items-start gap-2 mb-2">
                            <Wrench className="h-4 w-4 text-purple-600 mt-0.5" />
                            <p className="font-medium">Lubrificação preventiva</p>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">Aplicar lubrificante nos rolamentos principais</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Prioridade: Média
                          </Badge>
                        </div>
                        
                        <div className="p-3 bg-white dark:bg-gray-900 rounded-lg shadow-sm border border-purple-100 dark:border-purple-900">
                          <div className="flex items-start gap-2 mb-2">
                            <Settings className="h-4 w-4 text-purple-600 mt-0.5" />
                            <p className="font-medium">Verificação de sensores</p>
                          </div>
                          <p className="text-muted-foreground leading-relaxed">Calibrar sensor de temperatura em 15 dias</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            Prioridade: Baixa
                          </Badge>
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
    </>
  )
}
