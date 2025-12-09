// ============================================
// FILE: app/api/cities/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001"

export async function GET() {
  try {
    console.log("🔄 Fetching cities list from Node.js backend")

    const response = await fetch(`${BACKEND_URL}/api/cities`, {
      headers: {
        "Content-Type": "application/json",
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Successfully fetched cities:", data.cities)
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching cities:", error)
    return NextResponse.json(
      { error: "Failed to fetch cities" }, 
      { status: 500 }
    )
  }
}
