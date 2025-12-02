"use client"

import { useRef } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Environment, Text } from "@react-three/drei"
import type * as THREE from "three"

function Forklift({ position = [0, 0, 0], rotation = 0, color = "#2563eb", moving = false }: any) {
  const forkRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (forkRef.current && moving) {
      const time = state.clock.getElapsedTime()
      forkRef.current.position.z = position[2] + Math.sin(time * 0.5) * 2
      forkRef.current.children[3].position.y = 0.3 + Math.sin(time * 1.5) * 0.2
      forkRef.current.children[4].position.y = 0.3 + Math.sin(time * 1.5) * 0.2
    }
  })

  return (
    <group ref={forkRef} position={position} rotation={[0, rotation, 0]} scale={0.7}>
      {/* Body - more detailed */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[0.8, 0.6, 1.2]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Cabin */}
      <mesh position={[0, 0.9, 0.2]} castShadow>
        <boxGeometry args={[0.7, 0.5, 0.6]} />
        <meshStandardMaterial color={color} metalness={0.5} roughness={0.4} transparent opacity={0.7} />
      </mesh>

      {/* Mast - taller and more detailed */}
      <mesh position={[0, 1.5, -0.3]} castShadow>
        <boxGeometry args={[0.15, 2.5, 0.15]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Forks - animated */}
      <mesh position={[-0.2, 0.3, -0.8]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>
      <mesh position={[0.2, 0.3, -0.8]} castShadow>
        <boxGeometry args={[0.1, 0.1, 1.2]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Wheels with rotation */}
      {[
        [-0.3, 0.15, 0.4],
        [0.3, 0.15, 0.4],
        [-0.3, 0.15, -0.4],
        [0.3, 0.15, -0.4],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} rotation={[Math.PI / 2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.18, 0.18, 0.15, 16]} />
          <meshStandardMaterial color="#1e293b" roughness={0.8} metalness={0.2} />
        </mesh>
      ))}

      {/* Headlights */}
      <mesh position={[0.3, 0.5, -0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fbbf24" emissiveIntensity={3} />
        <pointLight position={[0, 0, 0]} intensity={0.4} distance={4} color="#fbbf24" />
      </mesh>
      <mesh position={[-0.3, 0.5, -0.5]}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshStandardMaterial color="#fff" emissive="#fbbf24" emissiveIntensity={3} />
        <pointLight position={[0, 0, 0]} intensity={0.4} distance={4} color="#fbbf24" />
      </mesh>

      {/* Safety light on top */}
      {moving && (
        <mesh position={[0, 1.3, 0.2]}>
          <sphereGeometry args={[0.08, 16, 16]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={4} />
          <pointLight intensity={0.6} distance={3} color="#f97316" />
        </mesh>
      )}
    </group>
  )
}

function StorageRack({ position = [0, 0, 0], withPallets = true }: any) {
  return (
    <group position={position}>
      {/* Vertical supports */}
      {[
        [-1.8, 0, -0.6],
        [1.8, 0, -0.6],
        [-1.8, 0, 0.6],
        [1.8, 0, 0.6],
      ].map((pos, i) => (
        <mesh key={i} position={pos as [number, number, number]} castShadow>
          <boxGeometry args={[0.2, 5, 0.2]} />
          <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
        </mesh>
      ))}

      {/* Horizontal beams - 4 levels */}
      {[0.8, 2, 3.2, 4.4].map((y, level) => (
        <group key={level}>
          <mesh position={[0, y, -0.6]} castShadow>
            <boxGeometry args={[3.9, 0.15, 0.15]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>
          <mesh position={[0, y, 0.6]} castShadow>
            <boxGeometry args={[3.9, 0.15, 0.15]} />
            <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
          </mesh>

          {/* Pallets with boxes */}
          {withPallets && level < 3 && (
            <group position={[0, y + 0.3, 0]}>
              {/* Pallet */}
              <mesh castShadow>
                <boxGeometry args={[1.4, 0.18, 1.2]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
              </mesh>
              {/* Boxes on pallet */}
              <mesh position={[0, 0.4, 0]} castShadow>
                <boxGeometry args={[1.2, 0.6, 1]} />
                <meshStandardMaterial color="#cbd5e1" roughness={0.6} />
              </mesh>
            </group>
          )}
        </group>
      ))}
    </group>
  )
}

function ConveyorBelt({ position = [0, 0, 0], length = 5, active = true }: any) {
  const beltRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (beltRef.current && active) {
      const material = beltRef.current.material as THREE.MeshStandardMaterial
      if (material.map) {
        material.map.offset.y -= 0.01
      }
    }
  })

  return (
    <group position={position}>
      {/* Belt surface */}
      <mesh ref={beltRef} position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[1.2, 0.15, length]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Side supports */}
      <mesh position={[-0.7, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, length]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>
      <mesh position={[0.7, 0.2, 0]} castShadow>
        <boxGeometry args={[0.15, 0.4, length]} />
        <meshStandardMaterial color="#475569" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Movement indicators */}
      {active && (
        <>
          <pointLight position={[0, 0.6, 0]} intensity={0.3} distance={2.5} color="#10b981" />
          <mesh position={[0, 0.5, 0]}>
            <sphereGeometry args={[0.08, 16, 16]} />
            <meshStandardMaterial color="#10b981" emissive="#10b981" emissiveIntensity={2} />
          </mesh>
        </>
      )}
    </group>
  )
}

