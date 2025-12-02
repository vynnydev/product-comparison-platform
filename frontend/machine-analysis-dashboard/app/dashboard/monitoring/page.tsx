"use client"

import { useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Text } from "@react-three/drei"
import { Activity, Gauge, AlertCircle, CheckCircle2, Box, Brain, Sparkles, Building2, Hospital, Warehouse, Car, MapPin, Factory, Truck } from 'lucide-react'
import { useTheme } from "@/contexts/theme-context"
import cn from "classnames"
import * as THREE from "three"

function RoboticArm({ color = "#f59e0b", position = [0, 0, 0], rotation = 0 }: { color?: string; position?: [number, number, number]; rotation?: number }) {
  const armRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (armRef.current) {
      const time = state.clock.getElapsedTime()
      armRef.current.rotation.y = rotation + Math.sin(time * 0.5) * 0.3
      armRef.current.children[3].rotation.z = 0.3 + Math.sin(time * 0.8) * 0.4
    }
  })
  
  return (
    <group ref={armRef} position={position} scale={0.5}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow>
        <cylinderGeometry args={[0.4, 0.5, 0.5, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Lower arm */}
      <mesh position={[0, 1, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.25, 1.2, 0.25]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Joint sphere */}
      <mesh position={[0.35, 1.7, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>
      
      {/* Upper arm */}
      <mesh position={[0.8, 1.9, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.2, 0.9, 0.2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>
      
      {/* Gripper base */}
      <mesh position={[1.15, 2.3, 0]} castShadow>
        <boxGeometry args={[0.15, 0.3, 0.15]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Gripper fingers */}
      <mesh position={[1.15, 2.5, 0.1]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.05]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[1.15, 2.5, -0.1]} castShadow>
        <boxGeometry args={[0.1, 0.2, 0.05]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>
      
      {/* Activity indicator light */}
      <mesh position={[0, 0.6, 0]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={2}
        />
        <pointLight intensity={0.5} distance={2} color="#10b981" />
      </mesh>
    </group>
  )
}

function FactoryEnvironment() {
  const machines = [
    { id: "T-9R", pos: [2, 0, 2] as [number, number, number], efficiency: 88, status: "active" },
    { id: "Z-7X", pos: [-1, 0, 2] as [number, number, number], efficiency: 68, status: "active" },
    { id: "T-8R", pos: [4, 0, 0] as [number, number, number], efficiency: 69, status: "idle" },
    { id: "R-F3", pos: [-2, 0, 0] as [number, number, number], efficiency: 73, status: "active" },
    { id: "Z-8X", pos: [1, 0, -1] as [number, number, number], efficiency: 31, status: "warning" },
    { id: "C-T2", pos: [-1, 0, -2] as [number, number, number], efficiency: 70, status: "active" },
    { id: "R-F2", pos: [3, 0, -2] as [number, number, number], efficiency: 67, status: "active" },
    { id: "T-4F", pos: [5, 0, -1] as [number, number, number], efficiency: 72, status: "active" },
  ]

  return (
    <group>
      {/* Factory floor with grid pattern */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial 
          color="#1e293b" 
          metalness={0.4} 
          roughness={0.8}
        />
      </mesh>

      {/* Main corridors with animated lights */}
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[2, 0.02, 20]} />
        <meshStandardMaterial 
          color="#3b82f6" 
          emissive="#3b82f6" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>
      <mesh position={[0, 0.01, 0]}>
        <boxGeometry args={[20, 0.02, 2]} />
        <meshStandardMaterial 
          color="#10b981" 
          emissive="#10b981" 
          emissiveIntensity={0.3}
          transparent
          opacity={0.8}
        />
      </mesh>

      {/* Animated dashed lines connecting machines */}
      <DashedConnectionLines machines={machines} />

      {/* Support pillars */}
      {[[-6, 0, -6], [-6, 0, 6], [6, 0, -6], [6, 0, 6]].map((pos, idx) => (
        <mesh key={idx} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.5, 4, 0.5]} />
          <meshStandardMaterial color="#0f172a" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}

      {/* Overhead structures with lights */}
      <mesh position={[0, 3.5, 0]}>
        <boxGeometry args={[14, 0.3, 14]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.6} />
      </mesh>

      {/* Machines with platforms and status indicators */}
      {machines.map((machine, idx) => (
        <group key={machine.id} position={machine.pos}>
          {/* Platform */}
          <mesh position={[0, 0, 0]} castShadow receiveShadow>
            <boxGeometry args={[0.9, 0.05, 0.9]} />
            <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
          </mesh>
          
          {/* Robotic arm */}
          <RoboticArm 
            color={machine.status === "active" ? "#10b981" : machine.status === "warning" ? "#f59e0b" : "#64748b"} 
            position={[0, 0, 0]}
            rotation={idx * 0.5}
          />
          
          {/* Conveyor belt extension */}
          <mesh position={[0, 0.02, 1.2]} receiveShadow>
            <boxGeometry args={[0.8, 0.1, 2]} />
            <meshStandardMaterial color="#475569" metalness={0.4} roughness={0.6} />
          </mesh>
          
          {/* Status hologram */}
          <Text
            position={[0, 2.5, 0]}
            fontSize={0.2}
            color={machine.status === "active" ? "#10b981" : machine.status === "warning" ? "#f59e0b" : "#64748b"}
            anchorX="center"
            anchorY="middle"
          >
            {machine.id}
          </Text>
          
          <Text
            position={[0, 2.2, 0]}
            fontSize={0.15}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {machine.efficiency}%
          </Text>
          
          {/* Floating efficiency indicator */}
          <mesh position={[0, 3, 0]}>
            <ringGeometry args={[0.3, 0.35, 32]} />
            <meshStandardMaterial
              color={machine.status === "active" ? "#10b981" : machine.status === "warning" ? "#f59e0b" : "#64748b"}
              emissive={machine.status === "active" ? "#10b981" : machine.status === "warning" ? "#f59e0b" : "#64748b"}
              emissiveIntensity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Enhanced animated production line */}
      <AnimatedProductionLine />

      {/* Grid helper */}
      <gridHelper args={[20, 20, "#475569", "#1e293b"]} />
    </group>
  )
}

function DashedConnectionLines({ machines }: { machines: Array<{ pos: [number, number, number] }> }) {
  const linesRef = useRef<THREE.Group>(null)
  
  useFrame((state) => {
    if (linesRef.current) {
      linesRef.current.children.forEach((child, idx) => {
        if (child instanceof THREE.Line) {
          const material = child.material as THREE.LineDashedMaterial
          material.dashOffset = -state.clock.getElapsedTime() * 0.5
        }
      })
    }
  })
  
  return (
    <group ref={linesRef}>
      {machines.map((machine, idx) => {
        if (idx < machines.length - 1) {
          const start = new THREE.Vector3(...machine.pos)
          start.y = 0.5
          const end = new THREE.Vector3(...machines[idx + 1].pos)
          end.y = 0.5
          
          const points = [start, end]
          const geometry = new THREE.BufferGeometry().setFromPoints(points)
          
          return (
            <line key={idx} geometry={geometry}>
              <lineDashedMaterial
                attach="material"
                color="#3b82f6"
                dashSize={0.2}
                gapSize={0.1}
                linewidth={2}
                transparent
                opacity={0.6}
              />
            </line>
          )
        }
        return null
      })}
    </group>
  )
}

function WorkshopEnvironment() {
  const vehicles = [
    { type: "car", pos: [0, 0.8, 0] as [number, number, number], status: "inspection", progress: 65 },
    { type: "truck", pos: [-5, 0.8, 0] as [number, number, number], status: "repair", progress: 40 },
    { type: "bus", pos: [5, 0.8, 0] as [number, number, number], status: "complete", progress: 100 },
  ]

  return (
    <group>
      {/* Workshop floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[18, 0.1, 15]} />
        <meshStandardMaterial color="#2d2d2d" metalness={0.3} roughness={0.9} />
      </mesh>

      {/* Bay dividers */}
      {[-2.5, 2.5].map((x, idx) => (
        <mesh key={idx} position={[x, 0.01, 0]}>
          <boxGeometry args={[0.1, 0.02, 15]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={0.3}
          />
        </mesh>
      ))}

      {/* Vehicles with status indicators */}
      {vehicles.map((vehicle, idx) => (
        <group key={idx} position={vehicle.pos} rotation={[0, Math.PI / 6, 0]}>
          {/* Vehicle body */}
          <mesh position={[0, 0, 0]} castShadow>
            <boxGeometry args={vehicle.type === "bus" ? [4, 1.2, 1.8] : vehicle.type === "truck" ? [3.5, 1.5, 1.6] : [3, 1, 1.5]} />
            <meshStandardMaterial 
              color={vehicle.status === "complete" ? "#10b981" : vehicle.status === "repair" ? "#f59e0b" : "#3b82f6"} 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Vehicle cabin */}
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={vehicle.type === "bus" ? [3.5, 0.8, 1.7] : [2, 0.7, 1.4]} />
            <meshStandardMaterial 
              color={vehicle.status === "complete" ? "#10b981" : vehicle.status === "repair" ? "#f59e0b" : "#3b82f6"} 
              metalness={0.8} 
              roughness={0.2} 
            />
          </mesh>
          
          {/* Wheels */}
          {(vehicle.type === "bus" 
            ? [[-1.5, -0.5, 0.9], [-1.5, -0.5, -0.9], [0, -0.5, 0.9], [0, -0.5, -0.9], [1.5, -0.5, 0.9], [1.5, -0.5, -0.9]]
            : [[-1.2, -0.5, 0.8], [-1.2, -0.5, -0.8], [1.2, -0.5, 0.8], [1.2, -0.5, -0.8]]
          ).map((pos, wheelIdx) => (
            <mesh key={wheelIdx} position={pos as [number, number, number]} rotation={[0, 0, Math.PI / 2]} castShadow>
              <cylinderGeometry args={[0.4, 0.4, 0.3, 32]} />
              <meshStandardMaterial color="#1a1a1a" metalness={0.5} roughness={0.7} />
            </mesh>
          ))}
          
          {/* Status display */}
          <Text
            position={[0, 2, 0]}
            fontSize={0.3}
            color={vehicle.status === "complete" ? "#10b981" : vehicle.status === "repair" ? "#f59e0b" : "#3b82f6"}
            anchorX="center"
            anchorY="middle"
          >
            {vehicle.status.toUpperCase()}
          </Text>
          
          <Text
            position={[0, 1.6, 0]}
            fontSize={0.2}
            color="#94a3b8"
            anchorX="center"
            anchorY="middle"
          >
            {vehicle.progress}%
          </Text>
          
          {/* Progress ring */}
          <mesh position={[0, 2.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.4, 0.45, 32, 1, 0, (vehicle.progress / 100) * Math.PI * 2]} />
            <meshStandardMaterial
              color={vehicle.status === "complete" ? "#10b981" : vehicle.status === "repair" ? "#f59e0b" : "#3b82f6"}
              emissive={vehicle.status === "complete" ? "#10b981" : vehicle.status === "repair" ? "#f59e0b" : "#3b82f6"}
              emissiveIntensity={0.5}
              side={THREE.DoubleSide}
            />
          </mesh>
        </group>
      ))}

      {/* Tool cabinet */}
      <mesh position={[-7, 1, -5]} castShadow>
        <boxGeometry args={[1.5, 2, 0.6]} />
        <meshStandardMaterial color="#dc2626" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Workbenches */}
      {[-7, 7].map((x, idx) => (
        <group key={idx} position={[x, 0.8, 5]}>
          <mesh castShadow>
            <boxGeometry args={[2, 0.1, 1]} />
            <meshStandardMaterial color="#8b4513" roughness={0.8} />
          </mesh>
          <mesh position={[0, -0.4, 0]}>
            <boxGeometry args={[1.8, 0.8, 0.9]} />
            <meshStandardMaterial color="#654321" roughness={0.9} />
          </mesh>
        </group>
      ))}

      {/* Overhead lifts */}
      {vehicles.map((_, idx) => (
        <mesh key={idx} position={[vehicles[idx].pos[0], 3, vehicles[idx].pos[2]]}>
          <boxGeometry args={[0.3, 0.3, 3]} />
          <meshStandardMaterial color="#475569" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      <gridHelper args={[18, 18, "#555555", "#2d2d2d"]} />
    </group>
  )
}

function HospitalEnvironment() {
  return (
    <group>
      {/* Hospital floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[12, 0.1, 12]} />
        <meshStandardMaterial color="#f0f4f8" metalness={0.1} roughness={0.3} />
      </mesh>

      {/* MRI Machine */}
      <group position={[0, 0.8, 0]}>
        <mesh castShadow>
          <cylinderGeometry args={[1.2, 1.2, 0.8, 32]} />
          <meshStandardMaterial color="#f8fafc" metalness={0.9} roughness={0.1} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 3, 32]} />
          <meshStandardMaterial color="#cbd5e1" metalness={0.7} roughness={0.3} />
        </mesh>
        <mesh>
          <torusGeometry args={[1, 0.2, 16, 32]} />
          <meshStandardMaterial 
            color="#0ea5e9" 
            metalness={0.8} 
            roughness={0.2}
            emissive="#0ea5e9"
            emissiveIntensity={0.3}
          />
        </mesh>
        
        {/* Status indicator */}
        <Text
          position={[0, 2, 0]}
          fontSize={0.25}
          color="#10b981"
          anchorX="center"
          anchorY="middle"
        >
          OPERATIONAL
        </Text>
      </group>

      {/* CT Scanner */}
      <group position={[-4, 0.8, -3]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.9, 0.9, 0.5, 32]} />
          <meshStandardMaterial color="#e0f2fe" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.5, 0.5, 2, 32]} />
          <meshStandardMaterial color="#bae6fd" metalness={0.7} roughness={0.3} />
        </mesh>
      </group>

      {/* Ultrasound machine */}
      <mesh position={[4, 0.8, -3]} castShadow>
        <boxGeometry args={[0.6, 1.2, 0.4]} />
        <meshStandardMaterial color="#dbeafe" metalness={0.5} roughness={0.4} />
      </mesh>

      {/* Medical cart */}
      <mesh position={[-3, 0.6, 3]} castShadow>
        <boxGeometry args={[0.8, 1.2, 0.5]} />
        <meshStandardMaterial color="#e0e7ff" metalness={0.3} roughness={0.6} />
      </mesh>

      {/* Wall panels */}
      <mesh position={[0, 2, -6]}>
        <boxGeometry args={[12, 4, 0.1]} />
        <meshStandardMaterial color="#e0f2fe" />
      </mesh>

      <gridHelper args={[12, 12, "#94a3b8", "#cbd5e1"]} />
    </group>
  )
}

function WarehouseEnvironment() {
  return (
    <group>
      {/* Warehouse floor */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[20, 0.1, 20]} />
        <meshStandardMaterial color="#3a3a3a" metalness={0.2} roughness={0.9} />
      </mesh>

      {/* Storage racks (5 corridors visible) */}
      {[0, 1, 2, 3, 4].map((corridor) => {
        const xPos = (corridor - 2) * 3.5
        return (
          <group key={corridor}>
            {/* Left rack */}
            <group position={[xPos - 0.8, 0, 0]}>
              {[0, 1, 2, 3].map((shelf) => (
                <mesh key={shelf} position={[0, 0.5 + shelf * 1.2, 0]} castShadow>
                  <boxGeometry args={[1.2, 0.1, 8]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.4} />
                </mesh>
              ))}
              {/* Vertical supports */}
              {[-4, 0, 4].map((z, idx) => (
                <mesh key={idx} position={[0, 2.5, z]} castShadow>
                  <boxGeometry args={[0.1, 5, 0.1]} />
                  <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
            
            {/* Right rack */}
            <group position={[xPos + 0.8, 0, 0]}>
              {[0, 1, 2, 3].map((shelf) => (
                <mesh key={shelf} position={[0, 0.5 + shelf * 1.2, 0]} castShadow>
                  <boxGeometry args={[1.2, 0.1, 8]} />
                  <meshStandardMaterial color="#f59e0b" metalness={0.6} roughness={0.4} />
                </mesh>
              ))}
              {/* Vertical supports */}
              {[-4, 0, 4].map((z, idx) => (
                <mesh key={idx} position={[0, 2.5, z]} castShadow>
                  <boxGeometry args={[0.1, 5, 0.1]} />
                  <meshStandardMaterial color="#dc2626" metalness={0.7} roughness={0.3} />
                </mesh>
              ))}
            </group>
            
            {/* Corridor label */}
            <Text
              position={[xPos, 5.5, 0]}
              fontSize={0.4}
              color="#fbbf24"
              anchorX="center"
              anchorY="middle"
            >
              {`CORREDOR ${corridor + 1}`}
            </Text>
            
            {/* Pallets with boxes */}
            {[0, 2].map((shelfLevel) => {
              return [-3, -1, 1, 3].map((zPos, idx) => (
                <mesh 
                  key={`${shelfLevel}-${idx}`} 
                  position={[xPos - 0.8, 0.6 + shelfLevel * 1.2, zPos]} 
                  castShadow
                >
                  <boxGeometry args={[0.8, 0.6, 0.8]} />
                  <meshStandardMaterial color="#8b4513" roughness={0.8} />
                </mesh>
              ))
            })}
          </group>
        )
      })}

      {/* Forklift */}
      <group position={[0, 0.5, -7]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.5, 0.8, 1]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, 1, 0.3]} castShadow>
          <boxGeometry args={[0.6, 0.8, 0.4]} />
          <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
        </mesh>
        {/* Forks */}
        <mesh position={[0, 0.3, -0.8]} castShadow>
          <boxGeometry args={[0.1, 0.05, 1]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0.4, 0.3, -0.8]} castShadow>
          <boxGeometry args={[0.1, 0.05, 1]} />
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Aisle markers */}
      {[-7, 0, 7].map((z, idx) => (
        <mesh key={idx} position={[0, 0.01, z]}>
          <boxGeometry args={[20, 0.02, 0.3]} />
          <meshStandardMaterial 
            color="#fbbf24" 
            emissive="#fbbf24" 
            emissiveIntensity={0.2}
          />
        </mesh>
      ))}

      <gridHelper args={[20, 20, "#666666", "#3a3a3a"]} />
    </group>
  )
}


function AnimatedProductionLine() {
  const lineRefs = useRef<(THREE.Group | null)[]>([])
  
  useFrame((state) => {
    const time = state.clock.getElapsedTime()
    lineRefs.current.forEach((ref, index) => {
      if (ref) {
        ref.position.x = (Math.sin(time * 0.5 + index * 2) * 2) - 1
      }
    })
  })

  const stations = [
    { name: "Packing", color: "#3b82f6", pos: [0, 0, 0] },
    { name: "Labelling", color: "#10b981", pos: [3, 0, 0] },
    { name: "Riveting", color: "#f59e0b", pos: [6, 0, 0] },
    { name: "Cutting", color: "#ef4444", pos: [9, 0, 0] },
  ]

  return (
    <group position={[-4.5, 0, 0]}>
      {[0, 1, 2].map((lineNum) => (
        <group key={lineNum} position={[0, 0, lineNum * 3 - 3]}>
          {/* Conveyor belt */}
          <mesh position={[4.5, -0.05, 0]} receiveShadow>
            <boxGeometry args={[10, 0.1, 0.8]} />
            <meshStandardMaterial color="#4b5563" metalness={0.4} roughness={0.8} />
          </mesh>
          
          {/* Belt movement lines */}
          {[0, 0.2, 0.4, 0.6, 0.8].map((offset, i) => (
            <mesh key={i} position={[4.5 - 5 + offset * 10, 0, 0]}>
              <boxGeometry args={[0.1, 0.02, 0.8]} />
              <meshStandardMaterial 
                color="#6b7280" 
                emissive="#3b82f6"
                emissiveIntensity={0.1}
              />
            </mesh>
          ))}
          
          {stations.map((station, stationIdx) => (
            <group key={stationIdx} position={station.pos as [number, number, number]}>
              {/* Station platform */}
              <mesh position={[0, 0.3, 0]} castShadow>
                <boxGeometry args={[1.2, 0.6, 1]} />
                <meshStandardMaterial 
                  color={station.color} 
                  metalness={0.7} 
                  roughness={0.3}
                  emissive={station.color}
                  emissiveIntensity={0.2}
                />
              </mesh>
              
              {/* Status indicator light */}
              <mesh position={[0, 0.7, 0]}>
                <sphereGeometry args={[0.1, 16, 16]} />
                <meshStandardMaterial
                  color="#10b981"
                  emissive="#10b981"
                  emissiveIntensity={1 + Math.sin(Date.now() * 0.003) * 0.5}
                  metalness={0.5}
                  roughness={0.5}
                />
              </mesh>
              
              {/* Connection lines */}
              {stationIdx < stations.length - 1 && (
                <>
                  <mesh position={[1.5, 0.05, 0]}>
                    <boxGeometry args={[1.5, 0.05, 0.15]} />
                    <meshStandardMaterial 
                      color="#10b981" 
                      emissive="#10b981" 
                      emissiveIntensity={0.4}
                    />
                  </mesh>
                  {/* Animated flow particles */}
                  {[0, 0.5, 1].map((offset, i) => (
                    <mesh key={i} position={[0.5 + offset, 0.05, 0]}>
                      <sphereGeometry args={[0.05, 8, 8]} />
                      <meshStandardMaterial
                        color="#3b82f6"
                        emissive="#3b82f6"
                        emissiveIntensity={0.8}
                      />
                    </mesh>
                  ))}
                </>
              )}
            </group>
          ))}
          
          {/* Moving product */}
          <group ref={(el) => (lineRefs.current[lineNum] = el)} position={[0, 0.2, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.3, 0.3, 0.3]} />
              <meshStandardMaterial 
                color="#fbbf24" 
                metalness={0.6} 
                roughness={0.4}
                emissive="#fbbf24"
                emissiveIntensity={0.3}
              />
            </mesh>
            {/* Product highlight */}
            <mesh position={[0, 0.2, 0]}>
              <sphereGeometry args={[0.05, 8, 8]} />
              <meshStandardMaterial
                color="#10b981"
                emissive="#10b981"
                emissiveIntensity={1}
              />
            </mesh>
          </group>
        </group>
      ))}
      
      <gridHelper args={[20, 20, "#3b82f6", "#1e293b"]} position={[4, -0.1, 0]} />
    </group>
  )
}

function ProductionLineSVG({ lineNum, locationType }: { lineNum: number; locationType: "factory" | "workshop" | "hospital" | "warehouse" }) {
  const { theme } = useTheme()
  
  if (locationType === "factory") {
    return (
      <svg viewBox="0 0 1200 300" className="w-full h-full">
        <defs>
          {/* Gradient definitions */}
          <linearGradient id={`belt-gradient-${lineNum}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="50%" stopColor="#475569" />
            <stop offset="100%" stopColor="#64748b" />
          </linearGradient>
          
          {/* Animated dashed line */}
          <linearGradient id={`flow-gradient-${lineNum}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
            <stop offset="50%" stopColor="#3b82f6" stopOpacity="1">
              <animate attributeName="stop-opacity" values="0;1;0" dur="2s" repeatCount="indefinite" />
            </stop>
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
          </linearGradient>
          
          {/* Glow filter */}
          <filter id={`glow-${lineNum}`}>
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Main conveyor belt */}
        <rect x="50" y="120" width="1100" height="60" fill={`url(#belt-gradient-${lineNum})`} rx="5" />
        
        {/* Belt movement lines (animated) */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
          <line
            key={i}
            x1={50 + i * 100}
            y1="130"
            x2={50 + i * 100}
            y2="170"
            stroke="#94a3b8"
            strokeWidth="3"
            strokeDasharray="10,10"
            opacity="0.6"
          >
            <animateTransform
              attributeName="transform"
              type="translate"
              from="0 0"
              to="100 0"
              dur="3s"
              repeatCount="indefinite"
            />
          </line>
        ))}
        
        {/* Stations */}
        {[
          { x: 150, name: "Packing", color: "#3b82f6", icon: "📦" },
          { x: 425, name: "Labelling", color: "#10b981", icon: "🏷️" },
          { x: 700, name: "Riveting", color: "#f59e0b", icon: "🔩" },
          { x: 975, name: "Cutting", color: "#ef4444", icon: "✂️" },
        ].map((station, idx) => (
          <g key={idx}>
            {/* Station platform */}
            <rect
              x={station.x - 60}
              y="60"
              width="120"
              height="180"
              fill={station.color}
              fillOpacity="0.1"
              stroke={station.color}
              strokeWidth="3"
              rx="10"
            />
            
            {/* Machine body */}
            <rect
              x={station.x - 40}
              y="70"
              width="80"
              height="40"
              fill={station.color}
              fillOpacity="0.8"
              rx="5"
            />
            
            {/* Robotic arm (simplified) */}
            <line
              x1={station.x}
              y1="110"
              x2={station.x + 20}
              y2="90"
              stroke={station.color}
              strokeWidth="6"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${station.x} 110`}
                to={`30 ${station.x} 110`}
                dur="2s"
                repeatCount="indefinite"
                additive="sum"
              />
            </line>
            
            <line
              x1={station.x + 20}
              y1="90"
              x2={station.x + 30}
              y2="120"
              stroke={station.color}
              strokeWidth="5"
              strokeLinecap="round"
            >
              <animateTransform
                attributeName="transform"
                type="rotate"
                from={`0 ${station.x + 20} 90`}
                to={`-20 ${station.x + 20} 90`}
                dur="2s"
                repeatCount="indefinite"
                additive="sum"
              />
            </line>
            
            {/* Status indicator (pulsing) */}
            <circle
              cx={station.x}
              cy="85"
              r="5"
              fill="#10b981"
              filter={`url(#glow-${lineNum})`}
            >
              <animate attributeName="opacity" values="1;0.3;1" dur="1.5s" repeatCount="indefinite" />
            </circle>
            
            {/* Station label */}
            <text
              x={station.x}
              y="230"
              textAnchor="middle"
              fill={theme === "light" ? "#1e293b" : "#f1f5f9"}
              fontSize="16"
              fontWeight="600"
            >
              {station.name}
            </text>
            
            <text
              x={station.x}
              y="250"
              textAnchor="middle"
              fill={theme === "light" ? "#64748b" : "#94a3b8"}
              fontSize="12"
            >
              Line/ 0{lineNum}
            </text>
            
            {/* Connection arrows to next station */}
            {idx < 3 && (
              <>
                <line
                  x1={station.x + 60}
                  y1="150"
                  x2={station.x + 215}
                  y2="150"
                  stroke="#10b981"
                  strokeWidth="4"
                  strokeDasharray="10,5"
                  opacity="0.6"
                >
                  <animate attributeName="stroke-dashoffset" from="0" to="-15" dur="1s" repeatCount="indefinite" />
                </line>
                
                {/* Flow indicator (moving circle) */}
                <circle r="6" fill="#3b82f6" filter={`url(#glow-${lineNum})`}>
                  <animateMotion
                    path={`M${station.x + 60},150 L${station.x + 215},150`}
                    dur="3s"
                    repeatCount="indefinite"
                  />
                </circle>
                
                {/* Arrow head */}
                <polygon
                  points={`${station.x + 215},145 ${station.x + 225},150 ${station.x + 215},155`}
                  fill="#10b981"
                  opacity="0.8"
                />
              </>
            )}
          </g>
        ))}
        
        {/* Moving product on belt */}
        <g>
          <rect
            width="30"
            height="30"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="3"
          >
            <animateMotion
              path="M50,135 L1150,135"
              dur="10s"
              repeatCount="indefinite"
            />
          </rect>
        </g>
      </svg>
    )
  }
  
  if (locationType === "workshop") {
    return (
      <svg viewBox="0 0 1200 300" className="w-full h-full">
        <defs>
          <filter id={`workshop-glow-${lineNum}`}>
            <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Workshop bays */}
        {[
          { x: 200, vehicle: "car", status: "Inspeção", progress: 65, color: "#3b82f6" },
          { x: 600, vehicle: "truck", status: "Reparo", progress: 40, color: "#f59e0b" },
          { x: 1000, vehicle: "bus", status: "Concluído", progress: 100, color: "#10b981" },
        ].map((bay, idx) => (
          <g key={idx}>
            {/* Bay area */}
            <rect
              x={bay.x - 120}
              y="50"
              width="240"
              height="200"
              fill={bay.color}
              fillOpacity="0.05"
              stroke={bay.color}
              strokeWidth="2"
              strokeDasharray="10,5"
              rx="10"
            />
            
            {/* Vehicle body */}
            <rect
              x={bay.x - 80}
              y="120"
              width={bay.vehicle === "bus" ? "160" : bay.vehicle === "truck" ? "140" : "120"}
              height="50"
              fill={bay.color}
              fillOpacity="0.8"
              stroke={bay.color}
              strokeWidth="3"
              rx="8"
            />
            
            {/* Vehicle cabin */}
            <rect
              x={bay.x - 70}
              y="100"
              width={bay.vehicle === "bus" ? "140" : "80"}
              height="30"
              fill={bay.color}
              fillOpacity="0.9"
              rx="5"
            />
            
            {/* Wheels */}
            {(bay.vehicle === "bus" 
              ? [bay.x - 60, bay.x - 20, bay.x + 20, bay.x + 60]
              : [bay.x - 50, bay.x + 50]
            ).map((wheelX, wheelIdx) => (
              <g key={wheelIdx}>
                <circle cx={wheelX} cy="175" r="15" fill="#1a1a1a" stroke="#64748b" strokeWidth="2" />
                <circle cx={wheelX} cy="175" r="8" fill="#64748b" />
              </g>
            ))}
            
            {/* Status label */}
            <text
              x={bay.x}
              y="75"
              textAnchor="middle"
              fill={bay.color}
              fontSize="18"
              fontWeight="700"
            >
              {bay.status.toUpperCase()}
            </text>
            
            {/* Progress bar */}
            <rect
              x={bay.x - 80}
              y="200"
              width="160"
              height="8"
              fill={theme === "light" ? "#e2e8f0" : "#334155"}
              rx="4"
            />
            <rect
              x={bay.x - 80}
              y="200"
              width={160 * (bay.progress / 100)}
              height="8"
              fill={bay.color}
              rx="4"
            >
              <animate attributeName="width" from="0" to={160 * (bay.progress / 100)} dur="1s" fill="freeze" />
            </rect>
            
            <text
              x={bay.x}
              y="225"
              textAnchor="middle"
              fill={theme === "light" ? "#64748b" : "#94a3b8"}
              fontSize="14"
              fontWeight="600"
            >
              {bay.progress}%
            </text>
            
            {/* Overhead lift indicator */}
            <rect
              x={bay.x - 5}
              y="20"
              width="10"
              height="30"
              fill="#64748b"
              rx="2"
            />
            <line
              x1={bay.x}
              y1="50"
              x2={bay.x}
              y2="95"
              stroke="#64748b"
              strokeWidth="2"
              strokeDasharray="5,3"
            />
          </g>
        ))}
      </svg>
    )
  }
  
  if (locationType === "warehouse") {
    return (
      <svg viewBox="0 0 1200 400" className="w-full h-full">
        {/* 5 visible corridors */}
        {[0, 1, 2, 3, 4].map((corridor) => {
          const x = 150 + corridor * 200
          return (
            <g key={corridor}>
              {/* Left rack */}
              <g>
                {/* Vertical supports */}
                <rect x={x - 50} y="50" width="8" height="280" fill="#dc2626" />
                <rect x={x - 20} y="50" width="8" height="280" fill="#dc2626" />
                
                {/* Shelves */}
                {[0, 1, 2, 3].map((shelf) => (
                  <rect
                    key={shelf}
                    x={x - 55}
                    y={80 + shelf * 60}
                    width="68"
                    height="6"
                    fill="#f59e0b"
                  />
                ))}
                
                {/* Boxes on shelves */}
                {[0, 1, 2].map((shelf) => (
                  <g key={shelf}>
                    <rect
                      x={x - 48}
                      y={60 + shelf * 60}
                      width="25"
                      height="18"
                      fill="#8b4513"
                      stroke="#654321"
                      strokeWidth="1"
                    />
                    <rect
                      x={x - 20}
                      y={60 + shelf * 60}
                      width="25"
                      height="18"
                      fill="#8b4513"
                      stroke="#654321"
                      strokeWidth="1"
                    />
                  </g>
                ))}
              </g>
              
              {/* Right rack (mirror of left) */}
              <g>
                <rect x={x + 42} y="50" width="8" height="280" fill="#dc2626" />
                <rect x={x + 72} y="50" width="8" height="280" fill="#dc2626" />
                
                {[0, 1, 2, 3].map((shelf) => (
                  <rect
                    key={shelf}
                    x={x + 37}
                    y={80 + shelf * 60}
                    width="68"
                    height="6"
                    fill="#f59e0b"
                  />
                ))}
                
                {[0, 1, 2].map((shelf) => (
                  <g key={shelf}>
                    <rect
                      x={x + 45}
                      y={60 + shelf * 60}
                      width="25"
                      height="18"
                      fill="#8b4513"
                      stroke="#654321"
                      strokeWidth="1"
                    />
                    <rect
                      x={x + 73}
                      y={60 + shelf * 60}
                      width="25"
                      height="18"
                      fill="#8b4513"
                      stroke="#654321"
                      strokeWidth="1"
                    />
                  </g>
                ))}
              </g>
              
              {/* Corridor label */}
              <text
                x={x + 10}
                y="35"
                textAnchor="middle"
                fill="#fbbf24"
                fontSize="16"
                fontWeight="700"
              >
                CORREDOR {corridor + 1}
              </text>
              
              {/* Aisle marker */}
              <line
                x1={x + 10}
                y1="330"
                x2={x + 10}
                y2="350"
                stroke="#fbbf24"
                strokeWidth="4"
              />
            </g>
          )
        })}
        
        {/* Forklift */}
        <g>
          {/* Forklift body */}
          <rect
            x="50"
            y="310"
            width="60"
            height="35"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="3"
          >
            <animateMotion
              path="M0,0 L900,0 L900,0 L0,0"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Cabin */}
          <rect
            x="60"
            y="295"
            width="30"
            height="20"
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth="2"
            rx="2"
          >
            <animateMotion
              path="M0,0 L900,0 L900,0 L0,0"
              dur="20s"
              repeatCount="indefinite"
            />
          </rect>
          
          {/* Wheels */}
          <circle cx="65" cy="345" r="8" fill="#1a1a1a">
            <animateMotion
              path="M0,0 L900,0 L900,0 L0,0"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
          <circle cx="95" cy="345" r="8" fill="#1a1a1a">
            <animateMotion
              path="M0,0 L900,0 L900,0 L0,0"
              dur="20s"
              repeatCount="indefinite"
            />
          </circle>
        </g>
        
        {/* Floor aisle lines */}
        <line x1="0" y1="360" x2="1200" y2="360" stroke="#fbbf24" strokeWidth="3" opacity="0.4" strokeDasharray="20,10" />
      </svg>
    )
  }
  
  // Hospital
  return (
    <svg viewBox="0 0 1200 300" className="w-full h-full">
      {[
        { x: 200, name: "MRI", color: "#0ea5e9", icon: "🔬" },
        { x: 500, name: "CT Scanner", color: "#06b6d4", icon: "💉" },
        { x: 800, name: "Ultrasound", color: "#8b5cf6", icon: "🩺" },
      ].map((equipment, idx) => (
        <g key={idx}>
          {/* Equipment zone */}
          <rect
            x={equipment.x - 80}
            y="50"
            width="160"
            height="180"
            fill={equipment.color}
            fillOpacity="0.05"
            stroke={equipment.color}
            strokeWidth="2"
            rx="10"
          />
          
          {/* Equipment body */}
          <ellipse
            cx={equipment.x}
            cy="130"
            rx="50"
            ry="40"
            fill={equipment.color}
            fillOpacity="0.8"
          />
          
          {/* Inner circle (scanner aperture) */}
          <circle
            cx={equipment.x}
            cy="130"
            r="25"
            fill={theme === "light" ? "#f8fafc" : "#1e293b"}
            stroke={equipment.color}
            strokeWidth="3"
          />
          
          {/* Status indicator (pulsing ring) */}
          <circle
            cx={equipment.x}
            cy="130"
            r="30"
            fill="none"
            stroke="#10b981"
            strokeWidth="3"
            opacity="0.6"
          >
            <animate attributeName="r" values="30;40;30" dur="2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
          </circle>
          
          {/* Equipment label */}
          <text
            x={equipment.x}
            y="190"
            textAnchor="middle"
            fill={equipment.color}
            fontSize="18"
            fontWeight="700"
          >
            {equipment.name}
          </text>
          
          <text
            x={equipment.x}
            y="210"
            textAnchor="middle"
            fill="#10b981"
            fontSize="14"
            fontWeight="600"
          >
            OPERACIONAL
          </text>
          
          {/* Connection lines between equipment */}
          {idx < 2 && (
            <line
              x1={equipment.x + 80}
              y1="130"
              x2={equipment.x + 220}
              y2="130"
              stroke={equipment.color}
              strokeWidth="3"
              strokeDasharray="10,5"
              opacity="0.4"
            >
              <animate attributeName="stroke-dashoffset" from="0" to="-15" dur="1s" repeatCount="indefinite" />
            </line>
          )}
        </g>
      ))}
    </svg>
  )
}


