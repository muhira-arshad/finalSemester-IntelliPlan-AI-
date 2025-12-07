// ============================================
// FILE: app/api/cities/[city]/authorities/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  try {
    const { city } = params

    console.log(`🔄 Fetching authorities for ${city}`)

    const response = await fetch(`${BACKEND_URL}/api/cities/${city}/authorities`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log(`✅ Successfully fetched authorities for ${city}:`, data.authorities)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching authorities:", error)
    return NextResponse.json(
      { error: error.message || "Failed to fetch authorities" }, 
      { status: 500 }
    )
  }
}