function RoboticArm({
  color = "#f59e0b",
  position = [0, 0, 0],
  rotation = 0,
  status = "operating",
}: {
  color?: string
  position?: [number, number, number]
  rotation?: number
  status?: string
}) {
  const armRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (armRef.current && status === "operating") {
      const time = state.clock.getElapsedTime()
      armRef.current.rotation.y = rotation + Math.sin(time * 0.5) * 0.3
      armRef.current.children[3].rotation.z = 0.3 + Math.sin(time * 0.8) * 0.4
    }
  })

  const statusColor = status === "operating" ? "#10b981" : status === "maintenance" ? "#f59e0b" : "#ef4444"

  return (
    <group ref={armRef} position={position} scale={0.8}>
      {/* Base - larger and more detailed */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.65, 0.7, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Lower arm - thicker */}
      <mesh position={[0, 1.3, 0]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.35, 1.6, 0.35]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Joint sphere - larger */}
      <mesh position={[0.5, 2.2, 0]} castShadow>
        <sphereGeometry args={[0.28, 32, 32]} />
        <meshStandardMaterial color={color} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Upper arm */}
      <mesh position={[1.1, 2.5, 0]} rotation={[0, 0, -0.5]} castShadow>
        <boxGeometry args={[0.28, 1.2, 0.28]} />
        <meshStandardMaterial color={color} metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Gripper */}
      <mesh position={[1.6, 3, 0]} castShadow>
        <boxGeometry args={[0.2, 0.4, 0.2]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Status indicator light - larger */}
      <mesh position={[0, 0.8, 0]}>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={2.5} />
        <pointLight intensity={0.7} distance={3} color={statusColor} />
      </mesh>
    </group>
  )
}

function FactoryFloor({ corridors = 3, facilityType = "workshop" }: { corridors: number; facilityType?: string }) {
  const floorSize = facilityType === "warehouse" ? 40 : 35

  return (
    <group>
      {/* Large factory floor with texture */}
      <mesh position={[0, -0.05, 0]} receiveShadow>
        <boxGeometry args={[floorSize, 0.1, floorSize]} />
        <meshStandardMaterial color="#1e293b" metalness={0.4} roughness={0.8} />
      </mesh>

      {/* Floor grid lines */}
      {Array.from({ length: floorSize }).map((_, i) => (
        <mesh key={`grid-x-${i}`} position={[-floorSize / 2 + i, 0.01, 0]} receiveShadow>
          <boxGeometry args={[0.03, 0.01, floorSize]} />
          <meshStandardMaterial color="#334155" transparent opacity={0.3} />
        </mesh>
      ))}

      {/* Corridors with numbers and markings */}
      {Array.from({ length: corridors }).map((_, i) => {
        const spacing = 7
        const totalWidth = (corridors - 1) * spacing
        const xPos = -totalWidth / 2 + i * spacing
        
        return (
          <group key={i} position={[xPos, 0, 0]}>
            {/* Corridor surface */}
            <mesh position={[0, 0, 0]} receiveShadow>
              <boxGeometry args={[6, 0.15, 24]} />
              <meshStandardMaterial color="#334155" metalness={0.3} roughness={0.7} />
            </mesh>

            {/* Corridor number label - larger and more visible */}
            <Text
              position={[0, 0.2, -12]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.5}
              color="#10b981"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.ttf"
            >
              {i + 1}
            </Text>

            {/* End position label */}
            <Text
              position={[0, 0.2, 12]}
              rotation={[-Math.PI / 2, 0, 0]}
              fontSize={1.5}
              color="#10b981"
              anchorX="center"
              anchorY="middle"
              font="/fonts/Inter-Bold.ttf"
            >
              {i + 1}
            </Text>

            {/* Aisle safety markers */}
            {[-10, -5, 0, 5, 10].map((z, idx) => (
              <group key={idx}>
                <mesh position={[-2.8, 0.16, z]}>
                  <boxGeometry args={[0.5, 0.02, 0.5]} />
                  <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
                </mesh>
                <mesh position={[2.8, 0.16, z]}>
                  <boxGeometry args={[0.5, 0.02, 0.5]} />
                  <meshStandardMaterial color="#fbbf24" emissive="#fbbf24" emissiveIntensity={0.8} />
                </mesh>
              </group>
            ))}
          </group>
        )
      })}

      {/* Enhanced grid helper */}
      <gridHelper args={[floorSize, floorSize * 2, "#475569", "#1e293b"]} position={[0, 0.02, 0]} />
    </group>
  )
}

