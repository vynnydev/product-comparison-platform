"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Plus,
  ChevronDown,
  ChevronRight,
  Activity,
  MapPin,
  Calendar,
  TrendingUp,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { fetchMachines, fetchReviewMachines, type MachineData } from "@/lib/api"

interface MachineListProps {
  onSelectMachine: (machine: MachineData) => void
  selectedMachine: MachineData | null
  onStartAiAnalysis?: (machine: MachineData) => void
}

export function MachineList({ onSelectMachine, selectedMachine, onStartAiAnalysis }: MachineListProps) {
  const [machines, setMachines] = useState<MachineData[]>([])
  const [reviewMachines, setReviewMachines] = useState<MachineData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [expandedMachine, setExpandedMachine] = useState<string | null>(null)
  const [isReviewExpanded, setIsReviewExpanded] = useState(false)

  useEffect(() => {
    async function loadMachines() {
      setLoading(true)
      setError(null)

      try {
        const [industryData, reviewData] = await Promise.all([fetchMachines(), fetchReviewMachines()])

        setMachines(industryData)
        setReviewMachines(reviewData)

        if (industryData.length > 0 && !selectedMachine) {
          onSelectMachine(industryData[0])
        }
      } catch (err) {
        console.error("[v0] Erro ao carregar máquinas:", err)
        setError("Não foi possível carregar as máquinas")
      } finally {
        setLoading(false)
      }
    }

    loadMachines()

    // Users can manually refresh the page when needed
  }, [])

  const filteredMachines = machines.filter(
    (machine) =>
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.location.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return { bg: "bg-emerald-500/20", text: "text-emerald-500", border: "border-emerald-500/30" }
      case "warning":
        return { bg: "bg-amber-500/20", text: "text-amber-500", border: "border-amber-500/30" }
      case "critical":
        return { bg: "bg-red-500/20", text: "text-red-500", border: "border-red-500/30" }
      case "maintenance":
        return { bg: "bg-blue-500/20", text: "text-blue-500", border: "border-blue-500/30" }
      default:
        return { bg: "bg-gray-500/20", text: "text-gray-500", border: "border-gray-500/30" }
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operacional"
      case "warning":
        return "Atenção"
      case "critical":
        return "Crítico"
      case "maintenance":
        return "Manutenção"
      default:
        return "Desconhecido"
    }
  }

  return (
    <Card className="flex h-full flex-col overflow-hidden border-primary/20">
      <CardHeader className="space-y-2 border-b border-border py-3 px-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary" />
            Máquinas da Indústria
          </h3>
          <Button size="icon" variant="ghost" className="h-8 w-8 hover:bg-primary/10 hover:text-primary">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar máquinas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 h-9 bg-muted/50"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-amber-500/50 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Erro ao carregar máquinas</p>
            <p className="text-xs text-muted-foreground">{error}</p>
          </div>
        ) : machines.length === 0 && reviewMachines.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-center">
            <Activity className="h-12 w-12 text-muted-foreground/50 mb-3" />
            <p className="text-sm font-medium text-foreground mb-1">Nenhuma máquina encontrada</p>
            <p className="text-xs text-muted-foreground">Aguardando dados da API</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {reviewMachines.length > 0 && (
              <div className="bg-gradient-to-r from-amber-500/10 via-red-500/10 to-amber-500/10 border-l-4 border-amber-500">
                <div
                  className="flex items-center gap-3 p-3 cursor-pointer hover:bg-amber-500/5 transition-all"
                  onClick={() => setIsReviewExpanded(!isReviewExpanded)}
                >
                  <Button variant="ghost" size="icon" className="h-6 w-6 flex-shrink-0">
                    {isReviewExpanded ? (
                      <ChevronDown className="h-4 w-4 text-amber-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-amber-500" />
                    )}
                  </Button>

                  <AlertTriangle className="h-5 w-5 text-amber-500 animate-pulse" />

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-semibold text-sm text-amber-500">Máquinas para Revisão</h4>
                      <Badge variant="destructive" className="bg-red-500/30 text-red-400 border-red-500/40 text-xs">
                        {reviewMachines.length}
                      </Badge>
                    </div>
                    <p className="text-xs text-amber-400/80">Atenção ou Status Crítico</p>
                  </div>
                </div>

                {isReviewExpanded && (
                  <div className="px-3 pb-3 space-y-1.5 animate-in slide-in-from-top-2 duration-200">
                    {reviewMachines.map((machine) => {
                      const isSelected = selectedMachine?.id === machine.id
                      const isCritical = machine.status === "critical"

                      return (
                        <div
                          key={machine.id}
                          className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-all duration-200 ${
                            isSelected
                              ? isCritical
                                ? "bg-red-500/20 border-red-500 shadow-lg shadow-red-500/10"
                                : "bg-amber-500/20 border-amber-500 shadow-lg shadow-amber-500/10"
                              : isCritical
                                ? "bg-red-500/10 border-red-500/30 hover:bg-red-500/20 hover:border-red-500"
                                : "bg-amber-500/10 border-amber-500/30 hover:bg-amber-500/20 hover:border-amber-500"
                          }`}
                        >
                          <Button
                            size="icon"
                            variant="ghost"
                            className={`h-7 w-7 flex-shrink-0 ${
                              isCritical
                                ? "hover:bg-red-500/30 hover:text-red-300"
                                : "hover:bg-amber-500/30 hover:text-amber-300"
                            }`}
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectMachine(machine)
                              if (onStartAiAnalysis) {
                                onStartAiAnalysis(machine)
                              }
                            }}
                            title="Aceitar Revisão e Iniciar Análise IA"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </Button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              onSelectMachine(machine)
                            }}
                            className="flex flex-1 items-center gap-2 text-left min-w-0"
                          >
                            {isCritical ? (
                              <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse flex-shrink-0" />
                            ) : (
                              <Activity className="h-4 w-4 text-amber-400 flex-shrink-0" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium truncate ${isCritical ? "text-red-400" : "text-amber-400"}`}>
                                {machine.name}
                              </p>
                              <p className="text-xs text-muted-foreground truncate">{machine.model}</p>
                            </div>
                            <Badge
                              variant="secondary"
                              className={`text-xs flex-shrink-0 ${
                                isCritical
                                  ? "bg-red-500/30 text-red-300 border-red-500/40"
                                  : "bg-amber-500/30 text-amber-300 border-amber-500/40"
                              }`}
                            >
                              {isCritical ? "CRÍTICO" : "ATENÇÃO"}
                            </Badge>
                          </button>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )}

            {filteredMachines.map((machine) => {
              const isSelected = selectedMachine?.id === machine.id
              const isExpanded = expandedMachine === machine.id
              const statusColors = getStatusColor(machine.status)

              return (
                <div
                  key={machine.id}
                  className={`transition-all duration-200 ${
                    isSelected
                      ? "bg-primary/10 border-l-4 border-primary"
                      : "border-l-4 border-transparent hover:bg-accent/50"
                  }`}
                >
                  <div
                    className="flex items-center gap-3 p-3 cursor-pointer"
                    onClick={() => {
                      onSelectMachine(machine)
                      setExpandedMachine(isExpanded ? null : machine.id)
                    }}
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 flex-shrink-0"
                      onClick={(e) => {
                        e.stopPropagation()
                        setExpandedMachine(isExpanded ? null : machine.id)
                      }}
                    >
                      {isExpanded ? (
                        <ChevronDown className="h-4 w-4 text-primary" />
                      ) : (
                        <ChevronRight className="h-4 w-4" />
                      )}
                    </Button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm truncate">{machine.name}</h4>
                        <Badge variant="secondary" className={`${statusColors.bg} ${statusColors.text} text-xs`}>
                          {getStatusText(machine.status)}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">{machine.model}</p>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="px-3 pb-3 space-y-2 animate-in slide-in-from-top-2 duration-200">
                      <div className="bg-muted/30 rounded-lg p-3 space-y-2">
                        <div className="flex items-start gap-2">
                          <MapPin className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Localização</p>
                            <p className="text-sm">{machine.location}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <Calendar className="h-4 w-4 text-chart-2 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Última Manutenção</p>
                            <p className="text-sm">{machine.lastMaintenance}</p>
                          </div>
                        </div>

                        <div className="flex items-start gap-2">
                          <TrendingUp className="h-4 w-4 text-chart-3 flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-medium text-muted-foreground">Eficiência</p>
                            <div className="flex items-center gap-2">
                              <div className="flex-1 bg-muted rounded-full h-2">
                                <div
                                  className={`h-full rounded-full transition-all duration-300 ${
                                    machine.efficiency >= 90
                                      ? "bg-emerald-500"
                                      : machine.efficiency >= 70
                                        ? "bg-amber-500"
                                        : "bg-red-500"
                                  }`}
                                  style={{ width: `${machine.efficiency}%` }}
                                />
                              </div>
                              <span className="text-sm font-bold">{machine.efficiency}%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}

            {filteredMachines.length === 0 && machines.length > 0 && (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Search className="h-12 w-12 text-muted-foreground/50 mb-3" />
                <p className="text-sm text-muted-foreground">Nenhuma máquina encontrada para "{searchQuery}"</p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
