import type { PartData } from "@/lib/api"

interface ElectricMotorDiagramProps {
  parts: PartData[]
  hoveredPart: PartData | null
  selectedPart: PartData | null
}

export function ElectricMotorDiagram({ parts, hoveredPart, selectedPart }: ElectricMotorDiagramProps) {
  return (
    <svg
      viewBox="0 0 800 650"
      className="h-full w-full drop-shadow-xl"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="motorBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#334155", stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="rotorGrad">
          <stop offset="0%" style={{ stopColor: "#cbd5e1", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
        </radialGradient>

        {parts.map((part) => (
          <filter key={`glow-${part.id}`} id={`glow-${part.id}`} x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        ))}
      </defs>

      <rect width="800" height="650" fill="#0f172a" opacity="0.1" />

      {/* Motor housing - main body */}
      <rect
        x="250"
        y="220"
        width="300"
        height="210"
        fill="url(#motorBodyGrad)"
        stroke="#475569"
        strokeWidth="4"
        rx="12"
      />

      {/* Stator coil windings (simplified) */}
      <rect x="270" y="240" width="260" height="170" fill="#1e293b" stroke="#0f172a" strokeWidth="2" rx="8" />

      {/* Rotor */}
      <ellipse cx="400" cy="325" rx="80" ry="75" fill="url(#rotorGrad)" stroke="#475569" strokeWidth="3" />

      {/* Shaft extending from both sides */}
      <rect x="180" y="315" width="70" height="20" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
      <rect x="550" y="315" width="70" height="20" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Front bearing housing */}
      <ellipse cx="250" cy="325" rx="35" ry="60" fill="#475569" stroke="#334155" strokeWidth="3" />
      <circle cx="250" cy="325" r="15" fill="#94a3b8" />

      {/* Rear bearing housing */}
      <ellipse cx="550" cy="325" rx="35" ry="60" fill="#475569" stroke="#334155" strokeWidth="3" />
      <circle cx="550" cy="325" r="15" fill="#94a3b8" />

      {/* Cooling fan */}
      <circle cx="620" cy="325" r="60" fill="#334155" stroke="#64748b" strokeWidth="3" />
      {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
        <line
          key={angle}
          x1="620"
          y1="325"
          x2={620 + 50 * Math.cos((angle * Math.PI) / 180)}
          y2={325 + 50 * Math.sin((angle * Math.PI) / 180)}
          stroke="#94a3b8"
          strokeWidth="4"
          strokeLinecap="round"
        />
      ))}

      {/* Fan cover */}
      <rect x="590" y="200" width="120" height="250" fill="none" stroke="#64748b" strokeWidth="3" rx="8" />
      <path d="M 600 210 L 700 210 M 600 440 L 700 440" stroke="#64748b" strokeWidth="2" />

      {/* Terminal box */}
      <rect x="320" y="150" width="160" height="70" fill="#475569" stroke="#334155" strokeWidth="3" rx="6" />
      <text x="400" y="190" textAnchor="middle" fill="#94a3b8" fontSize="14" fontWeight="bold">
        TERMINAL BOX
      </text>

      {/* Mounting feet */}
      <rect x="240" y="430" width="80" height="30" fill="#475569" stroke="#334155" strokeWidth="2" rx="4" />
      <rect x="480" y="430" width="80" height="30" fill="#475569" stroke="#334155" strokeWidth="2" rx="4" />
      <circle cx="260" cy="445" r="8" fill="#1e293b" />
      <circle cx="300" cy="445" r="8" fill="#1e293b" />
      <circle cx="500" cy="445" r="8" fill="#1e293b" />
      <circle cx="540" cy="445" r="8" fill="#1e293b" />

      {/* Base plate */}
      <rect x="200" y="460" width="400" height="20" fill="#334155" stroke="#1e293b" strokeWidth="2" rx="4" />

      {/* Nameplate */}
      <rect x="280" y="380" width="240" height="40" fill="#1e293b" stroke="#64748b" strokeWidth="2" rx="4" />
      <text x="400" y="405" textAnchor="middle" fill="#cbd5e1" fontSize="12" fontWeight="bold">
        MOTOR ELÉTRICO - 50HP
      </text>
    </svg>
  )
}
