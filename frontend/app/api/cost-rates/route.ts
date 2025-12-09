// ============================================
// FILE: app/api/cost-rates/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001"

export async function GET() {
  try {
    console.log("🔄 Fetching cost rates from Node.js backend")

    const response = await fetch(`${BACKEND_URL}/api/cost-rates`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    console.log("✅ Successfully fetched cost rates")
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching cost rates:", error)
    
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: "Cannot connect to Node.js backend",
          details: "Node.js backend is not running on http://127.0.0.1:3001"
        }, 
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { error: "Failed to fetch cost rates", details: error.message }, 
      { status: 500 }
    )
  }
}