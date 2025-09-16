"use client"

import { useState, useEffect } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react"

interface ProgramSchema {
  bedrooms: { min: number; max: number }
  bathrooms: { min: number; max: number }
  living_areas: string[]
  kitchen: string[]
  outdoor_spaces: string[]
  special_features?: string[]
  service_areas?: string[]
  maxFloors?: number
  facingOptions?: string[]
  orientationOptions?: string[]
}

interface BackendOptions {
  authorities: Record<
    string,
    {
      plot_sizes: Record<
        string,
        {
          bedrooms: { min: number; max: number }
          washrooms: { min: number; max: number }
          living_areas: string[]
          kitchen_types: string[]
          outdoor_spaces: string[]
          special_features?: string[]
          service_areas?: string[]
          max_floors: number
        }
      >
    }
  >
  global_options: {
    orientation: string[]
    facing: string[]
    shape: string[]
  }
}

interface FormData {
  authority: string
  plotSize: string
  dimensions: { front: string; depth: string }
  orientation: string
  facing: string
  shape: string
  floors: string
  bedrooms: number
  bathrooms: number
  livingAreas: string[]
  kitchen: string[]
  serviceAreas: string[]
  outdoorSpaces: string[]
  specialFeatures: string[]
  notes: string
}

const minimalFallbackData: BackendOptions = {
  authorities: {
    LDA: {
      plot_sizes: {
        "3-marla": {
          bedrooms: { min: 1, max: 2 },
          washrooms: { min: 1, max: 2 },
          living_areas: ["TV Lounge"],
          kitchen_types: ["Normal Kitchen"],
          outdoor_spaces: ["Small Lawn"],
          service_areas: ["Store Room"],
          max_floors: 2,
        },
        "5-marla": {
          bedrooms: { min: 2, max: 3 },
          washrooms: { min: 2, max: 3 },
          living_areas: ["Drawing Room", "TV Lounge"],
          kitchen_types: ["Normal Kitchen", "Dirty Kitchen"],
          outdoor_spaces: ["Front Lawn", "Back Lawn"],
          service_areas: ["Store Room", "Laundry"],
          max_floors: 2,
        },
      },
    },
    DHA: {
      plot_sizes: {
        "3-marla": {
          bedrooms: { min: 1, max: 2 },
          washrooms: { min: 1, max: 2 },
          living_areas: ["TV Lounge"],
          kitchen_types: ["Normal Kitchen"],
          outdoor_spaces: ["Small Lawn"],
          service_areas: ["Store Room"],
          max_floors: 2,
        },
      },
    },
    Bahria: {
      plot_sizes: {
        "3-marla": {
          bedrooms: { min: 1, max: 2 },
          washrooms: { min: 1, max: 2 },
          living_areas: ["TV Lounge"],
          kitchen_types: ["Normal Kitchen"],
          outdoor_spaces: ["Small Lawn"],
          service_areas: ["Store Room"],
          max_floors: 2,
        },
      },
    },
  },
  global_options: {
    orientation: ["North", "South", "East", "West"],
    facing: ["Standard", "Park", "Corner", "Double Road"],
    shape: ["Regular", "Irregular"],
  },
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    authority: "",
    plotSize: "",
    dimensions: { front: "", depth: "" },
    orientation: "",
    facing: "",
    shape: "Regular",
    floors: "1",
    bedrooms: 1,
    bathrooms: 1,
    livingAreas: [],
    kitchen: [],
    serviceAreas: [],
    outdoorSpaces: [],
    specialFeatures: [],
    notes: "",
  })

  const [programSchema, setProgramSchema] = useState<ProgramSchema | null>(null)
  const [backendOptions, setBackendOptions] = useState<BackendOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [floorPlan, setFloorPlan] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [usingFallback, setUsingFallback] = useState(false)
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "fallback">("connecting")

  useEffect(() => {
    const fetchFormOptions = async () => {
      try {
        setLoading(true)
        setError(null)
        setConnectionStatus("connecting")

        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"
        console.log("[v0] Attempting to connect to backend:", apiUrl)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

        const response = await fetch(`${apiUrl}/api/form-options`, {
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
          },
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        const data = await response.json()
        console.log("[v0] Backend data received:", data)

        // Validate and sanitize backend data
        const sanitizedData: BackendOptions = {
          authorities: data.authorities || {},
          global_options: {
            orientation: data.global_options?.orientation || ["North", "South", "East", "West"],
            facing: data.global_options?.facing || ["Standard", "Park", "Corner", "Double Road"],
            shape: data.global_options?.shape || ["Regular", "Irregular"],
          },
        }

        setBackendOptions(sanitizedData)
        setUsingFallback(false)
        setConnectionStatus("connected")

        // Set default values from backend data
        const authorities = Object.keys(sanitizedData.authorities || {})
        if (authorities.length > 0 && !formData.authority) {
          const defaultAuthority = authorities[0]
          const plotSizes = Object.keys(sanitizedData.authorities[defaultAuthority]?.plot_sizes || {})

          setFormData((prev) => ({
            ...prev,
            authority: defaultAuthority,
            plotSize: plotSizes[0] || "",
            orientation: sanitizedData.global_options?.orientation?.[0] || "North",
            facing: sanitizedData.global_options?.facing?.[0] || "Standard",
          }))
        }
      } catch (err) {
        console.log("[v0] Backend connection failed:", err)
        setBackendOptions(minimalFallbackData)
        setUsingFallback(true)
        setConnectionStatus("fallback")

        // Set default values from fallback data
        setFormData((prev) => ({
          ...prev,
          authority: "LDA",
          plotSize: "3-marla",
          orientation: "North",
          facing: "Standard",
        }))

        if (err instanceof Error) {
          if (err.name === "AbortError") {
            setError("Backend connection timeout (10s). Using minimal fallback data.")
          } else if (err.message.includes("fetch")) {
            setError(
              "Cannot connect to backend server. Ensure Flask server is running on localhost:5000 with CORS enabled.",
            )
          } else {
            setError(`Backend error: ${err.message}. Using fallback data.`)
          }
        }
      } finally {
        setLoading(false)
      }
    }

    fetchFormOptions()
  }, [])

  useEffect(() => {
    if (!backendOptions || !formData.authority || !formData.plotSize) {
      setProgramSchema(null)
      return
    }

    console.log("[v0] Loading schema for:", formData.authority, formData.plotSize)

    const authorityData = backendOptions.authorities?.[formData.authority]
    const plotData = authorityData?.plot_sizes?.[formData.plotSize]

    if (!plotData) {
      console.log("[v0] No schema found for:", formData.authority, formData.plotSize)
      setProgramSchema(null)
      return
    }

    // Transform backend data to our schema format
    const schema: ProgramSchema = {
      bedrooms: plotData.bedrooms || { min: 1, max: 3 },
      bathrooms: plotData.washrooms || { min: 1, max: 3 },
      living_areas: plotData.living_areas || [],
      kitchen: plotData.kitchen_types || [],
      outdoor_spaces: plotData.outdoor_spaces || [],
      special_features: plotData.special_features || [],
      service_areas: plotData.service_areas || [],
      maxFloors: plotData.max_floors || 2,
      facingOptions: backendOptions.global_options?.facing || ["Standard"],
      orientationOptions: backendOptions.global_options?.orientation || ["North"],
    }

    setProgramSchema(schema)

    // Reset form values to schema constraints
    setFormData((prev) => ({
      ...prev,
      bedrooms: Math.max(prev.bedrooms, schema.bedrooms.min),
      bathrooms: Math.max(prev.bathrooms, schema.bathrooms.min),
      floors: Math.min(Number.parseInt(prev.floors), schema.maxFloors || 3).toString(),
      livingAreas: [],
      kitchen: [],
      serviceAreas: [],
      outdoorSpaces: [],
      specialFeatures: [],
    }))
  }, [formData.authority, formData.plotSize, backendOptions])

  const handleArrayToggle = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const currentArray = prev[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const validateForm = (): string | null => {
    if (!formData.authority) return "Please select an authority"
    if (!formData.plotSize) return "Please select a plot size"
    if (!formData.dimensions.front || !formData.dimensions.depth) return "Please enter plot dimensions"
    if (!programSchema) return "Schema not loaded"

    const frontDim = Number.parseFloat(formData.dimensions.front)
    const depthDim = Number.parseFloat(formData.dimensions.depth)
    if (frontDim <= 0 || depthDim <= 0) return "Dimensions must be positive numbers"

    if (formData.bedrooms < programSchema.bedrooms.min || formData.bedrooms > programSchema.bedrooms.max) {
      return `Bedrooms must be between ${programSchema.bedrooms.min} and ${programSchema.bedrooms.max}`
    }

    if (formData.bathrooms < programSchema.bathrooms.min || formData.bathrooms > programSchema.bathrooms.max) {
      return `Bathrooms must be between ${programSchema.bathrooms.min} and ${programSchema.bathrooms.max}`
    }

    const floors = Number.parseInt(formData.floors)
    if (floors < 1 || floors > (programSchema.maxFloors || 3)) {
      return `Floors must be between 1 and ${programSchema.maxFloors || 3}`
    }

    return null
  }

  const handleSubmit = async () => {
    const validationError = validateForm()
    if (validationError) {
      setError(validationError)
      return
    }

    setError(null)
    setSubmitting(true)
    console.log("[v0] Submitting form with exact keys:", {
      authority: formData.authority,
      plot_size: formData.plotSize,
    })

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      // Ensure exact key matching with backend expectations
      const payload = {
        authority: formData.authority, // Exact key: "LDA", "DHA", "Bahria"
        plot_size: formData.plotSize, // Exact key: "3-marla", "5-marla", etc.
        dimensions: {
          front: Number.parseFloat(formData.dimensions.front),
          depth: Number.parseFloat(formData.dimensions.depth),
        },
        orientation: formData.orientation,
        facing: formData.facing,
        shape: formData.shape,
        floors: Number.parseInt(formData.floors),
        bedrooms: formData.bedrooms,
        bathrooms: formData.bathrooms,
        living_areas: formData.livingAreas,
        kitchen_types: formData.kitchen,
        service_areas: formData.serviceAreas,
        outdoor_spaces: formData.outdoorSpaces,
        special_features: formData.specialFeatures,
        notes: formData.notes.trim(),
        city: "Lahore",
      }

      console.log("[v0] Sending payload:", payload)

      const response = await fetch(`${apiUrl}/api/generate-plan`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setFloorPlan(data)
        console.log("[v0] Floor plan generated successfully")
      } else {
        setFloorPlan(null)
        const errorMsg = data.error || data.message || `HTTP ${response.status}: ${response.statusText}`
        setError(`Generation failed: ${errorMsg}`)
        console.log("[v0] Generation failed:", errorMsg)
      }
    } catch (err) {
      setFloorPlan(null)
      const errorMsg = err instanceof Error ? err.message : "Unknown error"
      setError(`Network error: ${errorMsg}. Please ensure backend server is running.`)
      console.log("[v0] Network error:", err)
    } finally {
      setSubmitting(false)
    }
  }

  // Safe getter functions to prevent null/undefined errors
  const getAuthorities = (): string[] => {
    return Object.keys(backendOptions?.authorities || {})
  }

  const getPlotSizes = (): string[] => {
    if (!backendOptions?.authorities || !formData.authority) return []
    return Object.keys(backendOptions.authorities[formData.authority]?.plot_sizes || {})
  }

  const getGlobalOptions = (option: "orientation" | "facing" | "shape"): string[] => {
    return backendOptions?.global_options?.[option] || []
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 px-4 md:px-8 flex items-center justify-center">
        <Card>
          <CardContent className="p-6 flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading form options...</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 pt-16 px-4 md:px-8 space-y-6">
      {connectionStatus === "connected" && (
        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800 dark:text-green-200">
            <strong>Connected to backend:</strong> Using live data from Flask server.
          </AlertDescription>
        </Alert>
      )}

      {connectionStatus === "fallback" && (
        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800 dark:text-orange-200">
            <strong>Using fallback data:</strong> Backend server not connected. Limited options available.
            <br />• Start Flask server:{" "}
            <code className="bg-orange-100 dark:bg-orange-800 px-1 rounded">python app.py</code>
            <br />• Ensure CORS enabled and server runs on localhost:5000
          </AlertDescription>
        </Alert>
      )}

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>📝 Floor Plan Generator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Plot Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Plot Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Authority *</Label>
                <Select
                  value={formData.authority}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, authority: value, plotSize: "" }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAuthorities().map((authority) => (
                      <SelectItem key={authority} value={authority}>
                        {authority === "LDA"
                          ? "LDA Lahore"
                          : authority === "DHA"
                            ? "DHA Lahore"
                            : authority === "Bahria"
                              ? "Bahria Town"
                              : authority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Plot Size *</Label>
                <Select
                  value={formData.plotSize}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, plotSize: value }))}
                  disabled={!formData.authority}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plot size" />
                  </SelectTrigger>
                  <SelectContent>
                    {getPlotSizes().map((size) => (
                      <SelectItem key={size} value={size}>
                        {/* Display formatted but keep exact value */}
                        {size.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Front (ft) *</Label>
                <Input
                  type="number"
                  value={formData.dimensions.front}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, front: e.target.value },
                    }))
                  }
                  placeholder="e.g., 25"
                  min="1"
                  step="0.1"
                />
              </div>
              <div>
                <Label>Depth (ft) *</Label>
                <Input
                  type="number"
                  value={formData.dimensions.depth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dimensions: { ...prev.dimensions, depth: e.target.value },
                    }))
                  }
                  placeholder="e.g., 45"
                  min="1"
                  step="0.1"
                />
              </div>
              <div>
                <Label>Shape</Label>
                <Select
                  value={formData.shape}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, shape: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {getGlobalOptions("shape").length > 0
                      ? getGlobalOptions("shape").map((shape) => (
                          <SelectItem key={shape} value={shape}>
                            {shape}
                          </SelectItem>
                        ))
                      : [
                          <SelectItem key="Regular" value="Regular">
                            Regular
                          </SelectItem>,
                          <SelectItem key="Irregular" value="Irregular">
                            Irregular
                          </SelectItem>,
                        ]}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Orientation & Layout Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">Orientation & Layout</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Orientation</Label>
                <Select
                  value={formData.orientation}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, orientation: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    {(programSchema?.orientationOptions || getGlobalOptions("orientation")).map((orientation) => (
                      <SelectItem key={orientation} value={orientation}>
                        {orientation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Facing</Label>
                <Select
                  value={formData.facing}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, facing: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {(programSchema?.facingOptions || getGlobalOptions("facing")).map((facing) => (
                      <SelectItem key={facing} value={facing}>
                        {facing}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Floors *</Label>
                <Input
                  type="number"
                  value={formData.floors}
                  onChange={(e) => setFormData((prev) => ({ ...prev, floors: e.target.value }))}
                  min="1"
                  max={programSchema?.maxFloors || 3}
                />
                {programSchema?.maxFloors && (
                  <p className="text-xs text-gray-500 mt-1">Max: {programSchema.maxFloors} floors</p>
                )}
              </div>
            </div>
          </div>

          {programSchema && (
            <>
              {/* Rooms Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Rooms</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>
                      Bedrooms * ({programSchema.bedrooms.min}-{programSchema.bedrooms.max})
                    </Label>
                    <Input
                      type="number"
                      value={formData.bedrooms}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || programSchema.bedrooms.min
                        setFormData((prev) => ({
                          ...prev,
                          bedrooms: Math.max(programSchema.bedrooms.min, Math.min(programSchema.bedrooms.max, value)),
                        }))
                      }}
                      min={programSchema.bedrooms.min}
                      max={programSchema.bedrooms.max}
                    />
                  </div>
                  <div>
                    <Label>
                      Bathrooms * ({programSchema.bathrooms.min}-{programSchema.bathrooms.max})
                    </Label>
                    <Input
                      type="number"
                      value={formData.bathrooms}
                      onChange={(e) => {
                        const value = Number.parseInt(e.target.value) || programSchema.bathrooms.min
                        setFormData((prev) => ({
                          ...prev,
                          bathrooms: Math.max(
                            programSchema.bathrooms.min,
                            Math.min(programSchema.bathrooms.max, value),
                          ),
                        }))
                      }}
                      min={programSchema.bathrooms.min}
                      max={programSchema.bathrooms.max}
                    />
                  </div>
                </div>

                {/* Living Areas */}
                {programSchema.living_areas && programSchema.living_areas.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Living Areas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {programSchema.living_areas.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.livingAreas.includes(area)}
                            onCheckedChange={() => handleArrayToggle("livingAreas", area)}
                          />
                          <Label className="text-sm">{area}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Kitchen Options */}
                {programSchema.kitchen && programSchema.kitchen.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Kitchen</Label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {programSchema.kitchen.map((kitchen) => (
                        <div key={kitchen} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.kitchen.includes(kitchen)}
                            onCheckedChange={() => handleArrayToggle("kitchen", kitchen)}
                          />
                          <Label className="text-sm">{kitchen}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Service & Outdoor Areas */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold border-b pb-2">Service & Outdoor Areas</h3>

                {/* Service Areas */}
                {programSchema.service_areas && programSchema.service_areas.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Service Areas</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {programSchema.service_areas.map((area) => (
                        <div key={area} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.serviceAreas.includes(area)}
                            onCheckedChange={() => handleArrayToggle("serviceAreas", area)}
                          />
                          <Label className="text-sm">{area}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Outdoor Spaces */}
                {programSchema.outdoor_spaces && programSchema.outdoor_spaces.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Outdoor Spaces</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {programSchema.outdoor_spaces.map((space) => (
                        <div key={space} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.outdoorSpaces.includes(space)}
                            onCheckedChange={() => handleArrayToggle("outdoorSpaces", space)}
                          />
                          <Label className="text-sm">{space}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Special Features */}
                {programSchema.special_features && programSchema.special_features.length > 0 && (
                  <div>
                    <Label className="text-base font-semibold">Special Features</Label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                      {programSchema.special_features.map((feature) => (
                        <div key={feature} className="flex items-center space-x-2">
                          <Checkbox
                            checked={formData.specialFeatures.includes(feature)}
                            onCheckedChange={() => handleArrayToggle("specialFeatures", feature)}
                          />
                          <Label className="text-sm">{feature}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          <div>
            <Label>Additional Notes</Label>
            <Textarea
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Any specific requirements or preferences..."
              rows={3}
            />
          </div>

          <Button
            className="w-full"
            onClick={handleSubmit}
            disabled={
              !formData.authority ||
              !formData.plotSize ||
              !formData.dimensions.front ||
              !formData.dimensions.depth ||
              submitting
            }
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Floor Plan...
              </>
            ) : (
              "Generate Floor Plan"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Output Section */}
      <Card>
        <CardHeader>
          <CardTitle>🏗️ Generated Floor Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-gray-800 dark:text-gray-200 max-h-[60vh] overflow-y-auto">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {floorPlan ? (
            <>
              {floorPlan.summary && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-lg">📋 Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <p>
                      <strong>Authority:</strong> {floorPlan.summary.authority}
                    </p>
                    <p>
                      <strong>Plot Size:</strong> {floorPlan.summary.plotSize}
                    </p>
                    <p>
                      <strong>Dimensions:</strong> {floorPlan.summary.dimensions}
                    </p>
                    <p>
                      <strong>Floors:</strong> {floorPlan.summary.floors}
                    </p>
                    <p>
                      <strong>Orientation:</strong> {floorPlan.summary.orientation}
                    </p>
                    <p>
                      <strong>Facing:</strong> {floorPlan.summary.facing}
                    </p>
                  </div>
                  {floorPlan.summary.notes && (
                    <p>
                      <strong>Notes:</strong> {floorPlan.summary.notes}
                    </p>
                  )}
                </div>
              )}

              {floorPlan.rooms && floorPlan.rooms.length > 0 && (
                <div>
                  <h3 className="font-semibold text-lg">🏠 Rooms</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {floorPlan.rooms.map((room: any, idx: number) => (
                      <div key={idx} className="bg-gray-50 dark:bg-gray-800 p-2 rounded text-sm">
                        <strong>{room.name}</strong> - {room.size} (Floor {room.floor})
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {floorPlan.bylaws && (
                <div>
                  <h3 className="font-semibold text-lg">📜 Applicable Bylaws</h3>
                  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded text-sm space-y-2">
                    {Object.entries(floorPlan.bylaws).map(([key, value]) => (
                      <div key={key}>
                        <strong>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</strong>{" "}
                        {typeof value === "object" && value !== null && !Array.isArray(value) ? (
                          <div className="ml-4 mt-1">
                            {Object.entries(value as Record<string, unknown>).map(([k, v]) => (
                              <div key={k}>
                                • <strong>{k}:</strong> {String(v)}
                              </div>
                            ))}
                          </div>
                        ) : (
                          String(value)
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No floor plan generated yet.</p>
              <p className="text-sm mt-2">Fill out the form above and click "Generate Floor Plan" to get started.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
