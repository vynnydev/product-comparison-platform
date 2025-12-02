import type { PartData } from "@/lib/api"

interface CompressorDiagramProps {
  parts: PartData[]
  hoveredPart: PartData | null
  selectedPart: PartData | null
}

export function CompressorDiagram({ parts, hoveredPart, selectedPart }: CompressorDiagramProps) {
  return (
    <svg
      viewBox="0 0 800 650"
      className="h-full w-full drop-shadow-xl"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#94a3b8", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#cbd5e1", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="cylinderGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#cbd5e1", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#94a3b8", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
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

      {/* Compressor tank/cylinder body */}
      <ellipse cx="400" cy="350" rx="180" ry="220" fill="url(#cylinderGrad)" stroke="#475569" strokeWidth="4" />

      {/* Top cap */}
      <ellipse cx="400" cy="130" rx="180" ry="30" fill="url(#metalGrad)" stroke="#475569" strokeWidth="3" />

      {/* Bottom cap */}
      <ellipse cx="400" cy="570" rx="180" ry="30" fill="url(#metalGrad)" stroke="#475569" strokeWidth="3" />

      {/* Pressure gauge */}
      <circle cx="300" cy="300" r="40" fill="#1e293b" stroke="#64748b" strokeWidth="3" />
      <circle cx="300" cy="300" r="30" fill="#0f172a" stroke="#475569" strokeWidth="2" />
      <line x1="300" y1="300" x2="300" y2="280" stroke="#3b82f6" strokeWidth="3" strokeLinecap="round" />

      {/* Motor housing */}
      <rect x="450" y="280" width="120" height="140" fill="url(#metalGrad)" stroke="#475569" strokeWidth="3" rx="8" />
      <circle cx="510" cy="350" r="35" fill="#1e293b" />

      {/* Air intake valve */}
      <rect x="350" y="80" width="100" height="50" fill="#475569" stroke="#334155" strokeWidth="2" rx="6" />
      <circle cx="400" cy="105" r="15" fill="#3b82f6" opacity="0.7" />

      {/* Air outlet valve */}
      <rect x="350" y="570" width="100" height="50" fill="#475569" stroke="#334155" strokeWidth="2" rx="6" />
      <circle cx="400" cy="595" r="15" fill="#f59e0b" opacity="0.7" />

      {/* Piston (simplified) */}
      <rect x="370" y="340" width="60" height="80" fill="#64748b" stroke="#475569" strokeWidth="2" rx="4" />

      {/* Connecting rod */}
      <line x1="400" y1="420" x2="510" y2="350" stroke="#94a3b8" strokeWidth="6" strokeLinecap="round" />

      {/* Cooling fins */}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x="230" y={250 + i * 40} width="30" height="8" fill="#64748b" stroke="#475569" strokeWidth="1" />
      ))}

      {/* Mounting base */}
      <rect x="280" y="600" width="240" height="30" fill="url(#metalGrad)" stroke="#334155" strokeWidth="3" rx="4" />
    </svg>
  )
}
