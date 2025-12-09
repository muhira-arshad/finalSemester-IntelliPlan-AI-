// ============================================
// FILE: app/api/plot-dimensions/[city]/[plotSize]/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001"

export async function GET(
  request: Request,
  { params }: { params: { city: string; plotSize: string } }
) {
  try {
    const { city, plotSize } = params

    console.log(`🔄 Fetching dimensions for ${city}/${plotSize}`)

    const response = await fetch(
      `${BACKEND_URL}/api/plot-dimensions/${city}/${plotSize}`,
      {
        headers: {
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Successfully fetched dimensions for ${city}/${plotSize}`)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching plot dimensions:", error)
    
    return NextResponse.json(
      { error: "Failed to fetch plot dimensions", details: error.message }, 
      { status: 500 }
    )
  }
}
