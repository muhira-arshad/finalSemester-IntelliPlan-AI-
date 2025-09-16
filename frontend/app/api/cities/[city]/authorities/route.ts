// app/api/cities/[city]/authorities/route.js
import { NextResponse } from "next/server"

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000"

export async function GET(
  request: Request,
  { params }: { params: { city: string } }
) {
  try {
    const { city } = params

    const response = await fetch(`${BACKEND_URL}/api/cities/${city}/authorities`, {
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`Backend responded with status: ${response.status}`)
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error fetching authorities:", error)
    return NextResponse.json({ error: "Failed to fetch authorities" }, { status: 500 })
  }
}