"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit3, AlertTriangle, CheckCircle, AlertCircle, Play, Pause, Sparkles } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import type { MachineData, PartData } from "@/lib/api"
import { detectMachineType } from "@/lib/api"
import { CentrifugalPumpDiagram } from "@/components/diagrams/centrifugal-pump-diagram"
import { CompressorDiagram } from "@/components/diagrams/compressor-diagram"
import { ElectricMotorDiagram } from "@/components/diagrams/electric-motor-diagram"
import { ValveDiagram } from "@/components/diagrams/valve-diagram"
import { RivetingMachineDiagram } from "@/components/diagrams/riveting-machine-diagram"
import { AutomatedAssemblyDiagram } from "@/components/diagrams/automated-assembly-diagram"
import { CncCutterDiagram } from "@/components/diagrams/cnc-cutter-diagram"
import { HydraulicPressDiagram } from "@/components/diagrams/hydraulic-press-diagram"
import { RoboticWelderDiagram } from "@/components/diagrams/robotic-welder-diagram"
import { IndustrialDrillDiagram } from "@/components/diagrams/industrial-drill-diagram"

export function InteractiveMachineDiagram({
  machine,
  onPartSelect,
  isAnalyzing = false,
  showAIBorders = false,
}: {
  machine: MachineData | null
  onPartSelect?: (part: PartData | null) => void
  isAnalyzing?: boolean
  showAIBorders?: boolean
}) {
  const [hoveredPart, setHoveredPart] = useState<PartData | null>(null)
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null)
  const [isPresentationMode, setIsPresentationMode] = useState(false)
  const [currentPartIndex, setCurrentPartIndex] = useState(0)
  const [showAiInsights, setShowAiInsights] = useState(false)
  const [aiInsights, setAiInsights] = useState<Array<{ id: number; text: string; delay: number }>>([])

  const machineParts = machine?.parts || []

  const machineType = machine ? detectMachineType(machine.name, machine.model) : "centrifugal-pump"

  const handlePartChange = useCallback(
    (part: PartData | null) => {
      setSelectedPart(part)
      if (onPartSelect) {
        // Defer the parent state update to next tick
        setTimeout(() => onPartSelect(part), 0)
      }
    },
    [onPartSelect],
  )

  useEffect(() => {
    if (!isPresentationMode) return

    const interval = setInterval(() => {
      setCurrentPartIndex((prev) => {
        const nextIndex = (prev + 1) % machineParts.length
        const part = machineParts[nextIndex]
        handlePartChange(part)
        return nextIndex
      })
    }, 4000)

    return () => clearInterval(interval)
  }, [isPresentationMode, machineParts, handlePartChange])

  useEffect(() => {
    if (isPresentationMode) {
      if (machineParts.length > 0) {
        const part = machineParts[0]
        handlePartChange(part)
        setCurrentPartIndex(0)
      }
    } else {
      handlePartChange(null)
    }
  }, [isPresentationMode])

  useEffect(() => {
    setHoveredPart(null)
    setSelectedPart(null)
    setIsPresentationMode(false)
    setCurrentPartIndex(0)
  }, [machine?.id])

  useEffect(() => {
    if (isAnalyzing) {
      setShowAiInsights(true)
      const insights = [
        { id: 1, text: "Analisando padrões de vibração...", delay: 500 },
        { id: 2, text: "Detectando anomalias térmicas...", delay: 1500 },
        { id: 3, text: "Avaliando desgaste de componentes...", delay: 2500 },
        { id: 4, text: "Calculando vida útil estimada...", delay: 3500 },
        { id: 5, text: "Gerando recomendações de manutenção...", delay: 4500 },
      ]
      setAiInsights(insights)

      setTimeout(() => {
        setShowAiInsights(false)
        setAiInsights([])
      }, 6000)
    }
  }, [isAnalyzing])

  const getStatusInfo = (status: "good" | "warning" | "critical") => {
    switch (status) {
      case "good":
        return { icon: CheckCircle, color: "#10b981", bgColor: "#10b98120" }
      case "warning":
        return { icon: AlertCircle, color: "#f59e0b", bgColor: "#f59e0b20" }
      case "critical":
        return { icon: AlertTriangle, color: "#ef4444", bgColor: "#ef444420" }
    }
  }

  return (
    <Card className="flex h-full flex-col border-primary/20 overflow-hidden relative">
      <AnimatePresence>
        {isAnalyzing && (
          <>
            <motion.div
              className="absolute inset-0 z-10 rounded-lg pointer-events-none"
              style={{
                background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                padding: "3px",
                WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "xor",
                maskComposite: "exclude",
              }}
              animate={{
                opacity: [0.6, 1, 0.6],
                scale: [1, 1.005, 1],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />

            <motion.div
              className="absolute inset-0 z-9 rounded-lg pointer-events-none"
              style={{
                boxShadow:
                  "0 0 40px rgba(139, 92, 246, 0.6), 0 0 80px rgba(236, 72, 153, 0.4), inset 0 0 40px rgba(59, 130, 246, 0.3)",
              }}
              animate={{
                opacity: [0.4, 1, 0.4],
              }}
              transition={{
                duration: 2,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            />
            {/* End pulsating AI border */}
          </>
        )}
      </AnimatePresence>

      <CardContent className="flex flex-1 flex-col p-0 overflow-hidden">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-border bg-gradient-to-r from-muted/50 to-primary/10 px-3 py-1">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-primary/20 hover:text-primary">
              <Edit3 className="h-4 w-4" />
            </Button>
            <Button
              variant={isPresentationMode ? "default" : "ghost"}
              size="icon"
              className="h-8 w-8 hover:bg-primary/20 hover:text-primary"
              onClick={() => setIsPresentationMode(!isPresentationMode)}
              title={isPresentationMode ? "Parar Apresentação" : "Iniciar Apresentação"}
            >
              {isPresentationMode ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
          </div>
          {isPresentationMode && (
            <div className="flex items-center gap-2 text-xs text-primary animate-pulse">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="font-medium">Modo Apresentação</span>
            </div>
          )}
        </div>

        {/* Diagram Area */}
        <div className="relative flex flex-1 items-center justify-center overflow-hidden bg-gradient-to-br from-muted/20 via-background to-primary/5 p-0.5">
          <AnimatePresence>
            {isAnalyzing && (
              <motion.div
                className="absolute inset-0 z-0 pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                  background:
                    "radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.15), rgba(236, 72, 153, 0.15), rgba(245, 158, 11, 0.10), rgba(59, 130, 246, 0.15), rgba(16, 185, 129, 0.10))",
                  backgroundSize: "400% 400%",
                }}
              >
                <motion.div
                  className="absolute inset-0"
                  animate={{
                    background: [
                      "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.2), transparent 50%)",
                      "radial-gradient(circle at 80% 70%, rgba(236, 72, 153, 0.2), transparent 50%)",
                      "radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.2), transparent 50%)",
                      "radial-gradient(circle at 20% 30%, rgba(139, 92, 246, 0.2), transparent 50%)",
                    ],
                  }}
                  transition={{
                    duration: 6,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
          {/* End AI animated background */}

          <AnimatePresence>
            {showAiInsights &&
              aiInsights.map((insight, index) => (
                <motion.div
                  key={insight.id}
                  initial={{ opacity: 0, y: -20, scale: 0.8 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.8 }}
                  transition={{ delay: insight.delay / 1000, duration: 0.5 }}
                  className="absolute z-30 rounded-xl border-2 px-4 py-2 backdrop-blur-md shadow-2xl pointer-events-none"
                  style={{
                    top: `${5 + index * 12}%`,
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxWidth: "320px",
                    background:
                      "linear-gradient(135deg, rgba(139, 92, 246, 0.95), rgba(236, 72, 153, 0.95), rgba(245, 158, 11, 0.90))",
                    borderColor: "rgba(255, 255, 255, 0.3)",
                    boxShadow: "0 0 30px rgba(139, 92, 246, 0.5), 0 10px 40px rgba(0,0,0,0.4)",
                  }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div
                      animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                      transition={{
                        rotate: { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                        scale: { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" },
                      }}
                    >
                      <Sparkles className="h-4 w-4 text-white drop-shadow-lg" />
                    </motion.div>
                    <span className="text-xs font-semibold text-white drop-shadow-lg">{insight.text}</span>
                  </div>
                </motion.div>
              ))}
          </AnimatePresence>

          <div className="relative h-full w-full">
            {machineType === "centrifugal-pump" && (
              <CentrifugalPumpDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "compressor" && (
              <CompressorDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "electric-motor" && (
              <ElectricMotorDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "valve" && (
              <ValveDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "riveting-machine" && (
              <RivetingMachineDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "automated-assembly" && (
              <AutomatedAssemblyDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "cnc-cutter" && (
              <CncCutterDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "hydraulic-press" && (
              <HydraulicPressDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "robotic-welder" && (
              <RoboticWelderDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}
            {machineType === "industrial-drill" && (
              <IndustrialDrillDiagram parts={machineParts} hoveredPart={hoveredPart} selectedPart={selectedPart} />
            )}

            {machineParts.map((part) => (
              <div
                key={part.id}
                className="absolute"
                style={{
                  left: `${part.position.x}%`,
                  top: `${part.position.y}%`,
                  transform: "translate(-50%, -50%)",
                }}
              >
                {(hoveredPart?.id === part.id || selectedPart?.id === part.id) && (
                  <div
                    className="absolute inset-0 -z-10 animate-ping rounded-full opacity-75"
                    style={{
                      backgroundColor: part.color,
                      width: "48px",
                      height: "48px",
                      left: "50%",
                      top: "50%",
                      transform: "translate(-50%, -50%)",
                    }}
                  />
                )}

                <div className="relative">
                  {showAIBorders && (
                    <motion.div
                      className="absolute inset-0 rounded-full pointer-events-none"
                      style={{
                        background: "linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b, #3b82f6, #10b981)",
                        padding: "2px",
                        WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                        WebkitMaskComposite: "xor",
                        maskComposite: "exclude",
                      }}
                      animate={{
                        opacity: [0.6, 1, 0.6],
                        scale: [1, 1.05, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    />
                  )}

                  <button
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border-2 font-bold shadow-lg transition-all duration-300 hover:scale-110"
                    style={{
                      borderColor: selectedPart?.id === part.id || hoveredPart?.id === part.id ? part.color : "#64748b",
                      backgroundColor:
                        selectedPart?.id === part.id
                          ? part.color
                          : hoveredPart?.id === part.id
                            ? `${part.color}20`
                            : "#0f172a",
                      color:
                        selectedPart?.id === part.id ? "#ffffff" : hoveredPart?.id === part.id ? part.color : "#e2e8f0",
                      boxShadow:
                        selectedPart?.id === part.id || hoveredPart?.id === part.id
                          ? `0 0 20px ${part.color}80, 0 0 40px ${part.color}40`
                          : "0 4px 6px rgba(0,0,0,0.3)",
                    }}
                    onMouseEnter={() => !isPresentationMode && setHoveredPart(part)}
                    onMouseLeave={() => !isPresentationMode && setHoveredPart(null)}
                    onClick={() => !isPresentationMode && handlePartChange(selectedPart?.id === part.id ? null : part)}
                    disabled={isPresentationMode}
                  >
                    <span className="text-sm font-bold">{part.label}</span>
                  </button>
                </div>

                {(hoveredPart?.id === part.id || selectedPart?.id === part.id) && (
                  <div
                    className="absolute h-0.5 animate-pulse"
                    style={{
                      backgroundColor: part.color,
                      width: "30px",
                      left: part.position.x > 50 ? "-30px" : "40px",
                      top: "50%",
                      boxShadow: `0 0 10px ${part.color}`,
                    }}
                  />
                )}
              </div>
            ))}

            {(hoveredPart || selectedPart) && (
              <div
                className="absolute z-50 w-96 animate-in fade-in slide-in-from-bottom-2 rounded-lg border-2 bg-card/95 p-4 shadow-2xl backdrop-blur-sm duration-200"
                style={{
                  borderColor: (selectedPart || hoveredPart)?.color,
                  left:
                    (selectedPart || hoveredPart)!.position.x > 60
                      ? `${(selectedPart || hoveredPart)!.position.x - 30}%`
                      : `${(selectedPart || hoveredPart)!.position.x + 8}%`,
                  top:
                    (selectedPart || hoveredPart)!.position.y > 60
                      ? `${(selectedPart || hoveredPart)!.position.y - 35}%`
                      : `${(selectedPart || hoveredPart)!.position.y + 5}%`,
                  boxShadow: `0 0 30px ${(selectedPart || hoveredPart)?.color}40, 0 10px 40px rgba(0,0,0,0.5)`,
                }}
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div
                      className="rounded-md px-2 py-1 text-xs font-bold"
                      style={{
                        backgroundColor: `${(selectedPart || hoveredPart)?.color}20`,
                        color: (selectedPart || hoveredPart)?.color,
                      }}
                    >
                      {(selectedPart || hoveredPart)?.partNumber}
                    </div>
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full font-bold text-white"
                      style={{ backgroundColor: (selectedPart || hoveredPart)?.color }}
                    >
                      {(selectedPart || hoveredPart)?.label}
                    </div>
                  </div>
                  <h4 className="text-lg font-bold text-foreground">{(selectedPart || hoveredPart)?.name}</h4>
                  <p className="text-sm text-muted-foreground">{(selectedPart || hoveredPart)?.manufacturer}</p>

                  {/* Status section */}
                  <div
                    className="flex items-center gap-2 rounded-lg p-3"
                    style={{
                      backgroundColor: getStatusInfo((selectedPart || hoveredPart)!.status).bgColor,
                    }}
                  >
                    {(() => {
                      const StatusIcon = getStatusInfo((selectedPart || hoveredPart)!.status).icon
                      return (
                        <StatusIcon
                          className="h-5 w-5 flex-shrink-0"
                          style={{
                            color: getStatusInfo((selectedPart || hoveredPart)!.status).color,
                          }}
                        />
                      )
                    })()}
                    <div className="flex-1">
                      <div className="text-xs font-medium text-muted-foreground">Estado</div>
                      <div
                        className="text-sm font-bold"
                        style={{
                          color: getStatusInfo((selectedPart || hoveredPart)!.status).color,
                        }}
                      >
                        {(selectedPart || hoveredPart)?.statusText}
                      </div>
                    </div>
                  </div>

                  {/* Recommendation section */}
                  <div className="rounded-lg border border-border bg-muted/30 p-3">
                    <div className="text-xs font-medium text-muted-foreground mb-1">Recomendação</div>
                    <p className="text-sm text-foreground leading-relaxed">
                      {(selectedPart || hoveredPart)?.recommendation}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
