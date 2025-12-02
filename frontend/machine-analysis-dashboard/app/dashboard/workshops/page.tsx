"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Building2, Wrench, TrendingUp, AlertTriangle, CheckCircle2, Plus, Search, Filter, Box, ChevronLeft, Check, Sparkles } from 'lucide-react'
import { useTheme } from "@/contexts/theme-context"
import cn from "classnames"
import { Separator } from "@/components/ui/separator"
import { Machine3DViewer } from "@/components/machine-3d-viewer"
import { PartsLocationFinder } from "@/components/parts-location-finder"

interface MachinePart {
  id: string
  name: string
  description: string
  image: string
  inStock: boolean
  quantity: number
  price?: number
}

interface Machine {
  id: string
  name: string
  type: string
  model: string
  manufacturer: string
  status: "operational" | "maintenance" | "inactive"
  image: string
  parts: MachinePart[]
}

interface Workshop {
  id: string
  name: string
  type: "automotive" | "industrial" | "electronics"
  address: string
  city: string
  state: string
  machines: Machine[]
  totalMachines: number
  status: "operational" | "maintenance" | "inactive"
  efficiency: number
}

const mockMachines: Machine[] = [
  {
    id: "m1",
    name: "Torno CNC T-3000",
    type: "CNC Lathe",
    model: "T-3000",
    manufacturer: "Haas Automation",
    status: "operational",
    image: "/industrial-cnc-lathe-machine-metallic-gray.jpg",
    parts: [
      {
        id: "p1",
        name: "Mandril Hidráulico",
        description: "Mandril de alta precisão 10 polegadas",
        image: "/hydraulic-chuck-metallic.jpg",
        inStock: true,
        quantity: 3,
        price: 2500
      },
      {
        id: "p2",
        name: "Torre de Ferramentas",
        description: "Torre com 12 posições automática",
        image: "/cnc-tool-turret.jpg",
        inStock: true,
        quantity: 1,
        price: 8500
      },
      {
        id: "p3",
        name: "Contraponto",
        description: "Contraponto hidráulico ajustável",
        image: "/lathe-tailstock.jpg",
        inStock: false,
        quantity: 0,
        price: 1800
      },
      {
        id: "p4",
        name: "Painel de Controle",
        description: "Display touchscreen 15 polegadas",
        image: "/cnc-control-panel-touchscreen.jpg",
        inStock: true,
        quantity: 2,
        price: 3200
      }
    ]
  },
  {
    id: "m2",
    name: "Fresadora Universal FU-500",
    type: "Milling Machine",
    model: "FU-500",
    manufacturer: "DMG MORI",
    status: "operational",
    image: "/industrial-milling-machine-blue.jpg",
    parts: [
      {
        id: "p5",
        name: "Cabeçote de Fresagem",
        description: "Cabeçote universal 360°",
        image: "/milling-head.jpg",
        inStock: true,
        quantity: 2,
        price: 4500
      },
      {
        id: "p6",
        name: "Mesa Rotativa",
        description: "Mesa com divisor automático",
        image: "/rotary-table-machine.jpg",
        inStock: true,
        quantity: 1,
        price: 5200
      },
      {
        id: "p7",
        name: "Morsa Hidráulica",
        description: "Morsa de fixação 8 polegadas",
        image: "/hydraulic-vise.jpg",
        inStock: true,
        quantity: 4,
        price: 980
      }
    ]
  },
  {
    id: "m3",
    name: "Prensa Hidráulica PH-200",
    type: "Hydraulic Press",
    model: "PH-200",
    manufacturer: "Schuler",
    status: "maintenance",
    image: "/industrial-hydraulic-press-green.jpg",
    parts: [
      {
        id: "p8",
        name: "Cilindro Hidráulico",
        description: "Cilindro 200 toneladas",
        image: "/hydraulic-cylinder-diagram.png",
        inStock: false,
        quantity: 0,
        price: 12000
      },
      {
        id: "p9",
        name: "Válvula Proporcional",
        description: "Válvula de controle de pressão",
        image: "/proportional-valve.jpg",
        inStock: true,
        quantity: 2,
        price: 1500
      }
    ]
  },
  {
    id: "m4",
    name: "Centro de Usinagem VMC-850",
    type: "Machining Center",
    model: "VMC-850",
    manufacturer: "Mazak",
    status: "operational",
    image: "/cnc-machining-center-vertical-blue-gray.jpg",
    parts: [
      {
        id: "p10",
        name: "Fuso Principal",
        description: "Fuso de alta rotação 12000 RPM",
        image: "/cnc-spindle.jpg",
        inStock: true,
        quantity: 1,
        price: 15000
      },
      {
        id: "p11",
        name: "Trocador de Ferramentas",
        description: "ATC com 24 posições",
        image: "/automatic-tool-changer.jpg",
        inStock: true,
        quantity: 1,
        price: 9800
      }
    ]
  }
]

