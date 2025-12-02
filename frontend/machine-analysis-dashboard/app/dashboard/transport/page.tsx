"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Truck, Navigation, MapPin, Clock, Package, CheckCircle2, Search, ChevronRight } from 'lucide-react'
import { ProfessionalMap } from "@/components/professional-map"
import cn from "classnames"

interface TransportRequest {
  id: string
  type: "delivery" | "tow" | "pickup"
  status: "pending" | "in-progress" | "completed" | "cancelled"
  customer: string
  phone: string
  address: string
  destination?: string
  machine: string
  distance: string
  estimatedTime: string
  priority: "low" | "medium" | "high"
  lat: number
  lng: number
}

const mockRequests: TransportRequest[] = [
  {
    id: "TR-001",
    type: "tow",
    status: "pending",
    customer: "Carlos Silva",
    phone: "+55 (11) 98765-4321",
    address: "Av. Paulista, 1000 - Bela Vista, São Paulo, SP",
    destination: "Oficina Centro - Rua das Flores, 123",
    machine: "Mercedes-Benz Actros",
    distance: "12.5 km",
    estimatedTime: "45 min",
    priority: "high",
    lat: -23.561684,
    lng: -46.655981,
  },
  {
    id: "TR-002",
    type: "delivery",
    status: "in-progress",
    customer: "Maria Santos",
    phone: "+55 (11) 97654-3210",
    address: "Rua Augusta, 500 - Consolação, São Paulo, SP",
    destination: "Oficina Industrial Norte",
    machine: "Compressor Industrial CI-5000",
    distance: "8.3 km",
    estimatedTime: "30 min",
    priority: "medium",
    lat: -23.550520,
    lng: -46.633308,
  },
  {
    id: "TR-003",
    type: "pickup",
    status: "pending",
    customer: "João Oliveira",
    phone: "+55 (11) 96543-2109",
    address: "Av. Faria Lima, 2000 - Itaim Bibi, São Paulo, SP",
    destination: "Centro de Manutenção Sul",
    machine: "Bomba Centrífuga BC-2000",
    distance: "15.7 km",
    estimatedTime: "60 min",
    priority: "low",
    lat: -23.575520,
    lng: -46.688308,
  },
  {
    id: "TR-004",
    type: "tow",
    status: "pending",
    customer: "Ana Costa",
    phone: "+55 (11) 95432-1098",
    address: "Av. Ibirapuera, 3103 - Moema, São Paulo, SP",
    destination: "Oficina Centro - Rua das Flores, 123",
    machine: "Volvo FH 540",
    distance: "18.2 km",
    estimatedTime: "55 min",
    priority: "high",
    lat: -23.597421,
    lng: -46.663627,
  },
  {
    id: "TR-005",
    type: "delivery",
    status: "pending",
    customer: "Pedro Almeida",
    phone: "+55 (11) 94321-0987",
    address: "Av. Rebouças, 1500 - Pinheiros, São Paulo, SP",
    destination: "Depósito Oeste",
    machine: "Torno CNC T-3000",
    distance: "7.8 km",
    estimatedTime: "25 min",
    priority: "medium",
    lat: -23.565897,
    lng: -46.676520,
  },
  {
    id: "TR-006",
    type: "pickup",
    status: "in-progress",
    customer: "Lucas Ferreira",
    phone: "+55 (11) 93210-9876",
    address: "R. Vergueiro, 3185 - Vila Mariana, São Paulo, SP",
    destination: "Oficina Industrial Norte",
    machine: "Fresadora Industrial FI-2500",
    distance: "11.3 km",
    estimatedTime: "40 min",
    priority: "medium",
    lat: -23.589764,
    lng: -46.639853,
  },
  {
    id: "TR-007",
    type: "tow",
    status: "pending",
    customer: "Juliana Souza",
    phone: "+55 (11) 92109-8765",
    address: "Av. Engenheiro Luís Carlos Berrini, 1253 - Itaim Bibi, SP",
    destination: "Oficina Centro - Rua das Flores, 123",
    machine: "Scania R 450",
    distance: "13.9 km",
    estimatedTime: "50 min",
    priority: "high",
    lat: -23.611742,
    lng: -46.692395,
  },
]

const workshopLocation = {
  id: "workshop",
  name: "Oficina Centro",
  address: "Rua das Flores, 123 - Centro, São Paulo, SP",
  lat: -23.548520,
  lng: -46.633308,
}

