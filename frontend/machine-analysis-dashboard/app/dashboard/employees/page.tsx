"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, Filter, Download, UserPlus, Mail, Phone, MapPin, Briefcase, Calendar, Edit, Trash2, MoreVertical } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { useRouter } from 'next/navigation'

interface Employee {
  id: string
  name: string
  email: string
  phone: string
  role: string
  department: string
  team: string
  location: string
  status: "online" | "idle" | "offline"
  joinDate: string
  avatar: string
}

export default function EmployeesPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [departmentFilter, setDepartmentFilter] = useState("all")
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Mock data
  const employees: Employee[] = [
    {
      id: "1",
      name: "Carlos Oliveira",
      email: "carlos.oliveira@cognitiva.com",
      phone: "+55 (11) 98765-4321",
      role: "Técnico de Manutenção",
      department: "Manutenção",
      team: "Equipe Alpha",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "15 Jan 2024",
      avatar: "CO",
    },
    {
      id: "2",
      name: "Ana Paula Santos",
      email: "ana.santos@cognitiva.com",
      phone: "+55 (11) 98765-1234",
      role: "Engenheira",
      department: "Engenharia",
      team: "Equipe Beta",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "22 Feb 2024",
      avatar: "AS",
    },
    {
      id: "3",
      name: "Roberto Silva",
      email: "roberto.silva@cognitiva.com",
      phone: "+55 (11) 98765-5678",
      role: "Operador",
      department: "Operações",
      team: "Equipe Alpha",
      location: "Fábrica Sul",
      status: "idle",
      joinDate: "10 Mar 2024",
      avatar: "RS",
    },
    {
      id: "4",
      name: "Juliana Costa",
      email: "juliana.costa@cognitiva.com",
      phone: "+55 (11) 98765-9012",
      role: "Analista",
      department: "Análise",
      team: "Equipe Gamma",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "05 Apr 2024",
      avatar: "JC",
    },
    {
      id: "5",
      name: "Pedro Almeida",
      email: "pedro.almeida@cognitiva.com",
      phone: "+55 (11) 98765-3456",
      role: "Supervisor",
      department: "Supervisão",
      team: "Equipe Alpha",
      location: "Fábrica Norte",
      status: "offline",
      joinDate: "18 May 2024",
      avatar: "PA",
    },
    {
      id: "6",
      name: "Marina Rodrigues",
      email: "marina.rodrigues@cognitiva.com",
      phone: "+55 (11) 98765-7890",
      role: "Técnico de Manutenção",
      department: "Manutenção",
      team: "Equipe Beta",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "12 Jun 2024",
      avatar: "MR",
    },
    {
      id: "7",
      name: "Lucas Ferreira",
      email: "lucas.ferreira@cognitiva.com",
      phone: "+55 (11) 98765-2345",
      role: "Engenheiro",
      department: "Engenharia",
      team: "Equipe Gamma",
      location: "Fábrica Sul",
      status: "idle",
      joinDate: "25 Jul 2024",
      avatar: "LF",
    },
    {
      id: "8",
      name: "Fernanda Lima",
      email: "fernanda.lima@cognitiva.com",
      phone: "+55 (11) 98765-6789",
      role: "Operador",
      department: "Operações",
      team: "Equipe Alpha",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "08 Aug 2024",
      avatar: "FL",
    },
    {
      id: "9",
      name: "Ricardo Mendes",
      email: "ricardo.mendes@cognitiva.com",
      phone: "+55 (11) 98765-0123",
      role: "Analista",
      department: "Análise",
      team: "Equipe Beta",
      location: "Fábrica Norte",
      status: "offline",
      joinDate: "14 Sep 2024",
      avatar: "RM",
    },
    {
      id: "10",
      name: "Camila Souza",
      email: "camila.souza@cognitiva.com",
      phone: "+55 (11) 98765-4567",
      role: "Supervisor",
      department: "Supervisão",
      team: "Equipe Gamma",
      location: "Oficina Centro Automotiva",
      status: "online",
      joinDate: "20 Oct 2024",
      avatar: "CS",
    },
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "online":
        return "bg-green-500"
      case "idle":
        return "bg-yellow-500"
      case "offline":
        return "bg-gray-400"
      default:
        return "bg-gray-400"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "online":
        return "Online"
      case "idle":
        return "Ausente"
      case "offline":
        return "Offline"
      default:
        return "Desconhecido"
    }
  }

  const toggleEmployeeSelection = (id: string) => {
    setSelectedEmployees((prev) =>
      prev.includes(id) ? prev.filter((empId) => empId !== id) : [...prev, id]
    )
  }

  const toggleSelectAll = () => {
    if (selectedEmployees.length === employees.length) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id))
    }
  }

  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.team.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || emp.status === statusFilter
    const matchesDepartment = departmentFilter === "all" || emp.department === departmentFilter
    return matchesSearch && matchesStatus && matchesDepartment
  })

  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage)
  const paginatedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Funcionários ({employees.length})
          </h1>
          <p className="text-muted-foreground mt-1">Gerencie membros e suas funções e permissões</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <UserPlus className="h-4 w-4" />
            Adicionar Membro
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar membros..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="idle">Ausente</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
              </SelectContent>
            </Select>
            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Departamento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos Departamentos</SelectItem>
                <SelectItem value="Manutenção">Manutenção</SelectItem>
                <SelectItem value="Engenharia">Engenharia</SelectItem>
                <SelectItem value="Operações">Operações</SelectItem>
                <SelectItem value="Análise">Análise</SelectItem>
                <SelectItem value="Supervisão">Supervisão</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" className="gap-2">
              <Filter className="h-4 w-4" />
              Mais Filtros
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="p-4 text-left">
                    <Checkbox
                      checked={selectedEmployees.length === employees.length}
                      onCheckedChange={toggleSelectAll}
                    />
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Membro da Equipe
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Equipe</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">
                    Localização
                  </th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Função</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Data de Entrada</th>
                  <th className="p-4 text-left text-sm font-medium text-muted-foreground">Ações</th>
                </tr>
              </thead>
              <tbody>
                {paginatedEmployees.map((employee) => (
                  <tr key={employee.id} className="border-b hover:bg-muted/30 transition-colors">
                    <td className="p-4">
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => toggleEmployeeSelection(employee.id)}
                      />
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-500">
                          <AvatarFallback className="text-white font-semibold">
                            {employee.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-sm text-muted-foreground">{employee.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="secondary">{employee.team}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        {employee.location}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${getStatusColor(employee.status)}`} />
                        <span className="text-sm">{getStatusText(employee.status)}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <Badge variant="outline">{employee.role}</Badge>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        {employee.joinDate}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between p-4 border-t">
            <div className="text-sm text-muted-foreground">
              Mostrando {(currentPage - 1) * itemsPerPage + 1} -{" "}
              {Math.min(currentPage * itemsPerPage, filteredEmployees.length)} de {filteredEmployees.length}{" "}
              resultados
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                Anterior
              </Button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const page = i + 1
                return (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                )
              })}
              {totalPages > 5 && <span className="text-sm text-muted-foreground">...</span>}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                Próximo
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
