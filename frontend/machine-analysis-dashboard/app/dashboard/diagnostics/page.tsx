"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  TrendingUp,
  TrendingDown,
  Wrench,
  Users,
  CalendarIcon,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"

export default function DiagnosticsPage() {
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [selectedWeek, setSelectedWeek] = useState(2)

  const weekActivities = [
    {
      day: "Seg",
      date: 14,
      tasks: 12,
      completed: 12,
      color: "blue",
    },
    {
      day: "Ter",
      date: 15,
      tasks: 6,
      completed: 6,
      color: "green",
    },
    {
      day: "Qua",
      date: 16,
      tasks: 3,
      completed: 3,
      color: "blue",
      active: true,
    },
    {
      day: "Qui",
      date: 17,
      tasks: 4,
      completed: 0,
      color: "gray",
    },
    {
      day: "Sex",
      date: 18,
      tasks: 6,
      completed: 0,
      color: "gray",
    },
    {
      day: "Sáb",
      date: 19,
      tasks: 11,
      completed: 0,
      color: "gray",
    },
    {
      day: "Dom",
      date: 20,
      tasks: 2,
      completed: 0,
      color: "gray",
    },
  ]

  const dailyEvents = [
    {
      time: "7:00 - 8:20",
      title: "Inspeção matinal",
      location: "Planta 1",
      type: "inspection",
      attendees: 3,
    },
    {
      time: "8:30 - 10:20",
      title: "Manutenção preventiva",
      location: "Online",
      type: "maintenance",
      attendees: 2,
    },
    {
      time: "10:00 - 11:20",
      title: "Calibração de sensores",
      location: "Laboratório",
      type: "calibration",
      attendees: 4,
    },
    {
      time: "11:00 - 12:20",
      title: "Reunião de preparação",
      location: "Sala 2",
      type: "meeting",
      attendees: 5,
    },
  ]

  const monthlyStats = [
    {
      label: "Manutenções Realizadas",
      value: 145,
      change: +12,
      trend: "up",
      icon: Wrench,
      color: "blue",
    },
    {
      label: "Taxa de Conclusão",
      value: "94%",
      change: +3,
      trend: "up",
      icon: CheckCircle2,
      color: "green",
    },
    {
      label: "Tempo Médio de Reparo",
      value: "2.4h",
      change: -0.5,
      trend: "down",
      icon: Clock,
      color: "orange",
    },
    {
      label: "Equipe Ativa",
      value: 24,
      change: +2,
      trend: "up",
      icon: Users,
      color: "purple",
    },
  ]

  const recentIssues = [
    {
      id: "1",
      machine: "Bomba Centrífuga BCP-001",
      issue: "Vibração acima do normal",
      severity: "medium",
      time: "2 horas atrás",
      status: "investigating",
    },
    {
      id: "2",
      machine: "Compressor CP-200",
      issue: "Temperatura elevada",
      severity: "high",
      time: "4 horas atrás",
      status: "resolved",
    },
    {
      id: "3",
      machine: "Motor Elétrico ME-150",
      issue: "Ruído anormal",
      severity: "low",
      time: "1 dia atrás",
      status: "monitoring",
    },
  ]

  const getSeverityConfig = (severity: string) => {
    const configs = {
      high: {
        label: "Alta",
        color: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
      },
      medium: {
        label: "Média",
        color: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
      },
      low: {
        label: "Baixa",
        color: "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20",
      },
    }
    return configs[severity as keyof typeof configs]
  }

  const getStatusConfig = (status: string) => {
    const configs = {
      investigating: {
        label: "Investigando",
        color: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
      },
      resolved: {
        label: "Resolvido",
        color: "bg-green-500/10 text-green-600 dark:text-green-400",
      },
      monitoring: {
        label: "Monitorando",
        color: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
      },
    }
    return configs[status as keyof typeof configs]
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Diagnósticos e Atividades</h1>
        <p className="text-muted-foreground mt-1">Acompanhe as atividades mensais e o diagnóstico dos equipamentos</p>
      </div>

      {/* Monthly Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {monthlyStats.map((stat, idx) => {
          const Icon = stat.icon
          const isPositive = stat.trend === "up"
          const TrendIcon = isPositive ? TrendingUp : TrendingDown

          return (
            <Card key={idx}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={`h-12 w-12 rounded-full bg-${stat.color}-500/10 flex items-center justify-center`}>
                    <Icon className={`h-6 w-6 text-${stat.color}-500`} />
                  </div>
                  <Badge
                    variant="outline"
                    className={`${
                      isPositive
                        ? "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20"
                        : "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"
                    }`}
                  >
                    <TrendIcon className="h-3 w-3 mr-1" />
                    {Math.abs(stat.change)}
                    {typeof stat.value === "string" && stat.value.includes("%") ? "%" : ""}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                <p className="text-3xl font-bold text-foreground">{stat.value}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Calendar and Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Weekly Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Calendário de Atividades</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => setSelectedWeek(selectedWeek - 1)}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground px-4">Semana {selectedWeek}</span>
                <Button variant="outline" size="icon" onClick={() => setSelectedWeek(selectedWeek + 1)}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Week View */}
            <div className="grid grid-cols-7 gap-2 mb-6">
              {weekActivities.map((day, idx) => (
                <div
                  key={idx}
                  className={`text-center p-4 rounded-lg border transition-colors ${
                    day.active
                      ? "bg-blue-500/10 border-blue-500/30"
                      : "bg-secondary/50 border-border hover:bg-secondary"
                  }`}
                >
                  <p className="text-xs text-muted-foreground mb-2">{day.day}</p>
                  <div
                    className={`h-10 w-10 rounded-full mx-auto mb-2 flex items-center justify-center font-semibold ${
                      day.active
                        ? "bg-blue-500 text-white"
                        : day.completed === day.tasks
                          ? "bg-green-500/20 text-green-600 dark:text-green-400"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {day.date}
                  </div>
                  <div className="text-xs">
                    <p className="text-muted-foreground">
                      {day.completed}/{day.tasks}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1">tarefas</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Daily Events */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground mb-3">Atividades de Hoje</h4>
              {dailyEvents.map((event, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-4 p-3 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <div className="text-sm text-muted-foreground min-w-[100px]">{event.time}</div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground text-sm">{event.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{event.location}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {Array.from({ length: Math.min(event.attendees, 3) }).map((_, i) => (
                      <Avatar key={i} className="h-6 w-6 border-2 border-card">
                        <AvatarFallback className="text-[10px] bg-primary/10 text-primary">U{i + 1}</AvatarFallback>
                      </Avatar>
                    ))}
                    {event.attendees > 3 && (
                      <div className="h-6 w-6 rounded-full bg-muted border-2 border-card flex items-center justify-center">
                        <span className="text-[10px] text-muted-foreground">+{event.attendees - 3}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Month Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendário Mensal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
          </CardContent>
        </Card>
      </div>

      {/* Recent Issues */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Problemas Recentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentIssues.map((issue) => {
              const severityConfig = getSeverityConfig(issue.severity)
              const statusConfig = getStatusConfig(issue.status)

              return (
                <div
                  key={issue.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card hover:bg-accent/5 transition-colors"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium text-foreground">{issue.machine}</h4>
                      <Badge variant="outline" className={severityConfig.color}>
                        {severityConfig.label}
                      </Badge>
                      <Badge variant="outline" className={statusConfig.color}>
                        {statusConfig.label}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{issue.issue}</p>
                    <p className="text-xs text-muted-foreground">{issue.time}</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Detalhes
                  </Button>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
