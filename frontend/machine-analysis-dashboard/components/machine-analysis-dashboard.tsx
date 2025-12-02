"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Search, Menu, Bell, User, Settings, Grid3x3, LayoutList, Activity } from "lucide-react"
import { InteractiveMachineDiagram } from "@/components/interactive-machine-diagram"
import { MachineList } from "@/components/machine-list"
import { AnalysisMetrics } from "@/components/analysis-metrics"
import { fetchMachines, type MachineData, type PartData } from "@/lib/api"
import { AIAnalysisOverlay } from "@/components/ai-analysis-overlay"

export function MachineAnalysisDashboard() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null)
  const [selectedPart, setSelectedPart] = useState<PartData | null>(null)
  const [machines, setMachines] = useState<MachineData[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzingMachine, setAnalyzingMachine] = useState<MachineData | null>(null)
  const [showAIBorders, setShowAIBorders] = useState(false)

  useEffect(() => {
    async function loadMachines() {
      const data = await fetchMachines()
      setMachines(data)
    }
    loadMachines()
  }, [])

  const handleStartAiAnalysis = (machine: MachineData) => {
    setAnalyzingMachine(machine)
    setIsAnalyzing(true)
    setSelectedMachine(machine)
  }

  const handleAnalysisComplete = () => {
    setIsAnalyzing(false)
    setAnalyzingMachine(null)
    setShowAIBorders(true)
  }

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Header */}
      <header className="flex items-center justify-between border-b border-border bg-gradient-to-r from-card via-card to-primary/5 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="rounded-lg bg-primary/20 p-2">
              <Activity className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-xl font-semibold">Portal de Análise: Sistema Industrial</h1>
          </div>
          <Badge variant="secondary" className="bg-primary/20 text-primary border-primary/30 text-xs">
            POWERED BY IA
          </Badge>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground">Fábrica Central</span>
          <span className="text-sm font-medium">João Silva</span>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Search className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <User className="h-5 w-5" />
          </Button>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="flex items-center gap-2 border-b border-border bg-gradient-to-r from-muted/30 to-primary/5 px-6 py-2 text-sm">
        <span className="text-muted-foreground">Clientes</span>
        <ChevronRight className="h-4 w-4 text-primary/50" />
        <span className="text-muted-foreground">Equipamentos Industriais</span>
        <ChevronRight className="h-4 w-4 text-primary/50" />
        <span className="text-muted-foreground">Equipamento</span>
        <ChevronRight className="h-4 w-4 text-primary/50" />
        <span className="font-medium text-primary">{selectedMachine?.name || "Selecione uma máquina"}</span>
        <ChevronRight className="h-4 w-4 text-primary/50" />
        <span className="font-medium text-primary">Desenho e Peças</span>
      </div>

      {/* AI Analysis Overlay */}
      <AIAnalysisOverlay
        isActive={isAnalyzing}
        machineName={analyzingMachine?.name || ""}
        onComplete={handleAnalysisComplete}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="flex w-16 flex-col items-center gap-4 border-r border-border bg-card py-4">
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Grid3x3 className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="bg-primary/10 text-primary hover:bg-primary/20">
            <Activity className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <LayoutList className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hover:bg-primary/10 hover:text-primary">
            <Settings className="h-5 w-5" />
          </Button>
        </aside>

        {/* Main Content */}
        <main className="flex flex-1 flex-col overflow-y-auto scroll-smooth scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent hover:scrollbar-thumb-primary/40">
          {/* Machine Info */}
          {selectedMachine && (
            <div className="border-b border-border bg-gradient-to-r from-card to-primary/5 px-6 py-4">
              <h2 className="text-2xl font-semibold">{selectedMachine.name}</h2>
              <div className="mt-1 flex items-center gap-4 text-sm">
                <span className="text-muted-foreground">Fabricante: Indústria Central</span>
                <span className="text-primary/50">•</span>
                <span className="text-muted-foreground">
                  Modelo: <span className="font-medium text-primary">{selectedMachine.model}</span>
                </span>
              </div>
            </div>
          )}

          {/* Tabs */}
          <div className="flex items-center gap-6 border-b border-border bg-card px-6">
            <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30">
              Detalhes
            </button>
            <button className="border-b-2 border-primary px-1 py-3 text-sm font-medium text-primary">
              Desenho e Peças
            </button>
            <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30">
              Documentos
            </button>
            <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30">
              Análise IA
            </button>
            <button className="border-b-2 border-transparent px-1 py-3 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-primary/30">
              Histórico
            </button>
          </div>

          {/* Content Area */}
          <div className="flex min-h-[750px] flex-1 gap-4 overflow-visible p-4">
            {/* Diagram Section */}
            <div className="flex min-h-[700px] flex-1 flex-col overflow-hidden">
              <InteractiveMachineDiagram
                machine={selectedMachine}
                onPartSelect={setSelectedPart}
                isAnalyzing={isAnalyzing}
                showAIBorders={showAIBorders}
              />
            </div>

            {/* Machine List Section */}
            <div className="flex min-h-[700px] w-[440px] flex-col overflow-hidden">
              <MachineList
                onSelectMachine={setSelectedMachine}
                selectedMachine={selectedMachine}
                onStartAiAnalysis={handleStartAiAnalysis}
              />
            </div>
          </div>

          {/* Analysis Metrics */}
          <div className="border-t border-border bg-gradient-to-r from-card to-primary/5 p-2">
            <AnalysisMetrics machine={selectedMachine} selectedPart={selectedPart} showAIBorders={showAIBorders} />
          </div>
        </main>
      </div>
    </div>
  )
}
