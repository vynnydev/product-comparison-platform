"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Navigation,
  Clock,
  Star,
  Phone,
  X,
  Sparkles,
  TrendingDown,
  Package,
  ZoomIn,
  ZoomOut,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { generateMapUrl, generateRouteGeometry } from "@/app/actions/map-actions"
import { createPortal } from "react-dom"

interface Vendor {
  id: string
  name: string
  address: string
  city: string
  distance: number
  duration: string
  price: number
  originalPrice: number
  discount: number
  rating: number
  reviews: number
  phone: string
  hours: string
  inStock: boolean
  quantity: number
  coordinates: [number, number]
  image: string
}

interface PartsLocationFinderProps {
  isOpen: boolean
  onClose: () => void
  partName: string
  partImage?: string
}

const mockVendors: Vendor[] = [
  {
    id: "1",
    name: "AutoPeças Premium",
    address: "Rua das Indústrias, 450",
    city: "São Paulo - SP",
    distance: 2.3,
    duration: "8 min",
    price: 2250.0,
    originalPrice: 2800.0,
    discount: 20,
    rating: 4.8,
    reviews: 156,
    phone: "(11) 98765-4321",
    hours: "08:00 - 18:00",
    inStock: true,
    quantity: 5,
    coordinates: [-46.6333, -23.5505],
    image: "/parts-store-1.jpg",
  },
  {
    id: "2",
    name: "Oficina Central Peças",
    address: "Av. Paulista, 1200",
    city: "São Paulo - SP",
    distance: 4.1,
    duration: "15 min",
    price: 2180.0,
    originalPrice: 2600.0,
    discount: 16,
    rating: 4.9,
    reviews: 203,
    phone: "(11) 97654-3210",
    hours: "07:00 - 19:00",
    inStock: true,
    quantity: 3,
    coordinates: [-46.6567, -23.5629],
    image: "/parts-store-2.jpg",
  },
  {
    id: "3",
    name: "Industrial Parts Express",
    address: "Rua do Comércio, 890",
    city: "São Paulo - SP",
    distance: 5.8,
    duration: "22 min",
    price: 2450.0,
    originalPrice: 2900.0,
    discount: 15,
    rating: 4.6,
    reviews: 89,
    phone: "(11) 96543-2109",
    hours: "08:30 - 17:30",
    inStock: true,
    quantity: 2,
    coordinates: [-46.6189, -23.5475],
    image: "/parts-store-3.jpg",
  },
  {
    id: "4",
    name: "MegaPeças Distribuidora",
    address: "Av. Industrial, 2340",
    city: "São Paulo - SP",
    distance: 7.2,
    duration: "28 min",
    price: 2350.0,
    originalPrice: 2750.0,
    discount: 14,
    rating: 4.7,
    reviews: 124,
    phone: "(11) 95432-1098",
    hours: "09:00 - 18:00",
    inStock: true,
    quantity: 4,
    coordinates: [-46.6011, -23.5333],
    image: "/parts-store-4.jpg",
  },
  {
    id: "5",
    name: "TechParts Pro",
    address: "Rua dos Metalúrgicos, 567",
    city: "São Paulo - SP",
    distance: 9.5,
    duration: "35 min",
    price: 2520.0,
    originalPrice: 2950.0,
    discount: 15,
    rating: 4.5,
    reviews: 67,
    phone: "(11) 94321-0987",
    hours: "08:00 - 17:00",
    inStock: false,
    quantity: 0,
    coordinates: [-46.5822, -23.5189],
    image: "/parts-store-5.jpg",
  },
]

const userLocation: [number, number] = [-46.6389, -23.5489]

