"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Activity, Gauge, Zap, Sparkles, Brain } from 'lucide-react'
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import * as THREE from "three"

interface Machine {
  id: string
  name: string
  status: "running" | "idle" | "maintenance"
  task: string
  speed: number
  efficiency: number
  temperature: number
  location: string
}

interface MachinesCarouselProps {
  machines: Machine[]
}

// Componentes 3D (mantidos do original)
function RoboticArm() {
  return (
    <group position={[0, -0.5, 0]} scale={1.2}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.5, 0.6, 0.6, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} envMapIntensity={2} />
      </mesh>
      <mesh position={[0, 1.2, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.3, 1.5, 0.3]} />
        <meshStandardMaterial color="#fb923c" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[0.4, 2, 0]} castShadow>
        <sphereGeometry args={[0.25, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[1, 2.3, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color="#fb923c" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[1.5, 2.8, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[1.5, 3.1, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.25} />
      </mesh>
      <mesh position={[1.45, 3.3, 0.15]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
      </mesh>
      <mesh position={[1.55, 3.3, -0.15]} castShadow>
        <boxGeometry args={[0.08, 0.25, 0.08]} />
        <meshStandardMaterial color="#d97706" metalness={0.9} roughness={0.1} />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[-0.1 + i * 0.05, 1.5, 0.2]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.015, 0.015, 1.2, 8]} />
          <meshStandardMaterial color="#1a1a1a" metalness={0.3} roughness={0.8} />
        </mesh>
      ))}
    </group>
  )
}

function CNCLathe() {
  return (
    <group position={[0, -0.8, 0]} scale={0.35}>
      <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[6, 0.4, 2]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[5.5, 0.3, 0.8]} />
        <meshStandardMaterial color="#34495e" metalness={0.9} roughness={0.15} />
      </mesh>
      <mesh position={[-2.5, 1.2, 0]} castShadow>
        <boxGeometry args={[1, 1.5, 1.5]} />
        <meshStandardMaterial color="#2c3e50" metalness={0.85} roughness={0.2} />
      </mesh>
      <mesh position={[-3, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.4, 32]} />
        <meshStandardMaterial color="#1a1a1a" metalness={0.95} roughness={0.05} />
      </mesh>
      <mesh position={[-3.3, 1.2, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.4, 0.4, 0.25, 64]} />
        <meshStandardMaterial color="#95a5a6" metalness={0.95} roughness={0.1} envMapIntensity={2} />
      </mesh>
    </group>
  )
}

function CNCMillingMachine() {
  return (
    <group position={[0, -0.8, 0]} scale={0.4}>
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <boxGeometry args={[4, 0.6, 3.5]} />
        <meshStandardMaterial color="#2874a6" metalness={0.85} roughness={0.2} envMapIntensity={1.8} />
      </mesh>
      <mesh position={[0, 0.75, 0]} castShadow>
        <boxGeometry args={[3, 0.3, 2.5]} />
        <meshStandardMaterial color="#7f8c8d" metalness={0.9} roughness={0.15} envMapIntensity={2} />
      </mesh>
      <mesh position={[0, 2.5, -1.2]} castShadow>
        <boxGeometry args={[0.8, 3.5, 1.5]} />
        <meshStandardMaterial color="#2874a6" metalness={0.85} roughness={0.2} />
      </mesh>
    </group>
  )
}

function Machine3DModel({ machineName }: { machineName: string }) {
  if (machineName.includes("Robô") || machineName.includes("Robot")) {
    return <RoboticArm />
  } else if (machineName.includes("Torno") || machineName.includes("Lathe")) {
    return <CNCLathe />
  } else if (machineName.includes("Fresadora") || machineName.includes("Mill")) {
    return <CNCMillingMachine />
  }
  return <RoboticArm />
}

