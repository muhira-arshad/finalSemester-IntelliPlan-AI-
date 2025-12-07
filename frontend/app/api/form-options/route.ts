import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:5000"

export async function GET() {
  try {
    console.log("🔄 Fetching form options from Flask backend:", `${BACKEND_URL}/api/form-options`)

    const response = await fetch(`${BACKEND_URL}/api/form-options`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Prevent caching during development
    })

    if (!response.ok) {
      throw new Error(`Flask backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    
    console.log("✅ Successfully fetched form options from Flask")
    console.log("📊 Cities loaded:", Object.keys(data.cities || {}).length)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching form options from Flask:", error)
    
    // Check if it's a connection error
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: "Cannot connect to Flask backend. Please ensure Flask is running on http://127.0.0.1:5000",
          details: "Run 'python backend.py' in your backend directory"
        }, 
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        error: "Failed to fetch form options from backend",
        details: error.message 
      }, 
      { status: 500 }
    )
  }
}