const mockWorkshops: Workshop[] = [
  {
    id: "1",
    name: "Oficina Centro Automotiva",
    type: "automotive",
    address: "Rua das Flores, 123 - Centro",
    city: "São Paulo",
    state: "SP",
    machines: mockMachines.slice(0, 2),
    totalMachines: 12,
    status: "operational",
    efficiency: 94,
  },
  {
    id: "2",
    name: "Oficina Industrial Norte",
    type: "industrial",
    address: "Av. Industrial, 456 - Zona Norte",
    city: "São Paulo",
    state: "SP",
    machines: mockMachines,
    totalMachines: 25,
    status: "operational",
    efficiency: 87,
  },
  {
    id: "3",
    name: "Centro de Eletrônicos Sul",
    type: "electronics",
    address: "Rua Tecnológica, 789 - Zona Sul",
    city: "São Paulo",
    state: "SP",
    machines: mockMachines.slice(2, 3),
    totalMachines: 8,
    status: "maintenance",
    efficiency: 65,
  },
]

export default function WorkshopsPage() {
  const { theme } = useTheme()
  const [selectedWorkshop, setSelectedWorkshop] = useState<Workshop | null>(mockWorkshops[0])
  const [selectedMachine, setSelectedMachine] = useState<Machine | null>(null)
  const [selectedPart, setSelectedPart] = useState<MachinePart | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [isLocationFinderOpen, setIsLocationFinderOpen] = useState(false)
  const [selectedPartForLocation, setSelectedPartForLocation] = useState<MachinePart | null>(null)

  const getStatusColor = (status: string) => {
    const colors = {
      operational: "bg-green-500",
      maintenance: "bg-yellow-500",
      inactive: "bg-gray-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      operational: "Operacional",
      maintenance: "Manutenção",
      inactive: "Inativa",
    }
    return labels[status as keyof typeof labels] || "Desconhecido"
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      automotive: "Automotiva",
      industrial: "Industrial",
      electronics: "Eletrônica",
    }
    return labels[type as keyof typeof labels] || type
  }

  const filteredMachines = selectedWorkshop?.machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  ) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Oficina Virtual</h1>
          <p className="text-muted-foreground mt-1">Visualize suas máquinas e peças em 3D interativo</p>
        </div>
        <Button className="gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          <Plus className="h-4 w-4" />
          Adicionar Oficina
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Workshops List */}
        <div className="xl:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Minhas Oficinas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mockWorkshops.map((workshop) => (
                <div
                  key={workshop.id}
                  onClick={() => {
                    setSelectedWorkshop(workshop)
                    setSelectedMachine(null)
                    setSelectedPart(null)
                  }}
                  className={cn(
                    "p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                    selectedWorkshop?.id === workshop.id
                      ? theme === "light"
                        ? "bg-blue-50 border-blue-300"
                        : "bg-blue-950/50 border-blue-700"
                      : theme === "light"
                      ? "bg-white border-slate-200"
                      : "bg-slate-900/50 border-slate-700"
                  )}
                >
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-sm truncate">{workshop.name}</h4>
                      <p className="text-xs text-muted-foreground">{getTypeLabel(workshop.type)}</p>
                    </div>
                    <div className={cn("h-2 w-2 rounded-full mt-1 flex-shrink-0", getStatusColor(workshop.status))} />
                  </div>
                  <div className="flex items-start gap-2 text-xs text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-2">{workshop.address}</span>
                  </div>
                  <div className="flex gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {workshop.totalMachines} máquinas
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {workshop.efficiency}% efic.
                    </Badge>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Resumo Geral</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div
                className={cn(
                  "p-3 rounded-lg border",
                  theme === "light" ? "bg-green-50 border-green-200" : "bg-green-950/30 border-green-900/30"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Operacionais</span>
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                </div>
                <p className="text-2xl font-bold">2</p>
              </div>

              <div
                className={cn(
                  "p-3 rounded-lg border",
                  theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-950/30 border-blue-900/30"
                )}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Total Máquinas</span>
                  <Wrench className="h-4 w-4 text-blue-500" />
                </div>
                <p className="text-2xl font-bold">45</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Machine and Parts Viewer */}
        <div className="xl:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {selectedMachine && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setSelectedMachine(null)
                        setSelectedPart(null)
                      }}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Voltar
                    </Button>
                  )}
                  <div>
                    <CardTitle>
                      {selectedMachine ? selectedMachine.name : `Máquinas - ${selectedWorkshop?.name}`}
                    </CardTitle>
                    {selectedMachine && (
                      <CardDescription className="mt-1">
                        {selectedMachine.manufacturer} • {selectedMachine.model}
                      </CardDescription>
                    )}
                  </div>
                </div>
                {selectedMachine && (
                  <Button variant="outline" size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Trocar Máquina
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedMachine ? (
                // Machine List View
                <div className="space-y-4">
                  <div className="flex gap-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar máquinas..."
                        className="pl-9"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <Select defaultValue="all">
                      <SelectTrigger className="w-48">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos os Status</SelectItem>
                        <SelectItem value="operational">Operacional</SelectItem>
                        <SelectItem value="maintenance">Manutenção</SelectItem>
                        <SelectItem value="inactive">Inativa</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredMachines.map((machine) => (
                      <Card
                        key={machine.id}
                        className="cursor-pointer hover:shadow-lg transition-all group"
                        onClick={() => setSelectedMachine(machine)}
                      >
                        <CardContent className="p-4">
                          <div
                            className={cn(
                              "aspect-video rounded-lg mb-3 overflow-hidden",
                              theme === "light" ? "bg-slate-100" : "bg-slate-800"
                            )}
                          >
                            <img
                              src={machine.image || "/placeholder.svg"}
                              alt={machine.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1 min-w-0">
                              <h4 className="font-semibold text-sm truncate">{machine.name}</h4>
                              <p className="text-xs text-muted-foreground truncate">{machine.type}</p>
                            </div>
                            <div className={cn("h-2 w-2 rounded-full mt-1 flex-shrink-0", getStatusColor(machine.status))} />
                          </div>
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="text-xs">
                              {machine.parts.length} peças
                            </Badge>
                            <span className="text-xs text-muted-foreground">{machine.manufacturer}</span>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>

                  {filteredMachines.length === 0 && (
                    <div className="text-center py-12">
                      <Box className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">Nenhuma máquina encontrada</h3>
                      <p className="text-muted-foreground">Tente ajustar os filtros de busca</p>
                    </div>
                  )}
                </div>
              ) : (
                // Machine Detail with Parts View
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  {/* Machine 3D View */}
                  <div className="lg:col-span-3">
                    <div
                      className={cn(
                        "aspect-video rounded-lg overflow-hidden mb-4 relative",
                        theme === "light" ? "bg-slate-100" : "bg-slate-800"
                      )}
                    >
                      <Machine3DViewer 
                        machineName={selectedMachine.name} 
                        machineType={selectedMachine.type}
                      />
                      <div className="absolute top-4 right-4">
                        <Badge className={cn(getStatusColor(selectedMachine.status), "text-white")}>
                          {getStatusLabel(selectedMachine.status)}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <div
                        className={cn(
                          "p-4 rounded-lg border",
                          theme === "light" ? "bg-blue-50 border-blue-200" : "bg-blue-950/30 border-blue-900/30"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <Box className="h-4 w-4 text-blue-500" />
                          <span className="text-xs text-muted-foreground">Peças Totais</span>
                        </div>
                        <p className="text-2xl font-bold">{selectedMachine.parts.length}</p>
                      </div>

                      <div
                        className={cn(
                          "p-4 rounded-lg border",
                          theme === "light" ? "bg-green-50 border-green-200" : "bg-green-950/30 border-green-900/30"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-muted-foreground">Em Estoque</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {selectedMachine.parts.filter((p) => p.inStock).length}
                        </p>
                      </div>

                      <div
                        className={cn(
                          "p-4 rounded-lg border",
                          theme === "light" ? "bg-red-50 border-red-200" : "bg-red-950/30 border-red-900/30"
                        )}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <span className="text-xs text-muted-foreground">Sem Estoque</span>
                        </div>
                        <p className="text-2xl font-bold">
                          {selectedMachine.parts.filter((p) => !p.inStock).length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Parts List */}
                  <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Peças Disponíveis</h3>
                      {selectedPart && (
                        <Button variant="ghost" size="sm" onClick={() => setSelectedPart(null)}>
                          Limpar
                        </Button>
                      )}
                    </div>

                    <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
                      {selectedMachine.parts.map((part) => (
                        <Card
                          key={part.id}
                          className={cn(
                            "cursor-pointer transition-all hover:shadow-md",
                            selectedPart?.id === part.id && "ring-2 ring-blue-500"
                          )}
                          onClick={() => setSelectedPart(part)}
                        >
                          <CardContent className="p-4">
                            <div className="flex gap-4">
                              <div
                                className={cn(
                                  "w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 relative",
                                  theme === "light" ? "bg-slate-100" : "bg-slate-800"
                                )}
                              >
                                <img
                                  src={part.image || "/placeholder.svg"}
                                  alt={part.name}
                                  className="w-full h-full object-cover"
                                />
                                {selectedPart?.id === part.id && (
                                  <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                    <div className="bg-blue-500 rounded-full p-1">
                                      <Check className="h-4 w-4 text-white" />
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-sm truncate">{part.name}</h4>
                                  <Badge
                                    variant={part.inStock ? "default" : "secondary"}
                                    className={cn(
                                      "text-xs flex-shrink-0 ml-2",
                                      part.inStock ? "bg-green-500" : "bg-red-500"
                                    )}
                                  >
                                    {part.inStock ? "Disponível" : "Indisponível"}
                                  </Badge>
                                </div>
                                <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{part.description}</p>
                                <div className="flex items-center justify-between">
                                  <span className="text-xs text-muted-foreground">
                                    Qtd: {part.quantity}
                                  </span>
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="h-7 gap-1.5 px-2 text-purple-600 hover:text-white relative overflow-hidden group"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setSelectedPartForLocation(part)
                                      setIsLocationFinderOpen(true)
                                    }}
                                  >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <Sparkles className="h-3.5 w-3.5 relative z-10" />
                                    <span className="text-xs font-medium relative z-10">Verificar Preço</span>
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>

                    {selectedPart && (
                      <div className="mt-4 flex gap-2">
                        <Button variant="outline" className="flex-1">
                          Solicitar
                        </Button>
                        <Button className="flex-1 gap-2 relative overflow-hidden group bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:shadow-lg transition-shadow duration-300">
                          <Sparkles className="h-4 w-4 relative z-10" />
                          <span className="relative z-10">Verificar Preços</span>
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* PartsLocationFinder modal */}
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
  )
}