export default function TransportPage() {
  const [selectedRequest, setSelectedRequest] = useState<TransportRequest | null>(null)
  const [filterStatus, setFilterStatus] = useState<string>("all")
  const [filterType, setFilterType] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const mapCenter: [number, number] = selectedRequest 
    ? [(workshopLocation.lng + selectedRequest.lng) / 2, (workshopLocation.lat + selectedRequest.lat) / 2]
    : [-46.633308, -23.561684]

  const mapZoom = selectedRequest ? 12 : 11

  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-500",
      "in-progress": "bg-blue-500",
      completed: "bg-green-500",
      cancelled: "bg-red-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const getStatusLabel = (status: string) => {
    const labels = {
      pending: "Pendente",
      "in-progress": "Em Andamento",
      completed: "Concluído",
      cancelled: "Cancelado",
    }
    return labels[status as keyof typeof labels] || status
  }

  const getTypeLabel = (type: string) => {
    const labels = {
      delivery: "Entrega",
      tow: "Reboque",
      pickup: "Busca",
    }
    return labels[type as keyof typeof labels] || type
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "delivery":
        return <Package className="h-4 w-4" />
      case "tow":
        return <Truck className="h-4 w-4" />
      case "pickup":
        return <Navigation className="h-4 w-4" />
      default:
        return <Truck className="h-4 w-4" />
    }
  }

  const filteredRequests = mockRequests.filter(r => {
    const matchesStatus = filterStatus === "all" || r.status === filterStatus
    const matchesType = filterType === "all" || r.type === filterType
    const matchesSearch = !searchQuery || 
      r.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.machine.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesType && matchesSearch
  })

  const mapMarkers = [
    // Always show workshop card
    {
      id: workshopLocation.id,
      lng: workshopLocation.lng,
      lat: workshopLocation.lat,
      color: "#22c55e",
      label: workshopLocation.name,
      address: workshopLocation.address,
      type: "workshop",
      showCard: true,
    },
    // Show all requests as pins, but only show card for selected request
    ...filteredRequests.map(request => ({
      id: request.id,
      lng: request.lng,
      lat: request.lat,
      color: request.status === "pending" ? "#f59e0b" : request.status === "in-progress" ? "#3b82f6" : "#10b981",
      label: request.customer,
      address: request.address,
      machine: request.machine,
      type: request.type,
      status: request.status,
      distance: request.distance,
      phone: request.phone,
      showCard: selectedRequest?.id === request.id,
      onClick: () => setSelectedRequest(request),
    })),
  ]

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col">
      <div className="flex items-center justify-between p-4 bg-background border-b">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Transporte & Reboque</h1>
            <p className="text-sm text-muted-foreground">
              {filteredRequests.length} solicitações
            </p>
          </div>
          <div className="flex items-center gap-3 ml-6">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-yellow-500/10">
              <Clock className="h-4 w-4 text-yellow-500" />
              <span className="text-sm font-semibold">
                {mockRequests.filter(r => r.status === "pending").length} Pendentes
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10">
              <Truck className="h-4 w-4 text-blue-500" />
              <span className="text-sm font-semibold">
                {mockRequests.filter(r => r.status === "in-progress").length} Em Rota
              </span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span className="text-sm font-semibold">{mockRequests.length} Total</span>
            </div>
          </div>
        </div>
        <Button size="sm" className="gap-2">
          <Truck className="h-4 w-4" />
          Nova Solicitação
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative">
          <ProfessionalMap
            markers={mapMarkers}
            center={mapCenter}
            zoom={mapZoom}
            className="h-full"
            showRoute={!!selectedRequest}
            selectedRequestId={selectedRequest?.id || null}
          />
        </div>

        <div className="w-[400px] border-l bg-background flex flex-col">
          <div className="p-4 border-b space-y-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar solicitações..." 
                className="pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2">
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Status</SelectItem>
                  <SelectItem value="pending">Pendentes</SelectItem>
                  <SelectItem value="in-progress">Em Andamento</SelectItem>
                  <SelectItem value="completed">Concluídos</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos Tipos</SelectItem>
                  <SelectItem value="delivery">Entrega</SelectItem>
                  <SelectItem value="tow">Reboque</SelectItem>
                  <SelectItem value="pickup">Busca</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            {filteredRequests.map((request) => (
              <Card
                key={request.id}
                className={cn(
                  "m-3 cursor-pointer transition-all hover:shadow-md",
                  selectedRequest?.id === request.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedRequest(request)}
              >
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className="flex-shrink-0">
                        {getTypeIcon(request.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{request.customer}</p>
                        <p className="text-xs text-muted-foreground truncate">{request.id}</p>
                      </div>
                    </div>
                    <Badge className={cn(getStatusColor(request.status), "text-white text-xs flex-shrink-0")}>
                      {getStatusLabel(request.status)}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                      <p className="text-xs line-clamp-2 text-muted-foreground">{request.address}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-xs truncate text-muted-foreground">{request.machine}</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1">
                        <Navigation className="h-3 w-3" />
                        {request.distance}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {request.estimatedTime}
                      </span>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
