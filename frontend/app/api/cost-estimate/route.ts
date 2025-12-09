// ============================================
// FILE: app/api/cost-estimate/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("🔄 Saving cost estimate to Node.js backend")

    const response = await fetch(`${BACKEND_URL}/api/cost-estimate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      throw new Error(errorData.error || `Backend responded with status: ${response.status}`)
    }

    const result = await response.json()
    console.log("✅ Successfully saved cost estimate:", result.estimate?.estimate_id)
    
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("❌ Error saving cost estimate:", error)
    
    return NextResponse.json(
      { error: "Failed to save cost estimate", details: error.message }, 
      { status: 500 }
    )
  }
}