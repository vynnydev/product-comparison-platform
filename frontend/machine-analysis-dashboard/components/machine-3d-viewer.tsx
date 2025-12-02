"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { useTheme } from "@/contexts/theme-context"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface Machine3DViewerProps {
  machineName: string
  machineType: string
  isAnalyzing?: boolean
  onAnalysisComplete?: (parts: MachinePart[]) => void
}

interface MachinePart {
  id: string
  name: string
  status: "healthy" | "warning" | "critical"
  position: { x: number; y: number; z: number }
  marker: string
}

export function Machine3DViewer({ machineName, machineType, isAnalyzing = false, onAnalysisComplete }: Machine3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const { theme } = useTheme()
  const [scanProgress, setScanProgress] = useState(0)
  const [detectedParts, setDetectedParts] = useState<MachinePart[]>([])
  const [showParts, setShowParts] = useState(false)

  const handleClearAnalysis = () => {
    setDetectedParts([])
    setShowParts(false)
    setScanProgress(0)
  }

  // Add scanning animation effect
  useEffect(() => {
    if (isAnalyzing) {
      setShowParts(false)
      setDetectedParts([])
      setScanProgress(0)
      
      const interval = setInterval(() => {
        setScanProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            // Generate detected parts based on machine type
            const parts = generateMachineParts(machineType)
            setDetectedParts(parts)
            setShowParts(true)
            if (onAnalysisComplete) {
              onAnalysisComplete(parts)
            }
            return 100
          }
          return prev + 2
        })
      }, 50)

      return () => clearInterval(interval)
    }
  }, [isAnalyzing, machineType, onAnalysisComplete])

  const generateMachineParts = (type: string): MachinePart[] => {
    const basePosition = { x: 0, y: 1.5, z: 0 }
    
    if (type.includes("pump") || type.includes("bomba")) {
      return [
        { id: "A", name: "Motor Elétrico", status: "healthy", position: { x: -1, y: 1.5, z: 0 }, marker: "A" },
        { id: "B", name: "Impelidor", status: "healthy", position: { x: 1.5, y: 1.5, z: 0 }, marker: "B" },
        { id: "C", name: "Voluta", status: "warning", position: { x: 1.5, y: 1.5, z: 1 }, marker: "C" },
        { id: "D", name: "Eixo", status: "healthy", position: { x: 0.5, y: 1.5, z: 0 }, marker: "D" },
        { id: "E", name: "Selo Mecânico", status: "critical", position: { x: 0.5, y: 1.2, z: 0.5 }, marker: "E" },
      ]
    } else if (type.includes("cnc") || type.includes("lathe")) {
      return [
        { id: "1", name: "Mandril", status: "healthy", position: { x: -3.5, y: 1.4, z: 0 }, marker: "1" },
        { id: "2", name: "Torre Ferramentas", status: "healthy", position: { x: 0.5, y: 1.5, z: 0 }, marker: "2" },
        { id: "3", name: "Contraponto", status: "warning", position: { x: 2.5, y: 1, z: 0 }, marker: "3" },
        { id: "4", name: "Painel CNC", status: "healthy", position: { x: 3.5, y: 1.8, z: -1 }, marker: "4" },
        { id: "5", name: "Barramento", status: "healthy", position: { x: 0, y: 0.675, z: 0 }, marker: "5" },
      ]
    } else if (type.includes("motor") || type.includes("engine")) {
      return [
        { id: "A", name: "Turbocompressor", status: "warning", position: { x: -1.8, y: 1.8, z: 1.2 }, marker: "A" },
        { id: "B", name: "Bloco do Motor", status: "healthy", position: { x: 0, y: 1.5, z: 0 }, marker: "B" },
        { id: "C", name: "Cabeçotes", status: "healthy", position: { x: 0, y: 2.5, z: 0 }, marker: "C" },
        { id: "D", name: "Intercooler", status: "healthy", position: { x: 1.5, y: 1.5, z: 1.5 }, marker: "D" },
        { id: "E", name: "Coletor Escape", status: "critical", position: { x: -1, y: 2.2, z: -1 }, marker: "E" },
      ]
    } else if (type.includes("compressor")) {
      return [
        { id: "1", name: "Reservatório", status: "healthy", position: { x: 0.5, y: 1.2, z: 0 }, marker: "1" },
        { id: "2", name: "Motor", status: "healthy", position: { x: -1.2, y: 1, z: 0 }, marker: "2" },
        { id: "3", name: "Cabeçote", status: "warning", position: { x: -1.2, y: 1.7, z: 0 }, marker: "3" },
        { id: "4", name: "Válvulas", status: "healthy", position: { x: -1.2, y: 2.1, z: 0.3 }, marker: "4" },
        { id: "5", name: "Manômetro", status: "healthy", position: { x: 0.5, y: 1.2, z: 0.9 }, marker: "5" },
      ]
    }
    
    return [
      { id: "1", name: "Componente Principal", status: "healthy", position: basePosition, marker: "1" },
      { id: "2", name: "Sistema Elétrico", status: "healthy", position: { ...basePosition, x: basePosition.x + 2 }, marker: "2" },
      { id: "3", name: "Painel Controle", status: "warning", position: { ...basePosition, x: basePosition.x + 4 }, marker: "3" },
    ]
  }

  useEffect(() => {
    if (!containerRef.current) return

    console.log("=== RENDERIZAÇÃO 3D REALISTA ===")
    console.log("Machine:", machineName, "Type:", machineType)

    // Limpar container
    while (containerRef.current.firstChild) {
      containerRef.current.removeChild(containerRef.current.firstChild)
    }

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color(theme === "light" ? 0xf1f5f9 : 0x1e293b)
    scene.fog = new THREE.Fog(scene.background.getHex(), 10, 50)

    // Camera
    const camera = new THREE.PerspectiveCamera(
      45,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    )
    camera.position.set(6, 5, 10)
    camera.lookAt(0, 1, 0)

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    containerRef.current.appendChild(renderer.domElement)

    // Iluminação melhorada
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)
    scene.add(ambientLight)

    const mainLight = new THREE.DirectionalLight(0xffffff, 1.2)
    mainLight.position.set(10, 15, 10)
    mainLight.castShadow = true
    mainLight.shadow.mapSize.width = 2048
    mainLight.shadow.mapSize.height = 2048
    scene.add(mainLight)

    const fillLight = new THREE.DirectionalLight(0xadd8e6, 0.6)
    fillLight.position.set(-8, 8, -5)
    scene.add(fillLight)

    const rimLight = new THREE.PointLight(0xffa500, 0.5, 20)
    rimLight.position.set(-5, 3, -5)
    scene.add(rimLight)

    const machineGroup = new THREE.Group()
    const type = machineType.toLowerCase()

    // BOMBA CENTRÍFUGA DETALHADA
    if (type.includes("centrifugal") || type.includes("pump") || type.includes("bomba")) {
      console.log("🎨 BOMBA CENTRÍFUGA REALISTA")

      // Base robusta
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(4.5, 0.4, 2.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x2874a6, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      base.position.y = 0.2
      base.castShadow = true
      machineGroup.add(base)

      // Motor elétrico
      const motorBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.6, 0.7, 2.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.8, 
          roughness: 0.25 
        })
      )
      motorBody.rotation.z = Math.PI / 2
      motorBody.position.set(-1, 1.5, 0)
      motorBody.castShadow = true
      machineGroup.add(motorBody)

      // Aletas de resfriamento do motor
      for (let i = 0; i < 12; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.05, 1.3, 2.3),
          new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, 
            metalness: 0.7, 
            roughness: 0.3 
          })
        )
        const angle = (i * Math.PI * 2) / 12
        fin.position.set(
          -1 + Math.cos(angle) * 0.65,
          1.5 + Math.sin(angle) * 0.65,
          0
        )
        fin.rotation.y = angle
        machineGroup.add(fin)
      }

      // Tampa do motor
      const motorCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.2, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.9, 
          roughness: 0.1 
        })
      )
      motorCap.rotation.z = Math.PI / 2
      motorCap.position.set(-2.3, 1.5, 0)
      machineGroup.add(motorCap)

      // Eixo
      const shaft = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 1.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xbdc3c7, 
          metalness: 0.95, 
          roughness: 0.05 
        })
      )
      shaft.rotation.z = Math.PI / 2
      shaft.position.set(0.5, 1.5, 0)
      machineGroup.add(shaft)

      // Caixa da bomba (voluta)
      const voluteGeometry = new THREE.TorusGeometry(1, 0.5, 16, 32, Math.PI * 1.5)
      const volute = new THREE.Mesh(
        voluteGeometry,
        new THREE.MeshStandardMaterial({ 
          color: 0x3498db, 
          metalness: 0.9, 
          roughness: 0.15 
        })
      )
      volute.rotation.y = Math.PI / 2
      volute.position.set(1.5, 1.5, 0)
      volute.castShadow = true
      machineGroup.add(volute)

      // Tampa frontal da bomba
      const frontCover = new THREE.Mesh(
        new THREE.CylinderGeometry(1.3, 1.3, 0.3, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x2980b9, 
          metalness: 0.9, 
          roughness: 0.15 
        })
      )
      frontCover.rotation.z = Math.PI / 2
      frontCover.position.set(2.2, 1.5, 0)
      frontCover.castShadow = true
      machineGroup.add(frontCover)

      // Impelidor (rotor)
      const impellerMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xf39c12, 
        metalness: 0.85, 
        roughness: 0.15 
      })
      
      const impellerHub = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.1, 32),
        impellerMaterial
      )
      impellerHub.rotation.z = Math.PI / 2
      impellerHub.position.set(1.5, 1.5, 0)
      machineGroup.add(impellerHub)

      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.8, 0.05),
          impellerMaterial
        )
        blade.position.set(
          1.5,
          1.5 + Math.cos(angle) * 0.5,
          Math.sin(angle) * 0.5
        )
        blade.rotation.x = angle
        blade.rotation.y = Math.PI / 6
        machineGroup.add(blade)
      }

      // Flanges
      const flangeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x7f8c8d, 
        metalness: 0.8, 
        roughness: 0.2 
      })

      // Flange de sucção
      const suctionFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.3, 32),
        flangeMaterial
      )
      suctionFlange.position.set(1.5, 0.8, 0)
      suctionFlange.castShadow = true
      machineGroup.add(suctionFlange)

      // Parafusos da flange
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.05, 0.05, 0.15, 8),
          new THREE.MeshStandardMaterial({ color: 0x2c3e50, metalness: 0.9 })
        )
        bolt.position.set(
          1.5 + Math.cos(angle) * 0.45,
          0.875,
          Math.sin(angle) * 0.45
        )
        machineGroup.add(bolt)
      }

      // Tubulação de sucção
      const suctionPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 1, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.75, 
          roughness: 0.3 
        })
      )
      suctionPipe.position.set(1.5, 0.2, 0)
      suctionPipe.castShadow = true
      machineGroup.add(suctionPipe)

      // Flange de descarga
      const dischargeFlange = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.3, 32),
        flangeMaterial
      )
      dischargeFlange.rotation.z = Math.PI / 2
      dischargeFlange.position.set(1.5, 2.5, 0)
      dischargeFlange.castShadow = true
      machineGroup.add(dischargeFlange)

      // Tubulação de descarga
      const dischargePipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 1.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.75, 
          roughness: 0.3 
        })
      )
      dischargePipe.rotation.z = Math.PI / 2
      dischargePipe.position.set(2.3, 2.5, 0)
      dischargePipe.castShadow = true
      machineGroup.add(dischargePipe)

      // Proteção de acoplamento
      const couplingGuard = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 1, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xe74c3c, 
          metalness: 0.6, 
          roughness: 0.4,
          transparent: true,
          opacity: 0.8
        })
      )
      couplingGuard.rotation.z = Math.PI / 2
      couplingGuard.position.set(0.2, 1.5, 0)
      machineGroup.add(couplingGuard)

      // Parafusos de fixação da base
      const boltPositions = [
        [-1.8, 0.4, -1], [-1.8, 0.4, 1],
        [2, 0.4, -1], [2, 0.4, 1]
      ]
      boltPositions.forEach(pos => {
        const bolt = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.4, 16),
          new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, 
            metalness: 0.9, 
            roughness: 0.2 
          })
        )
        bolt.position.set(pos[0], pos[1], pos[2])
        machineGroup.add(bolt)
      })

      // Placa de identificação
      const nameplate = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.3, 0.02),
        new THREE.MeshStandardMaterial({ 
          color: 0xecf0f1, 
          metalness: 0.3, 
          roughness: 0.7 
        })
      )
      nameplate.position.set(-1, 1.5, 0.8)
      machineGroup.add(nameplate)

      // Manômetro
      const gaugeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32),
        new THREE.MeshStandardMaterial({ color: 0xecf0f1, metalness: 0.3 })
      )
      gaugeBody.rotation.x = Math.PI / 2
      gaugeBody.position.set(2.8, 2.5, 0.5)
      machineGroup.add(gaugeBody)

      const gaugeFace = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          emissive: 0x3498db, 
          emissiveIntensity: 0.2 
        })
      )
      gaugeFace.rotation.x = Math.PI / 2
      gaugeFace.position.set(2.8, 2.5, 0.56)
      machineGroup.add(gaugeFace)

    }
    // TORNO CNC DETALHADO
    else if (type.includes("cnc") || type.includes("lathe") || type.includes("torno")) {
      console.log("🎨 TORNO CNC REALISTA")

      // Base principal
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(7, 0.5, 2.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.8, 
          roughness: 0.2 
        })
      )
      base.position.y = 0.25
      base.castShadow = true
      machineGroup.add(base)

      // Barramento (bed)
      const bed = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.35, 1),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.85, 
          roughness: 0.15 
        })
      )
      bed.position.set(0, 0.675, 0)
      bed.castShadow = true
      machineGroup.add(bed)

      // Guias do barramento
      for (let i = -2.5; i <= 2.5; i += 0.5) {
        const guide = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.2, 0.8),
          new THREE.MeshStandardMaterial({ 
            color: 0x95a5a6, 
            metalness: 0.9, 
            roughness: 0.1 
          })
        )
        guide.position.set(i, 0.85, 0)
        machineGroup.add(guide)
      }

      // Cabeçote fixo
      const headstock = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 1.8, 1.8),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.8, 
          roughness: 0.2 
        })
      )
      headstock.position.set(-3, 1.4, 0)
      headstock.castShadow = true
      machineGroup.add(headstock)

      // Furo do eixo-árvore
      const spindleHole = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.25, 0.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x1a1a1a, 
          metalness: 0.9, 
          roughness: 0.1 
        })
      )
      spindleHole.rotation.z = Math.PI / 2
      spindleHole.position.set(-3.25, 1.4, 0)
      machineGroup.add(spindleHole)

      // Placa (chuck)
      const chuck = new THREE.Mesh(
        new THREE.CylinderGeometry(0.5, 0.5, 0.3, 64),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.95, 
          roughness: 0.1 
        })
      )
      chuck.rotation.z = Math.PI / 2
      chuck.position.set(-3.5, 1.4, 0)
      chuck.castShadow = true
      machineGroup.add(chuck)

      // Castanhas da placa (4 castanhas)
      for (let i = 0; i < 4; i++) {
        const angle = (i * Math.PI) / 2
        const jaw = new THREE.Mesh(
          new THREE.BoxGeometry(0.15, 0.4, 0.08),
          new THREE.MeshStandardMaterial({ 
            color: 0x7f8c8d, 
            metalness: 0.9, 
            roughness: 0.2 
          })
        )
        jaw.position.set(
          -3.5,
          1.4 + Math.cos(angle) * 0.35,
          Math.sin(angle) * 0.35
        )
        machineGroup.add(jaw)
      }

      // Carro transversal
      const crossSlide = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 0.4, 1.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.8, 
          roughness: 0.25 
        })
      )
      crossSlide.position.set(0.5, 1.2, 0)
      crossSlide.castShadow = true
      machineGroup.add(crossSlide)

      // Torre porta-ferramentas
      const turretBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.5, 0.6, 12),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.8, 
          roughness: 0.25 
        })
      )
      turretBody.position.set(0.5, 1.5, 0)
      turretBody.castShadow = true
      machineGroup.add(turretBody)

      // Ferramentas na torre (6 posições)
      for (let i = 0; i < 6; i++) {
        const angle = (i * Math.PI * 2) / 6
        
        const toolHolder = new THREE.Mesh(
          new THREE.BoxGeometry(0.12, 0.3, 0.1),
          new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, 
            metalness: 0.7, 
            roughness: 0.3 
          })
        )
        toolHolder.position.set(
          0.5 + Math.cos(angle) * 0.4,
          1.5,
          Math.sin(angle) * 0.4
        )
        toolHolder.rotation.y = -angle
        machineGroup.add(toolHolder)

        // Inserto da ferramenta
        const toolTip = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.15, 0.03),
          new THREE.MeshStandardMaterial({ 
            color: 0xf39c12, 
            metalness: 0.9, 
            roughness: 0.1 
          })
        )
        toolTip.position.set(
          0.5 + Math.cos(angle) * 0.45,
          1.35,
          Math.sin(angle) * 0.45
        )
        toolTip.rotation.y = -angle
        machineGroup.add(toolTip)
      }

      // Contraponto
      const tailstock = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 1, 1.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.8, 
          roughness: 0.2 
        })
      )
      tailstock.position.set(2.5, 1, 0)
      tailstock.castShadow = true
      machineGroup.add(tailstock)

      // Manga do contraponto
      const quill = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.12, 0.8, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xbdc3c7, 
          metalness: 0.95, 
          roughness: 0.05 
        })
      )
      quill.rotation.z = Math.PI / 2
      quill.position.set(2.9, 1, 0)
      machineGroup.add(quill)

      // Painel de controle CNC
      const panelHousing = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 2, 0.3),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.3, 
          roughness: 0.7 
        })
      )
      panelHousing.position.set(3.5, 1.5, -1)
      panelHousing.rotation.y = Math.PI / 8
      panelHousing.castShadow = true
      machineGroup.add(panelHousing)

      // Tela do CNC
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(0.9, 0.7, 0.05),
        new THREE.MeshStandardMaterial({ 
          color: 0x1e3a5f, 
          emissive: 0x2e5c8a, 
          emissiveIntensity: 0.8, 
          roughness: 0.1 
        })
      )
      screen.position.set(3.56, 1.8, -1)
      screen.rotation.y = Math.PI / 8
      machineGroup.add(screen)

      // Botões de emergência
      for (let i = 0; i < 3; i++) {
        const button = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
          new THREE.MeshStandardMaterial({ 
            color: i === 0 ? 0xe74c3c : i === 1 ? 0xf39c12 : 0x27ae60, 
            metalness: 0.6, 
            emissive: i === 0 ? 0xe74c3c : i === 1 ? 0xf39c12 : 0x27ae60,
            emissiveIntensity: 0.3 
          })
        )
        button.rotation.z = Math.PI / 2
        button.position.set(3.57, 1.2 + i * 0.15, -1)
        machineGroup.add(button)
      }

      // Proteção de acrílico
      const guard = new THREE.Mesh(
        new THREE.BoxGeometry(4, 2, 2.2),
        new THREE.MeshPhysicalMaterial({ 
          color: 0xaaaaaa, 
          metalness: 0.1, 
          roughness: 0.1, 
          transmission: 0.9, 
          thickness: 0.5, 
          transparent: true, 
          opacity: 0.3 
        })
      )
      guard.position.set(-0.5, 1.5, 0)
      machineGroup.add(guard)

      // Bandeja de cavacos
      const chipTray = new THREE.Mesh(
        new THREE.BoxGeometry(6, 0.1, 1.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.6, 
          roughness: 0.4 
        })
      )
      chipTray.position.set(0, 0.55, 0)
      machineGroup.add(chipTray)

    }
    // MOTOR V8 TURBO DETALHADO
    else if (type.includes("motor") || type.includes("engine") || type.includes("v8")) {
      console.log("🎨 MOTOR V8 TURBO REALISTA")

      // Bloco do motor
      const engineBlock = new THREE.Mesh(
        new THREE.BoxGeometry(3, 2, 2.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      engineBlock.position.y = 1.5
      engineBlock.castShadow = true
      machineGroup.add(engineBlock)

      // Detalhes do bloco (nervuras)
      for (let i = -1; i <= 1; i += 0.5) {
        const rib = new THREE.Mesh(
          new THREE.BoxGeometry(3.1, 0.1, 0.1),
          new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.8, 
            roughness: 0.3 
          })
        )
        rib.position.set(0, 1.5 + i * 0.3, 1.3)
        machineGroup.add(rib)
      }

      // Cabeçotes (V configuration)
      const headMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x34495e, 
        metalness: 0.8, 
        roughness: 0.25 
      })

      const leftHead = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.6, 0.8),
        headMaterial
      )
      leftHead.position.set(0, 2.5, -0.6)
      leftHead.rotation.x = -0.3
      leftHead.castShadow = true
      machineGroup.add(leftHead)

      const rightHead = new THREE.Mesh(
        new THREE.BoxGeometry(3.2, 0.6, 0.8),
        headMaterial
      )
      rightHead.position.set(0, 2.5, 0.6)
      rightHead.rotation.x = 0.3
      rightHead.castShadow = true
      machineGroup.add(rightHead)

      // Tampas de válvulas cromadas
      const chromeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xecf0f1, 
        metalness: 0.95, 
        roughness: 0.05 
      })

      const leftValveCover = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.3, 0.7),
        chromeMaterial
      )
      leftValveCover.position.set(0, 2.95, -0.65)
      leftValveCover.rotation.x = -0.3
      leftValveCover.castShadow = true
      machineGroup.add(leftValveCover)

      const rightValveCover = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.3, 0.7),
        chromeMaterial
      )
      rightValveCover.position.set(0, 2.95, 0.65)
      rightValveCover.rotation.x = 0.3
      rightValveCover.castShadow = true
      machineGroup.add(rightValveCover)

      // Velas de ignição (8 cilindros)
      const plugMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xe67e22, 
        metalness: 0.7, 
        roughness: 0.3 
      })

      for (let i = 0; i < 4; i++) {
        // Lado esquerdo
        const leftPlug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16),
          plugMaterial
        )
        leftPlug.position.set(-1 + i * 0.7, 3.1, -0.9)
        leftPlug.rotation.x = -0.3
        machineGroup.add(leftPlug)

        // Lado direito
        const rightPlug = new THREE.Mesh(
          new THREE.CylinderGeometry(0.06, 0.06, 0.4, 16),
          plugMaterial
        )
        rightPlug.position.set(-1 + i * 0.7, 3.1, 0.9)
        rightPlug.rotation.x = 0.3
        machineGroup.add(rightPlug)
      }

      // Turbocompressor
      const turboHousing = new THREE.Mesh(
        new THREE.SphereGeometry(0.6, 32, 32, 0, Math.PI),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.9, 
          roughness: 0.15 
        })
      )
      turboHousing.rotation.z = Math.PI / 2
      turboHousing.position.set(-1.8, 1.8, 1.2)
      turboHousing.castShadow = true
      machineGroup.add(turboHousing)

      // Entrada do turbo
      const turboInlet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.25, 0.3, 0.5, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      turboInlet.rotation.x = Math.PI / 2
      turboInlet.position.set(-1.8, 1.8, 1.7)
      machineGroup.add(turboInlet)

      // Saída do turbo
      const turboOutlet = new THREE.Mesh(
        new THREE.CylinderGeometry(0.3, 0.25, 0.6, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      turboOutlet.rotation.z = Math.PI / 2
      turboOutlet.position.set(-1.3, 1.8, 1.2)
      machineGroup.add(turboOutlet)

      // Roda do turbo
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI * 2) / 8
        const blade = new THREE.Mesh(
          new THREE.BoxGeometry(0.08, 0.4, 0.02),
          new THREE.MeshStandardMaterial({ 
            color: 0xf39c12, 
            metalness: 0.9, 
            roughness: 0.1 
          })
        )
        blade.position.set(
          -1.8,
          1.8 + Math.cos(angle) * 0.2,
          1.2 + Math.sin(angle) * 0.2
        )
        blade.rotation.x = angle
        machineGroup.add(blade)
      }

      // Intercooler
      const intercooler = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 0.8, 0.4),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.7, 
          roughness: 0.4 
        })
      )
      intercooler.position.set(1.5, 1.5, 1.5)
      intercooler.castShadow = true
      machineGroup.add(intercooler)

      // Aletas do intercooler
      for (let i = 0; i < 15; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.02, 0.7, 0.35),
          new THREE.MeshStandardMaterial({ 
            color: 0x7f8c8d, 
            metalness: 0.6, 
            roughness: 0.5 
          })
        )
        fin.position.set(1.5 - 0.55 + i * 0.075, 1.5, 1.5)
        machineGroup.add(fin)
      }

      // Coletor de admissão
      const intakeManifold = new THREE.Mesh(
        new THREE.BoxGeometry(2.5, 0.5, 1.8),
        new THREE.MeshStandardMaterial({ 
          color: 0xe74c3c, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      intakeManifold.position.set(0, 3.4, 0)
      intakeManifold.castShadow = true
      machineGroup.add(intakeManifold)

      // Corpo de borboleta
      const throttleBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32),
        chromeMaterial
      )
      throttleBody.position.set(0.5, 3.8, 0)
      machineGroup.add(throttleBody)

      // Coletores de escape (8 tubos)
      const exhaustMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xd35400, 
        metalness: 0.85, 
        roughness: 0.2, 
        emissive: 0x5d2800, 
        emissiveIntensity: 0.2 
      })

      for (let i = 0; i < 4; i++) {
        // Lado esquerdo
        const leftExhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
          exhaustMaterial
        )
        leftExhaust.position.set(-1.2 + i * 0.6, 2.2, -1)
        leftExhaust.rotation.x = Math.PI / 4
        machineGroup.add(leftExhaust)

        // Lado direito
        const rightExhaust = new THREE.Mesh(
          new THREE.CylinderGeometry(0.08, 0.08, 0.6, 16),
          exhaustMaterial
        )
        rightExhaust.position.set(-1.2 + i * 0.6, 2.2, 1)
        rightExhaust.rotation.x = -Math.PI / 4
        machineGroup.add(rightExhaust)
      }

      // Carter de óleo
      const oilPan = new THREE.Mesh(
        new THREE.BoxGeometry(2.8, 0.5, 2.3),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.7, 
          roughness: 0.4 
        })
      )
      oilPan.position.y = 0.25
      oilPan.castShadow = true
      machineGroup.add(oilPan)

      // Filtro de óleo
      const oilFilter = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.4, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xf39c12, 
          metalness: 0.6, 
          roughness: 0.4 
        })
      )
      oilFilter.position.set(-1.5, 1, -0.8)
      machineGroup.add(oilFilter)

      // Alternador
      const alternator = new THREE.Mesh(
        new THREE.CylinderGeometry(0.35, 0.35, 0.6, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      alternator.rotation.z = Math.PI / 2
      alternator.position.set(1.3, 1.2, -1)
      machineGroup.add(alternator)

      // Polia do virabrequim
      const crankPulley = new THREE.Mesh(
        new THREE.CylinderGeometry(0.4, 0.4, 0.2, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x1a1a1a, 
          metalness: 0.5, 
          roughness: 0.6 
        })
      )
      crankPulley.rotation.z = Math.PI / 2
      crankPulley.position.set(-1.6, 1.5, 0)
      machineGroup.add(crankPulley)

      // Cabos de vela
      const wireMaterial = new THREE.MeshStandardMaterial({ 
        color: 0x000000, 
        metalness: 0.2, 
        roughness: 0.8 
      })

      for (let i = 0; i < 3; i++) {
        const wire = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8),
          wireMaterial
        )
        wire.position.set(0.8 - i * 0.3, 3.2, -0.5)
        machineGroup.add(wire)
      }

    } 
    // COMPRESSOR DETALHADO
    else if (type.includes("compressor") || type.includes("pneum")) {
      console.log("🎨 COMPRESSOR REALISTA")

      // Base
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(3, 0.3, 1.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.6, 
          roughness: 0.4 
        })
      )
      base.position.y = 0.15
      base.castShadow = true
      machineGroup.add(base)

      // Reservatório de ar principal
      const tank = new THREE.Mesh(
        new THREE.CylinderGeometry(0.8, 0.8, 2, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xe74c3c, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      tank.rotation.z = Math.PI / 2
      tank.position.set(0.5, 1.2, 0)
      tank.castShadow = true
      machineGroup.add(tank)

      // Tampa do reservatório
      const tankCap = new THREE.Mesh(
        new THREE.CylinderGeometry(0.7, 0.7, 0.1, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xc0392b, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      tankCap.rotation.z = Math.PI / 2
      tankCap.position.set(1.55, 1.2, 0)
      machineGroup.add(tankCap)

      // Anéis de reforço
      for (let i = 0; i < 3; i++) {
        const ring = new THREE.Mesh(
          new THREE.TorusGeometry(0.82, 0.05, 16, 32),
          new THREE.MeshStandardMaterial({ 
            color: 0x2c3e50, 
            metalness: 0.9, 
            roughness: 0.2 
          })
        )
        ring.rotation.y = Math.PI / 2
        ring.position.set(0.5 - 0.6 + i * 0.6, 1.2, 0)
        machineGroup.add(ring)
      }

      // Motor do compressor
      const motor = new THREE.Mesh(
        new THREE.BoxGeometry(0.8, 1, 0.8),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.7, 
          roughness: 0.3 
        })
      )
      motor.position.set(-1.2, 1, 0)
      motor.castShadow = true
      machineGroup.add(motor)

      // Aletas de resfriamento do motor
      for (let i = 0; i < 8; i++) {
        const fin = new THREE.Mesh(
          new THREE.BoxGeometry(0.82, 0.05, 0.82),
          new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.6, 
            roughness: 0.4 
          })
        )
        fin.position.set(-1.2, 0.6 + i * 0.1, 0)
        machineGroup.add(fin)
      }

      // Cabeçote do compressor
      const compressorHead = new THREE.Mesh(
        new THREE.BoxGeometry(0.6, 0.7, 0.6),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      compressorHead.position.set(-1.2, 1.7, 0)
      compressorHead.castShadow = true
      machineGroup.add(compressorHead)

      // Pistão
      const piston = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.4, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.9, 
          roughness: 0.1 
        })
      )
      piston.position.set(-1.2, 2.2, 0)
      machineGroup.add(piston)

      // Válvulas
      const valve1 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xf39c12, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      valve1.rotation.z = Math.PI / 2
      valve1.position.set(-1.2, 2.1, 0.3)
      machineGroup.add(valve1)

      const valve2 = new THREE.Mesh(
        new THREE.CylinderGeometry(0.08, 0.08, 0.15, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xf39c12, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      valve2.rotation.z = Math.PI / 2
      valve2.position.set(-1.2, 2.1, -0.3)
      machineGroup.add(valve2)

      // Tubulação de ar
      const airPipe = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 1.5, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      airPipe.rotation.z = Math.PI / 2
      airPipe.position.set(-0.2, 2.2, 0)
      machineGroup.add(airPipe)

      // Manômetro
      const gaugeBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xecf0f1, 
          metalness: 0.3, 
          roughness: 0.7 
        })
      )
      gaugeBody.rotation.x = Math.PI / 2
      gaugeBody.position.set(0.5, 1.2, 0.9)
      machineGroup.add(gaugeBody)

      const gaugeFace = new THREE.Mesh(
        new THREE.CircleGeometry(0.13, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xffffff, 
          emissive: 0x3498db, 
          emissiveIntensity: 0.3 
        })
      )
      gaugeFace.rotation.x = Math.PI / 2
      gaugeFace.position.set(0.5, 1.2, 0.96)
      machineGroup.add(gaugeFace)

      // Válvula de alívio
      const reliefValve = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.08, 0.3, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xf39c12, 
          metalness: 0.85, 
          roughness: 0.2 
        })
      )
      reliefValve.position.set(1.5, 1.2, 0)
      machineGroup.add(reliefValve)

      // Dreno
      const drain = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.05, 0.2, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.8, 
          roughness: 0.3 
        })
      )
      drain.position.set(0.5, 0.2, 0)
      machineGroup.add(drain)

      // Painel de controle
      const controlPanel = new THREE.Mesh(
        new THREE.BoxGeometry(0.4, 0.6, 0.1),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.5, 
          roughness: 0.5 
        })
      )
      controlPanel.position.set(-1.2, 0.8, 0.5)
      machineGroup.add(controlPanel)

      // Botões
      const startButton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0x27ae60, 
          metalness: 0.6, 
          emissive: 0x27ae60, 
          emissiveIntensity: 0.3 
        })
      )
      startButton.rotation.x = Math.PI / 2
      startButton.position.set(-1.2, 1, 0.56)
      machineGroup.add(startButton)

      const stopButton = new THREE.Mesh(
        new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xe74c3c, 
          metalness: 0.6, 
          emissive: 0xe74c3c, 
          emissiveIntensity: 0.3 
        })
      )
      stopButton.rotation.x = Math.PI / 2
      stopButton.position.set(-1.2, 0.85, 0.56)
      machineGroup.add(stopButton)

      // Rodas (opcional)
      for (let i = 0; i < 2; i++) {
        const wheel = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.1, 32),
          new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.5, 
            roughness: 0.6 
          })
        )
        wheel.rotation.z = Math.PI / 2
        wheel.position.set(i * 2 - 1, 0.15, 0.8)
        machineGroup.add(wheel)
      }

    } 
    // MÁQUINA GENÉRICA MELHORADA
    else {
      console.log("🎨 MÁQUINA GENÉRICA REALISTA")

      // Gabinete principal
      const enclosure = new THREE.Mesh(
        new THREE.BoxGeometry(6, 5, 4.5),
        new THREE.MeshStandardMaterial({ 
          color: 0x5d6d7e, 
          metalness: 0.8, 
          roughness: 0.25 
        })
      )
      enclosure.position.y = 2.5
      enclosure.castShadow = true
      machineGroup.add(enclosure)

      // Janela de inspeção
      const window = new THREE.Mesh(
        new THREE.BoxGeometry(4, 3.5, 0.15),
        new THREE.MeshPhysicalMaterial({ 
          color: 0x87ceeb, 
          metalness: 0.1, 
          roughness: 0.05, 
          transmission: 0.95, 
          thickness: 0.5, 
          transparent: true, 
          opacity: 0.4 
        })
      )
      window.position.set(0, 2.5, 2.28)
      machineGroup.add(window)

      // Moldura da janela
      const frameTop = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.15, 0.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.6, 
          roughness: 0.4 
        })
      )
      frameTop.position.set(0, 4.28, 2.3)
      machineGroup.add(frameTop)

      const frameBottom = new THREE.Mesh(
        new THREE.BoxGeometry(4.2, 0.15, 0.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x2c3e50, 
          metalness: 0.6, 
          roughness: 0.4 
        })
      )
      frameBottom.position.set(0, 0.72, 2.3)
      machineGroup.add(frameBottom)

      // Porta de acesso
      const door = new THREE.Mesh(
        new THREE.BoxGeometry(1.2, 4, 0.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.7, 
          roughness: 0.3 
        })
      )
      door.position.set(3, 2.5, 0)
      door.castShadow = true
      machineGroup.add(door)

      // Maçaneta
      const handle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.1, 0.1, 0.6, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0xe74c3c, 
          metalness: 0.7, 
          roughness: 0.3, 
          emissive: 0xe74c3c, 
          emissiveIntensity: 0.2 
        })
      )
      handle.rotation.z = Math.PI / 2
      handle.position.set(2, 2.5, 2.3)
      machineGroup.add(handle)

      // Painel de controle
      const controlPanel = new THREE.Mesh(
        new THREE.BoxGeometry(1.8, 3.5, 1.2),
        new THREE.MeshStandardMaterial({ 
          color: 0x34495e, 
          metalness: 0.5, 
          roughness: 0.5 
        })
      )
      controlPanel.position.set(4, 2.5, 0)
      controlPanel.castShadow = true
      machineGroup.add(controlPanel)

      // Tela touchscreen
      const screen = new THREE.Mesh(
        new THREE.BoxGeometry(1.4, 1.2, 0.08),
        new THREE.MeshStandardMaterial({ 
          color: 0x1e3a5f, 
          emissive: 0x3498db, 
          emissiveIntensity: 0.9, 
          roughness: 0.1, 
          metalness: 0.1 
        })
      )
      screen.position.set(4.61, 3.2, 0)
      machineGroup.add(screen)

      // Teclado
      const keyboard = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, 0.1, 0.4),
        new THREE.MeshStandardMaterial({ 
          color: 0x7f8c8d, 
          metalness: 0.4, 
          roughness: 0.6 
        })
      )
      keyboard.position.set(4.6, 1.5, 0.2)
      keyboard.rotation.x = -0.3
      machineGroup.add(keyboard)

      // Botão de emergência
      const eStop = new THREE.Mesh(
        new THREE.CylinderGeometry(0.12, 0.15, 0.08, 32),
        new THREE.MeshStandardMaterial({ 
          color: 0xff0000, 
          metalness: 0.6, 
          roughness: 0.4, 
          emissive: 0xff0000, 
          emissiveIntensity: 0.5 
        })
      )
      eStop.rotation.x = Math.PI / 2
      eStop.position.set(4.65, 2, -0.4)
      machineGroup.add(eStop)

      // Luzes indicadoras
      const lightColors = [0x00ff00, 0xffff00, 0xff0000]
      lightColors.forEach((color, i) => {
        const light = new THREE.Mesh(
          new THREE.CylinderGeometry(0.04, 0.04, 0.02, 16),
          new THREE.MeshStandardMaterial({ 
            color: color, 
            emissive: color, 
            emissiveIntensity: 0.8, 
            metalness: 0.5, 
            roughness: 0.3 
          })
        )
        light.rotation.x = Math.PI / 2
        light.position.set(4.65, 4.5, -0.3 + i * 0.15)
        machineGroup.add(light)
      })

      // Bico de refrigeração
      const nozzle = new THREE.Mesh(
        new THREE.CylinderGeometry(0.05, 0.03, 0.4, 16),
        new THREE.MeshStandardMaterial({ 
          color: 0x95a5a6, 
          metalness: 0.8, 
          roughness: 0.2 
        })
      )
      nozzle.position.set(-1.5, 3, 2)
      nozzle.rotation.z = Math.PI / 4
      machineGroup.add(nozzle)

      // Slots de ventilação
      for (let i = 0; i < 6; i++) {
        const vent = new THREE.Mesh(
          new THREE.BoxGeometry(5, 0.1, 0.1),
          new THREE.MeshStandardMaterial({ 
            color: 0x1a1a1a, 
            metalness: 0.7, 
            roughness: 0.4 
          })
        )
        vent.position.set(0, 0.5 + i * 0.7, -2.3)
        machineGroup.add(vent)
      }
    }

    scene.add(machineGroup)
    console.log("✅ Máquina realista adicionada!")

    if (showParts && detectedParts.length > 0) {
      detectedParts.forEach((part) => {
        // Marker sphere
        const markerGeometry = new THREE.SphereGeometry(0.15, 32, 32)
        const markerMaterial = new THREE.MeshStandardMaterial({
          color: part.status === "healthy" ? 0x00ff00 : part.status === "warning" ? 0xffaa00 : 0xff0000,
          emissive: part.status === "healthy" ? 0x00ff00 : part.status === "warning" ? 0xffaa00 : 0xff0000,
          emissiveIntensity: 0.6,
          metalness: 0.8,
          roughness: 0.2,
        })
        const marker = new THREE.Mesh(markerGeometry, markerMaterial)
        marker.position.set(part.position.x, part.position.y, part.position.z)
        scene.add(marker)

        // Marker line
        const lineGeometry = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(part.position.x, part.position.y, part.position.z),
          new THREE.Vector3(part.position.x, part.position.y + 1, part.position.z),
        ])
        const lineMaterial = new THREE.LineBasicMaterial({
          color: part.status === "healthy" ? 0x00ff00 : part.status === "warning" ? 0xffaa00 : 0xff0000,
          opacity: 0.7,
          transparent: true,
        })
        const line = new THREE.Line(lineGeometry, lineMaterial)
        scene.add(line)
      })
    }

    // Chão
    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(15, 64),
      new THREE.MeshStandardMaterial({ 
        color: theme === "light" ? 0xe2e8f0 : 0x1e293b, 
        roughness: 0.8 
      })
    )
    ground.rotation.x = -Math.PI / 2
    ground.receiveShadow = true
    scene.add(ground)

    // Grid
    const gridHelper = new THREE.GridHelper(15, 15, 0x888888, 0x444444)
    gridHelper.material.opacity = 0.2
    gridHelper.material.transparent = true
    scene.add(gridHelper)

    // Controles
    let isDragging = false
    let previousMouseX = 0
    let previousMouseY = 0
    let rotationY = 0
    let rotationX = 0

    const handleMouseDown = (e: MouseEvent) => {
      isDragging = true
      previousMouseX = e.clientX
      previousMouseY = e.clientY
    }

    const handleMouseUp = () => {
      isDragging = false
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return
      const deltaX = e.clientX - previousMouseX
      const deltaY = e.clientY - previousMouseY
      rotationY += deltaX * 0.01
      rotationX += deltaY * 0.01
      rotationX = Math.max(-Math.PI / 4, Math.min(Math.PI / 4, rotationX))
      previousMouseX = e.clientX
      previousMouseY = e.clientY
    }

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY * 0.01
      camera.position.z += delta
      camera.position.z = Math.max(4, Math.min(20, camera.position.z))
    }

    const currentContainer = containerRef.current
    currentContainer.addEventListener("mousedown", handleMouseDown)
    currentContainer.addEventListener("mouseup", handleMouseUp)
    currentContainer.addEventListener("mouseleave", handleMouseUp)
    currentContainer.addEventListener("mousemove", handleMouseMove)
    currentContainer.addEventListener("wheel", handleWheel, { passive: false })

    // Animação
    let animationId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animationId = requestAnimationFrame(animate)
      const delta = clock.getDelta()

      if (isDragging) {
        machineGroup.rotation.y = rotationY
        machineGroup.rotation.x = rotationX
      } else {
        machineGroup.rotation.y += delta * 0.3
      }

      renderer.render(scene, camera)
    }

    animate()
    console.log("✅ Animação iniciada!")

    // Resize
    const handleResize = () => {
      if (!containerRef.current) return
      const width = containerRef.current.clientWidth
      const height = containerRef.current.clientHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
    }
    window.addEventListener("resize", handleResize)

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize)
      if (currentContainer) {
        currentContainer.removeEventListener("mousedown", handleMouseDown)
        currentContainer.removeEventListener("mouseup", handleMouseUp)
        currentContainer.removeEventListener("mouseleave", handleMouseUp)
        currentContainer.removeEventListener("mousemove", handleMouseMove)
        currentContainer.removeEventListener("wheel", handleWheel)
      }
      cancelAnimationFrame(animationId)
      renderer.dispose()
      scene.clear()
    }
  }, [machineName, machineType, theme, showParts, detectedParts])

  return (
    <div className="relative w-full h-full">
      <div 
        ref={containerRef} 
        className="w-full h-full"
        style={{ 
          minHeight: '500px',
          cursor: 'grab',
          background: 'transparent'
        }}
      />
      
      {isAnalyzing && scanProgress < 100 && (
        <div className="absolute inset-0 pointer-events-none">
          {/* Animated scanner beam */}
          <div 
            className="absolute inset-0 bg-gradient-to-b from-transparent via-blue-500/20 to-transparent animate-pulse"
            style={{
              transform: `translateY(${(scanProgress / 100) * 100}%)`,
              transition: 'transform 0.05s linear',
              background: 'linear-gradient(to bottom, transparent 0%, rgba(59, 130, 246, 0.3) 20%, rgba(147, 51, 234, 0.3) 50%, rgba(236, 72, 153, 0.3) 80%, transparent 100%)',
              height: '20%',
            }}
          />
          
          {/* Corner borders with AI colors */}
          <div className="absolute inset-0 border-4 border-transparent">
            <div className="absolute top-0 left-0 w-20 h-20 border-t-4 border-l-4 border-blue-500 animate-pulse" />
            <div className="absolute top-0 right-0 w-20 h-20 border-t-4 border-r-4 border-purple-500 animate-pulse" />
            <div className="absolute bottom-0 left-0 w-20 h-20 border-b-4 border-l-4 border-purple-500 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-4 border-r-4 border-pink-500 animate-pulse" />
          </div>
          
          {/* Progress text */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-full shadow-lg">
            <div className="flex items-center gap-3">
              <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
              <span className="font-semibold">Analisando com IA... {Math.round(scanProgress)}%</span>
            </div>
          </div>
        </div>
      )}
      
      {showParts && detectedParts.length > 0 && (
        <>
          <Button
            variant="destructive"
            size="sm"
            className="absolute top-4 right-4 gap-2 shadow-lg z-20"
            onClick={handleClearAnalysis}
          >
            <X className="h-4 w-4" />
            Limpar Análise
          </Button>
          
          <div className="absolute bottom-4 left-4 right-4 flex gap-3 overflow-x-auto pb-2">
            {detectedParts.map((part) => (
              <Card 
                key={part.id}
                className="flex-shrink-0 w-48 p-3 bg-background/95 backdrop-blur shadow-xl border-2"
                style={{
                  borderColor: part.status === "healthy" ? "rgb(34 197 94)" : part.status === "warning" ? "rgb(251 146 60)" : "rgb(239 68 68)"
                }}
              >
                <div className="flex items-start gap-2">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm flex-shrink-0"
                    style={{
                      background: part.status === "healthy" ? "rgb(34 197 94)" : part.status === "warning" ? "rgb(251 146 60)" : "rgb(239 68 68)"
                    }}
                  >
                    {part.marker}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{part.name}</p>
                    <Badge 
                      variant={part.status === "healthy" ? "default" : part.status === "warning" ? "secondary" : "destructive"}
                      className="text-xs mt-1"
                    >
                      {part.status === "healthy" ? "Saudável" : part.status === "warning" ? "Atenção" : "Crítico"}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
