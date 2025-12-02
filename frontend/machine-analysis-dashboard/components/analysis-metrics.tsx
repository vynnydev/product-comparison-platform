"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Activity, TrendingUp, AlertTriangle, CheckCircle2, Zap, Thermometer, Radio, Gauge, Clock } from "lucide-react"
import type { MachineData, PartData } from "@/lib/api"
import { motion } from "framer-motion"

interface AnalysisMetricsProps {
  machine?: MachineData | null
  selectedPart?: PartData | null
  aiAnalysisActive?: boolean
  showAIBorders?: boolean
}

export function AnalysisMetrics({
  machine,
  selectedPart,
  aiAnalysisActive = false,
  showAIBorders = false,
}: AnalysisMetricsProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "normal":
        return "green"
      case "warning":
        return "amber"
      case "critical":
        return "red"
      default:
        return "blue"
    }
  }

  const getOverallStatus = () => {
    if (!machine) return { value: "--", text: "Selecione uma máquina", color: "blue" }

    switch (machine.status) {
      case "operational":
        return { value: "98%", text: "Operação Normal", color: "green" }
      case "warning":
        return { value: "75%", text: "Requer Atenção", color: "amber" }
      case "critical":
        return { value: "45%", text: "Estado Crítico", color: "red" }
      case "maintenance":
        return { value: "0%", text: "Em Manutenção", color: "blue" }
      default:
        return { value: "--", text: "Status Desconhecido", color: "blue" }
    }
  }

  const overallStatus = getOverallStatus()

  const analysisCompleted = showAIBorders

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">
          {selectedPart ? `Análise da Peça: ${selectedPart.name}` : "Análise IA em Tempo Real"}
        </h3>
        <Badge variant="secondary" className="gap-1 bg-primary/20 text-primary border-primary/30">
          <Activity className="h-3 w-3 animate-pulse" />
          Monitorando
        </Badge>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Status Geral */}
        <Card
          className={`border-${overallStatus.color}-500/30 bg-gradient-to-br from-card to-${overallStatus.color}-500/5 relative overflow-hidden`}
        >
          {analysisCompleted && (
            <motion.div
              className="absolute inset-0 z-0 rounded-lg pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <CardContent className="p-4 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Status Geral</p>
                <p className={`mt-1 text-2xl font-bold text-${overallStatus.color}-400`}>{overallStatus.value}</p>
                <p className={`mt-1 text-xs text-${overallStatus.color}-400/70`}>{overallStatus.text}</p>
              </div>
              <div className={`rounded-lg bg-${overallStatus.color}-500/20 p-2`}>
                <CheckCircle2 className={`h-8 w-8 text-${overallStatus.color}-400`} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Eficiência */}
        <Card className="border-chart-2/30 bg-gradient-to-br from-card to-chart-2/5 relative overflow-hidden">
          {analysisCompleted && (
            <motion.div
              className="absolute inset-0 z-0 rounded-lg pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <CardContent className="p-4 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Eficiência</p>
                <p className="mt-1 text-2xl font-bold text-chart-2">{machine ? `${machine.efficiency}%` : "--"}</p>
                <p className="mt-1 flex items-center gap-1 text-xs text-chart-2">
                  <TrendingUp className="h-3 w-3" />
                  {machine ? "+2.3% vs. média" : "Sem dados"}
                </p>
              </div>
              <div className="rounded-lg bg-chart-2/20 p-2">
                <Zap className="h-8 w-8 text-chart-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Alertas Ativos */}
        <Card className="border-amber-500/30 bg-gradient-to-br from-card to-amber-500/5 relative overflow-hidden">
          {analysisCompleted && (
            <motion.div
              className="absolute inset-0 z-0 rounded-lg pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <CardContent className="p-4 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Alertas Ativos</p>
                <p className="mt-1 text-2xl font-bold text-amber-400">
                  {machine ? (machine.status === "critical" ? "5" : machine.status === "warning" ? "2" : "0") : "--"}
                </p>
                <p className="mt-1 text-xs text-amber-400/70">
                  {machine
                    ? machine.status === "critical"
                      ? "Ação Urgente"
                      : machine.status === "warning"
                        ? "Requer atenção"
                        : "Sem alertas"
                    : "Sem dados"}
                </p>
              </div>
              <div className="rounded-lg bg-amber-500/20 p-2">
                <AlertTriangle className="h-8 w-8 text-amber-400" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manutenção */}
        <Card className="border-chart-3/30 bg-gradient-to-br from-card to-chart-3/5 relative overflow-hidden">
          {analysisCompleted && (
            <motion.div
              className="absolute inset-0 z-0 rounded-lg pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                padding: "2px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
          )}
          <CardContent className="p-4 relative z-10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Manutenção</p>
                <p className="mt-1 text-2xl font-bold text-chart-3">
                  {machine ? (machine.nextMaintenance === "ATRASADA" ? "0d" : "12d") : "--"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {machine
                    ? machine.nextMaintenance === "ATRASADA"
                      ? "ATRASADA"
                      : `Próxima: ${machine.nextMaintenance}`
                    : "Sem dados"}
                </p>
              </div>
              <div className="rounded-lg bg-chart-3/20 p-2">
                <Activity className="h-8 w-8 text-chart-3" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedPart && selectedPart.metrics ? (
        <div className="grid grid-cols-4 gap-4 mt-4">
          {/* Temperature Card - Part Specific */}
          {selectedPart.metrics.temperature !== undefined && (
            <Card
              className={`border-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-500/30 bg-gradient-to-br from-card to-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-400`}
                    >
                      {selectedPart.metrics.temperature}°C
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-400/70 capitalize`}
                    >
                      {selectedPart.metrics.temperatureStatus === "normal"
                        ? "Normal"
                        : selectedPart.metrics.temperatureStatus === "warning"
                          ? "Elevada"
                          : "Crítica"}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg bg-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-500/20 p-2`}
                  >
                    <Thermometer
                      className={`h-8 w-8 text-${getStatusColor(selectedPart.metrics.temperatureStatus || "normal")}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Vibration Card - Part Specific */}
          {selectedPart.metrics.vibration !== undefined && (
            <Card
              className={`border-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-500/30 bg-gradient-to-br from-card to-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vibração</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-400`}
                    >
                      {selectedPart.metrics.vibration} mm/s
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-400/70 capitalize`}
                    >
                      {selectedPart.metrics.vibrationStatus === "normal"
                        ? "Normal"
                        : selectedPart.metrics.vibrationStatus === "warning"
                          ? "Elevada"
                          : "Crítica"}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg bg-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-500/20 p-2`}
                  >
                    <Radio
                      className={`h-8 w-8 text-${getStatusColor(selectedPart.metrics.vibrationStatus || "normal")}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Pressure Card - Part Specific */}
          {selectedPart.metrics.pressure !== undefined && (
            <Card
              className={`border-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-500/30 bg-gradient-to-br from-card to-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pressão</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-400`}
                    >
                      {selectedPart.metrics.pressure} bar
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-400/70 capitalize`}
                    >
                      {selectedPart.metrics.pressureStatus === "normal"
                        ? "Normal"
                        : selectedPart.metrics.pressureStatus === "warning"
                          ? "Atenção"
                          : "Crítica"}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg bg-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-500/20 p-2`}
                  >
                    <Gauge
                      className={`h-8 w-8 text-${getStatusColor(selectedPart.metrics.pressureStatus || "normal")}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Wear Card - Part Specific */}
          {selectedPart.metrics.wear !== undefined && (
            <Card
              className={`border-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-500/30 bg-gradient-to-br from-card to-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Desgaste</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-400`}
                    >
                      {selectedPart.metrics.wear}%
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-400/70 capitalize`}
                    >
                      {selectedPart.metrics.wearStatus === "normal"
                        ? "Baixo"
                        : selectedPart.metrics.wearStatus === "warning"
                          ? "Moderado"
                          : "Alto"}
                    </p>
                  </div>
                  <div
                    className={`rounded-lg bg-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-500/20 p-2`}
                  >
                    <Activity
                      className={`h-8 w-8 text-${getStatusColor(selectedPart.metrics.wearStatus || "normal")}-400`}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        machine &&
        machine.metrics && (
          <div className="grid grid-cols-4 gap-4 mt-4">
            {/* Temperature Card */}
            <Card
              className={`border-${getStatusColor(machine.metrics.temperatureStatus)}-500/30 bg-gradient-to-br from-card to-${getStatusColor(machine.metrics.temperatureStatus)}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Temperatura</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(machine.metrics.temperatureStatus)}-400`}
                    >
                      {machine.metrics.temperature}°C
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(machine.metrics.temperatureStatus)}-400/70 capitalize`}
                    >
                      {machine.metrics.temperatureStatus === "normal"
                        ? "Normal"
                        : machine.metrics.temperatureStatus === "warning"
                          ? "Elevada"
                          : "Crítica"}
                    </p>
                  </div>
                  <div className={`rounded-lg bg-${getStatusColor(machine.metrics.temperatureStatus)}-500/20 p-2`}>
                    <Thermometer className={`h-8 w-8 text-${getStatusColor(machine.metrics.temperatureStatus)}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Vibration Card */}
            <Card
              className={`border-${getStatusColor(machine.metrics.vibrationStatus)}-500/30 bg-gradient-to-br from-card to-${getStatusColor(machine.metrics.vibrationStatus)}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Vibração</p>
                    <p
                      className={`mt-1 text-2xl font-bold text-${getStatusColor(machine.metrics.vibrationStatus)}-400`}
                    >
                      {machine.metrics.vibration} mm/s
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(machine.metrics.vibrationStatus)}-400/70 capitalize`}
                    >
                      {machine.metrics.vibrationStatus === "normal"
                        ? "Normal"
                        : machine.metrics.vibrationStatus === "warning"
                          ? "Elevada"
                          : "Crítica"}
                    </p>
                  </div>
                  <div className={`rounded-lg bg-${getStatusColor(machine.metrics.vibrationStatus)}-500/20 p-2`}>
                    <Radio className={`h-8 w-8 text-${getStatusColor(machine.metrics.vibrationStatus)}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pressure Card */}
            <Card
              className={`border-${getStatusColor(machine.metrics.pressureStatus)}-500/30 bg-gradient-to-br from-card to-${getStatusColor(machine.metrics.pressureStatus)}-500/5 relative overflow-hidden`}
            >
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Pressão</p>
                    <p className={`mt-1 text-2xl font-bold text-${getStatusColor(machine.metrics.pressureStatus)}-400`}>
                      {machine.metrics.pressure} bar
                    </p>
                    <p
                      className={`mt-1 text-xs text-${getStatusColor(machine.metrics.pressureStatus)}-400/70 capitalize`}
                    >
                      {machine.metrics.pressureStatus === "normal"
                        ? "Normal"
                        : machine.metrics.pressureStatus === "warning"
                          ? "Atenção"
                          : "Crítica"}
                    </p>
                  </div>
                  <div className={`rounded-lg bg-${getStatusColor(machine.metrics.pressureStatus)}-500/20 p-2`}>
                    <Gauge className={`h-8 w-8 text-${getStatusColor(machine.metrics.pressureStatus)}-400`} />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Runtime Card */}
            <Card className="border-blue-500/30 bg-gradient-to-br from-card to-blue-500/5 relative overflow-hidden">
              {analysisCompleted && (
                <motion.div
                  className="absolute inset-0 z-0 rounded-lg pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                    padding: "2px",
                    WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    WebkitMaskComposite: "xor",
                    maskComposite: "exclude",
                  }}
                  animate={{
                    opacity: [0.4, 0.8, 0.4],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              )}
              <CardContent className="p-4 relative z-10">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Tempo de Operação</p>
                    <p className="mt-1 text-2xl font-bold text-blue-400">{machine.metrics.runtimeHours}h</p>
                    <p className="mt-1 text-xs text-blue-400/70">{machine.metrics.runtime}% do ciclo</p>
                  </div>
                  <div className="rounded-lg bg-blue-500/20 p-2">
                    <Clock className="h-8 w-8 text-blue-400" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      )}
    </div>
  )
}
