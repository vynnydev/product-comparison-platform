"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Building2, Shield, Bell, Palette, Globe, CreditCard, Lock, Eye, EyeOff, Upload, Camera, Check, X, Pencil } from 'lucide-react'
import { useTheme } from "@/contexts/theme-context"
import cn from "classnames"
import { useRouter } from 'next/navigation'
import { AccountSwitcher } from "@/components/account-switcher"

export default function SettingsPage() {
  const { theme } = useTheme()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("general")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Preferências do Usuário</h1>
        <p className="text-muted-foreground mt-1">Gerencie suas informações pessoais e configurações da conta</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="general">Geral</TabsTrigger>
          <TabsTrigger value="notifications">Notificações</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
          <TabsTrigger value="billing">Faturamento</TabsTrigger>
          <TabsTrigger value="preferences">Preferências</TabsTrigger>
        </TabsList>

        {/* General Tab */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>Atualize suas informações de perfil e foto</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src="/placeholder.svg?height=96&width=96" />
                    <AvatarFallback className="text-2xl">JS</AvatarFallback>
                  </Avatar>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">João Silva</h3>
                  <p className="text-sm text-muted-foreground">joao.silva@example.com</p>
                  <div className="flex gap-2 mt-2">
                    <Button size="sm" variant="outline" className="gap-2">
                      <Upload className="h-4 w-4" />
                      Fazer Upload
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2">
                      <X className="h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nome</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input id="firstName" placeholder="João" className="pl-9" defaultValue="João" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Sobrenome</Label>
                  <Input id="lastName" placeholder="Silva" defaultValue="Silva" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="joao.silva@example.com"
                      className="pl-9"
                      defaultValue="joao.silva@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Telefone</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+55 (11) 98765-4321"
                      className="pl-9"
                      defaultValue="+55 (11) 98765-4321"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    placeholder="Rua das Flores, 123"
                    className="pl-9"
                    defaultValue="Rua das Flores, 123, São Paulo - SP"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Empresa</Label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="company"
                    placeholder="Nome da Empresa"
                    className="pl-9"
                    defaultValue="Cognitiva Analytics"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline">Cancelar</Button>
                <Button className="gap-2">
                  <Check className="h-4 w-4" />
                  Salvar Alterações
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Informações da Conta</CardTitle>
              <CardDescription>Detalhes sobre sua conta e assinatura</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="mb-6">
                <Label className="text-sm font-medium mb-2 block">Contas Disponíveis</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Alterne entre diferentes contas com diferentes níveis de acesso
                </p>
                <AccountSwitcher />
              </div>

              <Separator />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Status da Conta</span>
                    <Badge className="bg-green-500">Ativa</Badge>
                  </div>
                  <p className="text-2xl font-bold">Premium</p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Membro desde</span>
                  </div>
                  <p className="text-2xl font-bold">Jan 2024</p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">ID da Conta</span>
                  </div>
                  <p className="text-sm font-mono">USR-2024-8457</p>
                </div>

                <div
                  className={cn(
                    "p-4 rounded-lg border",
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                  )}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">Próximo Pagamento</span>
                  </div>
                  <p className="text-xl font-bold">15 Jan 2025</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Configurações de Notificações</CardTitle>
              <CardDescription>Gerencie como e quando você recebe notificações</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Bell className="h-4 w-4 text-muted-foreground" />
                      <Label htmlFor="email-notifications">Notificações por E-mail</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Receba atualizações importantes por e-mail</p>
                  </div>
                  <Switch id="email-notifications" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Notificações Push</Label>
                    <p className="text-sm text-muted-foreground">Receba notificações push no navegador</p>
                  </div>
                  <Switch id="push-notifications" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="sms-notifications">Notificações por SMS</Label>
                    <p className="text-sm text-muted-foreground">Receba alertas críticos por SMS</p>
                  </div>
                  <Switch id="sms-notifications" />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="maintenance-alerts">Alertas de Manutenção</Label>
                    <p className="text-sm text-muted-foreground">Notificações sobre manutenção de máquinas</p>
                  </div>
                  <Switch id="maintenance-alerts" defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="performance-reports">Relatórios de Performance</Label>
                    <p className="text-sm text-muted-foreground">Relatórios semanais de desempenho</p>
                  </div>
                  <Switch id="performance-reports" defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Segurança da Conta</CardTitle>
              <CardDescription>Gerencie suas configurações de segurança e privacidade</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Senha Atual</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9 pr-9"
                    />
                    <Button
                      size="icon"
                      variant="ghost"
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="new-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar Nova Senha</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirm-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      className="pl-9"
                    />
                  </div>
                </div>

                <Button className="w-full">Atualizar Senha</Button>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <Label>Autenticação de Dois Fatores</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Adicione uma camada extra de segurança</p>
                  </div>
                  <Switch />
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-2">Sessões Ativas</h4>
                  <div className="space-y-2">
                    {[
                      { device: "Chrome - Windows", location: "São Paulo, Brasil", time: "Agora" },
                      { device: "Safari - iPhone", location: "São Paulo, Brasil", time: "Há 2 horas" },
                    ].map((session, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium">{session.device}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.location} • {session.time}
                          </p>
                        </div>
                        <Button size="sm" variant="outline">
                          Encerrar
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Tab */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações de Faturamento</CardTitle>
              <CardDescription>Gerencie seus métodos de pagamento e histórico</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-3">Métodos de Pagamento</h4>
                  <div className="space-y-2">
                    <div
                      className={cn(
                        "flex items-center justify-between p-4 rounded-lg border",
                        theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-blue-500/10">
                          <CreditCard className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Visa •••• 4242</p>
                          <p className="text-xs text-muted-foreground">Expira em 12/2025</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">Padrão</Badge>
                        <Button size="sm" variant="outline">
                          <Pencil className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full mt-3">
                    Adicionar Método de Pagamento
                  </Button>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Plano Atual</h4>
                  <div
                    className={cn(
                      "p-4 rounded-lg border",
                      theme === "light"
                        ? "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200"
                        : "bg-gradient-to-br from-blue-950/30 to-indigo-950/30 border-blue-900/30"
                    )}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-lg font-bold">Plano Professional</h3>
                        <p className="text-sm text-muted-foreground">Acesso completo a todos os recursos avançados</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">R$ 299</p>
                        <p className="text-xs text-muted-foreground">por mês</p>
                      </div>
                    </div>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Próxima cobrança</span>
                        <span className="font-medium">15 Jan 2025</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Máquinas monitoradas</span>
                        <span className="font-medium">24 de 50</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Localizações ativas</span>
                        <span className="font-medium">3 de 5</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button className="flex-1" onClick={() => router.push("/dashboard/pricing")}>
                        Alterar Plano
                      </Button>
                      <Button variant="outline" className="flex-1">
                        Cancelar Plano
                      </Button>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h4 className="text-sm font-medium mb-3">Histórico de Pagamentos</h4>
                  <div className="space-y-2">
                    {[
                      { date: "15 Dez 2024", amount: "R$ 199,00", status: "Pago" },
                      { date: "15 Nov 2024", amount: "R$ 199,00", status: "Pago" },
                      { date: "15 Out 2024", amount: "R$ 199,00", status: "Pago" },
                    ].map((payment, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "flex items-center justify-between p-3 rounded-lg border",
                          theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900/50 border-slate-700"
                        )}
                      >
                        <div>
                          <p className="text-sm font-medium">{payment.date}</p>
                          <p className="text-xs text-muted-foreground">Plano Premium</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-medium">{payment.amount}</p>
                          <Badge className="bg-green-500">{payment.status}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Preferências do Sistema</CardTitle>
              <CardDescription>Personalize sua experiência na plataforma</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Idioma</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Select defaultValue="pt-br">
                      <SelectTrigger className="pl-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pt-br">Português (Brasil)</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuso Horário</Label>
                  <Select defaultValue="america-sao-paulo">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america-sao-paulo">América/São Paulo (GMT-3)</SelectItem>
                      <SelectItem value="america-new-york">América/Nova York (GMT-5)</SelectItem>
                      <SelectItem value="europe-london">Europa/Londres (GMT+0)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="date-format">Formato de Data</Label>
                  <Select defaultValue="dd-mm-yyyy">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                      <SelectItem value="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                      <SelectItem value="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-muted-foreground" />
                      <Label>Animações da Interface</Label>
                    </div>
                    <p className="text-sm text-muted-foreground">Habilitar animações e transições</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Som de Notificações</Label>
                    <p className="text-sm text-muted-foreground">Reproduzir som ao receber notificações</p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Modo Compacto</Label>
                    <p className="text-sm text-muted-foreground">Reduzir espaçamento da interface</p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Dados e Privacidade</CardTitle>
              <CardDescription>Controle como seus dados são utilizados</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Coletar Dados de Uso</Label>
                  <p className="text-sm text-muted-foreground">Ajude-nos a melhorar o produto</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Permitir Cookies</Label>
                  <p className="text-sm text-muted-foreground">Necessário para algumas funcionalidades</p>
                </div>
                <Switch defaultChecked />
              </div>

              <Separator />

              <div className="space-y-3">
                <Button variant="outline" className="w-full">
                  Exportar Meus Dados
                </Button>
                <Button variant="destructive" className="w-full">
                  Excluir Minha Conta
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
