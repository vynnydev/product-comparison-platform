'use server'

// Use a variável correta para server-side
const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || 'pk.eyJ1IjoidnlubnlkZXZzZWNvcHMiLCJhIjoiY21pMHN0bG1kMHNqczJscTRjZW1haG56MSJ9.LOpINhn-mNz6rAQuwA8JPw'

export async function generateMapUrl(
  markers: Array<{ lng: number; lat: number; color: string }>,
  center: [number, number],
  zoom: number,
  dimensions: { width: number; height: number }
) {
  if (!MAPBOX_TOKEN) {
    console.error('❌ Token do Mapbox não configurado')
    throw new Error('MAPBOX_TOKEN not configured')
  }
  
  const style = 'dark-v11'
  
  const markerOverlays = markers
    .map(m => {
      const color = m.color.replace('#', '')
      return `pin-s+${color}(${m.lng},${m.lat})`
    })
    .join(',')
  
  // Se não tiver marcadores, não adiciona na URL
  const markerPart = markerOverlays ? `${markerOverlays}/` : ''
  
  const url = `https://api.mapbox.com/styles/v1/mapbox/${style}/static/${markerPart}${center[0]},${center[1]},${zoom},0/${dimensions.width}x${dimensions.height}@2x?access_token=${MAPBOX_TOKEN}`
  
  console.log('✅ URL do mapa gerada')
  return url
}

export async function generateRouteGeometry(
  origin: [number, number],
  destination: [number, number]
): Promise<Array<[number, number]>> {
  if (!MAPBOX_TOKEN) {
    console.error('❌ Token do Mapbox não configurado')
    return []
  }
  
  try {
    const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${origin[0]},${origin[1]};${destination[0]},${destination[1]}?geometries=geojson&access_token=${MAPBOX_TOKEN}`
    
    console.log('🛣️ Buscando rota...')
    const response = await fetch(url)
    
    if (!response.ok) {
      console.error('❌ Erro na API:', response.status)
      return []
    }
    
    const data = await response.json()
    
    if (data.routes && data.routes[0] && data.routes[0].geometry) {
      console.log('✅ Rota carregada com', data.routes[0].geometry.coordinates.length, 'pontos')
      return data.routes[0].geometry.coordinates
    }
    
    console.log('⚠️ Nenhuma rota encontrada')
    return []
  } catch (error) {
    console.error('❌ Erro ao buscar rota:', error)
    return []
  }
}