function IndustrialMachine({ position = [0, 0, 0], type = "cnc", status = "operating" }: any) {
  const machineRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (machineRef.current && status === "operating") {
      const time = state.clock.getElapsedTime()
      machineRef.current.children[2].rotation.y = time * 2
    }
  })

  const statusColor = status === "operating" ? "#10b981" : status === "maintenance" ? "#f59e0b" : "#ef4444"

  return (
    <group ref={machineRef} position={position} scale={0.8}>
      {/* Base - larger */}
      <mesh position={[0, 0.4, 0]} castShadow>
        <boxGeometry args={[2, 0.7, 1.6]} />
        <meshStandardMaterial color="#64748b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Main body - larger */}
      <mesh position={[0, 1.3, 0]} castShadow>
        <boxGeometry args={[1.6, 1.4, 1.3]} />
        <meshStandardMaterial color="#475569" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Rotating part (if operating) */}
      <mesh position={[0, 1.6, 0.5]} castShadow>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 16]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Control panel */}
      <mesh position={[0.7, 1.6, -0.4]} castShadow>
        <boxGeometry args={[0.4, 0.5, 0.15]} />
        <meshStandardMaterial color="#1e293b" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Status light - larger */}
      <mesh position={[0.7, 2, -0.38]}>
        <sphereGeometry args={[0.08, 16, 16]} />
        <meshStandardMaterial color={statusColor} emissive={statusColor} emissiveIntensity={3} />
        <pointLight intensity={0.5} distance={3} color={statusColor} />
      </mesh>
    </group>
  )
}

function AssemblyLine({ position = [0, 0, 0], length = 10 }: any) {
  const partRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (partRef.current) {
      const time = state.clock.getElapsedTime()
      partRef.current.position.z = -length / 2 + ((time * 0.5) % length)
    }
  })

  return (
    <group position={position}>
      {/* Conveyor belt */}
      <ConveyorBelt position={[0, 0, 0]} length={length} active />

      {/* Assembly stations */}
      {[-length / 3, 0, length / 3].map((z, i) => (
        <group key={i} position={[2.5, 0, z]}>
          <RoboticArm position={[0, 0, 0]} rotation={-Math.PI / 2} color="#3b82f6" status="operating" />
        </group>
      ))}

      {/* Moving part on conveyor */}
      <mesh ref={partRef} position={[0, 0.7, 0]} castShadow>
        <boxGeometry args={[0.5, 0.4, 0.5]} />
        <meshStandardMaterial color="#64748b" metalness={0.6} roughness={0.4} />
      </mesh>
    </group>
  )
}

