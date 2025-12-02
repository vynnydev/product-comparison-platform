"use client"

import { useState, useEffect } from "react"
import { AnimatePresence } from "framer-motion"
import { Sparkles, Brain, Zap, CheckCircle } from "lucide-react"

interface AIAnalysisOverlayProps {
  isActive: boolean
  machineName: string
  onComplete?: () => void
}

export function AIAnalysisOverlay({ isActive, machineName, onComplete }: AIAnalysisOverlayProps) {
  const [analysisStep, setAnalysisStep] = useState(0)

  const analysisSteps = [
    { text: "Iniciando varredura completa da máquina...", icon: Sparkles },
    { text: "Analisando componentes críticos...", icon: Brain },
    { text: "Processando dados de sensores...", icon: Zap },
    { text: "Gerando recomendações preditivas...", icon: Brain },
    { text: "Análise completa!", icon: CheckCircle },
  ]

  useEffect(() => {
    if (!isActive) {
      setAnalysisStep(0)
      return
    }

    const interval = setInterval(() => {
      setAnalysisStep((prev) => {
        if (prev < analysisSteps.length - 1) {
          return prev + 1
        } else {
          clearInterval(interval)
          setTimeout(() => onComplete?.(), 1500)
          return prev
        }
      })
    }, 2000)

    return () => clearInterval(interval)
  }, [isActive])

  if (!isActive) return null

  const CurrentIcon = analysisSteps[analysisStep]?.icon || Sparkles

  return <AnimatePresence></AnimatePresence>
}
