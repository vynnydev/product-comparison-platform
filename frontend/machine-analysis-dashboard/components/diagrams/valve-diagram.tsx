import type { PartData } from "@/lib/api"

interface ValveDiagramProps {
  parts: PartData[]
  hoveredPart: PartData | null
  selectedPart: PartData | null
}

export function ValveDiagram({ parts, hoveredPart, selectedPart }: ValveDiagramProps) {
  return (
    <svg
      viewBox="0 0 800 650"
      className="h-full w-full drop-shadow-xl"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="valveBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#94a3b8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
        </linearGradient>

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

      {/* Valve body - main */}
      <ellipse cx="400" cy="350" rx="120" ry="150" fill="url(#valveBodyGrad)" stroke="#475569" strokeWidth="4" />

      {/* Top bonnet */}
      <rect x="350" y="140" width="100" height="60" fill="#475569" stroke="#334155" strokeWidth="3" rx="8" />

      {/* Stem */}
      <rect x="385" y="200" width="30" height="150" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Handwheel */}
      <circle cx="400" cy="140" r="50" fill="#334155" stroke="#64748b" strokeWidth="4" />
      <circle cx="400" cy="140" r="35" fill="none" stroke="#94a3b8" strokeWidth="3" />
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <line
          key={angle}
          x1={400 + 35 * Math.cos((angle * Math.PI) / 180)}
          y1={140 + 35 * Math.sin((angle * Math.PI) / 180)}
          x2={400 + 45 * Math.cos((angle * Math.PI) / 180)}
          y2={140 + 45 * Math.sin((angle * Math.PI) / 180)}
          stroke="#cbd5e1"
          strokeWidth="6"
          strokeLinecap="round"
        />
      ))}

      {/* Disc/Gate */}
      <ellipse cx="400" cy="350" rx="80" ry="20" fill="#e11d48" stroke="#be123c" strokeWidth="3" />

      {/* Seat ring */}
      <ellipse cx="400" cy="360" rx="90" ry="10" fill="#64748b" stroke="#475569" strokeWidth="2" />

      {/* Inlet flange */}
      <rect x="180" y="310" width="100" height="80" fill="#475569" stroke="#334155" strokeWidth="3" rx="6" />
      <circle cx="230" cy="350" r="25" fill="#1e293b" />
      <text x="230" y="355" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
        IN
      </text>

      {/* Outlet flange */}
      <rect x="520" y="310" width="100" height="80" fill="#475569" stroke="#334155" strokeWidth="3" rx="6" />
      <circle cx="570" cy="350" r="25" fill="#1e293b" />
      <text x="570" y="355" textAnchor="middle" fill="#94a3b8" fontSize="12" fontWeight="bold">
        OUT
      </text>

      {/* Flow path */}
      <path d="M 280 350 L 320 350" stroke="#3b82f6" strokeWidth="3" />
      <path d="M 480 350 L 520 350" stroke="#3b82f6" strokeWidth="3" />

      {/* Packing gland */}
      <rect x="370" y="180" width="60" height="20" fill="#64748b" stroke="#475569" strokeWidth="2" rx="3" />

      {/* Bolts */}
      <circle cx="320" cy="190" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
      <circle cx="480" cy="190" r="6" fill="#1e293b" stroke="#64748b" strokeWidth="2" />

      {/* Base mounting */}
      <rect x="300" y="500" width="200" height="30" fill="#334155" stroke="#1e293b" strokeWidth="2" rx="4" />
    </svg>
  )
}