function OverheadCrane({ position = [0, 0, 0], moving = false }: any) {
  const craneRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (craneRef.current && moving) {
      const time = state.clock.getElapsedTime()
      craneRef.current.position.x = position[0] + Math.sin(time * 0.3) * 4
    }
  })

  return (
    <group ref={craneRef} position={position}>
      {/* Rails - longer */}
      <mesh position={[0, 6, -10]} castShadow>
        <boxGeometry args={[0.25, 0.25, 20]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0, 6, 10]} castShadow>
        <boxGeometry args={[0.25, 0.25, 20]} />
        <meshStandardMaterial color="#94a3b8" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Trolley - larger */}
      <mesh position={[0, 5.6, 0]} castShadow>
        <boxGeometry args={[2, 0.4, 1]} />
        <meshStandardMaterial color="#f59e0b" metalness={0.7} roughness={0.3} />
      </mesh>

      {/* Cables */}
      <mesh position={[0, 3, 0]} castShadow>
        <cylinderGeometry args={[0.04, 0.04, 5, 16]} />
        <meshStandardMaterial color="#1e293b" metalness={0.9} roughness={0.1} />
      </mesh>

      {/* Hook - larger */}
      <mesh position={[0, 0.7, 0]} castShadow>
        <torusGeometry args={[0.3, 0.08, 16, 32]} />
        <meshStandardMaterial color="#fbbf24" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Warning light */}
      {moving && (
        <mesh position={[0, 6.3, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#f97316" emissive="#f97316" emissiveIntensity={4} />
          <pointLight intensity={1} distance={6} color="#f97316" />
        </mesh>
      )}
    </group>
  )
}

interface WorkspaceViewer3DProps {
  facility: any
  machines: any[]
  selectedZone: string
  onMachineClick: (machine: any) => void
  renderMode: "3d" | "svg"
}

export function WorkspaceViewer3D({
  facility,
  machines,
  selectedZone,
  onMachineClick,
  renderMode,
}: WorkspaceViewer3DProps) {
  if (renderMode === "svg") {
    return <SVGWorkspaceViewer facility={facility} machines={machines} onMachineClick={onMachineClick} />
  }

  return (
    <div className="w-full h-full">
      <Canvas shadows camera={{ position: [0, 25, 30], fov: 60 }}>
        <OrbitControls
          enableZoom={true}
          enablePan={true}
          maxPolarAngle={Math.PI / 2.1}
          minDistance={20}
          maxDistance={60}
          target={[0, 0, 0]}
        />

        {/* Iluminação ambiente melhorada */}
        <ambientLight intensity={0.5} />
        <hemisphereLight intensity={0.5} groundColor="#0f172a" color="#94a3b8" />

        {/* Luz direcional principal (sol) com sombras suaves */}
        <directionalLight
          position={[30, 40, 20]}
          intensity={2}
          castShadow
          shadow-mapSize-width={4096}
          shadow-mapSize-height={4096}
          shadow-camera-far={80}
          shadow-camera-left={-35}
          shadow-camera-right={35}
          shadow-camera-top={35}
          shadow-camera-bottom={-35}
          shadow-bias={-0.0001}
        />

        {/* Luzes spot para criar profundidade */}
        <spotLight position={[-25, 30, -15]} angle={0.5} penumbra={1} intensity={1.2} castShadow color="#93c5fd" />
        <spotLight position={[25, 30, 15]} angle={0.5} penumbra={1} intensity={1.2} castShadow color="#fbbf24" />
        
        {/* Luzes de preenchimento */}
        <pointLight position={[0, 20, 0]} intensity={0.4} color="#e0f2fe" />
        <pointLight position={[-15, 10, -15]} intensity={0.3} color="#dbeafe" />
        <pointLight position={[15, 10, 15]} intensity={0.3} color="#fef3c7" />

        <FactoryFloor corridors={facility?.corridors || 3} facilityType={facility?.type} />

        {facility?.type === "warehouse" && (
          <>
            {/* Storage racks in grid - mais espaçados */}
            {[-14, -6, 6, 14].map((x) =>
              [-12, 0, 12].map((z) => <StorageRack key={`${x}-${z}`} position={[x, 0, z]} withPallets />),
            )}

            {/* Multiple forklifts with different colors and movements */}
            <Forklift position={[-10, 0, -6]} rotation={0} color="#2563eb" moving />
            <Forklift position={[10, 0, 6]} rotation={Math.PI} color="#10b981" moving />
            <Forklift position={[0, 0, -10]} rotation={Math.PI / 2} color="#f59e0b" />

            {/* Overhead crane system */}
            <OverheadCrane position={[0, 0, 0]} moving />
          </>
        )}

        {facility?.type === "factory" && (
          <>
            {/* Assembly lines - mais espaçadas */}
            <AssemblyLine position={[-10, 0, 0]} length={14} />
            <AssemblyLine position={[0, 0, 0]} length={14} />
            <AssemblyLine position={[10, 0, 0]} length={14} />

            {/* Quality control stations */}
            {[-10, 0, 10].map((x, i) => (
              <IndustrialMachine key={i} position={[x, 0, 10]} type="cnc" status="operating" />
            ))}
          </>
        )}

        {facility?.type === "workshop" && (
          <>
            {/* Workbenches - maiores */}
            {[-10, 0, 10].map((x) => (
              <mesh key={x} position={[x, 0.6, -10]} castShadow>
                <boxGeometry args={[2.5, 1, 1.3]} />
                <meshStandardMaterial color="#8b4513" roughness={0.9} />
              </mesh>
            ))}
          </>
        )}

        {machines.map((machine, idx) => {
          const corridorWidth = 7
          const corridors = facility?.corridors || 3
          const totalWidth = (corridors - 1) * corridorWidth
          const startX = -totalWidth / 2
          
          const x = startX + (machine.corridor - 1) * corridorWidth + (machine.position.x - 1) * 2
          const z = -10 + machine.position.y * 5

          return (
            <group key={machine.id} onClick={() => onMachineClick(machine)}>
              {machine.type === "robotic_arm" && (
                <RoboticArm
                  position={[x, 0, z]}
                  rotation={idx * 0.5}
                  color={
                    machine.status === "maintenance" ? "#f59e0b" : machine.status === "waiting" ? "#6366f1" : "#3b82f6"
                  }
                  status={machine.status}
                />
              )}

              {machine.type === "forklift" && (
                <Forklift
                  position={[x, 0, z]}
                  rotation={idx * 0.8}
                  color="#f59e0b"
                  moving={machine.status === "operating"}
                />
              )}

              {(machine.type === "cnc" || machine.type === "industrial") && (
                <IndustrialMachine position={[x, 0, z]} type={machine.type} status={machine.status} />
              )}
            </group>
          )
        })}

        <Environment preset="warehouse" />
      </Canvas>
    </div>
  )
}

