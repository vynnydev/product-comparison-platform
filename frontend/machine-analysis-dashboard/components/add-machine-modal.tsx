"use client"

import type React from "react"
import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface AddMachineModalProps {
  open: boolean
  onClose: () => void
  onSave: (data: any) => void
  facility: any
}

export function AddMachineModal({ open, onClose, onSave, facility }: AddMachineModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "bomba",
    status: "operating",
    corridor: 1,
    position: { x: 1, y: 1 },
    metrics: {
      efficiency: 85,
      performance: 90,
      quality: 95,
      availability: 90,
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
    // Reset form
    setFormData({
      name: "",
      type: "bomba",
      status: "operating",
      corridor: 1,
      position: { x: 1, y: 1 },
      metrics: {
        efficiency: 85,
        performance: 90,
        quality: 95,
        availability: 90,
      },
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative w-full max-w-2xl bg-background border border-border rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-background border-b border-border p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Adicionar Nova Máquina</h2>
            <p className="text-sm text-muted-foreground mt-1">Cadastre uma nova máquina no seu ambiente de trabalho</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Machine Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground">Informações da Máquina</h3>

            <div className="space-y-2">
              <Label htmlFor="machineName">Nome da Máquina</Label>
              <Input
                id="machineName"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Ex: Bomba Centrífuga BC-2000"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="machineType">Tipo de Máquina</Label>
              <select
                id="machineType"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm"
                required
              >
                <option value="bomba">Bomba</option>
                <option value="torno">Torno CNC</option>
                <option value="fresadora">Fresadora</option>
                <option value="prensa">Prensa</option>
                <option value="compressor">Compressor</option>
                <option value="gerador">Gerador</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status Inicial</Label>
              <select
                id="status"
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-3 py-2 bg-background border border-input rounded-lg text-sm"
                required
              >
                <option value="operating">Em Operação</option>
                <option value="maintenance">Em Manutenção</option>
                <option value="waiting">Aguardando Manutenção</option>
              </select>
            </div>
          </div>

          {/* Location */}
          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Localização</h3>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="corridor">Corredor</Label>
                <Input
                  id="corridor"
                  type="number"
                  min="1"
                  max={facility?.corridors || 10}
                  value={formData.corridor}
                  onChange={(e) => setFormData({ ...formData, corridor: Number.parseInt(e.target.value) })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posX">Posição X</Label>
                <Input
                  id="posX"
                  type="number"
                  min="1"
                  value={formData.position.x}
                  onChange={(e) =>
                    setFormData({ ...formData, position: { ...formData.position, x: Number.parseInt(e.target.value) } })
                  }
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="posY">Posição Y</Label>
                <Input
                  id="posY"
                  type="number"
                  min="1"
                  value={formData.position.y}
                  onChange={(e) =>
                    setFormData({ ...formData, position: { ...formData.position, y: Number.parseInt(e.target.value) } })
                  }
                  required
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Defina a localização exata da máquina no corredor</p>
          </div>

          {/* Initial Metrics */}
          <div className="space-y-4 border-t border-border pt-6">
            <h3 className="text-lg font-semibold text-foreground">Métricas Iniciais (Opcional)</h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="efficiency">Eficiência (%)</Label>
                <Input
                  id="efficiency"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.metrics.efficiency}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, efficiency: Number.parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="performance">Desempenho (%)</Label>
                <Input
                  id="performance"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.metrics.performance}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, performance: Number.parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="quality">Qualidade (%)</Label>
                <Input
                  id="quality"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.metrics.quality}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, quality: Number.parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="availability">Disponibilidade (%)</Label>
                <Input
                  id="availability"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.metrics.availability}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      metrics: { ...formData.metrics, availability: Number.parseFloat(e.target.value) },
                    })
                  }
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
              Adicionar Máquina
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