// Card individual de máquina
function MachineCard({ machine }: { machine: Machine }) {
  const [expanded, setExpanded] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)

  const statusColors = {
    running: "bg-green-500",
    idle: "bg-yellow-500",
    maintenance: "bg-red-500",
  }

  const statusLabels = {
    running: "Em Operação",
    idle: "Ocioso",
    maintenance: "Manutenção",
  }

  const handleAIAnalysis = (e: React.MouseEvent) => {
    e.stopPropagation()
    setAnalyzing(true)
    setTimeout(() => setAnalyzing(false), 3000)
  }

  return (
    <Card className={`w-full h-full overflow-hidden transition-all duration-300 hover:shadow-lg border-border/50 ${analyzing ? "ring-2 ring-purple-500" : ""}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{machine.name}</CardTitle>
            <p className="text-sm text-muted-foreground">{machine.location}</p>
          </div>
          <div className="flex flex-col gap-2 items-end">
            <Badge variant="outline" className="gap-1.5">
              <div className={`h-2 w-2 rounded-full ${statusColors[machine.status]} animate-pulse`} />
              {statusLabels[machine.status]}
            </Badge>
            {analyzing && (
              <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
                <Brain className="h-3 w-3" />
                Analisando...
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className={`relative bg-gradient-to-br from-background to-muted/30 rounded-lg overflow-hidden transition-all duration-300 ${expanded ? "h-64" : "h-32"}`}>
          {analyzing && (
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 animate-pulse z-10 pointer-events-none" />
          )}
          <Canvas shadows>
            <PerspectiveCamera makeDefault position={[3, 2, 3]} />
            <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={1} />
            <ambientLight intensity={0.3} />
            <directionalLight position={[10, 10, 5]} intensity={1.2} castShadow shadow-mapSize={[2048, 2048]} />
            <directionalLight position={[-5, 5, -5]} intensity={0.4} color="#add8e6" />
            <pointLight position={[0, 2, 2]} intensity={0.6} color="#4a90e2" />
            <spotLight position={[0, 5, 0]} angle={0.3} penumbra={0.5} intensity={0.8} castShadow />
            <Machine3DModel machineName={machine.name} />
            <Environment preset="warehouse" />
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]} receiveShadow>
              <planeGeometry args={[10, 10]} />
              <shadowMaterial opacity={0.3} />
            </mesh>
          </Canvas>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Gauge className="h-4 w-4 text-blue-500" />
            <div>
              <p className="text-xs text-muted-foreground">Velocidade</p>
              <p className="text-sm font-semibold">{machine.speed}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Activity className="h-4 w-4 text-green-500" />
            <div>
              <p className="text-xs text-muted-foreground">Eficiência</p>
              <p className="text-sm font-semibold">{machine.efficiency}%</p>
            </div>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-md bg-muted/50">
            <Zap className="h-4 w-4 text-orange-500" />
            <div>
              <p className="text-xs text-muted-foreground">Temp.</p>
              <p className="text-sm font-semibold">{machine.temperature}°C</p>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-foreground">Tarefa Atual:</p>
            <Button
              size="sm"
              variant="outline"
              onClick={handleAIAnalysis}
              className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-500"
            >
              <Sparkles className="h-3 w-3" />
              Analisar com IA
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">{machine.task}</p>
        </div>

        {expanded && (
          <div className="space-y-3 pt-3 border-t border-border/50">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Horas de Operação</p>
                <p className="text-sm font-medium">248.5h</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Última Manutenção</p>
                <p className="text-sm font-medium">há 15 dias</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Próxima Revisão</p>
                <p className="text-sm font-medium">em 14 dias</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground mb-1">Ciclos Completados</p>
                <p className="text-sm font-medium">12,430</p>
              </div>
            </div>
          </div>
        )}

        <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)} className="w-full">
          {expanded ? (
            <>
              <ChevronUp className="h-4 w-4 mr-2" />
              Mostrar Menos
            </>
          ) : (
            <>
              <ChevronDown className="h-4 w-4 mr-2" />
              Ver Mais Detalhes
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}

// Componente principal do Carousel
export function Machines3DCardCarousel({ machines }: MachinesCarouselProps) {
  const activeMachines = machines.filter((m) => m.status === "running").length

  const scrollLeft = () => {
    const carousel = document.getElementById("machines-3d-carousel")
    if (carousel) {
      carousel.scrollBy({ left: -400, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    const carousel = document.getElementById("machines-3d-carousel")
    if (carousel) {
      carousel.scrollBy({ left: 400, behavior: "smooth" })
    }
  }

  return (
    <div className="w-[82vw]">
      <Card className="shadow-lg border-2">
        <CardContent className="p-6 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">Máquinas em Operação</h2>
            <Badge variant="secondary" className="text-sm">
              {activeMachines} ativas
            </Badge>
          </div>

          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg"
              onClick={scrollLeft}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            
            <div 
              id="machines-3d-carousel"
              className="flex gap-4 overflow-x-auto scroll-smooth pb-2 px-10 scrollbar-hide"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {machines.map((machine) => (
                <div
                  key={machine.id}
                  className="flex-shrink-0 w-[380px]"
                >
                  <MachineCard machine={machine} />
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background/95 backdrop-blur shadow-lg"
              onClick={scrollRight}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      <style jsx>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}