function SVGWorkspaceViewer({
  facility,
  machines,
  onMachineClick,
}: { facility: any; machines: any[]; onMachineClick: (machine: any) => void }) {
  const corridorCount = facility?.corridors || 3
  const viewBoxWidth = 800
  const viewBoxHeight = 600
  const corridorWidth = 200
  const corridorHeight = 400
  const startX = (viewBoxWidth - corridorCount * corridorWidth) / 2
  const startY = 100

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${viewBoxWidth} ${viewBoxHeight}`} className="bg-background">
      <defs>
        {/* Gradient for corridors */}
        <linearGradient id="corridorGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="var(--muted)" />
          <stop offset="100%" stopColor="var(--border)" />
        </linearGradient>
      </defs>

      {/* Draw corridors */}
      {Array.from({ length: corridorCount }).map((_, i) => (
        <g key={i}>
          <rect
            x={startX + i * corridorWidth}
            y={startY}
            width={corridorWidth - 10}
            height={corridorHeight}
            fill="url(#corridorGradient)"
            stroke="var(--border)"
            strokeWidth="2"
            rx="8"
          />
          <text
            x={startX + i * corridorWidth + 20}
            y={startY + 30}
            fill="var(--muted-foreground)"
            fontSize="16"
            fontWeight="bold"
          >
            Corredor {i + 1}
          </text>
        </g>
      ))}

      {/* Draw machines with animation */}
      {machines.map((machine) => {
        const machineX = startX + (machine.corridor - 1) * corridorWidth + machine.position.x * 60
        const machineY = startY + machine.position.y * 80
        const statusColor =
          machine.status === "operating" ? "#10b981" : machine.status === "maintenance" ? "#f59e0b" : "#ef4444"

        return (
          <g key={machine.id} onClick={() => onMachineClick(machine)} style={{ cursor: "pointer" }}>
            {/* Machine body */}
            <rect
              x={machineX}
              y={machineY}
              width="40"
              height="50"
              fill={statusColor}
              stroke="#fff"
              strokeWidth="2"
              rx="4"
            >
              {machine.status === "operating" && (
                <animate attributeName="opacity" values="1;0.7;1" dur="2s" repeatCount="indefinite" />
              )}
            </rect>
            {/* Machine icon */}
            <text x={machineX + 20} y={machineY + 32} fill="#fff" fontSize="20" textAnchor="middle" fontWeight="bold">
              M
            </text>
            {/* Machine label */}
            <text x={machineX + 20} y={machineY + 70} fill="var(--foreground)" fontSize="10" textAnchor="middle">
              {machine.name.substring(0, 10)}
            </text>
          </g>
        )
      })}
    </svg>
  )
}
