"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  Check,
  AlertTriangle,
  Info,
  Building,
  MapPin,
  Ruler,
  Users,
  Car,
  Sparkles,
} from "lucide-react"

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
    city: string
    frontend_key: string
  }
  available_options: DynamicOptions
  raw_bylaws: any
}

interface FormOptions {
  cities: {
    [cityName: string]: {
      authorities: {
        [authorityName: string]: {
          plot_sizes: {
            [plotSize: string]: PlotData
          }
        }
      }
    }
  }
  global_options: {
    orientation: string[]
    facing: string[]
    shape: string[]
  }
}

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
          flex items-center space-x-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer hover:shadow-lg hover:scale-[1.02]
          ${
            checked
              ? "border-blue-500 bg-gradient-to-r from-blue-50 to-indigo-50 shadow-md ring-2 ring-blue-200"
              : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-50/50"
          }
          ${disabled ? "opacity-50 cursor-not-allowed hover:border-gray-200 hover:bg-white hover:scale-100" : ""}
          ${className || ""}
        `}
        onClick={() => !disabled && onCheckedChange()}
        title={disabled ? disabledReason : undefined}
      >
        <div
          className={`
            w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300 shadow-sm
            ${
              checked
                ? "border-blue-500 bg-blue-500 text-white scale-110"
                : "border-gray-300 bg-white hover:border-blue-400"
            }
          `}
        >
          {checked && <Check className="h-4 w-4 animate-in zoom-in duration-200" />}
        </div>
        <Label htmlFor={id} className="text-sm font-medium text-gray-700 cursor-pointer flex-1">
          {label}
        </Label>
        {disabled && disabledReason && <AlertTriangle className="h-4 w-4 text-amber-500" />}
      </div>
    </div>
  )
}

export default function DynamicFormComponent() {
  const [formData, setFormData] = useState({
    city: "",
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

  const API_BASE_URL = "/api"

  const getProgressPercentage = () => {
    const totalSteps = 3
    return (currentStep / totalSteps) * 100
  }

  // Load form options from backend
  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`${API_BASE_URL}/form-options`)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const options = await response.json()
        setFormOptions(options)
        console.log("[v0] Loaded dynamic form options:", options)
      } catch (error) {
        console.error("[v0] Failed to load form options:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFormOptions()
  }, [])

  useEffect(() => {
    if (formData.city && formData.authority && formData.plotSize && formOptions) {
      const plotData = formOptions.cities[formData.city]?.authorities[formData.authority]?.plot_sizes[formData.plotSize]
      setCurrentPlotData(plotData || null)

      // Reset dependent fields when plot changes
      setFormData((prev) => ({
        ...prev,
        floors: ["ground"], // Ground floor is always required
        bedrooms: "",
        washrooms: "Auto-calculated",
        publicZones: [],
        serviceZones: [],
        kitchenType: "",
        specialFeatures: [],
      }))

      console.log("[v0] Updated plot data for", formData.city, formData.authority, formData.plotSize, plotData)
    }
  }, [formData.city, formData.authority, formData.plotSize, formOptions])

  const validateSelection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/validate-selection`, {
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

  const getAvailableCities = () => {
    if (!formOptions) return []
    return Object.keys(formOptions.cities)
  }

  const getAvailableAuthorities = () => {
    if (!formData.city || !formOptions) return []
    return Object.keys(formOptions.cities[formData.city]?.authorities || {})
  }

  const getAvailablePlotSizes = () => {
    if (!formData.city || !formData.authority || !formOptions) return []
    return Object.keys(formOptions.cities[formData.city]?.authorities[formData.authority]?.plot_sizes || {})
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

  const getFloorOptions = () => {
    if (!currentPlotData) return []

    const maxFloors = currentPlotData.available_options.max_floors
    const options = []

    // Always include ground floor
    options.push({ value: "ground", label: "Ground Floor", required: true })

    // Add upper floors based on maximum allowed
    for (let i = 1; i <= maxFloors; i++) {
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
      <div className="min-h-screen flex items-center justify-center p-6">
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertTriangle className="h-4 w-4 text-red-500" />
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            Failed to load bylaws data. Please ensure the backend is running and refresh the page.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-blue-500" />
                  City
                </Label>
                <Select
                  value={formData.city}
                  onValueChange={(value) => {
                    updateFormData("city", value)
                    updateFormData("authority", "")
                    updateFormData("plotSize", "")
                  }}
                >
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableCities().map((city) => (
                      <SelectItem key={city} value={city} className="py-3">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-blue-500" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authority" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Building className="h-4 w-4 text-green-500" />
                  Housing Authority
                </Label>
                <Select
                  value={formData.authority}
                  onValueChange={(value) => {
                    updateFormData("authority", value)
                    updateFormData("plotSize", "")
                  }}
                  disabled={!formData.city}
                >
                  <SelectTrigger className="h-12 border-2 hover:border-green-300 transition-colors">
                    <SelectValue placeholder={formData.city ? "Select authority" : "Select city first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailableAuthorities().map((authority) => (
                      <SelectItem key={authority} value={authority} className="py-3">
                        <Badge variant="outline" className="font-medium">
                          {authority}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotSize" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-purple-500" />
                  Plot Size
                </Label>
                <Select
                  value={formData.plotSize}
                  onValueChange={(value) => updateFormData("plotSize", value)}
                  disabled={!formData.authority}
                >
                  <SelectTrigger className="h-12 border-2 hover:border-purple-300 transition-colors">
                    <SelectValue placeholder={formData.authority ? "Select plot size" : "Select authority first"} />
                  </SelectTrigger>
                  <SelectContent>
                    {getAvailablePlotSizes().map((plotSize) => (
                      <SelectItem key={plotSize} value={plotSize} className="py-3">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-purple-500" />
                          {plotSize.replace("-", " ").toUpperCase()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentPlotData && (
              <div className="bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 p-6 rounded-2xl border border-blue-200 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-blue-500 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-gray-800">
                      {currentPlotData.meta.plot_size_label} - {currentPlotData.meta.authority}
                    </h4>
                    <p className="text-sm text-gray-600">{currentPlotData.meta.city} Regulations</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Max Floors</div>
                    <div className="font-bold text-blue-600">{currentPlotData.available_options.max_floors}</div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">Coverage</div>
                    <div className="font-bold text-green-600">
                      {currentPlotData.available_options.ground_coverage_percent}%
                    </div>
                  </div>
                  <div className="bg-white p-3 rounded-lg shadow-sm">
                    <div className="text-xs text-gray-500 mb-1">FAR</div>
                    <div className="font-bold text-purple-600">{currentPlotData.available_options.FAR}</div>
                  </div>
                  {currentPlotData.available_options.max_height_ft && (
                    <div className="bg-white p-3 rounded-lg shadow-sm">
                      <div className="text-xs text-gray-500 mb-1">Max Height</div>
                      <div className="font-bold text-orange-600">
                        {currentPlotData.available_options.max_height_ft}ft
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Orientation</Label>
                <Select value={formData.orientation} onValueChange={(value) => updateFormData("orientation", value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions?.global_options.orientation.map((orientation) => (
                      <SelectItem key={orientation} value={orientation} className="py-3">
                        {orientation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700">Facing</Label>
                <Select value={formData.facing} onValueChange={(value) => updateFormData("facing", value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent>
                    {formOptions?.global_options.facing.map((facing) => (
                      <SelectItem key={facing} value={facing} className="py-3">
                        {facing}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      case 2:
        if (!currentPlotData) return null
        return (
          <div className="space-y-8">
            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-500" />
                Number of Floors
                <Badge variant="secondary" className="ml-2">
                  Max {currentPlotData.available_options.max_floors} floors for {currentPlotData.meta.plot_size_label}
                </Badge>
              </Label>
              <div className="grid grid-cols-1 gap-3">
                {getFloorOptions().map((floor) => (
                  <EnhancedCheckbox
                    key={floor.value}
                    id={floor.value}
                    checked={formData.floors.includes(floor.value)}
                    onCheckedChange={() => toggleArrayValue("floors", floor.value)}
                    label={floor.label}
                    disabled={floor.required && formData.floors.includes(floor.value)}
                  />
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  Bedrooms
                  <Badge variant="outline" className="text-xs">
                    {currentPlotData.available_options.bedrooms_range.min}-
                    {currentPlotData.available_options.bedrooms_range.max}
                  </Badge>
                </Label>
                <Input
                  type="number"
                  placeholder={`${currentPlotData.available_options.bedrooms_range.min}-${currentPlotData.available_options.bedrooms_range.max}`}
                  value={formData.bedrooms}
                  onChange={(e) => updateFormData("bedrooms", e.target.value)}
                  min={currentPlotData.available_options.bedrooms_range.min}
                  max={currentPlotData.available_options.bedrooms_range.max}
                  className="h-12 border-2 hover:border-green-300 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Home className="h-4 w-4 text-blue-500" />
                  Washrooms
                  <Badge variant="outline" className="text-xs">
                    {currentPlotData.available_options.washrooms_range.min}-
                    {currentPlotData.available_options.washrooms_range.max}
                  </Badge>
                </Label>
                <Select value={formData.washrooms} onValueChange={(value) => updateFormData("washrooms", value)}>
                  <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                    <SelectValue placeholder="Select washrooms" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Auto-calculated" className="py-3">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-500" />
                        Auto-calculate based on bedrooms
                      </div>
                    </SelectItem>
                    {Array.from(
                      {
                        length:
                          currentPlotData.available_options.washrooms_range.max -
                          currentPlotData.available_options.washrooms_range.min +
                          1,
                      },
                      (_, i) => currentPlotData.available_options.washrooms_range.min + i,
                    ).map((num) => (
                      <SelectItem key={num} value={num.toString()} className="py-3">
                        {num} washrooms
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )
      case 3:
        if (!currentPlotData) return null
        return (
          <div className="space-y-8">
            <div className="space-y-6">
              <div>
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-blue-500" />
                  Public Zones
                  <Badge variant="secondary">Available for {currentPlotData.meta.plot_size_label}</Badge>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
                <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-green-500" />
                  Service Zones
                  <Badge variant="secondary">Based on {currentPlotData.meta.authority} regulations</Badge>
                </Label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold text-gray-700">Kitchen Type</Label>
              <Select value={formData.kitchenType} onValueChange={(value) => updateFormData("kitchenType", value)}>
                <SelectTrigger className="h-12 border-2 hover:border-blue-300 transition-colors">
                  <SelectValue placeholder="Select kitchen type" />
                </SelectTrigger>
                <SelectContent>
                  {currentPlotData.available_options.kitchen_types.map((type) => (
                    <SelectItem key={type} value={type} className="py-3">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-purple-500" />
                Special Features
                <Badge variant="secondary">
                  Allowed for {currentPlotData.meta.plot_size_label} in {currentPlotData.meta.authority}
                </Badge>
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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

            <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-6 rounded-2xl border border-gray-200">
              <h4 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Car className="h-5 w-5 text-blue-500" />
                Parking Requirements
              </h4>
              <div className="text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium">
                    {currentPlotData.available_options.parking.type}
                  </Badge>
                  {currentPlotData.available_options.parking.spaces && (
                    <span>
                      • <strong>Spaces:</strong> {currentPlotData.available_options.parking.spaces}
                    </span>
                  )}
                  {currentPlotData.available_options.parking.min && currentPlotData.available_options.parking.max && (
                    <span>
                      • <strong>Range:</strong> {currentPlotData.available_options.parking.min}-
                      {currentPlotData.available_options.parking.max} spaces
                    </span>
                  )}
                </div>
              </div>
            </div>

            {currentPlotData.available_options.special_rules.length > 0 && (
              <div className="bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
                <h4 className="font-semibold text-amber-900 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  Special Regulations
                </h4>
                <ul className="text-sm text-amber-800 space-y-2">
                  {currentPlotData.available_options.special_rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0"></div>
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )
      default:
        return null
    }
  }

  const isStep1Complete =
    formData.city && formData.authority && formData.plotSize && formData.orientation && formData.facing
  const isStep2Complete = formData.floors.length > 0 && formData.bedrooms !== ""
  const isStep3Complete = formData.publicZones.length > 0 && formData.kitchenType

  const getStepTitle = () => {
    switch (currentStep) {
      case 1:
        return "Basic Information"
      case 2:
        return "Floor & Room Count"
      case 3:
        return "Zone & Feature Configuration"
      default:
        return ""
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="max-w-5xl mx-auto p-6">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Building className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dynamic Floorplan Generator
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Generate custom floorplans with options dynamically loaded from official building regulations for Lahore,
            Karachi & Islamabad
          </p>

          <div className="mt-6 max-w-md mx-auto">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round(getProgressPercentage())}% Complete</span>
            </div>
            <Progress value={getProgressPercentage()} className="h-2" />
          </div>
        </div>

        {validationErrors.length > 0 && (
          <Alert className="mb-6 border-red-200 bg-red-50" variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Validation Error</AlertTitle>
            <AlertDescription>
              <ul className="list-disc list-inside">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}

        <Card className="shadow-2xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-t-lg">
            <CardTitle className="flex items-center gap-3 text-xl">
              <div className="p-2 bg-white/20 rounded-lg">
                <Home className="h-6 w-6" />
              </div>
              <div>
                <div>
                  Step {currentStep}: {getStepTitle()}
                </div>
                <div className="text-sm font-normal opacity-90 mt-1">
                  {currentStep === 1 && "Select your location and plot details"}
                  {currentStep === 2 && "Configure floors and room requirements"}
                  {currentStep === 3 && "Choose zones and special features"}
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            {renderStep()}

            <div className="flex justify-between items-center pt-8 border-t mt-8">
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                disabled={currentStep === 1}
                className="h-12 px-6 border-2 hover:border-blue-300 transition-all duration-200"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Previous
              </Button>

              {currentStep < 3 ? (
                <Button
                  onClick={() => setCurrentStep((prev) => prev + 1)}
                  disabled={(currentStep === 1 && !isStep1Complete) || (currentStep === 2 && !isStep2Complete)}
                  className="h-12 px-6 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg"
                >
                  Next Step
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={async () => {
                    const isValid = await validateSelection()
                    if (isValid) {
                      try {
                        const response = await fetch(`${API_BASE_URL}/generate-plan`, {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify(formData),
                        })

                        if (response.ok) {
                          const result = await response.json()
                          alert("Floorplan generated successfully!")
                          console.log("[v0] Generated plan:", result)
                        } else {
                          alert("Failed to generate floorplan. Please try again.")
                        }
                      } catch (error) {
                        console.error("[v0] Generation error:", error)
                        alert("Error generating floorplan. Please try again.")
                      }
                    }
                  }}
                  disabled={!isStep3Complete}
                  className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 transition-all duration-200 shadow-lg"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Floorplan
                  <FileText className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

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
    </div>
  )
}
