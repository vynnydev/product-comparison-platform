'use client'

import { useState, useEffect, useRef } from 'react'
import { MapPin, ZoomIn, ZoomOut, Maximize2, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import cn from 'classnames'
import { generateMapUrl, generateRouteGeometry } from '@/app/actions/map-actions'

interface MapMarker {
  id: string
  lng: number
  lat: number
  color: string
  label: string
  address?: string
  type?: string
  status?: string
  distance?: string
  machine?: string
  phone?: string
  showCard?: boolean
  onClick?: () => void
}

interface ProfessionalMapProps {
  markers: MapMarker[]
  center?: [number, number]
  zoom?: number
  className?: string
  showRoute?: boolean
  selectedRequestId?: string | null
}

export function ProfessionalMap({ 
  markers, 
  center = [-46.633308, -23.550520], 
  zoom = 12, 
  className = "h-[600px]",
  showRoute = false,
  selectedRequestId = null
}: ProfessionalMapProps) {
  const [currentZoom, setCurrentZoom] = useState(zoom)
  const [currentCenter, setCurrentCenter] = useState(center)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [mapUrl, setMapUrl] = useState('')
  const [routeGeometry, setRouteGeometry] = useState<Array<[number, number]>>([])
  const [isLoading, setIsLoading] = useState(true)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  useEffect(() => {
    const loadRoute = async () => {
      if (showRoute && markers.length >= 2 && selectedRequestId) {
        console.log('[v0] Loading route for request:', selectedRequestId)
        try {
          const workshop = markers.find(m => m.type === 'workshop')
          const client = markers.find(m => m.id === selectedRequestId)
          
          if (workshop && client) {
            console.log('[v0] Fetching route from', workshop.label, 'to', client.label)
            const route = await generateRouteGeometry(
              [workshop.lng, workshop.lat],
              [client.lng, client.lat]
            )
            console.log('[v0] Route geometry loaded with', route.length, 'points')
            setRouteGeometry(route)
          } else {
            console.log('[v0] Workshop or client not found')
            setRouteGeometry([])
          }
        } catch (error) {
          console.error('[v0] Error loading route:', error)
          setRouteGeometry([])
        }
      } else {
        setRouteGeometry([])
      }
    }
    
    loadRoute()
  }, [showRoute, markers, selectedRequestId])

  useEffect(() => {
    setCurrentCenter(center)
    setDragOffset({ x: 0, y: 0 })
  }, [center[0], center[1]])

  useEffect(() => {
    setCurrentZoom(zoom)
  }, [zoom])

  useEffect(() => {
    const loadMap = async () => {
      setIsLoading(true)
      try {
        const width = 1200
        const height = 800
        
        const url = await generateMapUrl(
          [],
          currentCenter,
          currentZoom,
          { width, height }
        )
        
        setMapUrl(url)
      } catch (error) {
        console.error('[v0] Error generating map:', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    loadMap()
  }, [currentCenter, currentZoom])

  const latLngToPixel = (lat: number, lng: number) => {
    const scale = Math.pow(2, currentZoom) * 156543.03392 / Math.cos(currentCenter[1] * Math.PI / 180) * 800 / 40075016.686
    
    const x = 400 + (lng - currentCenter[0]) * scale + dragOffset.x
    const y = 300 - (lat - currentCenter[1]) * scale + dragOffset.y
    
    return { x, y }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsDragging(true)
      setDragStart({ x: e.clientX, y: e.clientY })
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const deltaX = e.clientX - dragStart.x
      const deltaY = e.clientY - dragStart.y
      setDragOffset({ x: deltaX, y: deltaY })
    }
  }

  const handleMouseUp = () => {
    if (isDragging) {
      const scale = Math.pow(2, currentZoom) * 156543.03392 / Math.cos(currentCenter[1] * Math.PI / 180) * 800 / 40075016.686
      
      const newCenterLng = currentCenter[0] - dragOffset.x / scale
      const newCenterLat = currentCenter[1] + dragOffset.y / scale
      
      setCurrentCenter([newCenterLng, newCenterLat])
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }

  const handleZoomIn = () => setCurrentZoom(Math.min(currentZoom + 1, 18))
  const handleZoomOut = () => setCurrentZoom(Math.max(currentZoom - 1, 8))

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "workshop":
        return "🏭"
      case "delivery":
        return "📦"
      case "tow":
        return "🚛"
      case "pickup":
        return "📍"
      default:
        return "📍"
    }
  }

  return (
    <div className={cn("relative rounded-lg overflow-hidden bg-slate-900", className, isFullscreen && "fixed inset-0 z-50")}>
      <div 
        className={cn("absolute inset-0", isDragging ? "cursor-grabbing" : "cursor-grab")}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        ref={containerRef}
      >
        {isLoading ? (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-sm text-muted-foreground">Carregando mapa...</p>
            </div>
          </div>
        ) : mapUrl ? (
          <img 
            src={mapUrl || "/placeholder.svg"} 
            alt="Mapa" 
            className="w-full h-full object-cover pointer-events-none select-none"
            draggable={false}
            style={{
              transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
              transition: isDragging ? 'none' : 'transform 0.3s ease-out'
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-slate-900">
            <div className="text-center p-8">
              <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">
                Erro ao carregar o mapa
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="absolute inset-0 w-full h-full pointer-events-none">
        <svg className="w-full h-full" viewBox="0 0 800 600" preserveAspectRatio="xMidYMid slice">
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {routeGeometry.length > 0 && (
            <g>
              {/* Shadow */}
              <path
                d={routeGeometry.map((point, idx) => {
                  const pos = latLngToPixel(point[1], point[0])
                  return `${idx === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
                }).join(' ')}
                stroke="#000000"
                strokeWidth="8"
                fill="none"
                opacity="0.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              
              {/* Main route line */}
              <path
                d={routeGeometry.map((point, idx) => {
                  const pos = latLngToPixel(point[1], point[0])
                  return `${idx === 0 ? 'M' : 'L'} ${pos.x} ${pos.y}`
                }).join(' ')}
                stroke="#3b82f6"
                strokeWidth="5"
                fill="none"
                opacity="0.95"
                filter="url(#glow)"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="10 5"
              >
                <animate
                  attributeName="stroke-dashoffset"
                  from="15"
                  to="0"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </path>
            </g>
          )}
        </svg>
        
        {markers.map((marker) => {
          const pos = latLngToPixel(marker.lat, marker.lng)
          
          return (
            <div
              key={marker.id}
              className="absolute pointer-events-auto transition-all duration-300"
              style={{
                left: `${(pos.x / 800) * 100}%`,
                top: `${(pos.y / 600) * 100}%`,
                transform: 'translate(-50%, -100%)',
              }}
            >
              {marker.showCard ? (
                <>
                  <div className="mb-2">
                    <Card 
                      className={cn(
                        "shadow-xl cursor-pointer hover:shadow-2xl transition-all hover:scale-105",
                        marker.id === selectedRequestId && "ring-2 ring-primary scale-105"
                      )}
                      onClick={(e) => {
                        e.stopPropagation()
                        marker.onClick?.()
                      }}
                    >
                      <CardContent className={cn(
                        "p-3",
                        marker.type === "workshop" ? "min-w-[200px]" : "min-w-[180px] max-w-[220px]"
                      )}>
                        <div className="flex items-start gap-2">
                          <div 
                            className="h-10 w-10 rounded-full flex items-center justify-center text-lg flex-shrink-0"
                            style={{ backgroundColor: marker.color }}
                          >
                            {getTypeIcon(marker.type || "")}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-semibold text-sm truncate">{marker.label}</p>
                            <p className="text-xs text-muted-foreground line-clamp-2 leading-tight mt-0.5">
                              {marker.address}
                            </p>
                            {marker.machine && (
                              <p className="text-xs text-muted-foreground truncate mt-1 font-medium">
                                {marker.machine}
                              </p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                  
                  {/* Pin pointer */}
                  <div 
                    className="h-6 w-1 mx-auto rounded-full"
                    style={{ backgroundColor: marker.color }}
                  />
                  <div 
                    className="h-3 w-3 rounded-full mx-auto -mt-1 shadow-lg"
                    style={{ backgroundColor: marker.color }}
                  />
                </>
              ) : (
                <div 
                  className="relative cursor-pointer hover:scale-125 transition-transform"
                  onClick={(e) => {
                    e.stopPropagation()
                    marker.onClick?.()
                  }}
                >
                  {/* Pin icon */}
                  <div className="relative">
                    <svg 
                      width="32" 
                      height="42" 
                      viewBox="0 0 32 42" 
                      fill="none"
                      className="drop-shadow-lg"
                    >
                      <path
                        d="M16 0C7.163 0 0 7.163 0 16c0 12 16 26 16 26s16-14 16-26c0-8.837-7.163-16-16-16z"
                        fill={marker.color}
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="6"
                        fill="white"
                        opacity="0.9"
                      />
                    </svg>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Controls */}
      <div className="absolute top-4 right-4 flex flex-col gap-2 pointer-events-auto">
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomIn}
          className="h-10 w-10 shadow-lg"
        >
          <ZoomIn className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={handleZoomOut}
          className="h-10 w-10 shadow-lg"
        >
          <ZoomOut className="h-4 w-4" />
        </Button>
        <Button
          size="icon"
          variant="secondary"
          onClick={() => setIsFullscreen(!isFullscreen)}
          className="h-10 w-10 shadow-lg"
        >
          <Maximize2 className="h-4 w-4" />
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border flex items-center gap-2 pointer-events-auto">
        <MapPin className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium">{markers.length} locais</span>
      </div>

      <div className="absolute top-4 left-4 bg-background/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg border pointer-events-auto">
        <p className="text-sm font-semibold">São Paulo, SP</p>
        <p className="text-xs text-muted-foreground">Brasil</p>
      </div>

      {showRoute && routeGeometry.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-blue-500/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg text-white pointer-events-auto flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
          <span className="text-sm font-medium">Rota ativa</span>
        </div>
      )}
    </div>
  )
}
