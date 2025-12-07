// ============================================
// FILE: app/api/bylaws/[city]/[authority]/[plotSize]/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function GET(
  request: Request,
  { params }: { params: { city: string; authority: string; plotSize: string } },
) {
  try {
    const { city, authority, plotSize } = params

    console.log(`🔄 Fetching bylaws for ${city}/${authority}/${plotSize}`)

    const response = await fetch(
      `${BACKEND_URL}/api/bylaws/${city}/${authority}/${plotSize}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        cache: 'no-store',
      }
    )

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Successfully fetched bylaws for ${city}/${authority}/${plotSize}`)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching bylaws info:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch bylaws information" }, 
      { status: 500 }
    )
  }
}