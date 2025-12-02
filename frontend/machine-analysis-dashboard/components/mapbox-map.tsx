"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css'

mapboxgl.accessToken = 'pk.eyJ1IjoidnlubnlkZXZzZWNvcHMiLCJhIjoiY21oenA3NTFxMHB2ZzJyb3Fyc2p2M21saiJ9.iKi5Db6tbHTkDrwBM5-3IQ'

interface MapboxMapProps {
  markers?: Array<{
    id: string
    lng: number
    lat: number
    color?: string
    label?: string
    onClick?: () => void
  }>
  center?: [number, number]
  zoom?: number
  className?: string
}

export function MapboxMap({ 
  markers = [], 
  center = [-46.633308, -23.550520], 
  zoom = 12, 
  className = '' 
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const markersRef = useRef<mapboxgl.Marker[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    if (!mapContainer.current) return
    if (map.current) return // Initialize map only once

    console.log('[v0] Inicializando Mapbox...')

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/dark-v11',
        center: center,
        zoom: zoom,
      })

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Wait for map to load
      map.current.on('load', () => {
        console.log('[v0] Mapbox carregado com sucesso')
        setIsLoaded(true)
      })

      map.current.on('error', (e) => {
        console.error('[v0] Erro ao carregar Mapbox:', e)
      })
    } catch (error) {
      console.error('[v0] Erro ao inicializar Mapbox:', error)
    }

    return () => {
      console.log('[v0] Limpando Mapbox')
      map.current?.remove()
      map.current = null
    }
  }, [center, zoom])

  useEffect(() => {
    if (!map.current || !isLoaded) return

    console.log('[v0] Atualizando marcadores:', markers.length)

    // Remove existing markers
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []

    // Add new markers
    markers.forEach((markerData) => {
      const el = document.createElement('div')
      el.className = 'mapbox-marker'
      el.style.width = '24px'
      el.style.height = '24px'
      el.style.borderRadius = '50%'
      el.style.backgroundColor = markerData.color || '#3b82f6'
      el.style.border = '3px solid white'
      el.style.cursor = 'pointer'
      el.style.boxShadow = '0 2px 8px rgba(0,0,0,0.3)'

      if (markerData.onClick) {
        el.addEventListener('click', markerData.onClick)
      }

      const marker = new mapboxgl.Marker(el)
        .setLngLat([markerData.lng, markerData.lat])
        .addTo(map.current!)

      if (markerData.label) {
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(
          `<div style="padding: 8px; font-size: 14px; font-weight: 600; color: #000;">${markerData.label}</div>`
        )
        marker.setPopup(popup)
      }

      markersRef.current.push(marker)
    })
  }, [markers, isLoaded])

  return (
    <div className="relative w-full h-full">
      <div ref={mapContainer} className={className} />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  )
}
