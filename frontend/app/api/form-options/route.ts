import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://127.0.0.1:3001"

export async function GET() {
  try {
    console.log("🔄 Fetching form options from Node.js backend:", `${BACKEND_URL}/api/form-options`)

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
    
    console.log("✅ Successfully fetched form options from Node.js backend")
    console.log("📊 Cities loaded:", Object.keys(data.cities || {}).length)
    
    return NextResponse.json(data)
  } catch (error: any) {
    console.error("❌ Error fetching form options from Node.js backend:", error)
    
    // Check if it's a connection error
    if (error.cause?.code === 'ECONNREFUSED') {
      return NextResponse.json(
        { 
          error: "Cannot connect to Node.js backend. Please ensure Node.js backend is running on http://127.0.0.1:3001",
          details: "Run 'node index.js' in the Node.js-Backend directory"
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