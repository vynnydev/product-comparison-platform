export function AutomatedAssemblyDiagram({
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
      {/* Esteira transportadora */}
      <rect x="100" y="500" width="600" height="80" fill="#64748b" stroke="#475569" strokeWidth="2" rx="6" />
      <ellipse cx="150" cy="540" rx="30" ry="30" fill="#334155" stroke="#1e293b" strokeWidth="2" />
      <ellipse cx="650" cy="540" rx="30" ry="30" fill="#334155" stroke="#1e293b" strokeWidth="2" />

      {/* Trilhos superiores */}
      <line x1="150" y1="150" x2="650" y2="150" stroke="#718096" strokeWidth="8" strokeLinecap="round" />
      <line x1="150" y1="180" x2="650" y2="180" stroke="#718096" strokeWidth="8" strokeLinecap="round" />

      {/* Braço robótico 1 */}
      <g>
        <rect x="250" y="150" width="40" height="120" fill="#94a3b8" stroke="#64748b" strokeWidth="2" rx="4" />
        <rect x="240" y="270" width="60" height="15" fill="#475569" stroke="#334155" strokeWidth="2" rx="3" />
        <rect x="255" y="285" width="30" height="100" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="3" />
        {/* Garra */}
        <path d="M 260,385 L 250,410 L 260,410 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        <path d="M 280,385 L 290,410 L 280,410 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
      </g>

      {/* Braço robótico 2 */}
      <g>
        <rect x="510" y="150" width="40" height="120" fill="#94a3b8" stroke="#64748b" strokeWidth="2" rx="4" />
        <rect x="500" y="270" width="60" height="15" fill="#475569" stroke="#334155" strokeWidth="2" rx="3" />
        <rect x="515" y="285" width="30" height="100" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="3" />
        {/* Garra */}
        <path d="M 520,385 L 510,410 L 520,410 Z" fill="#10b981" stroke="#059669" strokeWidth="2" />
        <path d="M 540,385 L 550,410 L 540,410 Z" fill="#10b981" stroke="#059669" strokeWidth="2" />
      </g>

      {/* Estação de inspeção com câmera */}
      <g>
        <rect x="360" y="300" width="80" height="120" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
        <circle cx="400" cy="350" r="25" fill="#3b82f6" opacity="0.6" />
        <circle cx="400" cy="350" r="15" fill="#60a5fa" opacity="0.8" />
        <text x="400" y="395" fontSize="10" fill="#94a3b8" textAnchor="middle">
          VISÃO IA
        </text>
      </g>

      {/* Peças na esteira */}
      <rect x="180" y="520" width="40" height="30" fill="#f59e0b" stroke="#d97706" strokeWidth="2" rx="3" />
      <rect x="350" y="520" width="40" height="30" fill="#10b981" stroke="#059669" strokeWidth="2" rx="3" />
      <rect x="550" y="520" width="40" height="30" fill="#3b82f6" stroke="#2563eb" strokeWidth="2" rx="3" />

      {/* Sensores */}
      <circle cx="200" cy="480" r="8" fill="#ef4444" opacity="0.8" />
      <circle cx="400" cy="480" r="8" fill="#10b981" opacity="0.8" />
      <circle cx="600" cy="480" r="8" fill="#3b82f6" opacity="0.8" />
    </svg>
  )
}
