"use client"

import { useState, useEffect, Suspense, useMemo } from "react"
import { Button } from "@/components/ui/button"
import {
  Plus,
  RefreshCw,
  ChevronUp,
  X,
  Box,
  Layers,
  Activity,
  Settings,
  AlertCircle,
  Wrench,
  BarChart3,
} from "lucide-react"
import { SetupFacilityModal } from "@/components/setup-facility-modal"
import { AddMachineModal } from "@/components/add-machine-modal"
import { WorkspaceViewer3D } from "@/components/workspace-viewer-3d"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"

export default function WorkspacePage() {
  const [setupModalOpen, setSetupModalOpen] = useState(false)
  const [addMachineModalOpen, setAddMachineModalOpen] = useState(false)
  const [selectedZone, setSelectedZone] = useState("Zone T2")
  const [selectedLocation, setSelectedLocation] = useState("Oficina Centro Automotiva")
  const [selectedMachine, setSelectedMachine] = useState<any>(null)
  const [leftPanelState, setLeftPanelState] = useState<"minimized" | "semi" | "expanded">("semi")
  const [rightPanelState, setRightPanelState] = useState<"minimized" | "semi" | "expanded">("semi")
  const [renderMode, setRenderMode] = useState<"3d" | "svg">("3d")
  const [isSyncing, setIsSyncing] = useState(false)
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null)
  const [facility, setFacility] = useState<any>({ name: "", type: "", corridors: 0, zones: [] })
  const [machines, setMachines] = useState<any[]>([])
  const [selectedWing, setSelectedWing] = useState<string>("all")
  const [timelineData, setTimelineData] = useState<any[]>([])
  const [currentTimeIndex, setCurrentTimeIndex] = useState(2)
  const [machineCardExpanded, setMachineCardExpanded] = useState(false)
  const [showAutomatedTaskModal, setShowAutomatedTaskModal] = useState(false)

  const locations = [
    {
      id: "oficina",
      name: "Oficina Centro Automotiva",
      type: "workshop",
      corridors: 3,
      zones: ["Zone A1", "Zone A2", "Zone A3"],
      machines: [
        {
          id: "m1",
          name: "Braço Robótico BR-001",
          type: "robotic_arm",
          corridor: 1,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 86.8,
          performance: 94.3,
          quality: 98.3,
          availability: 92.0,
        },
        {
          id: "m2",
          name: "Torno CNC T-3000",
          type: "cnc",
          corridor: 2,
          position: { x: 1, y: 2 },
          status: "maintenance",
          efficiency: 0,
          performance: 0,
          quality: 0,
          availability: 0,
        },
        {
          id: "m3",
          name: "Empilhadeira E-200",
          type: "forklift",
          corridor: 3,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 92.5,
          performance: 88.7,
          quality: 100,
          availability: 95.0,
        },
      ],
    },
    {
      id: "fabrica",
      name: "Fábrica Industrial",
      type: "factory",
      corridors: 4,
      zones: ["Zone T1", "Zone T2", "Zone T3", "Zone T4"],
      machines: [
        {
          id: "f1",
          name: "Linha de Montagem LM-01",
          type: "industrial",
          corridor: 1,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 91.2,
          performance: 95.8,
          quality: 97.5,
          availability: 94.0,
        },
        {
          id: "f2",
          name: "Braço Robótico BR-500",
          type: "robotic_arm",
          corridor: 2,
          position: { x: 1, y: 2 },
          status: "operating",
          efficiency: 88.5,
          performance: 92.1,
          quality: 96.8,
          availability: 91.5,
        },
        {
          id: "f3",
          name: "CNC Industrial CI-800",
          type: "cnc",
          corridor: 3,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 85.0,
          performance: 89.5,
          quality: 99.2,
          availability: 88.0,
        },
        {
          id: "f4",
          name: "Empilhadeira E-300",
          type: "forklift",
          corridor: 4,
          position: { x: 1, y: 2 },
          status: "operating",
          efficiency: 90.0,
          performance: 87.5,
          quality: 100,
          availability: 93.0,
        },
      ],
    },
    {
      id: "galpao",
      name: "Galpão Logístico",
      type: "warehouse",
      corridors: 5,
      zones: ["Ala Norte", "Ala Sul", "Ala Leste", "Ala Oeste", "Centro"],
      machines: [
        {
          id: "g1",
          name: "Empilhadeira E-400",
          type: "forklift",
          corridor: 1,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 93.5,
          performance: 91.2,
          quality: 100,
          availability: 96.0,
        },
        {
          id: "g2",
          name: "Empilhadeira E-401",
          type: "forklift",
          corridor: 2,
          position: { x: 1, y: 2 },
          status: "operating",
          efficiency: 91.0,
          performance: 89.5,
          quality: 100,
          availability: 94.5,
        },
        {
          id: "g3",
          name: "Braço Robótico BR-700",
          type: "robotic_arm",
          corridor: 3,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 87.5,
          performance: 93.0,
          quality: 98.0,
          availability: 90.0,
        },
        {
          id: "g4",
          name: "Empilhadeira E-402",
          type: "forklift",
          corridor: 4,
          position: { x: 1, y: 2 },
          status: "maintenance",
          efficiency: 0,
          performance: 0,
          quality: 0,
          availability: 0,
        },
        {
          id: "g5",
          name: "Sistema Automatizado SA-100",
          type: "industrial",
          corridor: 5,
          position: { x: 1, y: 1 },
          status: "operating",
          efficiency: 95.0,
          performance: 96.5,
          quality: 99.5,
          availability: 97.0,
        },
      ],
    },
  ]

  useEffect(() => {
    const currentLocation = locations.find((loc) => loc.name === selectedLocation)
    if (currentLocation) {
      setFacility({
        name: currentLocation.name,
        type: currentLocation.type,
        corridors: currentLocation.corridors,
        zones: currentLocation.zones,
      })
      setMachines(currentLocation.machines)
      if (currentLocation.zones.length > 0) {
        setSelectedZone(currentLocation.zones[0])
      }
    }
  }, [selectedLocation])

  useEffect(() => {
    const times = ["10:00", "10:15", "10:30", "10:45", "11:00", "11:15", "11:30", "11:45"]
    const timeline = times.map((time, index) => ({
      time,
      machineCount: machines.length,
      operating: machines.filter((m) => {
        // Simulate historical data
        if (index < currentTimeIndex - 1) return m.status === "operating"
        if (index === currentTimeIndex - 1) return Math.random() > 0.3
        if (index === currentTimeIndex) return m.status === "operating"
        return Math.random() > 0.5
      }).length,
      maintenance: machines.filter((m) => m.status === "maintenance").length,
    }))
    setTimelineData(timeline)
  }, [machines, currentTimeIndex])

  const filteredMachines = useMemo(() => {
    if (selectedWing === "all") return machines

    const wingMappings: Record<string, number[]> = {
      "Zone A1": [1],
      "Zone A2": [2],
      "Zone A3": [3],
      "Zone T1": [1],
      "Zone T2": [2],
      "Zone T3": [3],
      "Zone T4": [4],
      "Ala Norte": [1],
      "Ala Sul": [2],
      "Ala Leste": [3],
      "Ala Oeste": [4],
      Centro: [5],
    }

    const corridors = wingMappings[selectedWing] || []
    return machines.filter((m) => corridors.includes(m.corridor))
  }, [machines, selectedWing])

  const totalMachines = machines.length
  const operatingMachines = machines.filter((m) => m.status === "operating").length
  const maintenanceMachines = machines.filter((m) => m.status === "maintenance").length
  const waitingMachines = machines.filter((m) => m.status === "waiting").length

  const handleAddMachine = (machineData: any) => {
    const newMachine = {
      ...machineData,
      id: `machine-${Date.now()}`,
    }
    setMachines([...machines, newMachine])
  }

  const handleRemoveMachine = (machineId: string) => {
    setMachines(machines.filter((m) => m.id !== machineId))
    setSelectedMachine(null)
  }

  const handleSyncAPI = async () => {
    setIsSyncing(true)
    console.log("[v0] Syncing API data...")

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000))

    setLastSyncTime(new Date())
    setIsSyncing(false)
    console.log("[v0] API sync completed")
  }

  const toggleLeftPanel = () => {
    setLeftPanelState((prev) => {
      if (prev === "minimized") return "semi"
      return "minimized"
    })
  }

  const toggleRightPanel = () => {
    setRightPanelState((prev) => {
      if (prev === "minimized") return "semi"
      return "minimized"
    })
  }

  const isFacilitySetup = facility && facility.name

  const handleTimelineClick = (index: number) => {
    setCurrentTimeIndex(index)
  }

  const handleCreateAutomatedTask = (duration: number, action: string) => {
    if (!selectedMachine) return

    console.log("[v0] Creating automated task:", {
      machine: selectedMachine.name,
      action,
      duration,
    })

    // Here you would integrate with the kanban board to create a new automated task
    setShowAutomatedTaskModal(false)
    setMachineCardExpanded(false)
  }

  useEffect(() => {
    const event = new CustomEvent("collapseSidebar", { detail: { collapsed: true } })
    window.dispatchEvent(event)

    // Cleanup: restore sidebar when leaving the page
    return () => {
      const restoreEvent = new CustomEvent("collapseSidebar", { detail: { collapsed: false } })
      window.dispatchEvent(restoreEvent)
    }
  }, [])

  return (
    <div className="fixed inset-0 top-16 bg-background overflow-hidden">
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-background/95 backdrop-blur-sm border-b border-border z-20 flex items-center justify-between px-6 pl-24">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Monitor de Máquinas</h1>
            <p className="text-sm text-muted-foreground">{facility?.name || "Configure seu ambiente de trabalho"}</p>
          </div>
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm font-medium"
          >
            {locations.map((location) => (
              <option key={location.id} value={location.name}>
                {location.name}
              </option>
            ))}
          </select>
          <select
            value={selectedWing}
            onChange={(e) => setSelectedWing(e.target.value)}
            className="px-4 py-2 bg-muted border border-border rounded-lg text-sm font-medium"
          >
            <option value="all">Todas as Alas</option>
            {facility?.zones?.map((zone: string) => (
              <option key={zone} value={zone}>
                {zone}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={renderMode === "3d" ? "default" : "outline"}
            onClick={() => setRenderMode("3d")}
            className="gap-2"
            size="sm"
          >
            <Box className="h-4 w-4" />
            3D
          </Button>
          <Button
            variant={renderMode === "svg" ? "default" : "outline"}
            onClick={() => setRenderMode("svg")}
            className="gap-2"
            size="sm"
          >
            <Layers className="h-4 w-4" />
            SVG
          </Button>
          <Button variant="outline" onClick={handleSyncAPI} className="gap-2 bg-transparent" disabled={isSyncing}>
            <RefreshCw className={`h-4 w-4 ${isSyncing ? "animate-spin" : ""}`} />
            {isSyncing ? "Sincronizando..." : "Sincronizar API"}
          </Button>
          <Button onClick={() => setAddMachineModalOpen(true)} className="gap-2 bg-emerald-600 hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            Adicionar Máquina
          </Button>
          <Button variant="outline" onClick={() => setSetupModalOpen(true)}>
            Configurar Local
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="absolute top-16 left-0 right-0 bottom-0">
        {/* Left Panel */}
        <Card
          className={`absolute left-24 top-6 bg-card/95 backdrop-blur-sm border-border transition-all duration-300 z-10 rounded-2xl ${
            leftPanelState === "minimized" ? "w-16 h-16" : "w-72"
          }`}
        >
          <div className="px-5">
            {leftPanelState === "minimized" ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleLeftPanel}
                className="flex items-center justify-center w-full h-full hover:bg-emerald-500/10"
              >
                <Activity className="h-6 w-6 text-emerald-500" />
              </Button>
            ) : (
              <>
                <div className="flex items-start justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
                      <Activity className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Total de Equipamentos</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-3xl font-bold text-foreground">{totalMachines}</p>
                        <p className="text-sm text-muted-foreground">Equipamentos</p>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon" onClick={toggleLeftPanel} className="h-8 w-8 flex-shrink-0">
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Settings className="h-5 w-5 text-emerald-500" />
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm text-foreground">Operando</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-foreground">{operatingMachines}</p>
                        <p className="text-xs text-muted-foreground">Equipamentos</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <AlertCircle className="h-5 w-5 text-amber-500" />
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm text-foreground">Em Manutenção</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-foreground">{maintenanceMachines}</p>
                        <p className="text-xs text-muted-foreground">Equipamentos</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Wrench className="h-5 w-5 text-amber-500" />
                    <div className="flex-1 flex items-center justify-between">
                      <p className="text-sm text-foreground">Aguardando Manutenção</p>
                      <div className="flex items-baseline gap-2">
                        <p className="text-2xl font-bold text-foreground">{waitingMachines}</p>
                        <p className="text-xs text-muted-foreground">Equipamentos</p>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>

        {/* Center - 3D Viewer */}
        <div className="w-full h-full">
          <Suspense
            fallback={<div className="flex items-center justify-center h-full">Carregando visualização 3D...</div>}
          >
            <WorkspaceViewer3D
              facility={facility}
              machines={filteredMachines}
              selectedZone={selectedZone}
              onMachineClick={(machine) => {
                setSelectedMachine(machine)
                setMachineCardExpanded(false)
              }}
              renderMode={renderMode}
            />
          </Suspense>

          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 flex items-center gap-6 px-6 py-2 bg-background/80 backdrop-blur-sm rounded-full border border-border">
            {timelineData.map((data, i) => (
              <button
                key={data.time}
                onClick={() => handleTimelineClick(i)}
                className={`flex flex-col items-center gap-1 transition-all hover:scale-110 ${
                  i === currentTimeIndex ? "scale-110" : ""
                }`}
                title={`${data.time}: ${data.operating} operando, ${data.maintenance} em manutenção`}
              >
                <div
                  className={`h-2 w-2 rounded-full transition-all ${
                    i === currentTimeIndex
                      ? "bg-emerald-500 ring-4 ring-emerald-500/20"
                      : data.operating > data.maintenance
                        ? "bg-emerald-500/50"
                        : "bg-amber-500/50"
                  }`}
                />
                <span
                  className={`text-xs ${i === currentTimeIndex ? "text-foreground font-semibold" : "text-muted-foreground"}`}
                >
                  {data.time}
                </span>
              </button>
            ))}
          </div>

          {selectedMachine && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-[700px]">
              <Card className="p-6 bg-background/95 backdrop-blur-sm border-border">
                {!machineCardExpanded ? (
                  <div className="flex items-start justify-between">
                    <div className="space-y-3 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-foreground">{selectedMachine.id}</h3>
                        <Badge
                          variant={selectedMachine.status === "operating" ? "default" : "secondary"}
                          className={
                            selectedMachine.status === "maintenance"
                              ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                              : ""
                          }
                        >
                          {selectedMachine.status === "maintenance"
                            ? "Em Manutenção"
                            : selectedMachine.status === "operating"
                              ? "Em Operação"
                              : "Aguardando"}
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setMachineCardExpanded(true)}
                          className="ml-auto"
                        >
                          Ver Detalhes
                        </Button>
                      </div>
                      <p className="text-sm text-muted-foreground">{selectedMachine.name}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setSelectedMachine(null)} className="ml-4">
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-foreground">{selectedMachine.name}</h3>
                          <Badge variant={selectedMachine.status === "operating" ? "default" : "secondary"}>
                            {selectedMachine.status === "maintenance" ? "Em Manutenção" : "Em Operação"}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Corredor {selectedMachine.corridor} - Posição: ({selectedMachine.position.x},{" "}
                          {selectedMachine.position.y})
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => setMachineCardExpanded(false)}>
                          Minimizar
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedMachine(null)
                            setMachineCardExpanded(false)
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="border-t border-border pt-4">
                      <h4 className="text-sm font-semibold mb-3">Atividade Automática</h4>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateAutomatedTask(30, "Mover para manutenção")}
                          className="gap-2"
                        >
                          <Activity className="h-4 w-4" />
                          30 min
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateAutomatedTask(60, "Mover para manutenção")}
                          className="gap-2"
                        >
                          <Activity className="h-4 w-4" />1 hora
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCreateAutomatedTask(120, "Mover para manutenção")}
                          className="gap-2"
                        >
                          <Activity className="h-4 w-4" />2 horas
                        </Button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2">
                        Crie uma tarefa automática para movimentar esta máquina por um período determinado
                      </p>
                    </div>
                    <div className="grid grid-cols-4 gap-4 border-t border-border pt-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Eficiência:</p>
                        <p className="text-lg font-semibold text-cyan-500">{selectedMachine.efficiency}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Desempenho:</p>
                        <p className="text-lg font-semibold text-cyan-500">{selectedMachine.performance}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Qualidade:</p>
                        <p className="text-lg font-semibold text-cyan-500">{selectedMachine.quality}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Disponibilidade:</p>
                        <p className="text-lg font-semibold text-cyan-500">{selectedMachine.availability}%</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveMachine(selectedMachine.id)}
                        className="gap-2"
                      >
                        <X className="h-4 w-4" />
                        Remover Máquina
                      </Button>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          )}
        </div>

        {/* Right Panel */}
        <Card
          className={`absolute right-6 top-6 bg-card/95 backdrop-blur-sm border-border transition-all duration-300 z-10 rounded-2xl ${
            rightPanelState === "minimized" ? "w-16 h-16" : "w-96"
          }`}
        >
          <div className="px-5">
            {rightPanelState === "minimized" ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleRightPanel}
                className="flex items-center justify-center w-full h-full hover:bg-emerald-500/10"
              >
                <BarChart3 className="h-6 w-6 text-emerald-500" />
              </Button>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-base font-semibold text-foreground">Métricas de Equipamentos</h3>
                    <p className="text-xs text-muted-foreground">Indicadores médios de desempenho</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-emerald-500">↗ 86.8%</span>
                    <Button variant="ghost" size="icon" onClick={toggleRightPanel} className="h-8 w-8">
                      <ChevronUp className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end justify-between h-40 gap-3 px-2">
                    {[
                      { label: "Eficiência", value: 86.8, color: "bg-gradient-to-t from-emerald-500 to-emerald-400" },
                      {
                        label: "Desempenho",
                        value: 94.3,
                        color: "bg-gradient-to-t from-amber-500 to-amber-400",
                      },
                      {
                        label: "Qualidade",
                        value: 98.3,
                        color: "bg-gradient-to-t from-rose-500 to-rose-400",
                      },
                      {
                        label: "Disponibilidade",
                        value: 92.0,
                        color: "bg-gradient-to-t from-blue-500 to-cyan-400",
                      },
                    ].map((metric, i) => (
                      <div key={i} className="flex-1 flex flex-col items-center gap-2">
                        <div className="relative w-full flex items-end" style={{ height: '128px' }}>
                          <div 
                            className={`w-full rounded-t-lg ${metric.color} transition-all duration-500 shadow-lg`} 
                            style={{ height: `${metric.value}%` }} 
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground text-center font-medium">{metric.label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-emerald-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Efic.</p>
                      <p className="text-lg font-bold text-foreground">86.8%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-amber-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Desemp.</p>
                      <p className="text-lg font-bold text-foreground">94.3%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-red-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Qualid.</p>
                      <p className="text-lg font-bold text-foreground">98.3%</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-2 rounded-full bg-blue-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dispon.</p>
                      <p className="text-lg font-bold text-foreground">92.0%</p>
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-sm font-semibold text-foreground">Eficiência ao Longo do Tempo</h4>
                      <p className="text-xs text-muted-foreground">Últimas 6 horas de desempenho</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-2xl font-bold text-emerald-500">90.8%</p>
                      <span className="text-xs text-emerald-500">↗ 0.5%</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6">
                        <ChevronUp className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-end justify-between h-24 gap-1">
                    {[88, 86, 90, 89, 91, 90, 92, 91].map((value, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-cyan-400 to-blue-500 rounded-t-sm"
                        style={{ height: `${value}%` }}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </Card>
      </div>

      {/* Modals */}
      <SetupFacilityModal
        open={setupModalOpen}
        onClose={() => setSetupModalOpen(false)}
        onSave={(data) => {
          // Placeholder for saving facility data
          console.log("Facility data saved:", data)
          setSetupModalOpen(false)
        }}
        existingData={facility}
      />

      <AddMachineModal
        open={addMachineModalOpen}
        onClose={() => setAddMachineModalOpen(false)}
        onSave={handleAddMachine}
        facility={facility}
      />
    </div>
  )
}
