"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ChevronLeft, ChevronRight, FileText, Home, Check, AlertTriangle, Info } from "lucide-react"

// Enhanced interfaces based on the backend structure
interface DynamicOptions {
  max_floors: number
  max_height_ft?: number
  ground_coverage_percent?: number
  FAR: string
  mandatory_open_spaces: {
    front: string
    rear: string
    side: string
  }
  bedrooms_range: { min: number; max: number }
  washrooms_range: { min: number; max: number }
  public_zones: string[]
  service_zones: string[]
  kitchen_types: string[]
  allowed_features: {
    servant_quarter: boolean
    swimming_pool: boolean
    basement: boolean
    mumty: boolean
  }
  parking: {
    type: string
    spaces?: number
    min?: number
    max?: number
  }
  special_rules: string[]
  additional_rules: any
}

interface PlotData {
  meta: {
    plot_size_label: string
    authority: string
    frontend_key: string
  }
  available_options: DynamicOptions
  raw_bylaws: any
}

interface FormOptions {
  authorities: {
    [key: string]: {
      plot_sizes: {
        [key: string]: PlotData
      }
    }
  }
  global_options: {
    orientation: string[]
    facing: string[]
    shape: string[]
  }
}

// Enhanced Checkbox Component
const EnhancedCheckbox = ({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
  disabledReason,
  className,
}: {
  id: string
  checked: boolean
  onCheckedChange: () => void
  label: string
  disabled?: boolean
  disabledReason?: string
  className?: string
}) => {
  return (
    <div className="relative">
      <div
        className={`
          flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md
          ${
            checked
              ? "border-primary bg-primary/5 shadow-sm"
              : "border-border bg-card hover:border-primary/50 hover:bg-primary/5"
          }
          ${disabled ? "opacity-50 cursor-not-allowed hover:border-border hover:bg-card" : ""}
          ${className || ""}
        `}
        onClick={() => !disabled && onCheckedChange()}
        title={disabled ? disabledReason : undefined}
      >
        <div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200
            ${
              checked
                ? "border-primary bg-primary text-primary-foreground"
                : "border-muted-foreground bg-background hover:border-primary"
            }
          `}
        >
          {checked && <Check className="h-3 w-3" />}
        </div>
        <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer flex-1">
          {label}
        </Label>
        {disabled && disabledReason && <AlertTriangle className="h-4 w-4 text-orange-500" />}
      </div>
    </div>
  )
}

export default function DynamicFormComponent() {
  const [formData, setFormData] = useState({
    authority: "",
    plotSize: "",
    floors: [] as string[],
    bedrooms: "",
    washrooms: "Auto-calculated",
    publicZones: [] as string[],
    serviceZones: [] as string[],
    kitchenType: "",
    specialFeatures: [] as string[],
    orientation: "",
    facing: "",
    shape: "Regular",
  })

  const [formOptions, setFormOptions] = useState<FormOptions | null>(null)
  const [currentPlotData, setCurrentPlotData] = useState<PlotData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [validationErrors, setValidationErrors] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(1)

  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

  // Load form options from backend
  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/form-options`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const options = await response.json()
        setFormOptions(options)
        console.log("Loaded dynamic form options:", options)
      } catch (error) {
        console.error("Failed to load form options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFormOptions()
  }, [])

  // Update current plot data when authority or plot size changes
  useEffect(() => {
    if (formData.authority && formData.plotSize && formOptions) {
      const plotData = formOptions.authorities[formData.authority]?.plot_sizes[formData.plotSize]
      setCurrentPlotData(plotData || null)

      // Reset dependent fields when plot changes
      setFormData((prev) => ({
        ...prev,
        floors: [],
        bedrooms: "",
        washrooms: "Auto-calculated",
        publicZones: [],
        serviceZones: [],
        kitchenType: "",
        specialFeatures: [],
      }))

      console.log("Updated plot data for", formData.authority, formData.plotSize, plotData)
    }
  }, [formData.authority, formData.plotSize, formOptions])

  // Validate selection against bylaws
  const validateSelection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/validate-selection`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        setValidationErrors([errorData.error])
        return false
      }

      setValidationErrors([])
      return true
    } catch (error) {
      console.error("Validation error:", error)
      setValidationErrors(["Validation failed. Please try again."])
      return false
    }
  }

  const updateFormData = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    setValidationErrors([]) // Clear errors when user makes changes
  }

  const toggleArrayValue = (field: string, value: string) => {
    setFormData((prev) => {
      const currentArray = (prev as any)[field] as string[]
      const newArray = currentArray.includes(value)
        ? currentArray.filter((item) => item !== value)
        : [...currentArray, value]
      return { ...prev, [field]: newArray }
    })
  }

  const getAvailablePlotSizes = () => {
    if (!formData.authority || !formOptions) return []
    return Object.keys(formOptions.authorities[formData.authority]?.plot_sizes || {})
  }

  const getFloorOptions = () => {
    if (!currentPlotData) return []

    const maxFloors = currentPlotData.available_options.max_floors
    const options = []

    // Always include ground floor
    options.push({ value: "ground", label: "Ground Floor", required: true })

    // Add upper floors based on maximum allowed
    for (let i = 1; i < maxFloors; i++) {
      const floorNames = ["First Floor", "Second Floor", "Third Floor", "Fourth Floor"]
      if (i <= floorNames.length) {
        options.push({ value: `floor-${i}`, label: floorNames[i - 1], required: false })
      }
    }

    // Add basement if allowed
    if (currentPlotData.available_options.allowed_features.basement) {
      options.push({ value: "basement", label: "Basement", required: false })
    }

    return options
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading bylaws data...</p>
        </div>
      </div>
    )
  }

  if (!formOptions) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>Failed to load bylaws data. Please refresh the page.</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Dynamic Floorplan Generator</h1>
        <p className="text-muted-foreground">Options dynamically generated from official bylaws</p>
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <ul className="list-disc list-inside">
              {validationErrors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </AlertDescription>
        </Alert>
      )}

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Step {currentStep}:{" "}
            {currentStep === 1 ? "Basic Information" : currentStep === 2 ? "Plot Details" : "Room Configuration"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1: Authority and Plot Size */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <Label htmlFor="authority" className="text-sm font-medium">
                  Housing Authority
                </Label>
                <Select
                  value={formData.authority}
                  onValueChange={(value) => {
                    updateFormData("authority", value)
                    updateFormData("plotSize", "") // Reset plot size when authority changes
                  }}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select housing authority" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.keys(formOptions.authorities).map((authority) => (
                      <SelectItem key={authority} value={authority}>
                        {authority}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="plotSize" className="text-sm font-medium">
                  Plot Size
                </Label>
                <Select
                  value={formData.plotSize}
                  onValueChange={(value) => updateFormData("plotSize", value)}
                  disabled={!formData.authority}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue
                      placeholder={formData.authority ? "Select plot size" : "Please select authority first"}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlotSizes().map((plotSize) => (
                      <SelectItem key={plotSize} value={plotSize}>
                        {plotSize.replace("-", " ").toUpperCase()}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Show plot information */}
                {currentPlotData && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-900 mb-2">
                      {currentPlotData.meta.plot_size_label} - {currentPlotData.meta.authority} Regulations
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm text-blue-700">
                      <div>Max Floors: {currentPlotData.available_options.max_floors}</div>
                      <div>Ground Coverage: {currentPlotData.available_options.ground_coverage_percent}%</div>
                      <div>FAR: {currentPlotData.available_options.FAR}</div>
                      {currentPlotData.available_options.max_height_ft && (
                        <div>Max Height: {currentPlotData.available_options.max_height_ft}ft</div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Orientation</Label>
                  <Select value={formData.orientation} onValueChange={(value) => updateFormData("orientation", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select orientation" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.global_options.orientation.map((orientation) => (
                        <SelectItem key={orientation} value={orientation}>
                          {orientation}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm font-medium">Facing</Label>
                  <Select value={formData.facing} onValueChange={(value) => updateFormData("facing", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select facing" />
                    </SelectTrigger>
                    <SelectContent>
                      {formOptions.global_options.facing.map((facing) => (
                        <SelectItem key={facing} value={facing}>
                          {facing}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Floor Configuration */}
          {currentStep === 2 && currentPlotData && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Number of Floors
                  <span className="text-muted-foreground text-xs ml-2">
                    (Maximum {currentPlotData.available_options.max_floors} floors allowed for{" "}
                    {currentPlotData.meta.plot_size_label} in {currentPlotData.meta.authority})
                  </span>
                </Label>
                <div className="grid grid-cols-1 gap-3">
                  {getFloorOptions().map((floor) => (
                    <EnhancedCheckbox
                      key={floor.value}
                      id={floor.value}
                      checked={formData.floors.includes(floor.value)}
                      onCheckedChange={() => toggleArrayValue("floors", floor.value)}
                      label={floor.label}
                      disabled={floor.required && formData.floors.includes(floor.value)} // Can't uncheck required floors
                    />
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">
                    Bedrooms
                    <span className="text-muted-foreground text-xs ml-2">
                      (Range: {currentPlotData.available_options.bedrooms_range.min}-
                      {currentPlotData.available_options.bedrooms_range.max})
                    </span>
                  </Label>
                  <Input
                    type="number"
                    placeholder={`${currentPlotData.available_options.bedrooms_range.min}-${currentPlotData.available_options.bedrooms_range.max}`}
                    value={formData.bedrooms}
                    onChange={(e) => {
                      const value = Number.parseInt(e.target.value)
                      const range = currentPlotData.available_options.bedrooms_range
                      if (value >= range.min && value <= range.max) {
                        updateFormData("bedrooms", e.target.value)
                      }
                    }}
                    min={currentPlotData.available_options.bedrooms_range.min}
                    max={currentPlotData.available_options.bedrooms_range.max}
                    className="mt-1"
                  />
                </div>

                <div>
                  <Label className="text-sm font-medium">
                    Washrooms
                    <span className="text-muted-foreground text-xs ml-2">
                      (Range: {currentPlotData.available_options.washrooms_range.min}-
                      {currentPlotData.available_options.washrooms_range.max})
                    </span>
                  </Label>
                  <Select value={formData.washrooms} onValueChange={(value) => updateFormData("washrooms", value)}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select washrooms" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Auto-calculated">Auto-calculate based on bedrooms</SelectItem>
                      {Array.from(
                        {
                          length:
                            currentPlotData.available_options.washrooms_range.max -
                            currentPlotData.available_options.washrooms_range.min +
                            1,
                        },
                        (_, i) => currentPlotData.available_options.washrooms_range.min + i,
                      ).map((num) => (
                        <SelectItem key={num} value={num.toString()}>
                          {num} washrooms
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Zones and Features */}
          {currentStep === 3 && currentPlotData && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Public Zones
                  <span className="text-muted-foreground text-xs ml-2">
                    (Available for {currentPlotData.meta.plot_size_label})
                  </span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {currentPlotData.available_options.public_zones.map((zone) => (
                    <EnhancedCheckbox
                      key={zone}
                      id={zone}
                      checked={formData.publicZones.includes(zone)}
                      onCheckedChange={() => toggleArrayValue("publicZones", zone)}
                      label={zone}
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Service Zones
                  <span className="text-muted-foreground text-xs ml-2">
                    (Based on {currentPlotData.meta.authority} regulations)
                  </span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {currentPlotData.available_options.service_zones.map((zone) => (
                    <EnhancedCheckbox
                      key={zone}
                      id={zone}
                      checked={formData.serviceZones.includes(zone)}
                      onCheckedChange={() => toggleArrayValue("serviceZones", zone)}
                      label={zone}
                      disabled={
                        zone === "Servant Quarter" &&
                        !currentPlotData.available_options.allowed_features.servant_quarter
                      }
                      disabledReason={
                        zone === "Servant Quarter" ? "Not allowed for this plot size/authority" : undefined
                      }
                    />
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-sm font-medium">Kitchen Type</Label>
                <Select value={formData.kitchenType} onValueChange={(value) => updateFormData("kitchenType", value)}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Select kitchen type" />
                  </SelectTrigger>
                  <SelectContent>
                    {currentPlotData.available_options.kitchen_types.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label className="text-sm font-medium mb-3 block">
                  Special Features
                  <span className="text-muted-foreground text-xs ml-2">
                    (Allowed for {currentPlotData.meta.plot_size_label} in {currentPlotData.meta.authority})
                  </span>
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  <EnhancedCheckbox
                    id="swimming-pool"
                    checked={formData.specialFeatures.includes("Swimming Pool")}
                    onCheckedChange={() => toggleArrayValue("specialFeatures", "Swimming Pool")}
                    label="Swimming Pool"
                    disabled={!currentPlotData.available_options.allowed_features.swimming_pool}
                    disabledReason="Not allowed for this plot size/authority combination"
                  />
                  <EnhancedCheckbox
                    id="servant-quarter-feature"
                    checked={formData.specialFeatures.includes("Servant Quarter")}
                    onCheckedChange={() => toggleArrayValue("specialFeatures", "Servant Quarter")}
                    label="Servant Quarter"
                    disabled={!currentPlotData.available_options.allowed_features.servant_quarter}
                    disabledReason="Not allowed for this plot size/authority combination"
                  />
                  <EnhancedCheckbox
                    id="basement"
                    checked={formData.specialFeatures.includes("Basement")}
                    onCheckedChange={() => toggleArrayValue("specialFeatures", "Basement")}
                    label="Basement"
                    disabled={!currentPlotData.available_options.allowed_features.basement}
                    disabledReason="Not allowed for this plot size/authority combination"
                  />
                  <EnhancedCheckbox
                    id="mumty"
                    checked={formData.specialFeatures.includes("Mumty")}
                    onCheckedChange={() => toggleArrayValue("specialFeatures", "Mumty")}
                    label="Mumty (Utility Room)"
                    disabled={!currentPlotData.available_options.allowed_features.mumty}
                    disabledReason="Not allowed for this plot size/authority combination"
                  />
                </div>
              </div>

              {/* Parking Information */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium mb-2">Parking Requirements</h4>
                <div className="text-sm text-muted-foreground">
                  <p>
                    <strong>Type:</strong> {currentPlotData.available_options.parking.type}
                    {currentPlotData.available_options.parking.spaces && (
                      <span>
                        {" "}
                        • <strong>Spaces:</strong> {currentPlotData.available_options.parking.spaces}
                      </span>
                    )}
                    {currentPlotData.available_options.parking.min && currentPlotData.available_options.parking.max && (
                      <span>
                        {" "}
                        • <strong>Range:</strong> {currentPlotData.available_options.parking.min}-
                        {currentPlotData.available_options.parking.max} spaces
                      </span>
                    )}
                  </p>
                </div>
              </div>

              {/* Special Rules */}
              {currentPlotData.available_options.special_rules.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <h4 className="font-medium mb-2 text-yellow-900 flex items-center gap-2">
                    <Info className="h-4 w-4" />
                    Special Regulations
                  </h4>
                  <ul className="text-sm text-yellow-800 space-y-1">
                    {currentPlotData.available_options.special_rules.map((rule, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="text-yellow-600 mt-1">•</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
              disabled={currentStep === 1}
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            {currentStep < 3 ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                disabled={
                  (currentStep === 1 && (!formData.authority || !formData.plotSize)) ||
                  (currentStep === 2 && (!formData.bedrooms || formData.floors.length === 0))
                }
              >
                Next
                <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={async () => {
                  const isValid = await validateSelection()
                  if (isValid) {
                    alert("Form is valid! Ready to generate floorplan.")
                    console.log("Final form data:", formData)
                  }
                }}
                disabled={!formData.kitchenType || formData.publicZones.length === 0}
                className="bg-green-600 hover:bg-green-700"
              >
                Generate Floorplan
                <FileText className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Debug Information (remove in production) */}
      {currentPlotData && (
        <Card className="mt-6 bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm">Debug: Current Bylaws Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-white p-4 rounded overflow-auto max-h-60">
              {JSON.stringify(currentPlotData.available_options, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
