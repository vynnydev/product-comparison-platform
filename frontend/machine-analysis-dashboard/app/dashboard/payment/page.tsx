"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Shield, Lock, CheckCircle2, Eye, EyeOff, Plus } from "lucide-react"
import Link from "next/link"
import cn from "classnames"
import { AddCardModal } from "@/components/add-card-modal"
import { AllCardsModal } from "@/components/all-cards-modal"

interface CardType {
  id: string
  cardholderName: string
  last4: string
  expiryMonth: string
  expiryYear: string
  cardType: string
  isDefault: boolean
}

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("credit-card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentSuccess, setPaymentSuccess] = useState(false)
  const [balanceVisible, setBalanceVisible] = useState(false)
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false)
  const [isAllCardsModalOpen, setIsAllCardsModalOpen] = useState(false)
  const [cards, setCards] = useState<CardType[]>([
    {
      id: "1",
      cardholderName: "João Silva",
      last4: "4562",
      expiryMonth: "02",
      expiryYear: "27",
      cardType: "mastercard",
      isDefault: true,
    },
    {
      id: "2",
      cardholderName: "João Silva",
      last4: "7710",
      expiryMonth: "05",
      expiryYear: "26",
      cardType: "visa",
      isDefault: false,
    },
  ])

  const planId = searchParams.get("plan") || "professional"
  const billingCycle = searchParams.get("billing") || "monthly"
  const balance = 12450.75

  // Plan details
  const planDetails = {
    starter: {
      name: "Plano Starter",
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: "Acesso limitado ao catálogo de templates e edição básica",
    },
    professional: {
      name: "Plano Professional",
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: "Acesso completo a recursos avançados e análises com IA",
    },
    enterprise: {
      name: "Plano Enterprise",
      monthlyPrice: 699,
      yearlyPrice: 6990,
      description: "Solução completa com suporte prioritário e recursos ilimitados",
    },
  }

  const selectedPlanDetails = planDetails[planId as keyof typeof planDetails] || planDetails.professional
  const price = billingCycle === "monthly" ? selectedPlanDetails.monthlyPrice : selectedPlanDetails.yearlyPrice
  const discount = 0
  const total = price - discount

  const currentDate = new Date()
  const formattedDate = currentDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const formattedTime = currentDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  const handleAddCard = (newCard: CardType) => {
    console.log("[v0] Adding new card:", newCard)
    setCards([...cards, newCard])
  }

  const handleSetDefault = (cardId: string) => {
    console.log("[v0] Setting default card:", cardId)
    setCards(
      cards.map((card) => ({
        ...card,
        isDefault: card.id === cardId,
      })),
    )
  }

  const handleDeleteCard = (cardId: string) => {
    console.log("[v0] Deleting card:", cardId)
    if (cards.length === 1) {
      alert("Você deve manter pelo menos um cartão cadastrado")
      return
    }
    setCards(cards.filter((card) => card.id !== cardId))
  }

  const getCardColor = (cardType: string, index: number) => {
    if (index === 0) return "from-blue-500 to-blue-700"
    return "from-purple-500 to-purple-700"
  }

  const handlePayment = async () => {
    setIsProcessing(true)
    // Simulate payment processing
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsProcessing(false)
    setPaymentSuccess(true)

    // Redirect to dashboard after success
    setTimeout(() => {
      router.push("/dashboard")
    }, 2000)
  }

  if (paymentSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 p-6">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-500 rounded-full mb-4">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-2xl font-bold mb-2">Pagamento Confirmado!</h2>
          <p className="text-muted-foreground mb-6">Seu plano foi ativado com sucesso. Redirecionando...</p>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Faturamento</h1>
          <p className="text-muted-foreground">Gerencie pagamentos, cartões e acompanhe despesas de manutenção</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <Card className="relative overflow-hidden bg-gradient-to-br from-blue-600 to-indigo-700 text-white p-6 border-0">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <p className="text-sm opacity-90 mb-2">Saldo Disponível</p>
                  <h2 className="text-4xl font-bold">{balanceVisible ? `R$ ${balance.toFixed(2)}` : "R$ ••••••"}</h2>
                </div>
                <button
                  onClick={() => setBalanceVisible(!balanceVisible)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  {balanceVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="flex items-center gap-2 text-sm mb-6">
                <CreditCard className="w-4 h-4" />
                <span className="opacity-90">Cartão de Crédito</span>
              </div>

              {/* Simple trend line */}
              <div className="h-16 flex items-end gap-1">
                {[40, 55, 45, 70, 65, 80, 75, 90, 85, 95, 88, 100].map((height, i) => (
                  <div key={i} className="flex-1 bg-white/30 rounded-t" style={{ height: `${height}%` }} />
                ))}
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-white/20">
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Solicitar
                </Button>
                <Button variant="secondary" className="bg-white/10 hover:bg-white/20 text-white border-white/20">
                  Enviar
                </Button>
              </div>
            </Card>
          </div>

          {/* Payment Form - Left Side */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold">Opções de Pagamento</h2>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="w-4 h-4" />
                  <span>Servidor seguro</span>
                </div>
              </div>

              <RadioGroup value={selectedPaymentMethod} onValueChange={setSelectedPaymentMethod} className="space-y-4">
                {/* Credit Card Option */}
                <div
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    selectedPaymentMethod === "credit-card"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : "border-border hover:border-blue-300",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="credit-card" id="credit-card" className="mt-1" />
                    <Label htmlFor="credit-card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">Cartão de Crédito / Débito</span>
                        <div className="flex gap-2">
                          <img src="/placeholder.svg?height=24&width=38&text=VISA" alt="Visa" className="h-6" />
                          <img src="/placeholder.svg?height=24&width=38&text=MC" alt="Mastercard" className="h-6" />
                          <img src="/placeholder.svg?height=24&width=38&text=AMEX" alt="Amex" className="h-6" />
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">Transferência segura usando sua conta bancária</p>

                      {selectedPaymentMethod === "credit-card" && (
                        <div className="mt-4 space-y-4 border-t pt-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <Label htmlFor="firstName">Nome(s)</Label>
                              <Input id="firstName" placeholder="Ana Laura" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="lastName">Sobrenome</Label>
                              <Input id="lastName" placeholder="López Hernández" />
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-2 space-y-2">
                              <Label htmlFor="cardNumber">Número do Cartão</Label>
                              <div className="relative">
                                <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="cardNumber"
                                  placeholder="1234 1234 1234 1234"
                                  className="pl-10"
                                  maxLength={19}
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="expiration">Validade</Label>
                              <Input id="expiration" placeholder="MM/AA" maxLength={5} />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Label htmlFor="cvv">CVV</Label>
                                <Lock className="w-3 h-3 text-muted-foreground" />
                              </div>
                              <Input id="cvv" placeholder="•••" maxLength={4} type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="postalCode">CEP</Label>
                              <Input id="postalCode" placeholder="45090" />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input id="email" type="email" placeholder="al@gmail.com" />
                          </div>
                        </div>
                      )}
                    </Label>
                  </div>
                </div>

                {/* PayPal Option */}
                <div
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    selectedPaymentMethod === "paypal"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : "border-border hover:border-blue-300",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="paypal" id="paypal" className="mt-1" />
                    <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">PayPal</span>
                        <img src="/placeholder.svg?height=24&width=80&text=PayPal" alt="PayPal" className="h-6" />
                      </div>
                      <p className="text-sm text-muted-foreground">Pagamento online seguro através do portal PayPal</p>
                    </Label>
                  </div>
                </div>

                {/* PIX Option */}
                <div
                  className={cn(
                    "relative border rounded-lg p-4 cursor-pointer transition-all",
                    selectedPaymentMethod === "pix"
                      ? "border-blue-500 bg-blue-50/50 dark:bg-blue-950/20"
                      : "border-border hover:border-blue-300",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <RadioGroupItem value="pix" id="pix" className="mt-1" />
                    <Label htmlFor="pix" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">PIX</span>
                        <Badge variant="secondary">Aprovação Instantânea</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pagamento instantâneo via PIX - QR Code gerado após confirmação
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </Card>
          </div>

          {/* Payment Summary - Right Side */}
          <div className="lg:col-span-1">
            <Card className="p-6 bg-gradient-to-br from-blue-600 to-purple-600 text-white sticky top-6">
              <h2 className="text-xl font-semibold mb-6">Resumo do Pagamento</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold mb-1">{selectedPlanDetails.name}</h3>
                  <p className="text-sm text-white/80">{selectedPlanDetails.description}</p>
                </div>

                <div className="border-t border-white/20 pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Data da transação:</span>
                    <span>{formattedDate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Horário:</span>
                    <span>{formattedTime}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Período:</span>
                    <span>{billingCycle === "monthly" ? "Mensal" : "Anual"}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4 space-y-2">
                  <div className="flex justify-between text-lg">
                    <span className="text-white/80">Subtotal:</span>
                    <span className="font-semibold">R$ {price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-white/80">Desconto:</span>
                    <span>R$ {discount.toFixed(2)}</span>
                  </div>
                </div>

                <div className="border-t border-white/20 pt-4">
                  <div className="flex justify-between text-xl font-bold">
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full h-12 bg-white text-blue-600 hover:bg-white/90 font-semibold mt-6"
                >
                  {isProcessing ? "Processando..." : "Confirmar Pagamento"}
                </Button>

                <p className="text-xs text-white/60 text-center mt-4">
                  Ao confirmar, você concorda com nossos{" "}
                  <Link href="/terms" className="underline hover:text-white">
                    Termos de Serviço
                  </Link>
                </p>
              </div>
            </Card>
          </div>

          {/* Cards Section */}
          <div className="lg:col-span-1">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-lg font-semibold">Meus Cartões</h3>
                  <p className="text-sm text-muted-foreground">Gerencie seus métodos de pagamento</p>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    console.log("[v0] Add card button clicked")
                    setIsAddCardModalOpen(true)
                  }}
                  className="gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Adicionar
                </Button>
              </div>

              <div className="space-y-4">
                {/* Display first 2 cards */}
                {cards.slice(0, 2).map((card, index) => (
                  <div
                    key={card.id}
                    className={`relative bg-gradient-to-br ${getCardColor(card.cardType, index)} rounded-xl p-4 text-white`}
                  >
                    {card.isDefault && (
                      <Badge className="absolute top-3 right-3 bg-yellow-500 text-black border-0 text-xs">Padrão</Badge>
                    )}

                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-7 bg-yellow-400 rounded flex items-center justify-center">
                        <CreditCard className="w-5 h-5 text-yellow-800" />
                      </div>
                      <div className="w-10 h-7 bg-white/20 rounded" />
                    </div>

                    <div className="flex items-center gap-2 mb-4 text-lg font-mono tracking-wider">
                      <span>••••</span>
                      <span>••••</span>
                      <span>••••</span>
                      <span className="font-semibold">{card.last4}</span>
                    </div>

                    <div className="flex items-end justify-between text-sm">
                      <div className="bg-yellow-400 text-black px-3 py-1.5 rounded">
                        <p className="text-xs opacity-80">Nome do Titular</p>
                        <p className="font-semibold">{card.cardholderName}</p>
                      </div>
                      <div className="bg-yellow-400 text-black px-3 py-1.5 rounded">
                        <p className="text-xs opacity-80">Validade</p>
                        <p className="font-semibold">
                          {card.expiryMonth}/{card.expiryYear}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-4 right-4">
                      <span className="text-xl font-bold uppercase">{card.cardType}</span>
                    </div>
                  </div>
                ))}
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 bg-transparent"
                onClick={() => {
                  console.log("[v0] View all cards button clicked")
                  setIsAllCardsModalOpen(true)
                }}
              >
                Ver todos os cartões
              </Button>
            </Card>
          </div>
        </div>
      </div>

      {console.log("[v0] Modal states - AddCard:", isAddCardModalOpen, "AllCards:", isAllCardsModalOpen)}

      <AddCardModal
        isOpen={isAddCardModalOpen}
        onClose={() => {
          console.log("[v0] Closing add card modal")
          setIsAddCardModalOpen(false)
        }}
        onAddCard={handleAddCard}
      />

      <AllCardsModal
        isOpen={isAllCardsModalOpen}
        onClose={() => {
          console.log("[v0] Closing all cards modal")
          setIsAllCardsModalOpen(false)
        }}
        cards={cards}
        onSetDefault={handleSetDefault}
        onDeleteCard={handleDeleteCard}
      />
    </div>
  )
}
