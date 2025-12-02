export function IndustrialDrillDiagram({
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
      {/* Base da furadeira */}
      <rect x="250" y="530" width="300" height="100" fill="#4a5568" stroke="#2d3748" strokeWidth="3" rx="8" />

      {/* Coluna principal */}
      <rect x="360" y="180" width="80" height="350" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="4" />

      {/* Carro móvel vertical */}
      <rect x="340" y="300" width="120" height="80" fill="#94a3b8" stroke="#64748b" strokeWidth="2" rx="4" />

      {/* Cabeçote motor */}
      <rect x="350" y="220" width="100" height="80" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="6" />
      <ellipse cx="400" cy="260" rx="40" ry="30" fill="#a0aec0" stroke="#718096" strokeWidth="2" />

      {/* Mandril (chuck) */}
      <rect x="385" y="380" width="30" height="60" fill="#475569" stroke="#334155" strokeWidth="2" />
      <polygon points="385,440 415,440 420,450 380,450" fill="#64748b" stroke="#475569" strokeWidth="2" />

      {/* Broca */}
      <rect x="395" y="450" width="10" height="70" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />
      <polygon points="395,520 405,520 400,540" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />

      {/* Mesa de trabalho regulável */}
      <rect x="300" y="540" width="200" height="20" fill="#64748b" stroke="#475569" strokeWidth="2" />
      <rect x="320" y="520" width="160" height="20" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Fuso de regulagem vertical */}
      <rect x="340" y="450" width="15" height="70" fill="#334155" stroke="#1e293b" strokeWidth="1" />

      {/* Alavanca de avanço */}
      <g>
        <line x1="280" y1="340" x2="320" y2="340" stroke="#475569" strokeWidth="8" strokeLinecap="round" />
        <circle cx="280" cy="340" r="12" fill="#ef4444" stroke="#dc2626" strokeWidth="2" />
      </g>

      {/* Volante de ajuste */}
      <g>
        <circle cx="300" cy="260" r="35" fill="#64748b" stroke="#475569" strokeWidth="2" />
        <circle cx="300" cy="260" r="25" fill="#334155" stroke="#1e293b" strokeWidth="1" />
        <line x1="300" y1="235" x2="300" y2="250" stroke="#94a3b8" strokeWidth="3" />
        <line x1="325" y1="260" x2="310" y2="260" stroke="#94a3b8" strokeWidth="3" />
      </g>

      {/* Sistema de refrigeração */}
      <rect
        x="520"
        y="400"
        width="60"
        height="100"
        fill="#3b82f6"
        opacity="0.3"
        stroke="#2563eb"
        strokeWidth="2"
        rx="4"
      />
      <circle cx="550" cy="440" r="15" fill="#60a5fa" opacity="0.6" />
      <text x="550" y="475" fontSize="10" fill="#3b82f6" textAnchor="middle">
        FLUIDO
      </text>

      {/* Mangueira de refrigeração */}
      <path d="M 520,450 Q 480,470 420,460" fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.6" />

      {/* Painel de controle */}
      <rect x="600" y="280" width="120" height="140" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
      <circle cx="640" cy="320" r="15" fill="#10b981" opacity="0.8" />
      <circle cx="680" cy="320" r="15" fill="#ef4444" opacity="0.8" />
      <rect x="620" y="350" width="80" height="50" fill="#0f172a" stroke="#1e293b" strokeWidth="1" rx="3" />
      <text x="660" y="380" fontSize="11" fill="#94a3b8" textAnchor="middle">
        RPM: 1500
      </text>

      {/* Guias de precisão */}
      <rect x="350" y="320" width="8" height="200" fill="#475569" stroke="#334155" strokeWidth="1" />
      <rect x="432" y="320" width="8" height="200" fill="#475569" stroke="#334155" strokeWidth="1" />
    </svg>
  )
}
