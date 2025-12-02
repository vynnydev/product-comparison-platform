"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, Filter, Plus, Edit, Trash2, Shield, Users, Copy } from 'lucide-react'
import { roleLabels, jobFunctionLabels, type UserRole, type JobFunction } from "@/lib/user-roles"
import { useAuth } from "@/contexts/auth-context"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  jobFunction: JobFunction
  status: "online" | "idle" | "offline"
  dateAdded: string
  teamId: string
}

export default function UsersManagementPage() {
  const { user: currentUser } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editDialogOpen, setEditDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // Mock users data
  const [users, setUsers] = useState<User[]>([
    {
      id: "1",
      name: "Jessica Wong",
      email: "jessica@example.com",
      role: "admin",
      jobFunction: "maintenance_engineer",
      status: "online",
      dateAdded: "Fri, 24 Jan 2026",
      teamId: "team-1",
    },
    {
      id: "2",
      name: "Julian Nguyen",
      email: "julian@example.com",
      role: "manager",
      jobFunction: "production_manager",
      status: "online",
      dateAdded: "Fri, 12 Dec 2025",
      teamId: "team-1",
    },
    {
      id: "3",
      name: "Sophia Lee",
      email: "sophia@example.com",
      role: "technician",
      jobFunction: "technician",
      status: "online",
      dateAdded: "Mon, 15 Jan 2026",
      teamId: "team-2",
    },
    {
      id: "4",
      name: "Marcus Chen",
      email: "marcus@example.com",
      role: "technician",
      jobFunction: "equipment_operator",
      status: "online",
      dateAdded: "Wed, 10 Feb 2026",
      teamId: "team-2",
    },
    {
      id: "5",
      name: "Lana Kate",
      email: "kate@example.com",
      role: "manager",
      jobFunction: "supervisor",
      status: "online",
      dateAdded: "Mon, 03 Oct 2025",
      teamId: "team-3",
    },
    {
      id: "6",
      name: "Mona Smith",
      email: "mona@example.com",
      role: "viewer",
      jobFunction: "analyst",
      status: "idle",
      dateAdded: "Sun, 27 Jan 2026",
      teamId: "team-3",
    },
    {
      id: "7",
      name: "Casey Weslister",
      email: "casey@example.com",
      role: "operator",
      jobFunction: "equipment_operator",
      status: "idle",
      dateAdded: "Wed, 01 Oct 2025",
      teamId: "team-1",
    },
    {
      id: "8",
      name: "Jason Gabriel",
      email: "jason@example.com",
      role: "technician",
      jobFunction: "quality_inspector",
      status: "offline",
      dateAdded: "Sat, 26 Jan 2026",
      teamId: "team-2",
    },
  ])

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || user.status === statusFilter
    return matchesSearch && matchesStatus
  })

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

  const getAvatarColor = (index: number) => {
    const colors = [
      "from-orange-400 to-pink-600",
      "from-blue-400 to-cyan-600",
      "from-purple-400 to-pink-600",
      "from-pink-400 to-rose-600",
      "from-orange-400 to-amber-600",
      "from-purple-400 to-purple-600",
      "from-yellow-400 to-orange-600",
      "from-blue-400 to-purple-600",
    ]
    return colors[index % colors.length]
  }

  const handleEditUser = (user: User) => {
    setSelectedUser(user)
    setEditDialogOpen(true)
  }

  const handleUpdateUser = () => {
    if (selectedUser) {
      setUsers(users.map((u) => (u.id === selectedUser.id ? selectedUser : u)))
      setEditDialogOpen(false)
    }
  }

  const handleDeleteUser = (userId: string) => {
    if (confirm("Tem certeza que deseja remover este usuário?")) {
      setUsers(users.filter((u) => u.id !== userId))
    }
  }

  const isMasterOrAdmin = currentUser?.role === "master" || currentUser?.role === "admin"

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Gerenciamento de Usuários</h1>
          <p className="text-muted-foreground">Gerencie membros e edite funções e permissões</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Copy className="h-4 w-4 mr-2" />
            Copiar link de convite
          </Button>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Add member
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search members..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm">
                <Filter className="h-4 w-4 mr-2" />
                Sort & Filter
              </Button>
              <Button variant={statusFilter === "all" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("all")}>
                All
              </Button>
              <Button variant={statusFilter === "online" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("online")}>
                Online
              </Button>
              <Button variant={statusFilter === "idle" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("idle")}>
                Idle
              </Button>
              <Button variant={statusFilter === "offline" ? "default" : "outline"} size="sm" onClick={() => setStatusFilter("offline")}>
                Offline
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Membros da Equipe ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Team member</TableHead>
                <TableHead>Date added</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Função (Software)</TableHead>
                <TableHead>Cargo (Empresa)</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback className={`bg-gradient-to-br ${getAvatarColor(index)} text-white`}>
                          {user.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">{user.dateAdded}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${getStatusColor(user.status)}`} />
                      <span className="capitalize">{user.status}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{roleLabels[user.role]}</Badge>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{jobFunctionLabels[user.jobFunction]}</span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEditUser(user)}
                        disabled={!isMasterOrAdmin}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteUser(user.id)}
                        disabled={!isMasterOrAdmin || user.id === currentUser?.user_id}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                      <Button variant="outline" size="sm" disabled={!isMasterOrAdmin}>
                        Manage
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredUsers.length === 0 && (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Nenhum usuário encontrado</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit User Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Usuário</DialogTitle>
            <DialogDescription>Atualize as informações e permissões do usuário</DialogDescription>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={selectedUser.name}
                  onChange={(e) => setSelectedUser({ ...selectedUser, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Email</Label>
                <Input
                  type="email"
                  value={selectedUser.email}
                  onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Função no Software</Label>
                <Select
                  value={selectedUser.role}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, role: value as UserRole })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(roleLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Cargo na Empresa</Label>
                <Select
                  value={selectedUser.jobFunction}
                  onValueChange={(value) => setSelectedUser({ ...selectedUser, jobFunction: value as JobFunction })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(jobFunctionLabels).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleUpdateUser}>Salvar Alterações</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
