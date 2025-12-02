"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { Cylinder, Box, Sphere, Torus } from "@react-three/drei"
import * as THREE from "three"


export function DetailedCarEngine({ isAnalyzing }: { isAnalyzing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isAnalyzing) {
      groupRef.current.rotation.y += 0.01
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.5, 0]} scale={0.8}>
      {/* Engine block */}
      <Box args={[1.8, 1.2, 1.2]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#1e3a8a" metalness={0.9} roughness={0.2} />
      </Box>
      
      {/* Cylinders */}
      {[-0.6, -0.2, 0.2, 0.6].map((x, i) => (
        <group key={i} position={[x, 0.8, 0]}>
          <Cylinder args={[0.15, 0.15, 0.6, 16]} rotation={[0, 0, 0]}>
            <meshStandardMaterial color="#2563eb" metalness={0.8} roughness={0.3} />
          </Cylinder>
          <Cylinder args={[0.08, 0.08, 0.2, 16]} position={[0, 0.5, 0]}>
            <meshStandardMaterial color="#60a5fa" metalness={0.7} roughness={0.4} />
          </Cylinder>
        </group>
      ))}
      
      {/* Oil filter */}
      <Cylinder args={[0.2, 0.18, 0.4, 16]} position={[-0.8, -0.3, 0.4]} rotation={[Math.PI / 2, 0, 0]}>
        <meshStandardMaterial color="#fbbf24" metalness={0.6} roughness={0.5} />
      </Cylinder>
      
      {/* Air filter */}
      <Box args={[0.4, 0.3, 0.3]} position={[0.8, 0.2, 0.3]}>
        <meshStandardMaterial color="#ef4444" metalness={0.5} roughness={0.6} />
      </Box>
      
      {/* Belt pulleys */}
      <Torus args={[0.25, 0.05, 16, 32]} position={[-0.7, -0.4, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </Torus>
      <Torus args={[0.2, 0.04, 16, 32]} position={[0.7, -0.4, -0.6]} rotation={[0, Math.PI / 2, 0]}>
        <meshStandardMaterial color="#374151" metalness={0.8} roughness={0.3} />
      </Torus>
    </group>
  )
}

export function DetailedMRIMachine({ isAnalyzing }: { isAnalyzing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isAnalyzing) {
      groupRef.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={groupRef} position={[0, 0, 0]} scale={0.7}>
      {/* Main cylinder housing */}
      <Cylinder args={[1.3, 1.3, 0.9, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f1f5f9" metalness={0.95} roughness={0.05} />
      </Cylinder>
      
      {/* Magnet ring */}
      <Torus args={[1.1, 0.25, 16, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} emissive="#0ea5e9" emissiveIntensity={0.2} />
      </Torus>
      
      {/* Patient tube */}
      <Cylinder args={[0.65, 0.65, 3.2, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#cbd5e1" metalness={0.8} roughness={0.2} />
      </Cylinder>
      
      {/* Control panel */}
      <Box args={[0.6, 0.8, 0.15]} position={[1.5, 0, 0]}>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Display screen */}
      <Box args={[0.45, 0.35, 0.05]} position={[1.58, 0.15, 0]}>
        <meshStandardMaterial color="#0f172a" metalness={0.3} roughness={0.7} emissive="#3b82f6" emissiveIntensity={0.3} />
      </Box>
    </group>
  )
}

export function DetailedCentrifugalPump({ isAnalyzing }: { isAnalyzing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const impellerRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isAnalyzing) {
      groupRef.current.rotation.y += 0.01
    }
    if (impellerRef.current && isAnalyzing) {
      impellerRef.current.rotation.y += 0.1
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={0.9}>
      {/* Pump casing */}
      <Cylinder args={[0.7, 0.9, 0.5, 32]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f59e0b" metalness={0.85} roughness={0.15} />
      </Cylinder>
      
      {/* Impeller (visible through transparent cover concept) */}
      <group ref={impellerRef} position={[0, 0, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const angle = (i * Math.PI * 2) / 6
          return (
            <Box
              key={i}
              args={[0.1, 0.4, 0.05]}
              position={[Math.cos(angle) * 0.3, 0, Math.sin(angle) * 0.3]}
              rotation={[0, angle, 0]}
            >
              <meshStandardMaterial color="#fb923c" metalness={0.9} roughness={0.2} />
            </Box>
          )
        })}
      </group>
      
      {/* Inlet pipe */}
      <Cylinder args={[0.18, 0.18, 1, 32]} rotation={[0, 0, Math.PI / 2]} position={[-0.8, 0, 0]}>
        <meshStandardMaterial color="#fb923c" metalness={0.8} roughness={0.3} />
      </Cylinder>
      
      {/* Outlet pipe */}
      <Cylinder args={[0.18, 0.18, 1, 32]} rotation={[0, 0, Math.PI / 2]} position={[0.8, 0, 0]}>
        <meshStandardMaterial color="#fb923c" metalness={0.8} roughness={0.3} />
      </Cylinder>
      
      {/* Motor housing */}
      <Cylinder args={[0.3, 0.3, 0.6, 32]} rotation={[Math.PI / 2, 0, 0]} position={[0, 0, -0.7]}>
        <meshStandardMaterial color="#1e40af" metalness={0.7} roughness={0.4} />
      </Cylinder>
      
      {/* Base */}
      <Box args={[1.4, 0.15, 0.8]} position={[0, -0.35, 0]}>
        <meshStandardMaterial color="#64748b" metalness={0.5} roughness={0.6} />
      </Box>
    </group>
  )
}

export function DetailedIndustrialWasher({ isAnalyzing }: { isAnalyzing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  const drumRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isAnalyzing) {
      groupRef.current.rotation.y += 0.005
    }
    if (drumRef.current && isAnalyzing) {
      drumRef.current.rotation.z += 0.02
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.4, 0]} scale={0.85}>
      {/* Main body */}
      <Box args={[1.6, 1.6, 1.1]} position={[0, 0, 0]}>
        <meshStandardMaterial color="#f1f5f9" metalness={0.85} roughness={0.15} />
      </Box>
      
      {/* Door frame */}
      <Torus args={[0.58, 0.08, 16, 32]} position={[0, 0, 0.56]} rotation={[0, 0, 0]}>
        <meshStandardMaterial color="#94a3b8" metalness={0.9} roughness={0.2} />
      </Torus>
      
      {/* Glass door */}
      <Cylinder args={[0.55, 0.55, 0.12, 32]} position={[0, 0, 0.62]}>
        <meshStandardMaterial
          color="#0ea5e9"
          metalness={0.95}
          roughness={0.05}
          transparent
          opacity={0.3}
        />
      </Cylinder>
      
      {/* Drum (inside, visible through door) */}
      <group ref={drumRef} position={[0, 0, 0.2]}>
        <Cylinder args={[0.45, 0.45, 0.6, 32]} rotation={[Math.PI / 2, 0, 0]}>
          <meshStandardMaterial color="#64748b" metalness={0.8} roughness={0.3} />
        </Cylinder>
      </group>
      
      {/* Control panel */}
      <Box args={[0.8, 0.3, 0.08]} position={[0, 0.8, 0.56]}>
        <meshStandardMaterial color="#1e293b" metalness={0.6} roughness={0.4} />
      </Box>
      
      {/* Buttons/Display */}
      {[-0.2, 0, 0.2].map((x, i) => (
        <Sphere key={i} args={[0.04, 16, 16]} position={[x, 0.8, 0.61]}>
          <meshStandardMaterial color={i === 1 ? "#10b981" : "#3b82f6"} metalness={0.5} roughness={0.5} emissive={i === 1 ? "#10b981" : "#3b82f6"} emissiveIntensity={0.5} />
        </Sphere>
      ))}
    </group>
  )
}

export function DetailedElectricBus({ isAnalyzing }: { isAnalyzing: boolean }) {
  const groupRef = useRef<THREE.Group>(null)
  
  useFrame(() => {
    if (groupRef.current && isAnalyzing) {
      groupRef.current.rotation.y += 0.008
    }
  })

  return (
    <group ref={groupRef} position={[0, -0.3, 0]} scale={0.45}>
      {/* Main body */}
      <Box args={[4.5, 1.8, 2.2]} position={[0, 1, 0]}>
        <meshStandardMaterial color="#10b981" metalness={0.7} roughness={0.3} />
      </Box>
      
      {/* Roof */}
      <Box args={[4.5, 0.2, 2.2]} position={[0, 2, 0]}>
        <meshStandardMaterial color="#059669" metalness={0.8} roughness={0.2} />
      </Box>
      
      {/* Chassis */}
      <Box args={[4.3, 0.6, 2]} position={[0, 0.2, 0]}>
        <meshStandardMaterial color="#064e3b" metalness={0.6} roughness={0.5} />
      </Box>
      
      {/* Windows */}
      {[-1.5, -0.5, 0.5, 1.5].map((x, i) => (
        <Box key={i} args={[0.7, 0.8, 0.05]} position={[x, 1.3, 1.13]}>
          <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} transparent opacity={0.4} />
        </Box>
      ))}
      
      {/* Front windshield */}
      <Box args={[2, 1, 0.05]} position={[2.1, 1.3, 0]}>
        <meshStandardMaterial color="#0ea5e9" metalness={0.9} roughness={0.1} transparent opacity={0.4} />
      </Box>
      
      {/* Wheels */}
      {[
        [-1.5, -0.2, 1.1],
        [-1.5, -0.2, -1.1],
        [1.5, -0.2, 1.1],
        [1.5, -0.2, -1.1],
      ].map((pos, i) => (
        <group key={i} position={pos as [number, number, number]}>
          <Cylinder args={[0.35, 0.35, 0.4, 32]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#1f2937" metalness={0.6} roughness={0.7} />
          </Cylinder>
          <Cylinder args={[0.2, 0.2, 0.42, 32]} rotation={[0, 0, Math.PI / 2]}>
            <meshStandardMaterial color="#6b7280" metalness={0.8} roughness={0.4} />
          </Cylinder>
        </group>
      ))}
      
      {/* Electric badge */}
      <Sphere args={[0.15, 16, 16]} position={[2.2, 0.8, 0]}>
        <meshStandardMaterial color="#3b82f6" metalness={0.5} roughness={0.5} emissive="#3b82f6" emissiveIntensity={0.5} />
      </Sphere>
    </group>
  )
}
