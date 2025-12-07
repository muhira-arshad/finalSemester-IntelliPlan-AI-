// ============================================
// FILE: app/api/generate-plan/route.ts
// ============================================
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    console.log("🔄 Generating plan with data:", data)

    const response = await fetch(`${BACKEND_URL}/api/generate-plan`, {
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
    console.log("✅ Plan generated successfully:", result.plan_id)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("❌ Error in generate plan:", error)
    return NextResponse.json(
      { error: "Failed to generate plan" }, 
      { status: 500 }
    )
  }
}