import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const partName = searchParams.get("partName")
  const maxDistance = searchParams.get("maxDistance")

  await new Promise((resolve) => setTimeout(resolve, 200))

  let vendors = mockData.partsVendors

  if (maxDistance) {
    vendors = vendors.filter((v) => v.distance <= Number.parseFloat(maxDistance))
  }

  // Simula preços dinâmicos baseados na peça
  const vendorsWithPrices = vendors.map((vendor) => {
    const basePrice = 2000 + Math.random() * 1000
    const discount = vendor.isTop ? 20 : Math.floor(Math.random() * 15) + 5

    return {
      ...vendor,
      partName: partName || "Peça não especificada",
      price: Math.round(basePrice * (1 - discount / 100)),
      originalPrice: Math.round(basePrice),
      discount,
    }
  })

  return NextResponse.json({
    data: vendorsWithPrices.sort((a, b) => a.distance - b.distance),
    total: vendorsWithPrices.length,
    searchedPart: partName,
    timestamp: new Date().toISOString(),
  })
}
