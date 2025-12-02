"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Clock, CalendarIcon, Star, X, Plus } from 'lucide-react'
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

interface NewTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const availableTags = [
  "urgente", "preventiva", "rotina", "upgrade", "qualidade", 
  "segurança", "atualização", "automação", "inspeção"
]

const availableAssignees = [
  { name: "João Silva", initials: "JS" },
  { name: "Ana Costa", initials: "AC" },
  { name: "Carlos Oliveira", initials: "CO" },
  { name: "Fernanda Lima", initials: "FL" },
  { name: "Juliana Rocha", initials: "JR" },
  { name: "Marcos Ferreira", initials: "MF" },
  { name: "Patrícia Souza", initials: "PS" },
  { name: "Ricardo Gomes", initials: "RG" },
]

const machines = [
  { id: "ME-780", name: "Motor Elétrico ME-780" },
  { id: "BC-2000", name: "Bomba Centrífuga BC-2000" },
  { id: "CNC-X500", name: "Robô Industrial CNC-X500" },
  { id: "TA-2000", name: "Torno Automático TA-2000" },
  { id: "F-800", name: "Fresadora CNC F-800" },
  { id: "CP-450", name: "Compressor de Ar CP-450" },
]

const locations = [
  "Setor de Produção A",
  "Setor de Produção B",
  "Linha de Produção 1",
  "Linha de Produção 2",
  "Linha de Produção 3",
  "Área de Manutenção",
  "Depósito",
]

export function NewTaskModal({ open, onOpenChange }: NewTaskModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [priority, setPriority] = useState("normal")
  const [status, setStatus] = useState("backlog")
  const [dueDate, setDueDate] = useState<Date>()
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [selectedAssignees, setSelectedAssignees] = useState<string[]>([])
  const [selectedMachine, setSelectedMachine] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("")
  const [newTag, setNewTag] = useState("")

  const createdDate = new Date()

  const handleAddTag = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  const handleRemoveTag = (tag: string) => {
    setSelectedTags(selectedTags.filter(t => t !== tag))
  }

  const handleAddCustomTag = () => {
    if (newTag && !selectedTags.includes(newTag)) {
      setSelectedTags([...selectedTags, newTag])
      setNewTag("")
    }
  }

  const toggleAssignee = (name: string) => {
    if (selectedAssignees.includes(name)) {
      setSelectedAssignees(selectedAssignees.filter(a => a !== name))
    } else {
      setSelectedAssignees([...selectedAssignees, name])
    }
  }

  const handleSubmit = () => {
    // TODO: Implement task creation logic
    console.log("[v0] Creating task:", {
      title,
      description,
      priority,
      status,
      dueDate,
      selectedTags,
      selectedAssignees,
      selectedMachine,
      selectedLocation,
    })
    onOpenChange(false)
    // Reset form
    setTitle("")
    setDescription("")
    setPriority("normal")
    setStatus("backlog")
    setDueDate(undefined)
    setSelectedTags([])
    setSelectedAssignees([])
    setSelectedMachine("")
    setSelectedLocation("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">Nova Tarefa</DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Clock className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Star className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Título da Tarefa</Label>
            <Input
              id="title"
              placeholder="Ex: Revisão de motor elétrico"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Created Date and Status Row */}
          <div className="grid grid-cols-2 gap-4 p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
            <div className="space-y-2">
              <Label className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                Criado em
              </Label>
              <p className="text-sm font-medium">
                {format(createdDate, "d 'de' MMMM 'de' yyyy 'às' HH:mm", { locale: ptBR })}
              </p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Status</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="backlog">A Fazer</SelectItem>
                  <SelectItem value="in-progress">Em Progresso</SelectItem>
                  <SelectItem value="review">Em Revisão</SelectItem>
                  <SelectItem value="done">Concluído</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Priority and Due Date Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Prioridade</Label>
              <Select value={priority} onValueChange={setPriority}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Baixa</SelectItem>
                  <SelectItem value="normal">Média</SelectItem>
                  <SelectItem value="high">Alta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Prazo
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    {dueDate ? format(dueDate, "d 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecione a data"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={dueDate}
                    onSelect={setDueDate}
                    locale={ptBR}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-3">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="cursor-pointer hover:bg-destructive/20"
                  onClick={() => handleRemoveTag(tag)}
                >
                  {tag}
                  <X className="h-3 w-3 ml-1" />
                </Badge>
              ))}
            </div>
            <div className="flex gap-2 flex-wrap">
              {availableTags.filter(tag => !selectedTags.includes(tag)).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-muted"
                  onClick={() => handleAddTag(tag)}
                >
                  + {tag}
                </Badge>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="Nova tag personalizada"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    handleAddCustomTag()
                  }
                }}
              />
              <Button variant="outline" onClick={handleAddCustomTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Assignees */}
          <div className="space-y-3">
            <Label>Responsáveis</Label>
            <div className="flex flex-wrap gap-3">
              {selectedAssignees.map((name) => {
                const assignee = availableAssignees.find(a => a.name === name)
                return (
                  <div key={name} className="flex items-center gap-2">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm font-medium">
                      {assignee?.initials}
                    </div>
                    <span className="text-sm font-medium">{name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={() => toggleAssignee(name)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )
              })}
            </div>
            <Select onValueChange={toggleAssignee}>
              <SelectTrigger>
                <SelectValue placeholder="Adicionar responsável" />
              </SelectTrigger>
              <SelectContent>
                {availableAssignees
                  .filter(a => !selectedAssignees.includes(a.name))
                  .map((assignee) => (
                    <SelectItem key={assignee.name} value={assignee.name}>
                      <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white text-xs font-medium">
                          {assignee.initials}
                        </div>
                        {assignee.name}
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {/* Equipment Information */}
          <div className="space-y-4 p-4 bg-muted/50 dark:bg-muted/20 rounded-lg">
            <h3 className="font-semibold">Informações do Equipamento</h3>
            
            <div className="space-y-2">
              <Label>Máquina:</Label>
              <Select value={selectedMachine} onValueChange={setSelectedMachine}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a máquina" />
                </SelectTrigger>
                <SelectContent>
                  {machines.map((machine) => (
                    <SelectItem key={machine.id} value={machine.id}>
                      {machine.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedMachine && (
                <p className="text-sm font-medium mt-1">
                  {machines.find(m => m.id === selectedMachine)?.name}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label>Localização:</Label>
              <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a localização" />
                </SelectTrigger>
                <SelectContent>
                  {locations.map((location) => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedLocation && (
                <p className="text-sm font-medium mt-1">{selectedLocation}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label>Descrição da Tarefa</Label>
            <Textarea
              placeholder="Ex: Análise completa após manutenção"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!title || !dueDate}>
              Criar Tarefa
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
