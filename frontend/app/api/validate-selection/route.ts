// ============================================
// FILE: app/api/validate-selection/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("🔄 Validating selection:", data)

    const response = await fetch(`${BACKEND_URL}/api/validate-selection`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      cache: 'no-store',
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(errorData, { status: response.status })
    }

    const result = await response.json()
    console.log("✅ Validation successful")
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("❌ Error in validate selection:", error)
    return NextResponse.json(
      { error: "Validation failed" }, 
      { status: 500 }
    )
  }
}
