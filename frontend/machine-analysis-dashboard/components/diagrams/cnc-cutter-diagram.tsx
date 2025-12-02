export function CncCutterDiagram({
  parts,
  hoveredPart,
  selectedPart,
}: {
  parts: any[]
  hoveredPart: any
  selectedPart: any
}) {
  return (
    <svg viewBox="0 0 800 650" className="h-full w-full" style={{ filter: "drop-shadow(0 4px 6px rgba(0,0,0,0.3))" }}>
      {/* Base da máquina */}
      <rect x="150" y="450" width="500" height="150" fill="#4a5568" stroke="#2d3748" strokeWidth="3" rx="8" />

      {/* Mesa de trabalho */}
      <rect x="200" y="400" width="400" height="50" fill="#64748b" stroke="#475569" strokeWidth="2" />
      <rect x="220" y="410" width="360" height="30" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

      {/* Pórtico (estrutura em ponte) */}
      <rect x="180" y="150" width="20" height="250" fill="#718096" stroke="#4a5568" strokeWidth="2" />
      <rect x="600" y="150" width="20" height="250" fill="#718096" stroke="#4a5568" strokeWidth="2" />
      <rect x="180" y="150" width="440" height="30" fill="#a0aec0" stroke="#718096" strokeWidth="2" rx="4" />

      {/* Carro transversal */}
      <rect x="350" y="180" width="100" height="60" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="4" />

      {/* Fuso (spindle) */}
      <rect x="385" y="240" width="30" height="80" fill="#475569" stroke="#334155" strokeWidth="2" />
      <ellipse cx="400" cy="320" rx="20" ry="10" fill="#334155" stroke="#1e293b" strokeWidth="2" />

      {/* Ferramenta de corte */}
      <polygon points="390,330 410,330 408,360 392,360" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="392,360 408,360 400,380" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />

      {/* Trilhos guia */}
      <line x1="200" y1="420" x2="600" y2="420" stroke="#334155" strokeWidth="4" strokeLinecap="round" />
      <line x1="200" y1="430" x2="600" y2="430" stroke="#334155" strokeWidth="4" strokeLinecap="round" />

      {/* Painel de controle CNC */}
      <rect x="660" y="300" width="120" height="150" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
      <rect x="675" y="320" width="90" height="60" fill="#0f172a" stroke="#1e293b" strokeWidth="1" rx="3" />
      <text x="720" y="355" fontSize="12" fill="#10b981" textAnchor="middle">
        CNC
      </text>

      {/* Botões do painel */}
      <circle cx="690" cy="400" r="10" fill="#10b981" opacity="0.8" />
      <circle cx="720" cy="400" r="10" fill="#ef4444" opacity="0.8" />
      <circle cx="750" cy="400" r="10" fill="#f59e0b" opacity="0.8" />

      {/* Sistema de refrigeração */}
      <rect x="650" y="460" width="40" height="80" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" rx="4" />
      <circle cx="670" cy="490" r="8" fill="#60a5fa" opacity="0.6" />
    </svg>
  )
}
