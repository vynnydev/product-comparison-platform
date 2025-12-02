export function RivetingMachineDiagram({
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
      <rect x="250" y="550" width="300" height="80" fill="#4a5568" stroke="#2d3748" strokeWidth="2" rx="4" />

      {/* Coluna principal */}
      <rect x="360" y="250" width="80" height="300" fill="#718096" stroke="#4a5568" strokeWidth="2" />

      {/* Cabeçote superior */}
      <rect x="320" y="180" width="160" height="70" fill="#a0aec0" stroke="#718096" strokeWidth="2" rx="6" />

      {/* Motor */}
      <ellipse cx="400" cy="150" rx="60" ry="40" fill="#cbd5e0" stroke="#a0aec0" strokeWidth="2" />
      <ellipse cx="400" cy="150" rx="35" ry="25" fill="#4a5568" />

      {/* Pistão pneumático */}
      <rect x="385" y="250" width="30" height="120" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />
      <rect x="375" y="370" width="50" height="40" fill="#475569" stroke="#334155" strokeWidth="2" rx="4" />

      {/* Punção */}
      <rect x="390" y="410" width="20" height="100" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      <polygon points="390,510 410,510 405,530 395,530" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />

      {/* Mesa de trabalho */}
      <rect x="300" y="510" width="200" height="20" fill="#64748b" stroke="#475569" strokeWidth="2" />

      {/* Guias laterais */}
      <rect x="340" y="300" width="10" height="210" fill="#475569" stroke="#334155" strokeWidth="1" />
      <rect x="450" y="300" width="10" height="210" fill="#475569" stroke="#334155" strokeWidth="1" />

      {/* Painel de controle */}
      <rect x="500" y="350" width="120" height="100" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
      <circle cx="540" cy="385" r="12" fill="#10b981" opacity="0.8" />
      <circle cx="580" cy="385" r="12" fill="#ef4444" opacity="0.8" />
      <rect x="520" y="410" width="80" height="25" fill="#334155" stroke="#475569" strokeWidth="1" rx="3" />
    </svg>
  )
}
