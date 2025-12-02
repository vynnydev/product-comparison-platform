"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Plus, Play, Pause, Copy, Trash2, Save, Settings, Zap, Clock, CheckCircle2, ArrowRight, GitBranch } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useTheme } from "@/contexts/theme-context"
import cn from "classnames"

interface WorkflowNode {
  id: string
  type: "trigger" | "action" | "condition"
  label: string
  icon: string
  position: { x: number; y: number }
  config?: Record<string, any>
}

interface Workflow {
  id: string
  name: string
  description: string
  status: "active" | "paused" | "draft"
  trigger: string
  nodes: WorkflowNode[]
  lastRun?: Date
  runsCount: number
}

const mockWorkflows: Workflow[] = [
  {
    id: "1",
    name: "Alerta de Manutenção Preventiva",
    description: "Notifica quando máquina atinge limite de horas de operação",
    status: "active",
    trigger: "Horas de operação",
    nodes: [],
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    runsCount: 145,
  },
  {
    id: "2",
    name: "Agendamento Automático de Reboque",
    description: "Cria solicitação de transporte quando máquina apresenta falha crítica",
    status: "active",
    trigger: "Status da máquina",
    nodes: [],
    lastRun: new Date(Date.now() - 5 * 60 * 60 * 1000),
    runsCount: 23,
  },
  {
    id: "3",
    name: "Relatório Semanal de Eficiência",
    description: "Envia relatório por e-mail toda segunda-feira às 8h",
    status: "active",
    trigger: "Agendamento",
    nodes: [],
    lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000),
    runsCount: 52,
  },
  {
    id: "4",
    name: "Otimização de Rota de Transporte",
    description: "Calcula melhor rota baseado em múltiplas solicitações",
    status: "draft",
    trigger: "Manual",
    nodes: [],
    runsCount: 0,
  },
]

const triggerTypes = [
  { value: "schedule", label: "Agendamento", icon: Clock },
  { value: "machine_status", label: "Status da Máquina", icon: Zap },
  { value: "maintenance", label: "Manutenção", icon: Settings },
  { value: "transport", label: "Transporte", icon: CheckCircle2 },
]

const actionTypes = [
  { value: "notify", label: "Enviar Notificação", color: "blue" },
  { value: "email", label: "Enviar E-mail", color: "green" },
  { value: "create_task", label: "Criar Tarefa", color: "purple" },
  { value: "schedule_maintenance", label: "Agendar Manutenção", color: "orange" },
  { value: "request_transport", label: "Solicitar Transporte", color: "red" },
  { value: "update_status", label: "Atualizar Status", color: "teal" },
]

