"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Search,
  Filter,
  Package,
  Calendar,
  MapPin,
  Activity,
  Settings,
  Eye,
  Edit,
  Trash2,
  Download,
} from "lucide-react"
import { MetricsReportModal } from "@/components/metrics-report-modal"

interface Machine {
  id: string
  name: string
  model: string
  serialNumber: string
  type: string
  location: string
  status: "operational" | "maintenance" | "idle" | "critical"
  lastMaintenance: string
  nextMaintenance: string
  operatingHours: number
  efficiency: number
  assignedTo: string
}

export default function InventoryPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [metricsReportOpen, setMetricsReportOpen] = useState(false)

  const machines: Machine[] = [
    {
      id: "BCP-001",
      name: "Bomba Centrífuga Principal",
      model: "GX-2000",
      serialNumber: "SN-2024-001",
      type: "Bomba Centrífuga",
      location: "Planta 1 - Setor A",
      status: "operational",
      lastMaintenance: "2024-10-15",
      nextMaintenance: "2025-01-15",
      operatingHours: 2450,
      efficiency: 92,
      assignedTo: "João Silva",
    },
    {
      id: "CP-200",
      name: "Compressor Industrial",
      model: "CI-5000",
      serialNumber: "SN-2024-002",
      type: "Compressor",
      location: "Planta 1 - Setor B",
      status: "maintenance",
      lastMaintenance: "2024-11-01",
      nextMaintenance: "2025-02-01",
      operatingHours: 3200,
      efficiency: 85,
      assignedTo: "Maria Santos",
    },
    {
      id: "ME-150",
      name: "Motor Elétrico Trifásico",
      model: "MT-750",
      serialNumber: "SN-2024-003",
      type: "Motor Elétrico",
      location: "Planta 2 - Setor C",
      status: "operational",
      lastMaintenance: "2024-09-20",
      nextMaintenance: "2024-12-20",
      operatingHours: 1850,
      efficiency: 88,
      assignedTo: "Carlos Oliveira",
    },
    {
      id: "VLV-340",
      name: "Válvula de Controle",
      model: "VC-120",
      serialNumber: "SN-2024-004",
      type: "Válvula",
      location: "Planta 1 - Setor A",
      status: "idle",
      lastMaintenance: "2024-10-05",
      nextMaintenance: "2025-01-05",
      operatingHours: 980,
      efficiency: 95,
      assignedTo: "Ana Costa",
    },
    {
      id: "RBT-500",
      name: "Rebitadeira Automática",
      model: "RA-300",
      serialNumber: "SN-2024-005",
      type: "Rebitadeira",
      location: "Planta 2 - Setor D",
      status: "critical",
      lastMaintenance: "2024-08-15",
      nextMaintenance: "2024-11-15",
      operatingHours: 4200,
      efficiency: 68,
      assignedTo: "Pedro Alves",
    },
    {
      id: "CNC-780",
      name: "Cortadora CNC",
      model: "CC-9000",
      serialNumber: "SN-2024-006",
      type: "Cortadora CNC",
      location: "Planta 3 - Setor E",
      status: "operational",
      lastMaintenance: "2024-10-25",
      nextMaintenance: "2025-01-25",
      operatingHours: 1920,
      efficiency: 94,
      assignedTo: "Fernanda Lima",
    },
  ]

  const getStatusConfig = (status: string) => {
    const configs = {
      operational: {
        label: "Operacional",
        color: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
        icon: Activity,
      },
      maintenance: {
        label: "Manutenção",
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
        icon: Settings,
      },
      idle: {
        label: "Parado",
        color: "bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20",
        icon: Package,
      },
      critical: {
        label: "Crítico",
        color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
        icon: Activity,
      },
    }
    return configs[status as keyof typeof configs]
  }

  const filteredMachines = machines.filter((machine) => {
    const matchesSearch =
      machine.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
      machine.serialNumber.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterStatus === "all" || machine.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Inventário de Equipamentos</h1>
        <p className="text-muted-foreground mt-1">Gerencie e acompanhe todos os equipamentos do seu local</p>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, modelo ou número de série..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[180px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os Status</SelectItem>
              <SelectItem value="operational">Operacional</SelectItem>
              <SelectItem value="maintenance">Manutenção</SelectItem>
              <SelectItem value="idle">Parado</SelectItem>
              <SelectItem value="critical">Crítico</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" onClick={() => setMetricsReportOpen(true)}>
            <Download className="h-4 w-4 mr-2" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total de Equipamentos</p>
                <p className="text-3xl font-bold text-foreground">{machines.length}</p>
              </div>
              <div className="h-12 w-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                <Package className="h-6 w-6 text-blue-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Operacionais</p>
                <p className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {machines.filter((m) => m.status === "operational").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-green-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Em Manutenção</p>
                <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">
                  {machines.filter((m) => m.status === "maintenance").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-orange-500/10 flex items-center justify-center">
                <Settings className="h-6 w-6 text-orange-500" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Críticos</p>
                <p className="text-3xl font-bold text-red-600 dark:text-red-400">
                  {machines.filter((m) => m.status === "critical").length}
                </p>
              </div>
              <div className="h-12 w-12 rounded-full bg-red-500/10 flex items-center justify-center">
                <Activity className="h-6 w-6 text-red-500" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Machine List */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMachines.map((machine) => {
          const statusConfig = getStatusConfig(machine.status)
          const StatusIcon = statusConfig.icon

          return (
            <Card key={machine.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-16 w-16 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center flex-shrink-0">
                      <Package className="h-8 w-8 text-white" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-foreground truncate">{machine.name}</h3>
                        <Badge variant="outline" className={statusConfig.color}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                        <div>
                          <p className="text-muted-foreground">ID / Modelo</p>
                          <p className="font-medium text-foreground">
                            {machine.id} / {machine.model}
                          </p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Número de Série</p>
                          <p className="font-medium text-foreground">{machine.serialNumber}</p>
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Localização</p>
                            <p className="font-medium text-foreground">{machine.location}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                          <div>
                            <p className="text-muted-foreground">Próxima Manutenção</p>
                            <p className="font-medium text-foreground">
                              {new Date(machine.nextMaintenance).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-3">
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {machine.assignedTo
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-muted-foreground">{machine.assignedTo}</span>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">{machine.operatingHours}h</span> operacionais
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Eficiência:{" "}
                          <span
                            className={`font-medium ${
                              machine.efficiency >= 90
                                ? "text-green-600 dark:text-green-400"
                                : machine.efficiency >= 75
                                  ? "text-orange-600 dark:text-orange-400"
                                  : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {machine.efficiency}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex lg:flex-col gap-2 lg:items-end">
                    <Button size="sm" variant="outline" className="flex-1 lg:flex-initial bg-transparent">
                      <Eye className="h-4 w-4 mr-2" />
                      Visualizar
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 lg:flex-initial bg-transparent">
                      <Edit className="h-4 w-4 mr-2" />
                      Editar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 dark:text-red-400 hover:bg-red-500/10 bg-transparent"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredMachines.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">Nenhum equipamento encontrado</h3>
            <p className="text-muted-foreground">Tente ajustar os filtros ou buscar por outros termos</p>
          </CardContent>
        </Card>
      )}

      {/* Metrics Report Modal */}
      <MetricsReportModal
        open={metricsReportOpen}
        onClose={() => setMetricsReportOpen(false)}
        reportType="inventory"
        filters={{
          status: filterStatus !== "all" ? filterStatus : undefined,
          search: searchQuery || undefined,
        }}
        data={{
          machines,
          filteredMachines,
        }}
      />
    </div>
  )
}
