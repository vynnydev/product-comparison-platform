import { NextResponse } from "next/server"
import mockData from "@/data/mock-data.json"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const type = searchParams.get("type")
  const machineId = searchParams.get("machineId")

  await new Promise((resolve) => setTimeout(resolve, 100))

  const reports = mockData.reports

  if (type === "machine" || machineId) {
    let machineReports = reports.machineReports
    if (machineId) {
      machineReports = machineReports.filter((r) => r.machineId === machineId)
    }
    return NextResponse.json({
      data: machineReports,
      total: machineReports.length,
      timestamp: new Date().toISOString(),
    })
  }

  if (type === "metrics") {
    return NextResponse.json({
      data: reports.metricsReports,
      total: reports.metricsReports.length,
      timestamp: new Date().toISOString(),
    })
  }

  return NextResponse.json({
    machineReports: reports.machineReports,
    metricsReports: reports.metricsReports,
    timestamp: new Date().toISOString(),
  })
}