export default function MonitoringPage() {
  const router = useRouter()
  const { theme } = useTheme()
  const [viewMode, setViewMode] = useState<"overview" | "individual">("overview")
  const [view3D, setView3D] = useState(true)
  const [selectedLocation, setSelectedLocation] = useState<string>("factory-main")
  const [selectedEnvironment, setSelectedEnvironment] = useState<"factory" | "workshop" | "hospital" | "warehouse">("factory")
  const [analyzingMachine, setAnalyzingMachine] = useState<string | null>(null)

  const handleLocationChange = (value: string) => {
    setSelectedLocation(value)
    const location = locations.find(loc => loc.value === value)
    if (location) {
      setSelectedEnvironment(location.type)
    }
  }

  const handleMachineClick = (machineId: string) => {
    router.push(`/dashboard/analysis?machine=${machineId}`)
  }

  const handleAIAnalysis = (machineId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    setAnalyzingMachine(machineId)
    setTimeout(() => setAnalyzingMachine(null), 3000)
  }

  const locations = [
    { value: "factory-main", label: "Fábrica Principal - São Paulo", icon: Factory, type: "factory" as const },
    { value: "factory-secondary", label: "Fábrica Secundária - Campinas", icon: Building2, type: "factory" as const },
    { value: "workshop-auto", label: "Oficina Automotiva - SP", icon: Car, type: "workshop" as const },
    { value: "workshop-trucks", label: "Oficina de Caminhões - SP", icon: Truck, type: "workshop" as const },
    { value: "warehouse-1", label: "Galpão 1 - Guarulhos", icon: Warehouse, type: "warehouse" as const },
    { value: "warehouse-2", label: "Galpão 2 - Santos", icon: Warehouse, type: "warehouse" as const },
    { value: "hospital-equipment", label: "Equipamentos Hospitalares", icon: Hospital, type: "hospital" as const },
  ]

  const getStatusColor = (status: string) => {
    const colors = {
      running: "bg-green-500",
      idle: "bg-yellow-500",
      stopped: "bg-gray-500",
      error: "bg-red-500",
      maintenance: "bg-orange-500",
    }
    return colors[status as keyof typeof colors] || "bg-gray-500"
  }

  const selectedLocationData = locations.find(loc => loc.value === selectedLocation)

  return (
    <div className="space-y-6">
      <Card className={cn(
        "border-2",
        theme === "light" 
          ? "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200" 
          : "bg-gradient-to-r from-blue-950/30 to-indigo-950/30 border-blue-800/30"
      )}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className={cn(
                "p-3 rounded-xl",
                theme === "light" ? "bg-blue-100" : "bg-blue-900/50"
              )}>
                <MapPin className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Localização Atual</h3>
                <Select value={selectedLocation} onValueChange={handleLocationChange}>
                  <SelectTrigger className="w-[400px] h-12 text-base font-semibold border-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {locations.map((location) => {
                      const Icon = location.icon
                      return (
                        <SelectItem key={location.value} value={location.value}>
                          <div className="flex items-center gap-3 py-1">
                            <Icon className="h-5 w-5 text-muted-foreground" />
                            <span className="font-medium">{location.label}</span>
                          </div>
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant={view3D ? "default" : "outline"}
                size="lg"
                onClick={() => setView3D(!view3D)}
                className="gap-2"
              >
                <Box className="h-5 w-5" />
                Visão 3D {view3D && "Ativa"}
              </Button>
              <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "overview" | "individual")}>
                <TabsList className="h-12">
                  <TabsTrigger value="overview" className="px-6">Visão Geral</TabsTrigger>
                  <TabsTrigger value="individual" className="px-6">Visão Individual</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Monitoramento em Tempo Real</h1>
          <p className="text-muted-foreground mt-1">
            {selectedLocationData && (
              <span className="flex items-center gap-2">
                <selectedLocationData.icon className="h-4 w-4" />
                {selectedLocationData.label}
              </span>
            )}
          </p>
        </div>
      </div>

      {viewMode === "overview" && (
        <div className="space-y-6">
          {view3D && (
            <Card className="overflow-hidden border-2 shadow-xl">
              <CardHeader className="border-b bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-blue-500/10">
                      <Box className="h-5 w-5 text-blue-500" />
                    </div>
                    <div>
                      <CardTitle className="text-xl">Visualização 3D do Ambiente</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        Explore o ambiente em tempo real com controles interativos
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="gap-2 px-3 py-1.5 bg-green-500/10 border-green-500/20 text-green-600">
                    <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                    Ao Vivo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  className={cn(
                    "h-[600px] relative",
                    theme === "light"
                      ? "bg-gradient-to-br from-slate-100 via-slate-200 to-slate-300"
                      : "bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800"
                  )}
                >
                  <Canvas shadows>
                    <PerspectiveCamera makeDefault position={[10, 10, 10]} />
                    <OrbitControls 
                      enableZoom={true} 
                      enablePan={true}
                      maxPolarAngle={Math.PI / 2}
                      minDistance={5}
                      maxDistance={30}
                    />
                    <ambientLight intensity={theme === "light" ? 0.6 : 0.3} />
                    <directionalLight
                      position={[10, 15, 10]}
                      intensity={1}
                      castShadow
                      shadow-mapSize-width={2048}
                      shadow-mapSize-height={2048}
                      shadow-camera-far={50}
                      shadow-camera-left={-15}
                      shadow-camera-right={15}
                      shadow-camera-top={15}
                      shadow-camera-bottom={-15}
                    />
                    <spotLight
                      position={[-10, 15, -10]}
                      angle={0.3}
                      penumbra={1}
                      intensity={0.5}
                      castShadow
                    />
                    <pointLight position={[0, 10, 0]} intensity={0.4} />
                    <pointLight position={[-10, 5, -10]} intensity={0.2} color="#3b82f6" />
                    <pointLight position={[10, 5, 10]} intensity={0.2} color="#10b981" />
                    
                    {selectedEnvironment === "factory" && <FactoryEnvironment />}
                    {selectedEnvironment === "workshop" && <WorkshopEnvironment />}
                    {selectedEnvironment === "hospital" && <HospitalEnvironment />}
                    {selectedEnvironment === "warehouse" && <WarehouseEnvironment />}
                    
                    <Environment preset={theme === "light" ? "city" : "night"} />
                  </Canvas>
                  
                  {/* Enhanced stats overlay */}
                  <div className="absolute bottom-6 left-6 space-y-3 z-10">
                    <Card className="bg-background/90 backdrop-blur-md border-2 shadow-2xl">
                      <CardContent className="p-5">
                        <p className="text-xs text-muted-foreground mb-2 font-medium uppercase tracking-wider">Total de Dispositivos</p>
                        <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                          {selectedEnvironment === "factory" 
                            ? "201" 
                            : selectedEnvironment === "workshop" 
                              ? "48" 
                              : selectedEnvironment === "warehouse"
                                ? "156"
                                : "32"}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Dispositivos Conectados</p>
                      </CardContent>
                    </Card>
                    <div className="grid grid-cols-2 gap-3">
                      <Card className="bg-background/90 backdrop-blur-md border-2 shadow-xl">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                            <p className="text-xs text-muted-foreground font-medium">Operando</p>
                          </div>
                          <p className="text-3xl font-bold text-green-500">
                            {selectedEnvironment === "factory"
                              ? "15"
                              : selectedEnvironment === "workshop"
                                ? "8"
                                : selectedEnvironment === "warehouse"
                                  ? "12"
                                  : "5"}
                          </p>
                        </CardContent>
                      </Card>
                      <Card className="bg-background/90 backdrop-blur-md border-2 shadow-xl">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle className="h-5 w-5 text-orange-500" />
                            <p className="text-xs text-muted-foreground font-medium">Em Reparo</p>
                          </div>
                          <p className="text-3xl font-bold text-orange-500">
                            {selectedEnvironment === "factory" 
                              ? "4" 
                              : selectedEnvironment === "workshop" 
                                ? "2"
                                : selectedEnvironment === "warehouse"
                                  ? "3"
                                  : "1"}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                  
                  {/* Controls hint */}
                  <div className="absolute top-6 right-6 z-10">
                    <Card className="bg-background/80 backdrop-blur-sm border border-border/50">
                      <CardContent className="p-3">
                        <p className="text-xs text-muted-foreground">
                          <span className="font-semibold">Controles:</span> Arrastar para rotacionar • Scroll para zoom • Botão direito para mover
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {!view3D && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Linhas de Produção - Visualização em Diagrama</CardTitle>
                  <Badge variant="outline" className="gap-2">
                    <Activity className="h-3 w-3" />
                    Modo 2D Ativo
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[1, 2, 3].map((lineNum) => (
                    <div
                      key={lineNum}
                      className={cn(
                        "rounded-xl p-6 border-2 cursor-pointer transition-all hover:shadow-lg relative overflow-hidden",
                        theme === "light"
                          ? "bg-gradient-to-br from-white via-slate-50 to-slate-100 border-slate-200 hover:border-blue-300"
                          : "bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 border-slate-700 hover:border-blue-600",
                        analyzingMachine === `line-${lineNum}` && "ring-2 ring-purple-500 ring-offset-2"
                      )}
                      onClick={() => handleMachineClick(`line-${lineNum}`)}
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <h4 className="text-lg font-bold">Linha {lineNum}</h4>
                          {analyzingMachine === `line-${lineNum}` && (
                            <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
                              <Brain className="h-3 w-3" />
                              Analisando com IA...
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={(e) => handleAIAnalysis(`line-${lineNum}`, e)}
                            className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-500"
                          >
                            <Sparkles className="h-4 w-4" />
                            Analisar com IA
                          </Button>
                          <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                            Ativa
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="h-[300px] rounded-lg border bg-gradient-to-br from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 p-4">
                        <ProductionLineSVG lineNum={lineNum} locationType={selectedEnvironment} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Máquinas Disponíveis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { id: "robot-1", name: "Braço Robótico T-9R", type: "Robotic Arm", status: "running" },
                  { id: "robot-2", name: "Braço Robótico Z-7X", type: "Robotic Arm", status: "idle" },
                  { id: "robot-3", name: "Braço Robótico R-F3", type: "Robotic Arm", status: "running" },
                  { id: "robot-4", name: "Braço Robótico C-T2", type: "Robotic Arm", status: "maintenance" },
                ].map((machine) => (
                  <div
                    key={machine.id}
                    className={cn(
                      "flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md",
                      theme === "light"
                        ? "bg-gradient-to-r from-blue-50/50 to-slate-50 border-blue-100"
                        : "bg-gradient-to-r from-blue-950/30 to-slate-900 border-blue-900/30",
                      analyzingMachine === machine.id && "ring-2 ring-purple-500 ring-offset-2"
                    )}
                    onClick={() => handleMachineClick(machine.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div>
                        <h4 className="text-sm font-semibold">{machine.name}</h4>
                        <p className="text-xs text-muted-foreground">{machine.type}</p>
                      </div>
                      {analyzingMachine === machine.id && (
                        <Badge className="gap-1 bg-gradient-to-r from-purple-500 to-blue-500 animate-pulse">
                          <Brain className="h-3 w-3" />
                          Analisando...
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={(e) => handleAIAnalysis(machine.id, e)}
                        className="gap-2 bg-gradient-to-r from-purple-500/10 to-blue-500/10 border-purple-500/20 hover:from-purple-500/20 hover:to-blue-500/20 text-purple-500"
                      >
                        <Sparkles className="h-4 w-4" />
                        Analisar
                      </Button>
                      <div className={cn("h-2 w-2 rounded-full", getStatusColor(machine.status))} />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {viewMode === "individual" && (
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2">
            <Card
              className={cn(
                theme === "light"
                  ? "bg-gradient-to-br from-slate-50 to-slate-100 border-slate-200"
                  : "bg-gradient-to-br from-slate-900 to-slate-800 border-slate-700"
              )}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className={cn("text-xl font-semibold mb-1", theme === "light" ? "text-slate-900" : "text-white")}>
                      Bomba Centrífuga BCP-001
                    </h3>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-green-500 text-white">Em Operação</Badge>
                      <span className={cn("text-sm", theme === "light" ? "text-slate-600" : "text-slate-400")}>
                        ID: 1
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-green-500/10 border-green-500/20 hover:bg-green-500/20 text-green-400"
                    >
                      Iniciar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-yellow-500/10 border-yellow-500/20 hover:bg-yellow-500/20 text-yellow-400"
                    >
                      Pausar
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="bg-red-500/10 border-red-500/20 hover:bg-red-500/20 text-red-400"
                    >
                      Parar
                    </Button>
                  </div>
                </div>

                <div
                  className={cn(
                    "aspect-video rounded-lg flex items-center justify-center border mb-6",
                    theme === "light"
                      ? "bg-gradient-to-br from-cyan-50 via-blue-50 to-indigo-50 border-slate-200"
                      : "bg-slate-800 border-slate-700"
                  )}
                >
                  <div className="text-center">
                    <Activity
                      className={cn(
                        "h-16 w-16 mx-auto mb-4 animate-pulse",
                        theme === "light" ? "text-blue-600" : "text-blue-500"
                      )}
                    />
                    <p className={cn("text-sm", theme === "light" ? "text-slate-600" : "text-slate-400")}>
                      Visualização 3D da Máquina
                    </p>
                    <p className={cn("text-xs mt-1", theme === "light" ? "text-slate-500" : "text-slate-500")}>
                      Modelo interativo em tempo real
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: Gauge, label: "Velocidade", value: "1750", unit: "RPM", color: "blue" },
                    { icon: Activity, label: "Temperatura", value: "68", unit: "°C", color: "orange" },
                    { icon: Gauge, label: "Pressão", value: "85", unit: "PSI", color: "cyan" },
                    { icon: Activity, label: "Potência", value: "45.5", unit: "kW", color: "yellow" },
                  ].map((metric, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "rounded-lg p-4 border",
                        theme === "light"
                          ? "bg-white/50 border-slate-200"
                          : "bg-slate-800/50 border-slate-700"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <metric.icon
                          className={cn(
                            "h-4 w-4",
                            metric.color === "blue" && "text-blue-400",
                            metric.color === "orange" && "text-orange-400",
                            metric.color === "cyan" && "text-cyan-400",
                            metric.color === "yellow" && "text-yellow-400"
                          )}
                        />
                        <span className="text-xs text-muted-foreground">{metric.label}</span>
                      </div>
                      <p className={cn("text-2xl font-bold", theme === "light" ? "text-slate-900" : "text-white")}>
                        {metric.value}
                      </p>
                      <p className="text-xs text-muted-foreground">{metric.unit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Padrão de Corte</CardTitle>
              </CardHeader>
              <CardContent>
                <div
                  className={cn(
                    "rounded-lg p-6 flex items-center justify-center h-48 border",
                    theme === "light" ? "bg-slate-50 border-slate-200" : "bg-slate-900 border-slate-700"
                  )}
                >
                  <div className="text-center">
                    <div className="w-32 h-32 border-2 border-dashed border-pink-500 rounded-lg mb-2 relative">
                      <div className="absolute inset-2 border border-pink-400 rounded-lg" />
                    </div>
                    <p className="text-xs text-muted-foreground">STI / 1-3</p>
                    <p className="text-xs text-muted-foreground mt-1">280mm x 340mm</p>
                  </div>
                </div>
                <div className="mt-4 space-y-2">
                  <Button className="w-full bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 text-green-400">
                    Aplicar
                  </Button>
                  <Button variant="outline" className="w-full bg-transparent">
                    Resetar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Indicadores de Padrão</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Tempo de Disparo</span>
                  <span className="font-medium">2.4 ms</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Frequência</span>
                  <span className="font-medium">7.3 Hz</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Ponto de Disparo</span>
                  <span className="font-medium">3</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  )
}
