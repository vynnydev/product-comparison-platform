import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const id = searchParams.get("id")
  const type = searchParams.get("type")

  await new Promise((resolve) => setTimeout(resolve, 100))

  let locations = mockData.locations

  if (id) {
    const location = locations.find((l) => l.id === id)
    if (!location) {
      return NextResponse.json({ error: "Location not found" }, { status: 404 })
    }
    return NextResponse.json(location)
  }

  if (type) {
    locations = locations.filter((l) => l.type === type)
  }

  return NextResponse.json({
    data: locations,
    total: locations.length,
    timestamp: new Date().toISOString(),
  })
}
