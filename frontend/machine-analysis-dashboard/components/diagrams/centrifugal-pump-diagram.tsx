import type { PartData } from "@/lib/api"

interface CentrifugalPumpDiagramProps {
  parts: PartData[]
  hoveredPart: PartData | null
  selectedPart: PartData | null
}

export function CentrifugalPumpDiagram({ parts, hoveredPart, selectedPart }: CentrifugalPumpDiagramProps) {
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
        <linearGradient id="darkMetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
          <stop offset="50%" style={{ stopColor: "#64748b", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#334155", stopOpacity: 1 }} />
        </linearGradient>
        <radialGradient id="shaftGrad">
          <stop offset="0%" style={{ stopColor: "#cbd5e1", stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: "#475569", stopOpacity: 1 }} />
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

      {/* Background grid */}
      <rect width="800" height="650" fill="#0f172a" opacity="0.1" />

      {/* Motor Housing - Top */}
      <rect x="300" y="80" width="200" height="120" rx="10" fill="url(#metalGrad)" stroke="#334155" strokeWidth="3" />
      <rect
        x="320"
        y="100"
        width="160"
        height="80"
        rx="5"
        fill="url(#darkMetalGrad)"
        stroke="#1e293b"
        strokeWidth="2"
      />

      {/* Motor Shaft - Vertical */}
      <rect x="390" y="200" width="20" height="100" fill="url(#shaftGrad)" stroke="#334155" strokeWidth="2" />

      {/* Coupling */}
      <ellipse cx="400" cy="300" rx="30" ry="20" fill="url(#darkMetalGrad)" stroke="#334155" strokeWidth="2" />
      <ellipse cx="400" cy="300" rx="20" ry="13" fill="url(#shaftGrad)" stroke="#1e293b" strokeWidth="1" />

      {/* Main Pump Casing - Volute */}
      <ellipse cx="400" cy="400" rx="180" ry="140" fill="url(#metalGrad)" stroke="#334155" strokeWidth="4" />
      <ellipse cx="400" cy="400" rx="160" ry="120" fill="#0f172a" fillOpacity="0.3" stroke="#475569" strokeWidth="2" />

      {/* Discharge Outlet - Right */}
      <rect x="580" y="370" width="140" height="60" rx="10" fill="url(#metalGrad)" stroke="#334155" strokeWidth="3" />
      <circle cx="690" cy="400" r="25" fill="url(#darkMetalGrad)" stroke="#334155" strokeWidth="2" />
      <circle cx="690" cy="400" r="15" fill="#0f172a" fillOpacity="0.6" />
      <text x="690" y="407" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
        OUT
      </text>

      {/* Suction Inlet - Left */}
      <rect x="80" y="370" width="140" height="60" rx="10" fill="url(#metalGrad)" stroke="#334155" strokeWidth="3" />
      <circle cx="110" cy="400" r="25" fill="url(#darkMetalGrad)" stroke="#334155" strokeWidth="2" />
      <circle cx="110" cy="400" r="15" fill="#0f172a" fillOpacity="0.6" />
      <text x="110" y="407" textAnchor="middle" fill="#64748b" fontSize="12" fontWeight="bold">
        IN
      </text>

      {/* Flow arrows - Inlet */}
      <defs>
        <marker id="arrowhead-in" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#3b82f6" />
        </marker>
      </defs>
      <path
        d="M 150 400 L 200 400"
        stroke="#3b82f6"
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrowhead-in)"
        opacity="0.8"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Flow arrows - Outlet */}
      <defs>
        <marker id="arrowhead-out" markerWidth="10" markerHeight="10" refX="9" refY="3" orient="auto">
          <polygon points="0 0, 10 3, 0 6" fill="#ef4444" />
        </marker>
      </defs>
      <path
        d="M 600 400 L 650 400"
        stroke="#ef4444"
        strokeWidth="3"
        fill="none"
        markerEnd="url(#arrowhead-out)"
        opacity="0.8"
      >
        <animate attributeName="stroke-dashoffset" from="0" to="20" dur="1s" repeatCount="indefinite" />
      </path>

      {/* Impeller - Center */}
      <circle cx="400" cy="400" r="80" fill="url(#darkMetalGrad)" stroke="#334155" strokeWidth="3" />
      <circle cx="400" cy="400" r="70" fill="#fb923c" fillOpacity="0.3" stroke="#fb923c" strokeWidth="2">
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 400 400"
          to="360 400 400"
          dur="3s"
          repeatCount="indefinite"
        />
      </circle>

      {/* Impeller Vanes */}
      {[0, 60, 120, 180, 240, 300].map((angle) => (
        <g key={angle}>
          <path
            d={`M 400 400 L ${400 + 65 * Math.cos((angle * Math.PI) / 180)} ${400 + 65 * Math.sin((angle * Math.PI) / 180)}`}
            stroke="#ef4444"
            strokeWidth="4"
            strokeLinecap="round"
          >
            <animateTransform
              attributeName="transform"
              type="rotate"
              from="0 400 400"
              to="360 400 400"
              dur="3s"
              repeatCount="indefinite"
            />
          </path>
        </g>
      ))}

      {/* Shaft - Connecting motor to impeller */}
      <rect x="390" y="320" width="20" height="60" fill="url(#shaftGrad)" stroke="#334155" strokeWidth="2" />
      <circle cx="400" cy="380" r="12" fill="url(#darkMetalGrad)" stroke="#334155" strokeWidth="2" />

      {/* Mechanical Seal Housing */}
      <ellipse cx="400" cy="340" rx="35" ry="25" fill="url(#metalGrad)" stroke="#334155" strokeWidth="2" />
      <ellipse cx="400" cy="340" rx="25" ry="18" fill="url(#darkMetalGrad)" stroke="#1e293b" strokeWidth="1" />
      <circle cx="400" cy="340" r="10" fill="#34d399" fillOpacity="0.4" stroke="#10b981" strokeWidth="2" />

      {/* Wear Ring - Around Impeller */}
      <circle cx="400" cy="400" r="88" fill="none" stroke="#10b981" strokeWidth="2" opacity="0.6" />

      {/* Mounting Base */}
      <rect
        x="250"
        y="540"
        width="300"
        height="30"
        rx="5"
        fill="url(#darkMetalGrad)"
        stroke="#334155"
        strokeWidth="3"
      />
      <rect x="280" y="490" width="40" height="50" fill="url(#metalGrad)" stroke="#334155" strokeWidth="2" />
      <rect x="480" y="490" width="40" height="50" fill="url(#metalGrad)" stroke="#334155" strokeWidth="2" />

      {/* Mounting Bolts */}
      <circle cx="300" cy="515" r="8" fill="url(#darkMetalGrad)" stroke="#1e293b" strokeWidth="2" />
      <circle cx="500" cy="515" r="8" fill="url(#darkMetalGrad)" stroke="#1e293b" strokeWidth="2" />
      <circle cx="300" cy="515" r="4" fill="#334155" />
      <circle cx="500" cy="515" r="4" fill="#334155" />

      {/* Foundation Plate */}
      <rect
        x="200"
        y="570"
        width="400"
        height="15"
        rx="3"
        fill="url(#darkMetalGrad)"
        stroke="#1e293b"
        strokeWidth="2"
      />

      {/* Casing Gasket seam */}
      <ellipse cx="400" cy="400" rx="170" ry="130" fill="none" stroke="#64748b" strokeWidth="1" strokeDasharray="5,5" />
      {/* End complete centrifugal pump SVG drawing */}
    </svg>
  )
}
