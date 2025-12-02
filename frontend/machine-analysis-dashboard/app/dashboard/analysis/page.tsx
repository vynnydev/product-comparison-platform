"use client"

import { useState, useEffect, Suspense } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Activity, Gauge, ThermometerSun, TrendingUp, AlertTriangle, CheckCircle2, Brain, Play, Pause, Wrench, Box, Cog, Zap, Shield, Clock, MapPin, Building2, Factory, ChevronLeft, ChevronRight, Sparkles, MapPinned, FileText, X } from 'lucide-react'
import { useTheme } from "@/contexts/theme-context"
import { fetchMachines, type MachineData } from "@/lib/api"
import { Machine3DViewer } from "@/components/machine-3d-viewer"
import Image from "next/image"
import { MachineReportModal } from "@/components/machine-report-modal"
import { PartsLocationFinder } from "@/components/parts-location-finder"

const workshopLocations = [
  {
    id: "oficina-centro",
    name: "Oficina Centro Automotiva",
    type: "workshop",
    address: "Rua das Flores, 123",
    machines: [
      { id: "1", name: "Bomba Centrífuga BC-2000", type: "centrifugal-pump", category: "Bomba Industrial" },
      { id: "2", name: "Torno CNC T-3000", type: "cnc-lathe", category: "Máquina CNC" },
      { id: "3", name: "Motor V8 Turbo", type: "car-engine", category: "Motor Automotivo" },
      { id: "4", name: "Compressor de Ar CA-500", type: "air-compressor", category: "Equipamento Pneumático" },
    ]
  },
  {
    id: "industria-textil",
    name: "Indústria Textil São Paulo",
    type: "industry",
    address: "Av. Industrial, 456",
    machines: [
      { id: "5", name: "Fresadora Universal FU-500", type: "milling-machine", category: "Máquina Industrial" },
      { id: "6", name: "Prensa Hidráulica PH-3000", type: "hydraulic-press", category: "Equipamento Industrial" },
      { id: "7", name: "Retificadora RET-200", type: "grinding-machine", category: "Máquina de Precisão" },
      { id: "8", name: "Empilhadeira Elétrica EE-2500", type: "electric-forklift", category: "Veículo Industrial" },
    ]
  },
  {
    id: "hospital-equipamentos",
    name: "Hospital Santa Maria - Equipamentos",
    type: "medical",
    address: "Av. Saúde, 789",
    machines: [
      { id: "9", name: "Ressonância Magnética MRI-2000", type: "mri-machine", category: "Equipamento Médico" },
      { id: "10", name: "Tomógrafo CT-5000", type: "ct-scanner", category: "Equipamento Radiológico" },
      { id: "11", name: "Ventilador Pulmonar VP-300", type: "ventilator", category: "Equipamento UTI" },
    ]
  },
  {
    id: "garagem-frota",
    name: "Garagem de Frota Volvo",
    type: "garage",
    address: "Rodovia BR-101, km 234",
    machines: [
      { id: "12", name: "Ônibus Elétrico Volvo 7900", type: "electric-bus", category: "Veículo Elétrico" },
      { id: "13", name: "Lavadora Industrial LW-5000", type: "industrial-washer", category: "Equipamento Limpeza" },
      { id: "14", name: "Elevador Automotivo EA-3000", type: "car-lift", category: "Equipamento Oficina" },
    ]
  }
]

const getMachineImage = (type: string) => {
  const imageMap: Record<string, string> = {
    "centrifugal-pump": "/industrial-centrifugal-pump-blue.jpg",
    "cnc-lathe": "/industrial-cnc-lathe-machine-metallic-gray.jpg",
    "car-engine": "/v8-turbo-engine-chrome.jpg",
    "milling-machine": "/industrial-milling-machine-blue.jpg",
    "mri-machine": "/mri-medical-scanner-white.jpg",
    "air-compressor": "/industrial-air-compressor-silver.jpg",
    "hydraulic-press": "/hydraulic-press-industrial-green.jpg",
    "grinding-machine": "/grinding-machine-precision.jpg",
    "electric-forklift": "/electric-forklift.jpg",
    "ct-scanner": "/ct-scanner-medical.jpg",
    "ventilator": "/medical-ventilator.jpg",
    "electric-bus": "/electric-bus-volvo-blue.jpg",
    "industrial-washer": "/industrial-washer-stainless.jpg",
    "car-lift": "/automotive-car-lift-blue.jpg"
  }
  return imageMap[type] || "/industrial-milling-machine-blue.jpg"
}

