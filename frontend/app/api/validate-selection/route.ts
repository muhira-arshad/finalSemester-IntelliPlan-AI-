import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    const required_fields = ["city", "authority", "plotSize", "bedrooms", "floors"]
    const missing_fields = required_fields.filter((field) => !data[field])

    if (missing_fields.length > 0) {
      return NextResponse.json({ error: `Missing required fields: ${missing_fields.join(", ")}` }, { status: 400 })
    }

    // Basic validation - in a real app this would check against actual bylaws
    const bedrooms = Number.parseInt(data.bedrooms)
    if (bedrooms < 1 || bedrooms > 10) {
      return NextResponse.json(
        {
          error: "Bedrooms must be between 1 and 10",
        },
        { status: 400 },
      )
    }

    const floors = data.floors || []
    if (floors.length === 0) {
      return NextResponse.json(
        {
          error: "At least one floor must be selected",
        },
        { status: 400 },
      )
    }

    console.log("[v0] Mock validation successful for:", data.city, data.authority, data.plotSize)
    return NextResponse.json({ valid: true, message: "Selection is valid" })
  } catch (error) {
    console.error("[v0] Error in validate selection:", error)
    return NextResponse.json({ error: "Validation failed" }, { status: 500 })
  }
}