export default function WorkflowsPage() {
  const [workflows, setWorkflows] = useState(mockWorkflows)
  const [selectedWorkflow, setSelectedWorkflow] = useState<Workflow | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const { theme } = useTheme()

  const getStatusColor = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500"
      case "paused":
        return "bg-yellow-500"
      case "draft":
        return "bg-gray-400"
    }
  }

  const getStatusLabel = (status: Workflow["status"]) => {
    switch (status) {
      case "active":
        return "Ativo"
      case "paused":
        return "Pausado"
      case "draft":
        return "Rascunho"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Automatizar Fluxos</h1>
          <p className="text-muted-foreground mt-2">
            Gerencie automações e fluxos de trabalho da sua operação
          </p>
        </div>
        <Button onClick={() => setIsCreating(true)} className="bg-gradient-to-r from-purple-500 to-blue-500">
          <Plus className="h-5 w-5 mr-2" />
          Novo Fluxo
        </Button>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Fluxos Ativos</p>
              <p className="text-2xl font-bold mt-1">{workflows.filter((w) => w.status === "active").length}</p>
            </div>
            <Zap className="h-8 w-8 text-blue-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Execuções Hoje</p>
              <p className="text-2xl font-bold mt-1">1,234</p>
            </div>
            <Play className="h-8 w-8 text-green-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Taxa de Sucesso</p>
              <p className="text-2xl font-bold mt-1">98.5%</p>
            </div>
            <CheckCircle2 className="h-8 w-8 text-purple-500" />
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-orange-500/10 to-orange-600/10 border-orange-500/20">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Tempo Economizado</p>
              <p className="text-2xl font-bold mt-1">145h</p>
            </div>
            <Clock className="h-8 w-8 text-orange-500" />
          </div>
        </Card>
      </div>

      {/* Workflow List */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {workflows.map((workflow) => (
          <Card
            key={workflow.id}
            className={cn(
              "p-3 hover:shadow-lg transition-all cursor-pointer",
              selectedWorkflow?.id === workflow.id && "ring-2 ring-primary ring-offset-2"
            )}
            onClick={() => setSelectedWorkflow(workflow)}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-semibold truncate">{workflow.name}</h3>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">{workflow.description}</p>
              </div>
              <span
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-medium text-white ${getStatusColor(workflow.status)} flex-shrink-0 ml-2`}
              >
                {getStatusLabel(workflow.status)}
              </span>
            </div>

            <div className="flex items-center gap-2 text-[10px] text-muted-foreground mb-2">
              <div className="flex items-center gap-1 flex-1 min-w-0">
                <Zap className="h-3 w-3 flex-shrink-0" />
                <span className="truncate">{workflow.trigger}</span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Play className="h-3 w-3" />
                <span>{workflow.runsCount}</span>
              </div>
            </div>

            <div className="flex items-center gap-1">
              {workflow.status === "active" ? (
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2">
                  <Pause className="h-3 w-3 mr-1" />
                  Pausar
                </Button>
              ) : (
                <Button variant="outline" size="sm" className="flex-1 h-7 text-xs px-2">
                  <Play className="h-3 w-3 mr-1" />
                  Ativar
                </Button>
              )}
              <Button variant="outline" size="sm">
                <Settings className="h-3 w-3" />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {selectedWorkflow && !isCreating && (
        <Card className="overflow-hidden">
          <div className="p-4 border-b bg-muted/30">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">{selectedWorkflow.name}</h2>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{selectedWorkflow.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Configurar
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Duplicar
                </Button>
                <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="p-6">
            <div
              className={cn(
                "rounded-lg border p-6 min-h-[300px]",
                theme === "light"
                  ? "bg-gradient-to-br from-slate-50 via-white to-slate-50 border-slate-200"
                  : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700"
              )}
            >
              {/* Flow nodes connected with arrows */}
              <div className="flex items-start gap-4 overflow-x-auto pb-4">
                {/* Trigger node */}
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div
                    className={cn(
                      "w-full rounded-lg p-3 border-2 shadow-sm",
                      theme === "light"
                        ? "bg-purple-50 border-purple-300"
                        : "bg-purple-950/30 border-purple-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-purple-500">
                        <Zap className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-purple-600 dark:text-purple-400">TRIGGERS</span>
                    </div>
                    <p className="text-xs font-semibold truncate">Basic trigger</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Generates bundles with their own structure
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-purple-600 dark:text-purple-400">
                      {selectedWorkflow.trigger}
                    </p>
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Condition node */}
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div
                    className={cn(
                      "w-full rounded-lg p-3 border-2 shadow-sm",
                      theme === "light"
                        ? "bg-blue-50 border-blue-300"
                        : "bg-blue-950/30 border-blue-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-blue-500">
                        <GitBranch className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">FLOW CONTROL</span>
                    </div>
                    <p className="text-xs font-semibold truncate">Get variable</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Get the value of a previously stored variable
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-blue-600 dark:text-blue-400">
                      Verificar condição
                    </p>
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Action node 1 */}
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div
                    className={cn(
                      "w-full rounded-lg p-3 border-2 shadow-sm",
                      theme === "light"
                        ? "bg-green-50 border-green-300"
                        : "bg-green-950/30 border-green-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-green-500">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-green-600 dark:text-green-400">ACTIONS</span>
                    </div>
                    <p className="text-xs font-semibold truncate">Get multiple variables</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Get values of a previously stored variables
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-green-600 dark:text-green-400">
                      Enviar notificação
                    </p>
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Action node 2 */}
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div
                    className={cn(
                      "w-full rounded-lg p-3 border-2 shadow-sm",
                      theme === "light"
                        ? "bg-orange-50 border-orange-300"
                        : "bg-orange-950/30 border-orange-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-orange-500">
                        <Settings className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">ACTIONS</span>
                    </div>
                    <p className="text-xs font-semibold truncate">Increment function</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Returns a value of 1 after first run
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-orange-600 dark:text-orange-400">
                      Criar tarefa
                    </p>
                  </div>
                </div>

                <div className="flex items-center pt-8">
                  <ArrowRight className="h-5 w-5 text-muted-foreground" />
                </div>

                {/* Final action node */}
                <div className="flex flex-col items-center gap-2 min-w-[140px]">
                  <div
                    className={cn(
                      "w-full rounded-lg p-3 border-2 shadow-sm",
                      theme === "light"
                        ? "bg-teal-50 border-teal-300"
                        : "bg-teal-950/30 border-teal-700"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1 rounded bg-teal-500">
                        <CheckCircle2 className="h-3 w-3 text-white" />
                      </div>
                      <span className="text-[10px] font-bold text-teal-600 dark:text-teal-400">ACTIONS</span>
                    </div>
                    <p className="text-xs font-semibold truncate">Set multiple variables</p>
                    <p className="text-[10px] text-muted-foreground mt-1 truncate">
                      Sets the value of multiple variables
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-[10px] font-medium text-teal-600 dark:text-teal-400">
                      Atualizar status
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Flow statistics below visualization */}
            <div className="grid grid-cols-4 gap-3 mt-4">
              <Card className="p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Total de Execuções</p>
                <p className="text-xl font-bold">{selectedWorkflow.runsCount}</p>
              </Card>
              <Card className="p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Taxa de Sucesso</p>
                <p className="text-xl font-bold text-green-500">98.2%</p>
              </Card>
              <Card className="p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Tempo Médio</p>
                <p className="text-xl font-bold">2.3s</p>
              </Card>
              <Card className="p-3 bg-muted/30">
                <p className="text-xs text-muted-foreground mb-1">Última Execução</p>
                <p className="text-xl font-bold">
                  {selectedWorkflow.lastRun
                    ? new Date(selectedWorkflow.lastRun).toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "Nunca"}
                </p>
              </Card>
            </div>
          </div>
        </Card>
      )}

      {!selectedWorkflow && !isCreating && (
        <Card className="overflow-hidden">
          <div className="p-12 text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <GitBranch className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Selecione um fluxo</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Escolha um fluxo acima para visualizar sua configuração e métricas
            </p>
            <Button onClick={() => setIsCreating(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Criar Novo Fluxo
            </Button>
          </div>
        </Card>
      )}

      {/* Workflow Builder (when creating) */}
      {isCreating && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Criar Novo Fluxo</h2>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancelar
              </Button>
              <Button className="bg-gradient-to-r from-purple-500 to-blue-500">
                <Save className="h-4 w-4 mr-2" />
                Salvar Fluxo
              </Button>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="text-sm font-medium mb-2 block">Nome do Fluxo</label>
              <Input placeholder="Ex: Notificar manutenção pendente" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Input placeholder="Descreva o que este fluxo faz" />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo de Gatilho</label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o gatilho" />
                </SelectTrigger>
                <SelectContent>
                  {triggerTypes.map((trigger) => {
                    const Icon = trigger.icon
                    return (
                      <SelectItem key={trigger.value} value={trigger.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4" />
                          {trigger.label}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Flow Builder Canvas */}
          <div className="border-2 border-dashed border-border rounded-lg p-8 min-h-[400px] bg-muted/30">
            <div className="text-center">
              <p className="text-muted-foreground mb-4">Configure as ações do seu fluxo</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {actionTypes.map((action) => (
                  <Button
                    key={action.value}
                    variant="outline"
                    size="sm"
                    className={`bg-${action.color}-500/10 border-${action.color}-500/20 hover:bg-${action.color}-500/20`}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    {action.label}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