const machineParts = {
  "Torno CNC T-3000": [
    {
      id: 1,
      name: "Mandril Hidráulico",
      category: "Chuck",
      status: "Em Estoque",
      quantity: 3,
      condition: "Novo",
      price: "R$ 8.500,00",
      image: "/hydraulic-chuck-metallic.jpg",
      specs: ["Diâmetro: 250mm", "Pressão: 40 bar", "Precisão: 0.01mm"]
    },
    {
      id: 2,
      name: "Torre de Ferramentas",
      category: "Tool Holder",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 12.000,00",
      image: "/cnc-tool-turret.jpg",
      specs: ["12 posições", "Rotação: 0.3s", "Repetibilidade: 0.002mm"]
    },
    {
      id: 3,
      name: "Contraponto",
      category: "Tailstock",
      status: "Manutenção",
      quantity: 1,
      condition: "Regular",
      price: "R$ 5.200,00",
      image: "/lathe-tailstock.jpg",
      specs: ["Curso: 150mm", "Cone Morse MT4", "Força: 5000N"]
    },
    {
      id: 4,
      name: "Painel de Controle CNC",
      category: "Control System",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 25.000,00",
      image: "/cnc-control-panel-touchscreen.jpg",
      specs: ["Touchscreen 19\"", "32GB RAM", "Siemens 840D"]
    }
  ],
  "Fresadora Universal FU-500": [
    {
      id: 5,
      name: "Cabeçote de Fresagem",
      category: "Milling Head",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 15.000,00",
      image: "/milling-head.jpg",
      specs: ["Potência: 15kW", "RPM: 0-8000", "ISO 40"]
    },
    {
      id: 6,
      name: "Mesa Rotativa",
      category: "Rotary Table",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 8.900,00",
      image: "/rotary-table-machine.jpg",
      specs: ["Ø 400mm", "Precisão: 20\"", "Carga: 300kg"]
    },
    {
      id: 7,
      name: "Morsa Hidráulica",
      category: "Vise",
      status: "Em Estoque",
      quantity: 4,
      condition: "Novo",
      price: "R$ 3.200,00",
      image: "/hydraulic-vise.jpg",
      specs: ["Abertura: 200mm", "Força: 40kN", "Precisão: 0.01mm"]
    }
  ],
  "Compressor de Ar CA-500": [
    {
      id: 8,
      name: "Motor Elétrico",
      category: "Motor",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 18.000,00",
      image: "/electric-motor.jpg",
      specs: ["Potência: 50kW", "Rotação: 3000rpm", "Eficácia: 95%"]
    },
    {
      id: 9,
      name: "Reservatório de Ar",
      category: "Air Tank",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 6.500,00",
      image: "/air-tank.jpg",
      specs: ["Capacidade: 500L", "Pressão: 10 bar", "Material: Aço Inoxidável"]
    }
  ],
  "Prensa Hidráulica PH-3000": [
    {
      id: 10,
      name: "Cilindro Hidráulico",
      category: "Hydraulic Cylinder",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 22.000,00",
      image: "/hydraulic-cylinder.jpg",
      specs: ["Diâmetro: 300mm", "Comprimento: 1500mm", "Pressão: 200 bar"]
    },
    {
      id: 11,
      name: "Valvula de Controle",
      category: "Control Valve",
      status: "Manutenção",
      quantity: 1,
      condition: "Regular",
      price: "R$ 4.500,00",
      image: "/control-valve.jpg",
      specs: ["Pressão: 100 bar", "Fluxo: 100L/min", "Material: Bronze"]
    }
  ],
  "Retificadora RET-200": [
    {
      id: 12,
      name: "Discos de Retificação",
      category: "Grinding Discs",
      status: "Em Estoque",
      quantity: 5,
      condition: "Novo",
      price: "R$ 10.000,00",
      image: "/grinding-discs.jpg",
      specs: ["Diâmetro: 200mm", "Material: Diamante", "Velocidade: 3000rpm"]
    },
    {
      id: 13,
      name: "Base de Retificação",
      category: "Grinding Base",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 15.000,00",
      image: "/grinding-base.jpg",
      specs: ["Diâmetro: 1000mm", "Precisão: 0.005mm", "Material: Aço"]
    }
  ],
  "Empilhadeira Elétrica EE-2500": [
    {
      id: 14,
      name: "Motor Elétrico",
      category: "Motor",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 30.000,00",
      image: "/electric-motor.jpg",
      specs: ["Potência: 75kW", "Rotação: 3600rpm", "Eficácia: 98%"]
    },
    {
      id: 15,
      name: "Bateria",
      category: "Battery",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 12.000,00",
      image: "/battery.jpg",
      specs: ["Capacidade: 100Ah", "Tensão: 48V", "Tipo: Absorvente de Líquido"]
    }
  ],
  "Ressonância Magnética MRI-2000": [
    {
      id: 16,
      name: "Supercondutor",
      category: "Superconductor",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 50.000,00",
      image: "/superconductor.jpg",
      specs: ["Tipo: Niobio Titanio", "Temperatura: 4K", "Corrente: 1000A"]
    },
    {
      id: 17,
      name: "Tubos de Imagem",
      category: "Image Tubes",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 35.000,00",
      image: "/image-tubes.jpg",
      specs: ["Diâmetro: 100mm", "Material: Vidro", "Resolução: 1.5mm"]
    }
  ],
  "Tomógrafo CT-5000": [
    {
      id: 18,
      name: "Xícaras de Tomografia",
      category: "CT Scanners",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 45.000,00",
      image: "/ct-scanners.jpg",
      specs: ["Diâmetro: 500mm", "Material: Plástico", "Resolução: 0.5mm"]
    },
    {
      id: 19,
      name: "Detector de Raios-X",
      category: "X-Ray Detector",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 28.000,00",
      image: "/x-ray-detector.jpg",
      specs: ["Tipo: Plano", "Resolução: 0.2mm", "Material: Cobre"]
    }
  ],
  "Ventilador Pulmonar VP-300": [
    {
      id: 20,
      name: "Motor de Ventilação",
      category: "Ventilation Motor",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 20.000,00",
      image: "/ventilation-motor.jpg",
      specs: ["Potência: 10kW", "Rotação: 3000rpm", "Eficácia: 90%"]
    },
    {
      id: 21,
      name: "Tubo de Ar",
      category: "Air Tube",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 8.000,00",
      image: "/air-tube.jpg",
      specs: ["Diâmetro: 50mm", "Material: PVC", "Pressão: 5 bar"]
    }
  ],
  "Ônibus Elétrico Volvo 7900": [
    {
      id: 22,
      name: "Bateria Elétrica",
      category: "Battery",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 150.000,00",
      image: "/electric-bus-battery.jpg",
      specs: ["Capacidade: 2000Ah", "Tensão: 600V", "Tipo: Líquido"]
    },
    {
      id: 23,
      name: "Motor Elétrico",
      category: "Motor",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 250.000,00",
      image: "/electric-bus-motor.jpg",
      specs: ["Potência: 500kW", "Rotação: 2000rpm", "Eficácia: 98%"]
    }
  ],
  "Lavadora Industrial LW-5000": [
    {
      id: 24,
      name: "Bomba de Agua",
      category: "Water Pump",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 30.000,00",
      image: "/water-pump.jpg",
      specs: ["Potência: 100kW", "Rotação: 3000rpm", "Eficácia: 95%"]
    },
    {
      id: 25,
      name: "Filtro de Água",
      category: "Water Filter",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 15.000,00",
      image: "/water-filter.jpg",
      specs: ["Capacidade: 1000L/min", "Material: Fibra de Vidro", "Tipo: Absorvente"]
    }
  ],
  "Elevador Automotivo EA-3000": [
    {
      id: 26,
      name: "Motor Hidráulico",
      category: "Hydraulic Motor",
      status: "Em Uso",
      quantity: 1,
      condition: "Ótimo",
      price: "R$ 40.000,00",
      image: "/hydraulic-motor.jpg",
      specs: ["Potência: 75kW", "Pressão: 300 bar", "Eficácia: 97%"]
    },
    {
      id: 27,
      name: "Corda de Elevação",
      category: "Lifting Rope",
      status: "Em Estoque",
      quantity: 2,
      condition: "Novo",
      price: "R$ 12.000,00",
      image: "/lifting-rope.jpg",
      specs: ["Diâmetro: 25mm", "Material: Fibra de Aço", "Comprimento: 500m"]
    }
  ]
}

