"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, MoreVertical, Trash2, CheckCircle2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const savedCards = [
  {
    id: "1",
    brand: "mastercard",
    last4: "4562",
    holder: "João Silva",
    expiry: "02/27",
    isDefault: true,
    color: "from-slate-800 to-slate-950",
  },
  {
    id: "2",
    brand: "visa",
    last4: "7710",
    holder: "João Silva",
    expiry: "05/26",
    isDefault: false,
    color: "from-blue-600 to-blue-800",
  },
  {
    id: "3",
    brand: "amex",
    last4: "1008",
    holder: "João Silva",
    expiry: "11/28",
    isDefault: false,
    color: "from-emerald-600 to-emerald-800",
  },
]

const savedAddresses = [
  {
    id: "1",
    name: "Fábrica Principal",
    address: "Rua Industrial, 1500",
    city: "São Paulo",
    state: "SP",
    zip: "01234-567",
    isDefault: true,
  },
  {
    id: "2",
    name: "Filial Norte",
    address: "Av. Produção, 2300",
    city: "Manaus",
    state: "AM",
    zip: "69000-000",
    isDefault: false,
  },
]

export default function CardsSettingsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações de Pagamento</h1>
        <p className="text-muted-foreground mt-1">Gerencie seus cartões, endereços e preferências</p>
      </div>

      <Tabs defaultValue="cards" className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-3">
          <TabsTrigger value="cards">Cartões Salvos</TabsTrigger>
          <TabsTrigger value="addresses">Endereços</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        <TabsContent value="cards" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cartões Salvos</CardTitle>
              <CardDescription>
                Selecione o cartão que deseja usar para transações. Você pode salvar até 5 cartões.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {savedCards.map((card) => (
                  <div key={card.id} className="relative group">
                    <div
                      className={`relative p-6 rounded-2xl bg-gradient-to-br ${card.color} text-white aspect-[1.586/1] flex flex-col justify-between transition-transform hover:scale-105 cursor-pointer`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="h-12 w-16 bg-white/20 rounded backdrop-blur-sm flex items-center justify-center">
                          <div className="h-8 w-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-sm" />
                        </div>
                        <div className="flex items-center gap-1">
                          {card.brand === "mastercard" && (
                            <>
                              <div className="h-8 w-8 rounded-full bg-red-500" />
                              <div className="h-8 w-8 rounded-full bg-orange-400 -ml-4" />
                            </>
                          )}
                          {card.brand === "visa" && <div className="text-2xl font-bold tracking-wider">VISA</div>}
                          {card.brand === "amex" && <div className="text-xl font-bold tracking-wider">AMEX</div>}
                        </div>
                      </div>

                      {/* Card Number */}
                      <div className="space-y-4">
                        <div className="font-mono text-xl tracking-widest">•••• •••• •••• {card.last4}</div>
                        <div className="flex justify-between items-end">
                          <div>
                            <div className="text-xs opacity-70 uppercase">Titular</div>
                            <div className="font-medium">{card.holder}</div>
                          </div>
                          <div>
                            <div className="text-xs opacity-70 uppercase">Validade</div>
                            <div className="font-medium">{card.expiry}</div>
                          </div>
                        </div>
                      </div>

                      {/* Default Badge */}
                      {card.isDefault && (
                        <Badge className="absolute top-4 right-4 bg-green-500/90 hover:bg-green-500">
                          <CheckCircle2 className="h-3 w-3 mr-1" />
                          Padrão
                        </Badge>
                      )}
                    </div>

                    {/* Card Actions */}
                    <div className="absolute inset-0 bg-black/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      {!card.isDefault && (
                        <Button size="sm" variant="secondary">
                          Definir como Padrão
                        </Button>
                      )}
                      <Button size="sm" variant="destructive">
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remover
                      </Button>
                    </div>
                  </div>
                ))}

                {/* Add Card Button */}
                <button className="relative p-6 rounded-2xl border-2 border-dashed border-muted-foreground/30 hover:border-blue-500 hover:bg-blue-500/5 transition-colors aspect-[1.586/1] flex flex-col items-center justify-center gap-3 group">
                  <div className="h-12 w-12 rounded-full bg-blue-500/10 group-hover:bg-blue-500/20 flex items-center justify-center transition-colors">
                    <Plus className="h-6 w-6 text-blue-500" />
                  </div>
                  <div className="text-center">
                    <p className="font-medium text-foreground">Adicionar Cartão</p>
                    <p className="text-sm text-muted-foreground">Adicione um novo método de pagamento</p>
                  </div>
                </button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="addresses" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Endereços Salvos</CardTitle>
              <CardDescription>Gerencie os endereços de entrega de peças e equipamentos</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {savedAddresses.map((address) => (
                  <div
                    key={address.id}
                    className="p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-foreground">{address.name}</h3>
                          {address.isDefault && (
                            <Badge variant="outline" className="bg-green-500/10 text-green-600 border-green-500/20">
                              Padrão
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{address.address}</p>
                        <p className="text-sm text-muted-foreground">
                          {address.city}, {address.state} - {address.zip}
                        </p>
                      </div>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}

                <Button variant="outline" className="w-full bg-transparent">
                  <Plus className="h-4 w-4 mr-2" />
                  Adicionar Endereço
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências de Pagamento</CardTitle>
              <CardDescription>Configure suas preferências e notificações</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-medium text-foreground">Notificações de Transação</h3>
                    <p className="text-sm text-muted-foreground">Receba alertas para cada transação</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativado
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-medium text-foreground">Faturamento Automático</h3>
                    <p className="text-sm text-muted-foreground">Autorize cobranças recorrentes</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativado
                  </Button>
                </div>

                <div className="flex items-center justify-between p-4 rounded-lg border border-border">
                  <div>
                    <h3 className="font-medium text-foreground">Relatórios Mensais</h3>
                    <p className="text-sm text-muted-foreground">Receba resumo de despesas por email</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ativado
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