export function PartsLocationFinder({ isOpen, onClose, partName, partImage }: PartsLocationFinderProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null)
  const [isCardExpanded, setIsCardExpanded] = useState(false)
  const [mapUrl, setMapUrl] = useState("")
  const [routeGeometry, setRouteGeometry] = useState<Array<[number, number]>>([])
  const [currentZoom, setCurrentZoom] = useState(12)
  const [currentCenter, setCurrentCenter] = useState<[number, number]>(userLocation)
  const [isMapLoading, setIsMapLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)
    return () => setMounted(false)
  }, [])

  useEffect(() => {
    if (!isOpen) return

    setIsLoading(true)
    setSelectedVendor(null)
    setIsCardExpanded(false)

    const timer = setTimeout(() => {
      setIsLoading(false)
      setSelectedVendor(mockVendors[0])
    }, 3000)

    return () => clearTimeout(timer)
  }, [isOpen])

  useEffect(() => {
    if (!isOpen || isLoading) return

    const loadMap = async () => {
      setIsMapLoading(true)
      try {
        const width = 1200
        const height = 800

        const url = await generateMapUrl([], currentCenter, currentZoom, { width, height })

        console.log("[PartsLocationFinder] Map URL loaded:", url)
        setMapUrl(url)
      } catch (error) {
        console.error("[PartsLocationFinder] Error loading map:", error)
      } finally {
        setIsMapLoading(false)
      }
    }

    loadMap()
  }, [isOpen, isLoading, currentCenter, currentZoom])

  useEffect(() => {
    if (!selectedVendor || isLoading) {
      setRouteGeometry([])
      return
    }

    const loadRoute = async () => {
      try {
        const route = await generateRouteGeometry(userLocation, selectedVendor.coordinates)
        console.log("[PartsLocationFinder] Route loaded with", route.length, "points")
        setRouteGeometry(route)
      } catch (error) {
        console.error("[PartsLocationFinder] Error loading route:", error)
        setRouteGeometry([])
      }
    }

    loadRoute()
  }, [selectedVendor, isLoading])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  const latLngToPixel = (lat: number, lng: number) => {
    const scale =
      (((Math.pow(2, currentZoom) * 156543.03392) / Math.cos((currentCenter[1] * Math.PI) / 180)) * 800) / 40075016.686

    const x = 600 + (lng - currentCenter[0]) * scale + dragOffset.x
    const y = 400 - (lat - currentCenter[1]) * scale + dragOffset.y

    return { x, y }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      // Botão esquerdo do mouse
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
      const scale =
        (((Math.pow(2, currentZoom) * 156543.03392) / Math.cos((currentCenter[1] * Math.PI) / 180)) * 800) /
        40075016.686

      const newCenterLng = currentCenter[0] - dragOffset.x / scale
      const newCenterLat = currentCenter[1] + dragOffset.y / scale

      setCurrentCenter([newCenterLng, newCenterLat])
      setDragOffset({ x: 0, y: 0 })
      setIsDragging(false)
    }
  }

  const handleZoomIn = () => setCurrentZoom(Math.min(currentZoom + 1, 18))
  const handleZoomOut = () => setCurrentZoom(Math.max(currentZoom - 1, 8))

  if (!isOpen || !mounted) return null

  const modalContent = (
    <>
      {/* BACKDROP DESFOCADO - Added dark mode support */}
      <div
        className="fixed inset-0 z-[9998] bg-black/60 dark:bg-black/80 backdrop-blur-md"
        onClick={onClose}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: "100vw",
          height: "100vh",
        }}
      />

      {/* MODAL CONTAINER - 85% DA TELA - Changed modal background to be light in light mode and dark in dark mode */}
      <div
        className="fixed z-[9999] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "85vw",
          height: "85vh",
          maxWidth: "85vw",
          maxHeight: "85vh",
        }}
      >
        <div className="relative w-full h-full overflow-hidden rounded-2xl">
          {isLoading ? (
            <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm">
              <div className="relative">
                <div className="absolute inset-0 animate-pulse">
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 via-pink-500 to-orange-500 opacity-50 blur-2xl animate-spin-slow" />
                </div>

                <div className="relative bg-slate-50 dark:bg-slate-900/90 p-12 rounded-2xl border-4 border-transparent bg-clip-padding">
                  <div
                    className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 via-pink-600 to-orange-600 opacity-75 animate-gradient-x"
                    style={{
                      padding: "4px",
                      WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                      WebkitMaskComposite: "xor",
                      maskComposite: "exclude",
                    }}
                  />

                  <div className="space-y-6 relative z-10">
                    <div className="flex items-center justify-center">
                      <div className="relative">
                        <Sparkles className="h-16 w-16 text-purple-600 dark:text-purple-400 animate-pulse" />
                        <div className="absolute inset-0 bg-purple-600 dark:bg-purple-400 blur-xl opacity-50 animate-pulse" />
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Analisando com IA</h3>
                      <p className="text-slate-600 dark:text-slate-300 max-w-md">
                        Buscando locais mais próximos com melhor custo-benefício para:
                      </p>
                      <p className="text-xl font-semibold text-purple-600 dark:text-purple-400">{partName}</p>
                    </div>

                    <div className="flex items-center justify-center gap-2">
                      <div
                        className="h-2 w-2 bg-blue-500 rounded-full animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-purple-500 rounded-full animate-bounce"
                        style={{ animationDelay: "150ms" }}
                      />
                      <div
                        className="h-2 w-2 bg-pink-500 rounded-full animate-bounce"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>

                    <div className="pt-4 space-y-2 text-sm text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Analisando preços em tempo real...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Calculando melhores rotas...</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
                        <span>Verificando disponibilidade de estoque...</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* MAPA - CAMADA BASE - Updated map background colors for light mode */}
              <div
                className="absolute inset-0 z-0 bg-slate-100 dark:bg-slate-900"
                style={{ cursor: isDragging ? "grabbing" : "grab" }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                ref={containerRef}
              >
                {isMapLoading ? (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-orange-500 dark:border-orange-400 mx-auto mb-4"></div>
                      <p className="text-lg text-slate-700 dark:text-slate-300">Carregando mapa...</p>
                    </div>
                  </div>
                ) : mapUrl ? (
                  <img
                    src={mapUrl || "/placeholder.svg"}
                    alt="Mapa"
                    className="w-full h-full object-cover pointer-events-none select-none"
                    draggable={false}
                    style={{
                      filter: "brightness(0.8) contrast(1.1)",
                      transform: `translate(${dragOffset.x}px, ${dragOffset.y}px)`,
                      transition: isDragging ? "none" : "transform 0.3s ease-out",
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-16 w-16 text-slate-400 dark:text-slate-600 mx-auto mb-4" />
                      <p className="text-slate-600 dark:text-slate-400">Erro ao carregar mapa</p>
                    </div>
                  </div>
                )}
              </div>

              {/* SVG OVERLAY - ROTAS */}
              <div className="absolute inset-0 w-full h-full pointer-events-none z-10">
                <svg className="w-full h-full" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice">
                  <defs>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                      <feMerge>
                        <feMergeNode in="coloredBlur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {routeGeometry.length > 0 && (
                    <g>
                      <path
                        d={routeGeometry
                          .map((point, idx) => {
                            const pos = latLngToPixel(point[1], point[0])
                            return `${idx === 0 ? "M" : "L"} ${pos.x} ${pos.y}`
                          })
                          .join(" ")}
                        stroke="#000000"
                        strokeWidth="12"
                        fill="none"
                        opacity="0.4"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />

                      <path
                        d={routeGeometry
                          .map((point, idx) => {
                            const pos = latLngToPixel(point[1], point[0])
                            return `${idx === 0 ? "M" : "L"} ${pos.x} ${pos.y}`
                          })
                          .join(" ")}
                        stroke="#f97316"
                        strokeWidth="8"
                        fill="none"
                        opacity="0.95"
                        filter="url(#glow)"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeDasharray="20 10"
                      >
                        <animate
                          attributeName="stroke-dashoffset"
                          from="30"
                          to="0"
                          dur="1.5s"
                          repeatCount="indefinite"
                        />
                      </path>
                    </g>
                  )}
                </svg>

                {/* MARCADOR DO USUÁRIO */}
                {(() => {
                  const userPos = latLngToPixel(userLocation[1], userLocation[0])
                  return (
                    <div
                      className="absolute pointer-events-none"
                      style={{
                        left: `${(userPos.x / 1200) * 100}%`,
                        top: `${(userPos.y / 800) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div className="relative">
                        <div className="h-20 w-20 rounded-full bg-blue-500/30 border-4 border-blue-500 animate-pulse shadow-2xl" />
                        <div className="absolute inset-0 h-20 w-20 rounded-full bg-blue-500 opacity-50 blur-xl animate-pulse" />
                      </div>
                    </div>
                  )
                })()}

                {/* MARCADORES DOS VENDEDORES */}
                {mockVendors.map((vendor) => {
                  const vendorPos = latLngToPixel(vendor.coordinates[1], vendor.coordinates[0])
                  return (
                    <div
                      key={vendor.id}
                      className="absolute pointer-events-auto cursor-pointer transition-all hover:scale-125"
                      style={{
                        left: `${(vendorPos.x / 1200) * 100}%`,
                        top: `${(vendorPos.y / 800) * 100}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                      onClick={() => {
                        setSelectedVendor(vendor)
                        setIsCardExpanded(false)
                      }}
                    >
                      <div
                        className={`h-12 w-12 rounded-full border-4 border-white shadow-2xl flex items-center justify-center text-white font-bold text-lg transition-all ${
                          selectedVendor?.id === vendor.id ? "scale-125 ring-4 ring-orange-500" : ""
                        }`}
                        style={{
                          backgroundColor: vendor.inStock ? "#f97316" : "#9ca3af",
                        }}
                      >
                        ₵
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* CONTROLES DO MAPA - CANTO SUPERIOR DIREITO - Updated map controls colors for light mode */}
              <div className="absolute top-6 right-6 z-30 flex flex-col gap-3">
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomIn}
                  className="h-12 w-12 shadow-2xl bg-white dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700"
                >
                  <ZoomIn className="h-5 w-5" />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  onClick={handleZoomOut}
                  className="h-12 w-12 shadow-2xl bg-white dark:bg-slate-900/95 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-900 dark:text-white border-2 border-slate-300 dark:border-slate-700"
                >
                  <ZoomOut className="h-5 w-5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={onClose}
                  className="h-12 w-12 bg-white dark:bg-slate-900/95 hover:bg-red-600 dark:hover:bg-red-700 text-slate-900 dark:text-white hover:text-white border-2 border-slate-300 dark:border-slate-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              {/* LISTA DE VENDEDORES - LATERAL ESQUERDA - Updated list of vendors colors for light mode */}
              <div className="absolute left-6 top-6 bottom-6 w-[360px] z-20">
                <Card className="h-full bg-white dark:bg-slate-900/95 backdrop-blur-md border-2 border-slate-300 dark:border-slate-700 shadow-2xl">
                  <CardContent className="p-5 h-full flex flex-col">
                    <div className="flex items-center justify-between mb-5">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100">Melhores Opções</h3>
                      <Badge className="bg-purple-600 dark:bg-purple-500 text-sm px-3 py-1">
                        {mockVendors.filter((v) => v.inStock).length} disponíveis
                      </Badge>
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-600 scrollbar-track-transparent">
                      {mockVendors.map((vendor, index) => (
                        <Card
                          key={vendor.id}
                          className={`cursor-pointer transition-all hover:scale-[1.02] ${
                            selectedVendor?.id === vendor.id
                              ? "ring-2 ring-orange-500 dark:ring-orange-400 bg-slate-100 dark:bg-slate-700 shadow-lg"
                              : "bg-slate-50/80 dark:bg-slate-700/80 hover:bg-slate-100 dark:hover:bg-slate-700"
                          }`}
                          onClick={() => {
                            setSelectedVendor(vendor)
                            setIsCardExpanded(false)
                          }}
                        >
                          <CardContent className="p-3">
                            <div className="flex gap-3">
                              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-600 flex-shrink-0">
                                <img
                                  src={partImage || "/placeholder.svg"}
                                  alt={vendor.name}
                                  className="w-full h-full object-cover"
                                />
                                {index === 0 && (
                                  <div className="absolute top-1 right-1">
                                    <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 dark:from-yellow-400 dark:to-orange-400 text-xs px-2 py-0.5 font-bold">
                                      TOP
                                    </Badge>
                                  </div>
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between mb-1">
                                  <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-1 pr-2">
                                    {vendor.name}
                                  </h4>
                                  <Badge
                                    variant={vendor.inStock ? "default" : "secondary"}
                                    className={`text-xs flex-shrink-0 ${
                                      vendor.inStock ? "bg-green-600 dark:bg-green-500" : "bg-gray-600 dark:bg-gray-500"
                                    }`}
                                  >
                                    {vendor.inStock ? "OK" : "X"}
                                  </Badge>
                                </div>

                                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mb-1">
                                  {partName}
                                </p>

                                <div className="flex items-center gap-1 mb-2">
                                  <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                  <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    {vendor.rating}
                                  </span>
                                  <span className="text-xs text-slate-500 dark:text-slate-600">({vendor.reviews})</span>
                                </div>

                                <div className="space-y-1.5">
                                  <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-500">
                                    <Navigation className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                                    <span>
                                      {vendor.distance} km • {vendor.duration}
                                    </span>
                                  </div>

                                  <div>
                                    <div className="flex items-center gap-1.5">
                                      <span className="text-lg font-bold text-green-600 dark:text-green-400">
                                        R$ {vendor.price.toFixed(2)}
                                      </span>
                                      <Badge
                                        variant="outline"
                                        className="text-xs border-green-600 dark:border-green-500 text-green-500 dark:text-green-400 px-1.5"
                                      >
                                        -{vendor.discount}%
                                      </Badge>
                                    </div>
                                    <span className="text-xs text-slate-500 dark:text-slate-600 line-through">
                                      R$ {vendor.originalPrice.toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* CARD DO VENDEDOR SELECIONADO - MINIMIZÁVEL - Updated vendor card colors for light mode */}
              {selectedVendor && (
                <div className="absolute right-6 bottom-6 z-20">
                  <Card
                    className={`bg-white dark:bg-slate-800/95 backdrop-blur-md border-2 border-orange-500 dark:border-orange-400 shadow-2xl transition-all duration-300 ${
                      isCardExpanded ? "w-[380px]" : "w-[320px]"
                    }`}
                  >
                    <CardContent className="p-4">
                      {/* VERSÃO MINIMIZADA */}
                      {!isCardExpanded ? (
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1 min-w-0">
                              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                                {selectedVendor.name}
                              </h3>
                              <div className="flex items-center gap-2 mt-1">
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                  <span className="text-xs font-semibold text-slate-900 dark:text-slate-100">
                                    {selectedVendor.rating}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  ({selectedVendor.reviews})
                                </span>
                                <Badge className="bg-green-600 dark:bg-green-500 text-xs px-2 py-0.5">Aberto</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1 ml-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCardExpanded(true)}
                                className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <ChevronUp className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedVendor(null)}
                                className="h-7 w-7 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Navigation className="h-3 w-3 text-orange-500 dark:text-orange-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">Distância</span>
                              </div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {selectedVendor.distance} km
                              </p>
                            </div>

                            <div className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-1.5 mb-0.5">
                                <Clock className="h-3 w-3 text-blue-500 dark:text-blue-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">Tempo</span>
                              </div>
                              <p className="text-sm font-bold text-slate-900 dark:text-slate-100">
                                {selectedVendor.duration}
                              </p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* VERSÃO EXPANDIDA */
                        <div className="space-y-3">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1">
                                {selectedVendor.name}
                              </h3>
                              <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 text-yellow-500 dark:text-yellow-400 fill-yellow-500 dark:fill-yellow-400" />
                                  <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                                    {selectedVendor.rating}
                                  </span>
                                </div>
                                <span className="text-xs text-slate-500 dark:text-slate-500">
                                  ({selectedVendor.reviews})
                                </span>
                                <Badge className="bg-green-600 dark:bg-green-500 text-xs px-2 py-0.5">Aberto</Badge>
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setIsCardExpanded(false)}
                                className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setSelectedVendor(null)}
                                className="h-8 w-8 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Navigation className="h-4 w-4 text-orange-500 dark:text-orange-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">Distância</span>
                              </div>
                              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {selectedVendor.distance} km
                              </p>
                            </div>

                            <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600">
                              <div className="flex items-center gap-1.5 mb-1">
                                <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400" />
                                <span className="text-xs text-slate-500 dark:text-slate-400">Tempo</span>
                              </div>
                              <p className="text-base font-bold text-slate-900 dark:text-slate-100">
                                {selectedVendor.duration}
                              </p>
                            </div>
                          </div>

                          <div className="p-4 rounded-lg bg-gradient-to-br from-green-100 dark:from-green-900/60 to-emerald-100 dark:to-emerald-800/60 border-2 border-green-300 dark:border-green-600">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-sm text-slate-700 dark:text-slate-200 font-medium">
                                Preço Final
                              </span>
                              <Badge
                                variant="outline"
                                className="border-green-500 dark:border-green-400 text-green-500 dark:text-green-400 text-xs px-2"
                              >
                                <TrendingDown className="h-3 w-3 mr-1" />
                                {selectedVendor.discount}% OFF
                              </Badge>
                            </div>
                            <div className="flex items-baseline gap-2">
                              <span className="text-3xl font-bold text-green-600 dark:text-green-400">
                                R$ {selectedVendor.price.toFixed(2)}
                              </span>
                              <span className="text-sm text-slate-500 dark:text-slate-400 line-through">
                                R$ {selectedVendor.originalPrice.toFixed(2)}
                              </span>
                            </div>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                              Economia de R$ {(selectedVendor.originalPrice - selectedVendor.price).toFixed(2)}
                            </p>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <MapPin className="h-4 w-4 text-orange-500 dark:text-orange-400 flex-shrink-0" />
                              <span className="line-clamp-1">
                                {selectedVendor.address}, {selectedVendor.city}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Clock className="h-4 w-4 text-blue-500 dark:text-blue-400 flex-shrink-0" />
                              <span>{selectedVendor.hours}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Phone className="h-4 w-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                              <span>{selectedVendor.phone}</span>
                            </div>
                            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                              <Package className="h-4 w-4 text-purple-500 dark:text-purple-400 flex-shrink-0" />
                              <span>{selectedVendor.quantity} unidades em estoque</span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <Button
                              variant="outline"
                              className="gap-2 border-slate-300 dark:border-slate-500 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white h-10 text-sm bg-transparent"
                            >
                              <Phone className="h-4 w-4" />
                              Ligar
                            </Button>
                            <Button className="gap-2 bg-gradient-to-r from-orange-600 to-orange-500 dark:from-orange-500 dark:to-orange-400 hover:from-orange-700 hover:to-orange-600 dark:hover:from-orange-600 dark:hover:to-orange-500 h-10 text-sm">
                              <Navigation className="h-4 w-4" />
                              Traçar Rota
                            </Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </>
          )}
        </div>

        <style jsx global>{`
          @keyframes gradient-x {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          @keyframes spin-slow {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          .animate-gradient-x {
            background-size: 200% 200%;
            animation: gradient-x 3s ease infinite;
          }
          .animate-spin-slow {
            animation: spin-slow 8s linear infinite;
          }
          .scrollbar-thin::-webkit-scrollbar {
            width: 6px;
          }
          .scrollbar-thin::-webkit-scrollbar-track {
            background: transparent;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgb(51, 65, 85);
            border-radius: 3px;
          }
          .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgb(71, 85, 105);
          }
          .dark .scrollbar-thin::-webkit-scrollbar-thumb {
            background: rgb(71, 85, 105);
          }
          .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
            background: rgb(100, 116, 139);
          }
        `}</style>
      </div>
    </>
  )

  return typeof window !== "undefined" ? createPortal(modalContent, document.body) : null
}