function AnalysisPage() {
  const [selectedLocation, setSelectedLocation] = useState<string>(workshopLocations[0].id)
  const [machines, setMachines] = useState<MachineData[]>([])
  const [selectedMachine, setSelectedMachine] = useState<MachineData | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analyzedParts, setAnalyzedParts] = useState<any[]>([])
  const [selectedPart, setSelectedPart] = useState<any>(null)
  const [scrollPosition, setScrollPosition] = useState(0)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false)
  const [isLocationFinderOpen, setIsLocationFinderOpen] = useState(false)
  const [selectedPartForLocation, setSelectedPartForLocation] = useState<any>(null)
  const { theme } = useTheme()
  
  const currentLocation = workshopLocations.find(loc => loc.id === selectedLocation)
  const currentMachines = currentLocation?.machines || []

  useEffect(() => {
    const loadMachines = async () => {
      try {
        const data = await fetchMachines()
        setMachines(data)
        if (currentMachines.length > 0) {
          setSelectedMachine(currentMachines[0] as any)
        }
      } catch (error) {
        console.error('Erro ao carregar máquinas:', error)
      }
    }
    loadMachines()
  }, [selectedLocation])

  const currentMachineParts = selectedMachine ? machineParts[selectedMachine.name as keyof typeof machineParts] || [] : []

  const scrollLeft = () => {
    const container = document.getElementById('machines-carousel')
    if (container) {
      container.scrollBy({ left: -300, behavior: 'smooth' })
    }
  }

  const scrollRight = () => {
    const container = document.getElementById('machines-carousel')
    if (container) {
      container.scrollBy({ left: 300, behavior: 'smooth' })
    }
  }

  const handleStartAnalysis = () => {
    setIsAnalyzing(true)
  }

  const handleAnalysisComplete = (parts: any[]) => {
    setIsAnalyzing(false)
    setAnalyzedParts(parts)
  }

  const handleClearAnalysis = () => {
    setIsAnalyzing(false)
    setAnalyzedParts([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-5xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">
              Análise de Máquinas
            </h1>
            <p className="text-lg text-muted-foreground">
              Monitoramento inteligente e análise preditiva em tempo real
            </p>
          </div>
        </div>

        <Card className="shadow-lg border-2">
          <CardContent className="p-6 space-y-6">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-5 w-5" />
                <span className="font-semibold">Selecione a Localização:</span>
              </div>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger className="w-[500px]">
                  <SelectValue placeholder="Selecione uma oficina ou indústria" />
                </SelectTrigger>
                <SelectContent>
                  {workshopLocations.map((location) => (
                    <SelectItem key={location.id} value={location.id}>
                      <div className="flex items-center gap-2">
                        {location.type === "workshop" && <Wrench className="h-4 w-4" />}
                        {location.type === "industry" && <Factory className="h-4 w-4" />}
                        {location.type === "garage" && <Building2 className="h-4 w-4" />}
                        {location.type === "medical" && <Activity className="h-4 w-4" />}
                        <span className="font-medium">{location.name}</span>
                        <span className="text-xs text-muted-foreground">• {location.address}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Badge variant="outline" className="ml-auto">
                {currentMachines.length} máquinas
              </Badge>
            </div>

            <div className="relative">
              <Button
                variant="outline"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg"
                onClick={scrollLeft}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <div 
                id="machines-carousel"
                className="flex gap-3 overflow-x-auto scroll-smooth pb-2 px-10 scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {currentMachines.map((machine) => (
                  <Card
                    key={machine.id}
                    className={`flex-shrink-0 w-56 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                      selectedMachine?.id === machine.id ? 'ring-2 ring-blue-600 shadow-xl' : ''
                    }`}
                    onClick={() => {
                      setSelectedMachine(machine as any)
                      setSelectedPart(null)
                    }}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="text-center mb-2">
                        <p className="font-semibold text-sm leading-tight line-clamp-2 h-10">{machine.name}</p>
                        <Badge variant="outline" className="text-xs mt-1">
                          {machine.category}
                        </Badge>
                      </div>
                      <div className="relative w-full h-32 rounded-md overflow-hidden bg-slate-100 dark:bg-slate-800">
                        <img
                          src={getMachineImage(machine.type) || "/placeholder.svg"}
                          alt={machine.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg"
                onClick={scrollRight}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>

        {selectedMachine && (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            <div className="xl:col-span-2 space-y-6">

              <Card className="overflow-hidden shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950">
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="h-5 w-5 text-purple-600" />
                    Visualização 3D Interativa
                    <div className="ml-auto flex gap-2">
                      {analyzedParts.length > 0 && !isAnalyzing && (
                        <Button 
                          variant="outline"
                          size="sm" 
                          className="gap-2 border-red-200 dark:border-red-800 hover:bg-red-50 dark:hover:bg-red-950"
                          onClick={handleClearAnalysis}
                        >
                          <X className="h-4 w-4 text-red-600" />
                          <span className="text-red-600 dark:text-red-400">Limpar Análise</span>
                        </Button>
                      )}
                      
                      <Button 
                        variant="default"
                        size="sm" 
                        className="gap-2 relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 border-0 shadow-lg"
                        onClick={handleStartAnalysis}
                        disabled={isAnalyzing}
                      >
                        <Brain className="h-4 w-4" />
                        {isAnalyzing ? "Analisando..." : "Análise com IA"}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="gap-2 border-2 border-purple-200 dark:border-purple-800 hover:bg-purple-50 dark:hover:bg-purple-950"
                        onClick={() => setIsReportModalOpen(true)}
                      >
                        <FileText className="h-4 w-4 text-purple-600" />
                        <span className="text-purple-600 dark:text-purple-400">Extrair Relatório</span>
                      </Button>
                    </div>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">Use o mouse para rotacionar e a roda para zoom</p>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="relative w-full h-[500px] bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 rounded-lg overflow-hidden shadow-inner">
                    <Machine3DViewer 
                      machineName={selectedMachine.name}
                      machineType={selectedMachine.type}
                      isAnalyzing={isAnalyzing}
                      onAnalysisComplete={handleAnalysisComplete}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-lg border-2">
                <CardHeader className="bg-gradient-to-r from-green-50 to-teal-50 dark:from-green-950 dark:to-teal-950">
                  <CardTitle className="flex items-center gap-2">
                    <Cog className="h-5 w-5 text-green-600" />
                    Peças e Componentes Disponíveis
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {currentMachineParts.map((part) => (
                      <Card 
                        key={part.id} 
                        className={`cursor-pointer transition-all hover:shadow-xl hover:scale-105 ${
                          selectedPart?.id === part.id ? 'ring-2 ring-blue-600' : ''
                        }`}
                        onClick={() => setSelectedPart(part)}
                      >
                        <CardContent className="p-4">
                          <div className="relative w-full h-48 mb-3 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-800">
                            <Image
                              src={part.image || "/placeholder.svg"}
                              alt={part.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-base">{part.name}</h4>
                                <p className="text-xs text-muted-foreground">{part.category}</p>
                              </div>
                              <Badge 
                                variant={part.status === "Em Estoque" ? "default" : part.status === "Em Uso" ? "secondary" : "destructive"}
                                className="text-xs"
                              >
                                {part.status}
                              </Badge>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Quantidade:</span>
                              <span className="font-medium">{part.quantity} un.</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-muted-foreground">Condição:</span>
                              <Badge variant="outline" className="text-xs">{part.condition}</Badge>
                            </div>
                            <div className="pt-2 border-t">
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full gap-2 relative overflow-hidden border-purple-200 dark:border-purple-800 group"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  setSelectedPartForLocation(part)
                                  setIsLocationFinderOpen(true)
                                }}
                              >
                                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                <Sparkles className="h-4 w-4 text-purple-600 group-hover:text-white transition-colors duration-300 relative z-10" />
                                <span className="text-sm font-medium text-purple-600 group-hover:text-white transition-colors duration-300 relative z-10">Verificar Preços com IA</span>
                              </Button>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              {/* Status card */}
              <Card className="shadow-lg border-2">
                <CardHeader className="pb-3 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Gauge className="h-5 w-5 text-blue-600" />
                    Status em Tempo Real
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-950 rounded-lg">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <span className="text-sm font-medium">Saúde Geral</span>
                    </div>
                    <Badge className="bg-green-600">98%</Badge>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <ThermometerSun className="h-5 w-5 text-orange-500" />
                        <span className="text-sm text-muted-foreground">Temperatura</span>
                      </div>
                      <span className="text-sm font-bold">72°C</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Activity className="h-5 w-5 text-blue-500" />
                        <span className="text-sm text-muted-foreground">Vibração</span>
                      </div>
                      <span className="text-sm font-bold">2.3 mm/s</span>
                    </div>
                    
                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Zap className="h-5 w-5 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Consumo</span>
                      </div>
                      <span className="text-sm font-bold">8.5 kW</span>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2">
                        <Clock className="h-5 w-5 text-purple-500" />
                        <span className="text-sm text-muted-foreground">Tempo Ativo</span>
                      </div>
                      <span className="text-sm font-bold">14h 32m</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Predictions card */}
              <Card className="shadow-lg border-2">
                <CardHeader className="pb-3 bg-gradient-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-yellow-600" />
                    Análise Preditiva
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3 p-3 bg-yellow-50 dark:bg-yellow-900 rounded-lg">
                    <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Manutenção Preventiva</p>
                      <p className="text-xs text-muted-foreground mt-1">Programada em 15 dias</p>
                      <p className="text-xs text-muted-foreground mt-1">Trocar rolamentos do eixo principal</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900 rounded-lg">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-semibold">Sistema de Proteção</p>
                      <p className="text-xs text-muted-foreground mt-1">Todos os sensores operacionais</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {selectedPart && (
                <Card className="shadow-lg border-2 border-blue-600">
                  <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600">
                    <CardTitle className="text-base font-semibold text-white flex items-center gap-2">
                      <Box className="h-5 w-5" />
                      Detalhes da Peça
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="relative w-full h-40 rounded-lg overflow-hidden">
                      <Image
                        src={selectedPart.image || "/placeholder.svg"}
                        alt={selectedPart.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-bold text-lg">{selectedPart.name}</h4>
                      <p className="text-sm text-muted-foreground">{selectedPart.category}</p>
                    </div>
                    <div className="space-y-2 text-sm">
                      <p className="font-semibold">Especificações:</p>
                      {selectedPart.specs.map((spec: string, index: number) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <div className="w-1 h-1 rounded-full bg-blue-600" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full gap-2 relative overflow-hidden border-purple-200 dark:border-purple-800 group"
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedPartForLocation(selectedPart)
                        setIsLocationFinderOpen(true)
                      }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <Sparkles className="h-4 w-4 text-purple-600 group-hover:text-white transition-colors duration-300 relative z-10" />
                      <span className="text-sm font-medium text-purple-600 group-hover:text-white transition-colors duration-300 relative z-10">Verificar Preços com IA</span>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        )}
        
        {selectedMachine && (
          <MachineReportModal
            isOpen={isReportModalOpen}
            onClose={() => setIsReportModalOpen(false)}
            machineName={selectedMachine.name}
            machineType={selectedMachine.type}
            machineCategory={selectedMachine.category}
            locationName={currentLocation?.name || ""}
          />
        )}
        
        {selectedPartForLocation && (
          <PartsLocationFinder
            isOpen={isLocationFinderOpen}
            onClose={() => {
              setIsLocationFinderOpen(false)
              setSelectedPartForLocation(null)
            }}
            partName={selectedPartForLocation.name}
            partImage={selectedPartForLocation.image}
          />
        )}
      </div>
    </div>
  )
}

export default function AnalysisPageWrapper() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Activity className="h-12 w-12 animate-spin mx-auto text-blue-600" />
          <p className="text-lg text-muted-foreground">Carregando análise...</p>
        </div>
      </div>
    }>
      <AnalysisPage />
    </Suspense>
  )
}
