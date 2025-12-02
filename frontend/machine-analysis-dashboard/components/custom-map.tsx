"use client"

import { useState } from "react"
import { MapPin } from 'lucide-react'
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import cn from "classnames"

interface MapMarker {
  id: string
  lng: number
  lat: number
  color: string
  label: string
  onClick?: () => void
}

interface CustomMapProps {
  markers: MapMarker[]
  center: [number, number]
  zoom?: number
  className?: string
}

export function CustomMap({ markers, center, zoom = 12, className }: CustomMapProps) {
  const [hoveredMarker, setHoveredMarker] = useState<string | null>(null)

  const latToY = (lat: number) => {
    const minLat = Math.min(...markers.map(m => m.lat))
    const maxLat = Math.max(...markers.map(m => m.lat))
    const range = maxLat - minLat || 0.1
    return ((maxLat - lat) / range) * 80 + 10
  }

  const lngToX = (lng: number) => {
    const minLng = Math.min(...markers.map(m => m.lng))
    const maxLng = Math.max(...markers.map(m => m.lng))
    const range = maxLng - minLng || 0.1
    return ((lng - minLng) / range) * 80 + 10
  }

  return (
    <div className={cn("relative bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800 overflow-hidden", className)}>
      <svg className="w-full h-full" viewBox="0 0 100 100">
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="currentColor" strokeWidth="0.1" className="text-slate-300 dark:text-slate-700" />
          </pattern>
        </defs>
        <rect width="100" height="100" fill="url(#grid)" />

        {/* Streets/paths */}
        <line x1="20" y1="50" x2="80" y2="50" stroke="currentColor" strokeWidth="0.3" className="text-slate-400 dark:text-slate-600" />
        <line x1="50" y1="20" x2="50" y2="80" stroke="currentColor" strokeWidth="0.3" className="text-slate-400 dark:text-slate-600" />
        <line x1="30" y1="30" x2="70" y2="70" stroke="currentColor" strokeWidth="0.2" className="text-slate-400 dark:text-slate-600" />
        
        {/* Markers */}
        {markers.map((marker) => {
          const x = lngToX(marker.lng)
          const y = latToY(marker.lat)
          const isHovered = hoveredMarker === marker.id
          
          return (
            <g
              key={marker.id}
              onMouseEnter={() => setHoveredMarker(marker.id)}
              onMouseLeave={() => setHoveredMarker(null)}
              onClick={() => marker.onClick?.()}
              style={{ cursor: 'pointer' }}
              className="transition-transform"
              transform={isHovered ? `translate(${x}, ${y}) scale(1.3)` : `translate(${x}, ${y})`}
            >
              {/* Marker shadow */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? "2" : "1.5"}
                fill="rgba(0,0,0,0.2)"
                transform="translate(0.3, 0.3)"
              />
              
              {/* Marker pin */}
              <circle
                cx="0"
                cy="0"
                r={isHovered ? "2" : "1.5"}
                fill={marker.color}
                stroke="white"
                strokeWidth="0.3"
              />
              
              {/* Pulse animation */}
              {isHovered && (
                <circle
                  cx="0"
                  cy="0"
                  r="2"
                  fill="none"
                  stroke={marker.color}
                  strokeWidth="0.5"
                  opacity="0.6"
                >
                  <animate
                    attributeName="r"
                    from="2"
                    to="4"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    from="0.6"
                    to="0"
                    dur="1.5s"
                    repeatCount="indefinite"
                  />
                </circle>
              )}
              
              {/* Label on hover */}
              {isHovered && (
                <text
                  x="0"
                  y="-3"
                  textAnchor="middle"
                  fontSize="2"
                  fontWeight="bold"
                  fill="currentColor"
                  className="text-foreground pointer-events-none"
                  style={{
                    textShadow: '0 0 3px rgba(255,255,255,0.8)',
                  }}
                >
                  {marker.label}
                </text>
              )}
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="absolute bottom-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg border p-3 shadow-lg">
        <div className="flex items-center gap-2 text-xs">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{markers.length} {markers.length === 1 ? 'local' : 'locais'}</span>
        </div>
      </div>
    </div>
  )
}
