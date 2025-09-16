import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    if (!data) {
      return NextResponse.json({ error: "No data provided" }, { status: 400 })
    }

    // Mock plan generation - in a real app this would generate actual floor plans
    const response = {
      success: true,
      message: "Floorplan generated successfully!",
      plan_data: {
        city: data.city,
        authority: data.authority,
        plot_size: data.plotSize,
        configuration: {
          floors: data.floors || [],
          bedrooms: data.bedrooms,
          washrooms: data.washrooms,
          public_zones: data.publicZones || [],
          service_zones: data.serviceZones || [],
          kitchen_type: data.kitchenType,
          special_features: data.specialFeatures || [],
          orientation: data.orientation,
          facing: data.facing,
        },
        generated_at: new Date().toISOString(),
        plan_id: `PLAN_${Date.now()}`,
      },
    }

    console.log("[v0] Mock plan generated for:", data.city, data.authority, data.plotSize)
    return NextResponse.json(response)
  } catch (error) {
    console.error("[v0] Error in generate plan:", error)
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 })
  }
}
