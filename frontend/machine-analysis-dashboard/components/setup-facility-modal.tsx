"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SetupFacilityModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  existingData?: any
}

export function SetupFacilityModal({ open, onClose, onSave, existingData }: SetupFacilityModalProps) {
  const [formData, setFormData] = useState({
    name: existingData?.name || "",
    type: existingData?.type || "oficina",
    address: existingData?.address || "",
    corridors: existingData?.corridors || 3,
    zones: existingData?.zones || ["Zone T1", "Zone T2", "Zone T3"],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Configurar Ambiente de Trabalho</h2>
            <p className="text-sm text-muted-foreground mt-1">Configure as informações do seu local de trabalho</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informações Básicas</h3>

            <div className="space-y-2">
              <Label htmlFor="name">Nome do Local</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Oficina Centro Automotiva"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Tipo de Estabelecimento</Label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm"
                required
              >
                <option value="oficina">Oficina</option>
                <option value="industria">Indústria</option>
                <option value="galpao">Galpão</option>
                <option value="fabrica">Fábrica</option>
                <option value="armazem">Armazém</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Endereço</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                placeholder="Rua, número, bairro, cidade"
                required
              />
            </div>
          </div>

          {/* Layout Configuration */}
          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Configuração de Layout</h3>

            <div className="space-y-2">
              <Label htmlFor="corridors">Número de Corredores</Label>
              <Input
                id="corridors"
                type="number"
                min="1"
                max="10"
                value={formData.corridors}
                onChange={(e) => setFormData({ ...formData, corridors: Number.parseInt(e.target.value) })}
                required
              />
              <p className="text-xs text-muted-foreground">
                Quantidade de corredores ou divisões no seu estabelecimento
              </p>
            </div>

            <div className="space-y-2">
              <Label>Zonas de Trabalho</Label>
              <div className="flex gap-2">
                {formData.zones.map((zone, index) => (
                  <div key={index} className="px-3 py-1 bg-muted rounded-lg text-sm">
                    {zone}
                  </div>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Zonas padrão criadas automaticamente. Você pode adicionar mais depois.
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              Salvar Configuração
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
