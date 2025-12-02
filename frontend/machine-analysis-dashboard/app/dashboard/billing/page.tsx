"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingUp, ArrowUpRight, ArrowDownLeft, Plus, Filter, Search, MoreHorizontal, CheckCircle2, Clock, XCircle, DollarSign, Package, Wrench, AlertCircle, Eye, EyeOff, Waves } from 'lucide-react'
import { LineChart, Line, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

// Mock data
const balanceHistory = [
  { month: "Jan", balance: 8200 },
  { month: "Fev", balance: 7800 },
  { month: "Mar", balance: 8500 },
  { month: "Abr", balance: 8100 },
  { month: "Mai", balance: 9200 },
  { month: "Jun", balance: 11450 },
]

const expensesByCategory = [
  { name: "Manutenção Preventiva", value: 4200, color: "#3b82f6" },
  { name: "Peças e Componentes", value: 3800, color: "#8b5cf6" },
  { name: "Ferramentas IA", value: 2100, color: "#06b6d4" },
  { name: "Consultoria Técnica", value: 1350, color: "#10b981" },
]

const recentTransactions = [
  {
    id: "1",
    type: "expense",
    description: "Manutenção Preventiva - CNC-001",
    amount: -850.0,
    date: "23 Nov, 2024",
    status: "success",
    method: "Mastercard •••• 4562",
  },
  {
    id: "2",
    type: "expense",
    description: "Ferramenta IA - Análise Preditiva",
    amount: -299.99,
    date: "23 Nov, 2024",
    status: "success",
    method: "Visa •••• 7710",
  },
  {
    id: "3",
    type: "income",
    description: "Crédito de Garantia - Peça Defeituosa",
    amount: +450.0,
    date: "22 Nov, 2024",
    status: "pending",
    method: "Transferência Bancária",
  },
  {
    id: "4",
    type: "expense",
    description: "Peças de Reposição - Linha 2",
    amount: -1240.5,
    date: "22 Nov, 2024",
    status: "canceled",
    method: "Mastercard •••• 4562",
  },
  {
    id: "5",
    type: "expense",
    description: "Sensor IoT - Monitoramento",
    amount: -180.0,
    date: "21 Nov, 2024",
    status: "pending",
    method: "Visa •••• 7710",
  },
  {
    id: "6",
    type: "expense",
    description: "Consultoria - Otimização Robô",
    amount: -1500.0,
    date: "20 Nov, 2024",
    status: "success",
    method: "American Express •••• 1008",
  },
]

const savedCards = [
  {
    id: "1",
    brand: "mastercard",
    last4: "4562",
    fullNumber: "5425 2334 3010 4562",
    holder: "João Silva",
    expiry: "02/27",
    isDefault: true,
    color: "from-blue-700 via-blue-600 to-blue-500",
  },
  {
    id: "2",
    brand: "visa",
    last4: "7710",
    fullNumber: "4532 7589 3441 7710",
    holder: "João Silva",
    expiry: "05/26",
    isDefault: false,
    color: "from-purple-700 via-purple-600 to-fuchsia-500",
  },
  {
    id: "3",
    brand: "amex",
    last4: "1008",
    fullNumber: "3782 822463 1008",
    holder: "João Silva",
    expiry: "11/28",
    isDefault: false,
    color: "from-slate-800 via-slate-700 to-slate-600",
  },
]

export default function BillingPage() {
  const currentBalance = 11450.87
  const balanceChange = 5.95
  const monthlyExpenses = 4520.49

  const [hideValues, setHideValues] = useState(true)

  const formatValue = (value: number) => {
    if (hideValues) return "••••••"
    return value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Faturamento</h1>
        <p className="text-muted-foreground mt-1">Gerencie pagamentos, cartões e acompanhe despesas de manutenção</p>
      </div>

      {/* Balance and Cards Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-blue-600 to-blue-800 border-none text-white">
          <CardHeader>
            <div className="flex items-center justify-between mb-2">
              <CardDescription className="text-blue-100">Saldo Disponível</CardDescription>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-white hover:bg-white/20"
                onClick={() => setHideValues(!hideValues)}
              >
                {hideValues ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
            <CardTitle className="text-4xl font-bold">
              R$ {formatValue(currentBalance)}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge
                variant="secondary"
                className="bg-green-500/20 text-green-100 border-green-400/30 hover:bg-green-500/30"
              >
                <TrendingUp className="h-3 w-3 mr-1" />
                {hideValues ? "••%" : `${balanceChange}%`}
              </Badge>
              <span className="text-sm text-blue-100">vs mês anterior</span>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={balanceHistory}>
                  <Line type="monotone" dataKey="balance" stroke="#fff" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <div className="flex gap-3 mt-4">
              <Button className="flex-1 bg-white/20 hover:bg-white/30 border-white/30">
                <ArrowUpRight className="h-4 w-4 mr-2" />
                Solicitar
              </Button>
              <Button className="flex-1 bg-blue-900 hover:bg-blue-950">
                <ArrowDownLeft className="h-4 w-4 mr-2" />
                Enviar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Cards */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div>
              <CardTitle>Meus Cartões</CardTitle>
              <CardDescription>Gerencie seus métodos de pagamento</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Adicionar
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {savedCards.slice(0, 2).map((card) => (
                <div
                  key={card.id}
                  className={`relative overflow-hidden rounded-xl cursor-pointer hover:scale-[1.02] transition-transform`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.color}`}>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
                  </div>

                  {/* Card content */}
                  <div className="relative p-5 text-white">
                    <div className="flex items-start justify-between mb-8">
                      <div className="flex items-center gap-3">
                        {/* Chip icon */}
                        <div className="h-10 w-14 bg-gradient-to-br from-yellow-200 to-yellow-400 rounded-md flex items-center justify-center shadow-lg">
                          <div className="grid grid-cols-3 gap-0.5">
                            {[...Array(9)].map((_, i) => (
                              <div key={i} className="w-1 h-1 bg-yellow-600 rounded-sm" />
                            ))}
                          </div>
                        </div>
                        {/* Contactless icon */}
                        <Waves className="h-6 w-6 -rotate-90" />
                      </div>
                      {/* Brand logo */}
                      <div className="flex gap-1">
                        {card.brand === "mastercard" && (
                          <>
                            <div className="h-8 w-8 rounded-full bg-red-500 shadow-lg" />
                            <div className="h-8 w-8 rounded-full bg-orange-400 -ml-4 shadow-lg" />
                          </>
                        )}
                        {card.brand === "visa" && (
                          <div className="text-2xl font-bold tracking-wider drop-shadow-lg">VISA</div>
                        )}
                      </div>
                    </div>

                    {/* Card number */}
                    <div className="text-xl font-mono tracking-widest mb-16 drop-shadow-lg font-semibold">
                      {hideValues ? `•••• •••• •••• ${card.last4}` : card.fullNumber}
                    </div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400 text-gray-900 px-5 py-3 rounded-b-xl">
                    <div className="flex justify-between text-sm font-medium">
                      <div>
                        <div className="text-xs opacity-70 mb-0.5">Nome do Titular</div>
                        <div className="font-semibold">{card.holder}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs opacity-70 mb-0.5">Validade</div>
                        <div className="font-semibold">{card.expiry}</div>
                      </div>
                    </div>
                  </div>

                  {/* Default badge */}
                  {card.isDefault && (
                    <Badge className="absolute top-3 right-3 bg-green-500/90 hover:bg-green-500 shadow-lg">
                      Padrão
                    </Badge>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full bg-transparent">
                Ver todos os cartões
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Despesas do Mês</CardTitle>
            <DollarSign className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">
              R$ {formatValue(monthlyExpenses)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-red-500">↑ {hideValues ? "••%" : "12.5%"}</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Manutenções Pagas</CardTitle>
            <Wrench className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">24</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 8.3%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Peças Adquiridas</CardTitle>
            <Package className="h-5 w-5 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">147</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className="text-green-500">↑ 15.2%</span> vs mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pagamentos Pendentes</CardTitle>
            <AlertCircle className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">3</div>
            <p className="text-xs text-muted-foreground mt-1">R$ 1.929,99 aguardando</p>
          </CardContent>
        </Card>
      </div>

      {/* Expenses and Recent Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Expenses by Category */}
        <Card>
          <CardHeader>
            <CardTitle>Despesas por Categoria</CardTitle>
            <CardDescription>Distribuição de gastos no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expensesByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number) => 
                      hideValues ? "R$ ••••••" : `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`
                    }
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-4">
              {expensesByCategory.map((category) => (
                <div key={category.name} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: category.color }} />
                    <span className="text-muted-foreground">{category.name}</span>
                  </div>
                  <span className="font-medium">
                    R$ {hideValues ? "••••••" : category.value.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Atividade Recente</CardTitle>
                <CardDescription>Transações e pagamentos recentes</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center ${
                      transaction.type === "income" ? "bg-green-500/10 text-green-600" : "bg-red-500/10 text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? (
                      <ArrowDownLeft className="h-5 w-5" />
                    ) : (
                      <ArrowUpRight className="h-5 w-5" />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm text-foreground truncate">{transaction.description}</p>
                    <p className="text-xs text-muted-foreground">{transaction.method}</p>
                  </div>

                  <div className="text-right">
                    <p
                      className={`font-semibold text-sm ${
                        transaction.type === "income" ? "text-green-600" : "text-foreground"
                      }`}
                    >
                      {hideValues ? "R$ ••••••" : (
                        <>
                          {transaction.amount > 0 ? "+" : ""}R${" "}
                          {Math.abs(transaction.amount).toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                        </>
                      )}
                    </p>
                    <p className="text-xs text-muted-foreground">{transaction.date}</p>
                  </div>

                  <div>
                    {transaction.status === "success" && (
                      <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Concluído
                      </Badge>
                    )}
                    {transaction.status === "pending" && (
                      <Badge variant="outline" className="bg-orange-500/10 text-orange-600 border-orange-500/20">
                        <Clock className="h-3 w-3 mr-1" />
                        Pendente
                      </Badge>
                    )}
                    {transaction.status === "canceled" && (
                      <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20">
                        <XCircle className="h-3 w-3 mr-1" />
                        Cancelado
                      </Badge>
                    )}
                  </div>

                  <Button variant="ghost" size="icon">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t">
              <Button variant="outline" size="sm">
                Anterior
              </Button>
              <div className="flex gap-1">
                <Button variant="default" size="sm" className="w-8 h-8 p-0">
                  1
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                  2
                </Button>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                  3
                </Button>
                <span className="flex items-center px-2">...</span>
                <Button variant="outline" size="sm" className="w-8 h-8 p-0 bg-transparent">
                  12
                </Button>
              </div>
              <Button variant="outline" size="sm">
                Próximo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>Gerenciamento financeiro simplificado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Button className="h-20 bg-green-600 hover:bg-green-700">
              <div className="flex flex-col items-center gap-2">
                <Plus className="h-5 w-5" />
                <span>Criar Fatura</span>
              </div>
            </Button>
            <Button className="h-20 bg-purple-600 hover:bg-purple-700">
              <div className="flex flex-col items-center gap-2">
                <CreditCard className="h-5 w-5" />
                <span>Adicionar Cartão</span>
              </div>
            </Button>
            <Button className="h-20 bg-orange-600 hover:bg-orange-700">
              <div className="flex flex-col items-center gap-2">
                <Package className="h-5 w-5" />
                <span>Criar Orçamento</span>
              </div>
            </Button>
            <Button className="h-20 bg-blue-600 hover:bg-blue-700">
              <div className="flex flex-col items-center gap-2">
                <Wrench className="h-5 w-5" />
                <span>Agendar Manutenção</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
