export function HydraulicPressDiagram({
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
      {/* Base da prensa */}
      <rect x="200" y="550" width="400" height="80" fill="#4a5568" stroke="#2d3748" strokeWidth="3" rx="8" />

      {/* Colunas laterais */}
      <rect x="220" y="200" width="60" height="350" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="4" />
      <rect x="520" y="200" width="60" height="350" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="4" />

      {/* Travessa superior */}
      <rect x="220" y="150" width="360" height="50" fill="#a0aec0" stroke="#718096" strokeWidth="2" rx="6" />

      {/* Cilindro hidráulico principal */}
      <rect x="350" y="200" width="100" height="180" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="4" />

      {/* Haste do pistão */}
      <rect x="385" y="380" width="30" height="120" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Placa superior móvel */}
      <rect x="300" y="500" width="200" height="30" fill="#475569" stroke="#334155" strokeWidth="2" rx="4" />

      {/* Mesa inferior fixa */}
      <rect x="280" y="530" width="240" height="20" fill="#64748b" stroke="#475569" strokeWidth="2" />

      {/* Unidade hidráulica */}
      <g>
        <rect x="620" y="400" width="120" height="150" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
        {/* Tanque de óleo */}
        <rect
          x="635"
          y="420"
          width="90"
          height="60"
          fill="#3b82f6"
          opacity="0.3"
          stroke="#2563eb"
          strokeWidth="2"
          rx="3"
        />
        {/* Bomba */}
        <circle cx="680" cy="500" r="20" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        {/* Manômetro */}
        <circle cx="680" cy="530" r="15" fill="#0f172a" stroke="#334155" strokeWidth="2" />
        <line x1="680" y1="530" x2="685" y2="520" stroke="#10b981" strokeWidth="2" strokeLinecap="round" />
      </g>

      {/* Tubulações hidráulicas */}
      <path d="M 620,470 Q 550,450 450,380" fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.7" />
      <path d="M 620,490 Q 550,510 450,380" fill="none" stroke="#ef4444" strokeWidth="6" opacity="0.7" />

      {/* Painel de controle */}
      <rect x="100" y="350" width="100" height="120" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
      <circle cx="130" cy="385" r="12" fill="#10b981" opacity="0.8" />
      <circle cx="170" cy="385" r="12" fill="#ef4444" opacity="0.8" />
      <rect x="120" y="410" width="60" height="40" fill="#334155" stroke="#475569" strokeWidth="1" rx="3" />

      {/* Indicadores de pressão */}
      <text x="680" y="455" fontSize="10" fill="#94a3b8" textAnchor="middle">
        PRESSÃO
      </text>
    </svg>
  )
}
