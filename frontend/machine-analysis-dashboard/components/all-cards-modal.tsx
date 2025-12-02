"use client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, CreditCard, MoreVertical, Trash2, Star } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface Card {
  id: string
  cardholderName: string
  last4: string
  expiryMonth: string
  expiryYear: string
  cardType: string
  isDefault: boolean
}

interface AllCardsModalProps {
  isOpen: boolean
  onClose: () => void
  cards: Card[]
  onSetDefault: (cardId: string) => void
  onDeleteCard: (cardId: string) => void
}

export function AllCardsModal({ isOpen, onClose, cards, onSetDefault, onDeleteCard }: AllCardsModalProps) {
  if (!isOpen) return null

  const getCardColor = (cardType: string, index: number) => {
    const colors = [
      "from-blue-500 to-blue-700",
      "from-purple-500 to-purple-700",
      "from-green-500 to-green-700",
      "from-orange-500 to-orange-700",
      "from-pink-500 to-pink-700",
      "from-indigo-500 to-indigo-700",
    ]
    return colors[index % colors.length]
  }

  const getCardBrandColor = (cardType: string) => {
    switch (cardType.toLowerCase()) {
      case "visa":
        return "text-white"
      case "mastercard":
        return "text-white"
      case "amex":
        return "text-white"
      default:
        return "text-white"
    }
  }

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-5xl max-h-[90vh] z-50 overflow-hidden">
        <div className="bg-background dark:bg-gray-900 rounded-lg shadow-2xl border border-border flex flex-col max-h-[90vh]">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border flex-shrink-0">
            <div>
              <h2 className="text-2xl font-semibold">Meus Cartões</h2>
              <p className="text-sm text-muted-foreground mt-1">Gerencie seus métodos de pagamento cadastrados</p>
            </div>
            <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Cards Grid */}
          <div className="flex-1 overflow-y-auto p-6">
            {cards.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <CreditCard className="w-16 h-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Nenhum cartão cadastrado</h3>
                <p className="text-sm text-muted-foreground">Adicione um cartão para começar a usar</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cards.map((card, index) => (
                  <div key={card.id} className="relative group">
                    {/* Card Design */}
                    <div
                      className={`relative bg-gradient-to-br ${getCardColor(card.cardType, index)} rounded-2xl p-6 h-52 flex flex-col justify-between text-white shadow-lg hover:shadow-xl transition-shadow`}
                    >
                      {/* Card Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2">
                          <CreditCard className="w-8 h-8 opacity-80" />
                          {card.isDefault && (
                            <Badge className="bg-yellow-500 text-black border-0">
                              <Star className="w-3 h-3 mr-1 fill-current" />
                              Padrão
                            </Badge>
                          )}
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-white hover:bg-white/20">
                              <MoreVertical className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {!card.isDefault && (
                              <DropdownMenuItem onClick={() => onSetDefault(card.id)}>
                                <Star className="w-4 h-4 mr-2" />
                                Definir como padrão
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuItem onClick={() => onDeleteCard(card.id)} className="text-red-600">
                              <Trash2 className="w-4 h-4 mr-2" />
                              Remover cartão
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      {/* Card Number */}
                      <div className="space-y-2">
                        <div className="flex items-center gap-3 text-lg font-mono tracking-wider">
                          <span>••••</span>
                          <span>••••</span>
                          <span>••••</span>
                          <span className="font-semibold">{card.last4}</span>
                        </div>
                      </div>

                      {/* Card Footer */}
                      <div className="flex items-end justify-between">
                        <div>
                          <p className="text-xs opacity-80 mb-1">Nome do Titular</p>
                          <p className="font-semibold text-sm">{card.cardholderName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs opacity-80 mb-1">Validade</p>
                          <p className="font-mono text-sm">
                            {card.expiryMonth}/{card.expiryYear}
                          </p>
                        </div>
                      </div>

                      {/* Card Brand */}
                      <div className="absolute top-6 right-6">
                        <span className={`text-2xl font-bold ${getCardBrandColor(card.cardType)} uppercase`}>
                          {card.cardType}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-border flex-shrink-0 bg-muted/30 dark:bg-gray-800/30">
            <p className="text-sm text-muted-foreground">
              Total de {cards.length} {cards.length === 1 ? "cartão" : "cartões"} cadastrado
              {cards.length !== 1 ? "s" : ""}
            </p>
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </div>
      </div>
    </>
  )
}
