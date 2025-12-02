export function RoboticWelderDiagram({
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
      {/* Base do robô */}
      <ellipse cx="400" cy="580" rx="80" ry="40" fill="#4a5568" stroke="#2d3748" strokeWidth="3" />

      {/* Coluna base giratória */}
      <rect x="360" y="480" width="80" height="100" fill="#718096" stroke="#4a5568" strokeWidth="2" rx="6" />
      <ellipse cx="400" cy="480" rx="50" ry="25" fill="#94a3b8" stroke="#64748b" strokeWidth="2" />

      {/* Primeiro segmento do braço */}
      <g transform="rotate(-25 400 480)">
        <rect x="400" y="350" width="40" height="130" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="4" />
        <circle cx="420" cy="350" r="20" fill="#475569" stroke="#334155" strokeWidth="2" />
      </g>

      {/* Segundo segmento do braço */}
      <g transform="rotate(-45 480 300)">
        <rect x="480" y="220" width="35" height="120" fill="#a0aec0" stroke="#718096" strokeWidth="2" rx="4" />
        <circle cx="497" cy="220" r="18" fill="#475569" stroke="#334155" strokeWidth="2" />
      </g>

      {/* Punho rotativo */}
      <g transform="translate(550, 270)">
        <rect x="-15" y="-15" width="30" height="60" fill="#64748b" stroke="#475569" strokeWidth="2" rx="3" />
        <circle cx="0" cy="-15" r="15" fill="#334155" stroke="#1e293b" strokeWidth="2" />
      </g>

      {/* Tocha de solda */}
      <g transform="translate(550, 315)">
        <rect x="-10" y="0" width="20" height="80" fill="#94a3b8" stroke="#64748b" strokeWidth="2" rx="2" />
        <polygon points="-8,80 8,80 5,100 -5,100" fill="#f59e0b" stroke="#d97706" strokeWidth="2" />
        {/* Arco elétrico simulado */}
        <circle cx="0" cy="105" r="15" fill="#60a5fa" opacity="0.6">
          <animate attributeName="opacity" values="0.4;0.8;0.4" dur="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="0" cy="105" r="8" fill="#f0f9ff" opacity="0.8">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="0.3s" repeatCount="indefinite" />
        </circle>
      </g>

      {/* Mesa de trabalho */}
      <rect x="500" y="420" width="200" height="150" fill="#64748b" stroke="#475569" strokeWidth="2" rx="4" />
      <rect x="520" y="440" width="160" height="20" fill="#94a3b8" stroke="#64748b" strokeWidth="1" />

      {/* Peça sendo soldada */}
      <rect x="530" y="470" width="140" height="60" fill="#cbd5e0" stroke="#94a3b8" strokeWidth="2" rx="3" />

      {/* Painel de controle */}
      <rect x="150" y="450" width="140" height="130" fill="#1e293b" stroke="#334155" strokeWidth="2" rx="6" />
      <rect x="170" y="475" width="100" height="60" fill="#0f172a" stroke="#1e293b" strokeWidth="1" rx="3" />
      <text x="220" y="510" fontSize="12" fill="#3b82f6" textAnchor="middle">
        ROBÔ CTRL
      </text>

      {/* Indicadores */}
      <circle cx="185" cy="555" r="10" fill="#10b981" opacity="0.8" />
      <circle cx="220" cy="555" r="10" fill="#f59e0b" opacity="0.8" />
      <circle cx="255" cy="555" r="10" fill="#ef4444" opacity="0.8" />

      {/* Cabos e mangueiras */}
      <path d="M 400,520 Q 350,480 300,450" fill="none" stroke="#64748b" strokeWidth="8" opacity="0.6" />
      <path d="M 410,520 Q 380,480 290,460" fill="none" stroke="#3b82f6" strokeWidth="6" opacity="0.5" />
    </svg>
  )
}
