"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, ArrowUpDown } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Part {
  id: string
  name: string
  partNumber: string
  status?: "normal" | "warning" | "critical"
}

const partsData: Part[] = [
  { id: "A", name: "Caixa de Vedação", partNumber: "ZX92A4L" },
  { id: "B", name: "Empacotamento", partNumber: "QP41D3M" },
  { id: "C", name: "Eixo", partNumber: "RT85F6P" },
  { id: "D", name: "Luva do Eixo", partNumber: "MN29H1W" },
  { id: "E", name: "Palheta", partNumber: "YL76K9Z", status: "warning" },
  { id: "F", name: "Carcaça", partNumber: "PT34J7Q" },
  { id: "G", name: "Olho do Impulsor", partNumber: "XR58L2V" },
  { id: "H", name: "Anel de Desgaste", partNumber: "ZT91N5T", status: "critical" },
  { id: "I", name: "Componente 9", partNumber: "FW63P8R" },
  { id: "J", name: "Componente 10", partNumber: "KL47X3Y" },
  { id: "K", name: "Tampa Superior", partNumber: "GT82Q4K" },
]

export function PartsDataTable({
  searchQuery,
}: {
  searchQuery: string
}) {
  const [sortField, setSortField] = useState<"id" | "name" | "partNumber">("id")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc")
  const [filterType, setFilterType] = useState<string>("all")
  const [localSearch, setLocalSearch] = useState("")

  const filteredParts = partsData.filter((part) => {
    const matchesSearch =
      part.name.toLowerCase().includes(localSearch.toLowerCase()) ||
      part.partNumber.toLowerCase().includes(localSearch.toLowerCase()) ||
      part.id.toLowerCase().includes(localSearch.toLowerCase())

    if (filterType === "all") return matchesSearch
    if (filterType === "warning") return matchesSearch && part.status === "warning"
    if (filterType === "critical") return matchesSearch && part.status === "critical"

    return matchesSearch
  })

  const sortedParts = [...filteredParts].sort((a, b) => {
    const aValue = a[sortField]
    const bValue = b[sortField]
    const comparison = aValue.localeCompare(bValue)
    return sortDirection === "asc" ? comparison : -comparison
  })

  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="space-y-2 border-b border-border py-2 px-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-muted-foreground">TIPO</span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 gap-1">
                  {filterType === "all" && "Ver todos"}
                  {filterType === "warning" && "Atenção"}
                  {filterType === "critical" && "Crítico"}
                  <ArrowUpDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterType("all")}>Ver todos</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("warning")}>Atenção</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterType("critical")}>Crítico</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button size="icon" variant="ghost" className="h-8 w-8">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="BUSCAR"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="pl-9 h-8"
          />
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-auto p-0">
        <div className="min-w-full">
          {/* Table Header */}
          <div className="sticky top-0 z-10 grid grid-cols-[60px_1fr_120px] gap-2 border-b border-border bg-muted px-3 py-1.5">
            <button
              className="flex items-center gap-1 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSortField("id")
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }}
            >
              No.
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              className="flex items-center gap-1 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSortField("name")
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }}
            >
              Nome da Peça
              <ArrowUpDown className="h-3 w-3" />
            </button>
            <button
              className="flex items-center gap-1 text-left text-xs font-medium text-muted-foreground hover:text-foreground"
              onClick={() => {
                setSortField("partNumber")
                setSortDirection(sortDirection === "asc" ? "desc" : "asc")
              }}
            >
              Nº Peça
              <ArrowUpDown className="h-3 w-3" />
            </button>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-border">
            {sortedParts.map((part, index) => (
              <div
                key={part.id}
                className={`grid grid-cols-[60px_1fr_120px] gap-2 px-3 py-2 hover:bg-accent/50 ${
                  part.id === "E" ? "bg-accent/30" : ""
                }`}
              >
                <div className="flex items-center">
                  <span className="text-sm font-medium">{part.id}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm">{part.name}</span>
                  {part.status === "warning" && (
                    <Badge variant="secondary" className="bg-amber-500/20 text-amber-500">
                      !
                    </Badge>
                  )}
                  {part.status === "critical" && (
                    <Badge variant="destructive" className="bg-red-500/20 text-red-500">
                      !!
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{part.partNumber}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
