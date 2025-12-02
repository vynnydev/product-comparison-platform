"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Factory, Zap, Crown, ArrowLeft } from 'lucide-react'
import Link from "next/link"
import { useRouter } from 'next/navigation'
import { useTheme } from "@/contexts/theme-context"
import cn from "classnames"

export default function PricingPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [currentPlan, setCurrentPlan] = useState<string>("professional") // This would come from API/context
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly")

  const plans = [
    {
      id: "starter",
      name: "Plano Starter",
      icon: Factory,
      monthlyPrice: 99,
      yearlyPrice: 990,
      description: "Ideal para pequenas operações e oficinas iniciantes",
      features: [
        "Até 10 máquinas monitoradas",
        "Análises básicas de performance",
        "Relatórios semanais",
        "Alertas de manutenção básicos",
        "1 oficina/localização",
        "Suporte por email",
        "Armazenamento de 30 dias",
      ],
      color: "from-slate-100 to-slate-200",
      darkColor: "from-slate-800 to-slate-900",
      borderColor: "border-slate-300",
      darkBorderColor: "dark:border-slate-700",
    },
    {
      id: "professional",
      name: "Plano Professional",
      icon: Zap,
      monthlyPrice: 299,
      yearlyPrice: 2990,
      description: "Perfeito para operações em crescimento com múltiplas máquinas",
      popular: true,
      features: [
        "Até 50 máquinas monitoradas",
        "Análises avançadas com IA",
        "Relatórios personalizados diários",
        "Alertas preditivos inteligentes",
        "Até 5 oficinas/localizações",
        "Automação de agendamentos",
        "Monitoramento em tempo real 3D",
        "Suporte prioritário 24/7",
        "Armazenamento de 1 ano",
        "Integrações com sistemas externos",
      ],
      color: "from-blue-500 via-purple-500 to-pink-500",
      borderColor: "border-blue-500",
    },
    {
      id: "enterprise",
      name: "Plano Enterprise",
      icon: Crown,
      monthlyPrice: 699,
      yearlyPrice: 6990,
      description: "Solução completa para grandes operações industriais",
      features: [
        "Máquinas ilimitadas",
        "Todos os recursos Professional",
        "IA avançada com deep learning",
        "Análise preditiva de falhas",
        "Localizações ilimitadas",
        "Gerente de conta dedicado",
        "Treinamento personalizado",
        "SLA garantido 99.9%",
        "Armazenamento ilimitado",
        "API personalizada",
        "Consultoria estratégica mensal",
        "Implementação assistida",
      ],
      color: "from-amber-100 to-orange-200",
      darkColor: "from-amber-900/30 to-orange-900/30",
      borderColor: "border-amber-300",
      darkBorderColor: "dark:border-amber-700",
    },
  ]

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId)
    // Navigate to payment page with selected plan
    router.push(`/dashboard/payment?plan=${planId}&billing=${billingCycle}`)
  }

  const getPrice = (plan: typeof plans[0]) => {
    return billingCycle === "monthly" ? plan.monthlyPrice : plan.yearlyPrice
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-gray-900 dark:to-gray-950 space-y-8 p-6">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="flex justify-center">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar ao Dashboard
          </Link>
        </div>
        
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-xl">
          <Factory className="w-12 h-12 text-white" />
        </div>

        <h1 className="text-4xl md:text-5xl font-bold text-foreground">
          Potencialize Suas Operações com IA
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Escolha o plano ideal para sua operação, ou{" "}
          <Link href="/contact" className="text-blue-600 hover:text-blue-700 font-medium">
            fale conosco
          </Link>{" "}
          para encontrá-lo
        </p>

        {/* Billing Toggle */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button
            onClick={() => setBillingCycle("monthly")}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-all",
              billingCycle === "monthly"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-700"
            )}
          >
            Mensal
          </button>
          <button
            onClick={() => setBillingCycle("yearly")}
            className={cn(
              "px-6 py-2 rounded-lg font-medium transition-all relative",
              billingCycle === "yearly"
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white dark:bg-slate-800 text-muted-foreground hover:bg-slate-50 dark:hover:bg-slate-700"
            )}
          >
            Anual
            <Badge className="absolute -top-2 -right-2 bg-green-500 text-white text-xs">-17%</Badge>
          </button>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {plans.map((plan) => {
          const Icon = plan.icon
          const isPopular = plan.popular
          const price = getPrice(plan)

          return (
            <Card
              key={plan.id}
              className={cn(
                "relative overflow-hidden transition-all duration-300 hover:scale-105",
                isPopular
                  ? "shadow-2xl ring-2 ring-blue-500 dark:ring-purple-500"
                  : "shadow-lg hover:shadow-xl",
                selectedPlan === plan.id && "ring-4 ring-green-500"
              )}
            >
              {isPopular && (
                <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />
              )}

              {/* Card Header */}
              <div
                className={cn(
                  "p-8",
                  isPopular
                    ? "bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 text-white"
                    : theme === "light"
                    ? `bg-gradient-to-br ${plan.color}`
                    : `bg-gradient-to-br ${plan.darkColor || plan.color}`
                )}
              >
                <div className="flex items-center justify-between mb-4">
                  <div
                    className={cn(
                      "p-3 rounded-xl",
                      isPopular ? "bg-white/20" : "bg-white/50 dark:bg-slate-800/50"
                    )}
                  >
                    <Icon className={cn("w-8 h-8", isPopular ? "text-white" : "text-foreground")} />
                  </div>
                  {isPopular && (
                    <Badge className="bg-white text-purple-700 hover:bg-white font-semibold">Popular</Badge>
                  )}
                </div>

                <h3
                  className={cn(
                    "text-2xl font-bold mb-2",
                    isPopular ? "text-white" : "text-foreground"
                  )}
                >
                  {plan.name}
                </h3>
                <p
                  className={cn(
                    "text-sm mb-6",
                    isPopular ? "text-white/90" : "text-muted-foreground"
                  )}
                >
                  {plan.description}
                </p>

                <div className="flex items-baseline gap-2">
                  <span
                    className={cn(
                      "text-5xl font-bold",
                      isPopular ? "text-white" : "text-foreground"
                    )}
                  >
                    R$ {price}
                  </span>
                  <span
                    className={cn(
                      "text-lg",
                      isPopular ? "text-white/80" : "text-muted-foreground"
                    )}
                  >
                    /{billingCycle === "monthly" ? "mês" : "ano"}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-8 bg-white dark:bg-slate-900">
                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <div
                        className={cn(
                          "mt-0.5 p-1 rounded-full shrink-0",
                          isPopular
                            ? "bg-gradient-to-br from-blue-500 to-purple-500"
                            : "bg-green-500"
                        )}
                      >
                        <Check className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm text-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  disabled={currentPlan === plan.id}
                  className={cn(
                    "w-full h-12 font-semibold text-base transition-all",
                    currentPlan === plan.id
                      ? "bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 cursor-not-allowed"
                      : isPopular
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  )}
                >
                  {currentPlan === plan.id ? "Plano Atual ✓" : "Escolher Plano"}
                </Button>
              </div>
            </Card>
          )
        })}
      </div>

      {/* Footer Info */}
      <div className="text-center space-y-4">
        <p className="text-sm text-muted-foreground">
          Todos os planos incluem período de teste gratuito de 14 dias. Cancele a qualquer momento.
        </p>
        <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Sem cartão de crédito necessário</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Suporte em português</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-green-500" />
            <span>Garantia de reembolso</span>
          </div>
        </div>
      </div>
    </div>
  )
}
