"use client"

import { X, Send, Sparkles, Mic, Paperclip, Image, Activity, Wrench, BarChart3, AlertCircle, FileText, Zap, Home } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState, useEffect, useRef } from "react"

interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: Date
  isTyping?: boolean
}

interface AIAssistantPopupProps {
  open: boolean
  onClose: () => void
}

const quickActions = [
  {
    id: "analyze-machines",
    icon: Activity,
    title: "Analisar Máquinas",
    description: "Análise detalhada do status e performance das suas máquinas industriais",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    id: "maintenance-schedule",
    icon: Wrench,
    title: "Agendar Manutenção",
    description: "Criar cronograma de manutenção preventiva baseado em dados históricos",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    id: "generate-report",
    icon: BarChart3,
    title: "Gerar Relatório",
    description: "Relatórios detalhados de produção e eficiência operacional",
    gradient: "from-orange-500 to-red-500",
  },
  {
    id: "diagnose-issues",
    icon: AlertCircle,
    title: "Diagnosticar Problemas",
    description: "Identificar e resolver problemas em tempo real com IA preditiva",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    id: "workflow-automation",
    icon: Zap,
    title: "Automatizar Fluxos",
    description: "Criar automações inteligentes para processos repetitivos",
    gradient: "from-violet-500 to-purple-500",
  },
  {
    id: "documentation",
    icon: FileText,
    title: "Consultar Docs",
    description: "Buscar informações sobre funcionalidades e recursos do sistema",
    gradient: "from-amber-500 to-yellow-500",
  },
]

function TypingMessage({ content }: { content: string }) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (currentIndex < content.length) {
      const timeout = setTimeout(() => {
        setDisplayedContent(prev => prev + content[currentIndex])
        setCurrentIndex(prev => prev + 1)
      }, 30) // Speed of typing animation
      
      return () => clearTimeout(timeout)
    }
  }, [currentIndex, content])

  return <span>{displayedContent}</span>
}

export function AIAssistantPopup({ open, onClose }: AIAssistantPopupProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Olá! Sou seu assistente de IA da Cognitiva Analytics. Posso ajudá-lo com análises de máquinas, diagnósticos, agendamento de manutenções e muito mais. Como posso ajudar?",
      timestamp: new Date(),
      isTyping: false,
    },
  ])
  const [input, setInput] = useState("")
  const [showQuickActions, setShowQuickActions] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const sendMessage = (content?: string) => {
    const messageContent = content || input
    if (!messageContent.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageContent,
      timestamp: new Date(),
      isTyping: false,
    }

    setMessages([...messages, userMessage])
    setInput("")
    setShowQuickActions(false)

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          "Entendi sua solicitação. Estou analisando os dados das suas máquinas e oficinas para fornecer a melhor resposta. Por favor, aguarde um momento...",
        timestamp: new Date(),
        isTyping: true, // Enable typing animation
      }
      setMessages((prev) => [...prev, assistantMessage])
    }, 1000)
  }

  const handleQuickAction = (action: typeof quickActions[0]) => {
    const contextMessages = {
      "analyze-machines": "Quero fazer uma análise detalhada das minhas máquinas. Mostre-me o status atual, performance e possíveis problemas.",
      "maintenance-schedule": "Preciso criar um cronograma de manutenção preventiva para todas as minhas máquinas baseado no histórico de uso.",
      "generate-report": "Gere um relatório completo sobre a produção, eficiência e tempo de atividade das máquinas neste mês.",
      "diagnose-issues": "Diagnostique todos os problemas atuais nas máquinas e sugira soluções com base nos dados disponíveis.",
      "workflow-automation": "Quero automatizar os processos de notificação e agendamento de manutenção. Como posso fazer isso?",
      "documentation": "Preciso de ajuda para entender todas as funcionalidades disponíveis no sistema Cognitiva Analytics.",
    }
    
    sendMessage(contextMessages[action.id as keyof typeof contextMessages])
  }

  const resetToInitialState = () => {
    setMessages([
      {
        id: "1",
        role: "assistant",
        content:
          "Olá! Sou seu assistente de IA da Cognitiva Analytics. Posso ajudá-lo com análises de máquinas, diagnósticos, agendamento de manutenções e muito mais. Como posso ajudar?",
        timestamp: new Date(),
        isTyping: false,
      },
    ])
    setShowQuickActions(true)
    setInput("")
  }

  if (!open) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 backdrop-blur-md bg-black/40 dark:bg-black/60"
        onClick={onClose}
      />

      <div
        className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-6xl h-[90vh] rounded-3xl p-[3px] animate-in zoom-in-95 duration-300"
        style={{
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6, #ec4899, #f59e0b, #10b981, #06b6d4, #3b82f6)",
          backgroundSize: "400% 400%",
          animation: "rainbow-pulse 4s ease-in-out infinite", // Changed to pulsating animation
        }}
      >
        <style jsx>{`
          @keyframes rainbow-pulse {
            0%, 100% { 
              background-position: 0% 50%;
              opacity: 1;
            }
            25% {
              opacity: 0.8;
            }
            50% { 
              background-position: 100% 50%;
              opacity: 1;
            }
            75% {
              opacity: 0.8;
            }
          }
        `}</style>
        
        {/* Popup with glass effect */}
        <div
          className="w-full h-full rounded-3xl shadow-2xl bg-white dark:bg-gray-950"
          style={{
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
          }}
        >
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-blue-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white animate-pulse" />
                </div>
                <div>
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Assistente de IA</h2>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Cognitiva Analytics • Contexto completo da aplicação</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!showQuickActions && messages.length > 1 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetToInitialState}
                    className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 gap-2"
                  >
                    <Home className="h-4 w-4" />
                    Voltar ao Início
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {showQuickActions && messages.length === 1 && (
              <div className="p-6 border-b border-gray-200 dark:border-gray-800">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Ações Rápidas</h3>
                <div className="grid grid-cols-3 gap-3">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action)}
                      className="group relative p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 hover:border-transparent hover:shadow-lg transition-all duration-300 text-left overflow-hidden"
                    >
                      {/* Gradient background on hover */}
                      <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />
                      
                      <div className="relative z-10">
                        <div className={`h-10 w-10 rounded-lg bg-gradient-to-br ${action.gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300`}>
                          <action.icon className="h-5 w-5 text-white" />
                        </div>
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-1">{action.title}</h4>
                        <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2">{action.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[75%] rounded-2xl p-4 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white shadow-lg"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-700"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">
                      {message.role === "assistant" && message.isTyping ? (
                        <TypingMessage content={message.content} />
                      ) : (
                        message.content
                      )}
                    </p>
                    <p
                      className={`text-xs mt-2 ${message.role === "user" ? "text-purple-100" : "text-gray-500 dark:text-gray-400"}`}
                    >
                      {message.timestamp.toLocaleTimeString("pt-BR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-6 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <Paperclip className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <Image className="h-5 w-5" />
                </Button>
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                  placeholder="Digite sua mensagem sobre análise, manutenção ou diagnóstico..."
                  className="flex-1 bg-gray-50 dark:bg-gray-900 border-gray-300 dark:border-gray-700 text-gray-900 dark:text-white placeholder:text-gray-500 dark:placeholder:text-gray-400"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
                >
                  <Mic className="h-5 w-5" />
                </Button>
                <Button
                  onClick={() => sendMessage()}
                  className="bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-lg"
                >
                  <Send className="h-5 w-5" />
                </Button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                O assistente tem contexto completo da aplicação: máquinas, oficinas, tarefas, relatórios e análises
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
