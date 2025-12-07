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
  MessageCircle,
  Download,
  Edit3,
  Save,
} from "lucide-react"
import { GenerateScreenBackground } from "@/components/generate-screen-background"
import { SimpleAIChatbot, InlineAIChatbot } from "@/components/ai-floorplan-chatbot"

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
              ? "border-purple-500 bg-gradient-to-r from-purple-500/20 to-pink-500/20 shadow-md ring-2 ring-purple-400/50"
              : "border-slate-600 bg-slate-700/50 hover:border-purple-400 hover:bg-slate-700"
          }
          ${disabled ? "opacity-50 cursor-not-allowed hover:border-slate-600 hover:bg-slate-700/50 hover:scale-100" : ""}
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
                ? "border-purple-500 bg-gradient-to-r from-purple-500 to-pink-500 text-white scale-110"
                : "border-slate-500 bg-slate-800 hover:border-purple-400"
            }
          `}
        >
          {checked && <Check className="h-4 w-4 animate-in zoom-in duration-200" />}
        </div>
        <Label htmlFor={id} className="text-sm font-medium text-gray-200 cursor-pointer flex-1">
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
  const [showAIChat, setShowAIChat] = useState(false)
  const [generatedFloorplan, setGeneratedFloorplan] = useState<any>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [preferenceAnswered, setPreferenceAnswered] = useState(false)
  const [modificationAnswered, setModificationAnswered] = useState(false)

  const API_BASE_URL = "/api"

  const getProgressPercentage = () => {
    const totalSteps = 3
    return (currentStep / totalSteps) * 100
  }

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

      setFormData((prev) => ({
        ...prev,
        floors: ["ground"],
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
    setValidationErrors([])
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

    options.push({ value: "ground", label: "Ground Floor", required: true })

    for (let i = 1; i <= maxFloors; i++) {
      const floorNames = ["First Floor", "Second Floor", "Third Floor", "Fourth Floor"]
      if (i <= floorNames.length) {
        options.push({ value: `floor-${i}`, label: floorNames[i - 1], required: false })
      }
    }

    if (currentPlotData.available_options.allowed_features.basement) {
      options.push({ value: "basement", label: "Basement", required: false })
    }

    return options
  }

  const handleGenerateFloorplan = async () => {
    const isValid = await validateSelection()
    if (isValid) {
      setIsGenerating(true)
      try {
        const response = await fetch(`${API_BASE_URL}/generate-plan`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        })

        if (response.ok) {
          const result = await response.json()
          setGeneratedFloorplan(result)
          setCurrentStep(currentStep === 4 ? 5 : 7)
          console.log("[v0] Generated plan:", result)
        } else {
          alert("Failed to generate floorplan. Please try again.")
        }
      } catch (error) {
        console.error("[v0] Generation error:", error)
        alert("Error generating floorplan. Please try again.")
      } finally {
        setIsGenerating(false)
      }
    }
  }

  const handleSaveFloorplan = async () => {
    if (!generatedFloorplan) return

    try {
      const canvas = document.querySelector("canvas") as HTMLCanvasElement
      if (canvas) {
        const link = document.createElement("a")
        link.href = canvas.toDataURL("image/png")
        link.download = `floorplan-${Date.now()}.png`
        link.click()
      } else {
        alert("Floorplan image not found. Please try again.")
      }
    } catch (error) {
      console.error("[v0] Save error:", error)
      alert("Error saving floorplan.")
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <GenerateScreenBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto mb-4"></div>
            <p className="text-gray-300 font-medium">Loading bylaws data...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!formOptions) {
    return (
      <div className="relative min-h-screen overflow-hidden">
        <GenerateScreenBackground />
        <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
          <Alert variant="destructive" className="border-red-500/50 bg-red-900/30 max-w-md">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle className="text-red-300">Error!</AlertTitle>
            <AlertDescription className="text-red-200">
              Failed to load bylaws data. Please ensure the backend is running and refresh the page.
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
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
      case 4:
        return "AI Preference Consultation"
      case 5:
        return "Generated Floorplan"
      case 6:
        return "Modify with AI"
      case 7:
        return "Final Floorplan"
      default:
        return ""
    }
  }

  const renderFormSteps = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="city" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-purple-400" />
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
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {getAvailableCities().map((city) => (
                      <SelectItem key={city} value={city} className="py-3 text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-purple-400" />
                          {city}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="authority" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Building className="h-4 w-4 text-pink-400" />
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
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-pink-400 transition-colors">
                    <SelectValue placeholder={formData.city ? "Select authority" : "Select city first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {getAvailableAuthorities().map((authority) => (
                      <SelectItem key={authority} value={authority} className="py-3 text-white hover:bg-slate-700">
                        <Badge variant="outline" className="font-medium border-pink-400 text-pink-300">
                          {authority}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="plotSize" className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Ruler className="h-4 w-4 text-yellow-400" />
                  Plot Size
                </Label>
                <Select
                  value={formData.plotSize}
                  onValueChange={(value) => updateFormData("plotSize", value)}
                  disabled={!formData.authority}
                >
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-yellow-400 transition-colors">
                    <SelectValue placeholder={formData.authority ? "Select plot size" : "Select authority first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {getAvailablePlotSizes().map((plotSize) => (
                      <SelectItem key={plotSize} value={plotSize} className="py-3 text-white hover:bg-slate-700">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-yellow-400" />
                          {plotSize.replace("-", " ").toUpperCase()}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {currentPlotData && (
              <div className="bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-purple-500/20 p-6 rounded-2xl border border-purple-400/30 shadow-lg backdrop-blur-sm">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-600 rounded-lg">
                    <Building className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white">
                      {currentPlotData.meta.plot_size_label} - {currentPlotData.meta.authority}
                    </h4>
                    <p className="text-sm text-gray-300">{currentPlotData.meta.city} Regulations</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-slate-800/50 p-3 rounded-lg shadow-sm border-l-4 border-purple-500">
                    <div className="text-xs text-gray-400 mb-1">Max Floors</div>
                    <div className="font-bold text-purple-400 text-lg">
                      {currentPlotData.available_options.max_floors}
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg shadow-sm border-l-4 border-pink-500">
                    <div className="text-xs text-gray-400 mb-1">Coverage</div>
                    <div className="font-bold text-pink-400 text-lg">
                      {currentPlotData.available_options.ground_coverage_percent}%
                    </div>
                  </div>
                  <div className="bg-slate-800/50 p-3 rounded-lg shadow-sm border-l-4 border-yellow-500">
                    <div className="text-xs text-gray-400 mb-1">FAR</div>
                    <div className="font-bold text-yellow-400 text-lg">{currentPlotData.available_options.FAR}</div>
                  </div>
                  {currentPlotData.available_options.max_height_ft && (
                    <div className="bg-slate-800/50 p-3 rounded-lg shadow-sm border-l-4 border-cyan-500">
                      <div className="text-xs text-gray-400 mb-1">Max Height</div>
                      <div className="font-bold text-cyan-400 text-lg">
                        {currentPlotData.available_options.max_height_ft}ft
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-200">Orientation</Label>
                <Select value={formData.orientation} onValueChange={(value) => updateFormData("orientation", value)}>
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Select orientation" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {formOptions?.global_options.orientation.map((orientation) => (
                      <SelectItem key={orientation} value={orientation} className="py-3 text-white hover:bg-slate-700">
                        {orientation}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-200">Facing</Label>
                <Select value={formData.facing} onValueChange={(value) => updateFormData("facing", value)}>
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-purple-400 transition-colors">
                    <SelectValue placeholder="Select facing" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    {formOptions?.global_options.facing.map((facing) => (
                      <SelectItem key={facing} value={facing} className="py-3 text-white hover:bg-slate-700">
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
              <Label className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="h-5 w-5 text-purple-400" />
                Number of Floors
                <Badge variant="secondary" className="ml-2 bg-purple-500/20 text-purple-300 border-purple-400/30">
                  Max {currentPlotData.available_options.max_floors} floors
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
                <Label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Users className="h-4 w-4 text-pink-400" />
                  Bedrooms
                  <Badge variant="outline" className="text-xs border-pink-400/50 text-pink-300">
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
                  className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-pink-400 transition-colors"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-gray-200 flex items-center gap-2">
                  <Home className="h-4 w-4 text-cyan-400" />
                  Washrooms
                  <Badge variant="outline" className="text-xs border-cyan-400/50 text-cyan-300">
                    {currentPlotData.available_options.washrooms_range.min}-
                    {currentPlotData.available_options.washrooms_range.max}
                  </Badge>
                </Label>
                <Select value={formData.washrooms} onValueChange={(value) => updateFormData("washrooms", value)}>
                  <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-cyan-400 transition-colors">
                    <SelectValue placeholder="Select washrooms" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-slate-600">
                    <SelectItem value="Auto-calculated" className="py-3 text-white hover:bg-slate-700">
                      <div className="flex items-center gap-2">
                        <Sparkles className="h-4 w-4 text-purple-400" />
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
                      <SelectItem key={num} value={num.toString()} className="py-3 text-white hover:bg-slate-700">
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
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Home className="h-5 w-5 text-purple-400" />
                  Public Zones
                  <Badge variant="secondary" className="bg-purple-500/20 text-purple-300 border-purple-400/30">
                    Available
                  </Badge>
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
                <Label className="text-lg font-semibold text-white flex items-center gap-2 mb-4">
                  <Building className="h-5 w-5 text-pink-400" />
                  Service Zones
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
              <Label className="text-sm font-semibold text-gray-200">Kitchen Type</Label>
              <Select value={formData.kitchenType} onValueChange={(value) => updateFormData("kitchenType", value)}>
                <SelectTrigger className="h-12 border-2 border-slate-600 bg-slate-700/50 text-white hover:border-purple-400 transition-colors">
                  <SelectValue placeholder="Select kitchen type" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {currentPlotData.available_options.kitchen_types.map((type) => (
                    <SelectItem key={type} value={type} className="py-3 text-white hover:bg-slate-700">
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              <Label className="text-lg font-semibold text-white flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-yellow-400" />
                Special Features
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

            <div className="bg-slate-700/30 p-6 rounded-2xl border border-slate-600">
              <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                <Car className="h-5 w-5 text-cyan-400" />
                Parking Requirements
              </h4>
              <div className="text-sm text-gray-300">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="font-medium border-cyan-400/50 text-cyan-300">
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
              <div className="bg-amber-500/10 p-6 rounded-2xl border border-amber-500/30">
                <h4 className="font-semibold text-amber-300 mb-3 flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-400" />
                  Special Regulations
                </h4>
                <ul className="text-sm text-amber-200 space-y-2">
                  {currentPlotData.available_options.special_rules.map((rule, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="w-2 h-2 bg-amber-400 rounded-full mt-2 flex-shrink-0"></div>
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

  const renderAdvancedSteps = () => {
    switch (currentStep) {
      case 4:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-400/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                Preference Consultation
              </h3>
              <p className="text-sm text-gray-300">
                Chat with our AI assistant about your preferences. Answer one simple question to customize your
                floorplan.
              </p>
            </div>

            <InlineAIChatbot
              mode="preference"
              onComplete={(response) => {
                setPreferenceAnswered(true)
                console.log("[v0] User preference:", response)
              }}
              isAnswered={preferenceAnswered}
            />

            {preferenceAnswered && (
              <div className="bg-green-500/10 p-4 rounded-lg border border-green-500/30 flex items-start gap-3">
                <Check className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-green-300">Preference recorded!</p>
                  <p className="text-xs text-green-200 mt-1">
                    Click 'Generate Floorplan' to create your custom design.
                  </p>
                </div>
              </div>
            )}
          </div>
        )
      case 5:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-green-500/20 to-emerald-500/20 p-6 rounded-2xl border border-green-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-400" />
                Your Generated Floorplan
              </h3>
              <p className="text-sm text-gray-300">
                Review your generated floorplan. You can modify it or save it to your projects.
              </p>
            </div>

            {generatedFloorplan && (
              <div className="bg-slate-700/50 p-6 rounded-2xl border-2 border-green-500/30 shadow-lg">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Home className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400">Floorplan Preview</p>
                    <pre className="text-xs text-gray-500 mt-2 max-h-40 overflow-auto">
                      {JSON.stringify(generatedFloorplan, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={() => {
                  setCurrentStep(6)
                  setModificationAnswered(false)
                }}
                variant="outline"
                className="h-12 border-2 border-purple-400 text-white bg-slate-700 hover:bg-slate-600 hover:border-pink-400"
              >
                <Edit3 className="h-4 w-4 mr-2" />
                Modify Your Plan
              </Button>
              <Button
                onClick={handleSaveFloorplan}
                className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Save as PNG
              </Button>
            </div>
          </div>
        )
      case 6:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 p-6 rounded-2xl border border-purple-400/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <MessageCircle className="h-5 w-5 text-purple-400" />
                Modification Consultation
              </h3>
              <p className="text-sm text-gray-300">
                Chat with our AI about what you'd like to modify. Answer one question and we'll regenerate the
                floorplan.
              </p>
            </div>

            <InlineAIChatbot
              mode="modify"
              onComplete={(response) => {
                setModificationAnswered(true)
                console.log("[v0] User modification request:", response)
              }}
              isAnswered={modificationAnswered}
            />

            <div className="flex gap-4">
              <Button
                onClick={() => setCurrentStep(5)}
                variant="outline"
                className="h-12 border-2 border-slate-600 text-white bg-slate-700 hover:bg-slate-600 flex-1"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to View
              </Button>
              <Button
                onClick={handleGenerateFloorplan}
                disabled={!modificationAnswered || isGenerating}
                className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 flex-1"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Regenerating...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 mr-2" />
                    Generate Floorplan
                  </>
                )}
              </Button>
            </div>
          </div>
        )
      case 7:
        return (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-500/20 to-orange-500/20 p-6 rounded-2xl border border-amber-500/30">
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <Check className="h-5 w-5 text-amber-400" />
                Final Floorplan
              </h3>
              <p className="text-sm text-gray-300">
                Your design is complete and compliant. Save it to your projects or export as PNG.
              </p>
            </div>

            {generatedFloorplan && (
              <div className="bg-slate-700/50 p-6 rounded-2xl border-2 border-amber-500/30 shadow-lg">
                <div className="aspect-video bg-slate-800 rounded-lg flex items-center justify-center mb-4">
                  <div className="text-center">
                    <Home className="h-16 w-16 text-green-500 mx-auto mb-3" />
                    <p className="font-semibold text-white">Final Floorplan - Ready to Save</p>
                    <Badge className="mt-2 bg-green-500">Bylaws Compliant</Badge>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <Button
                onClick={handleSaveFloorplan}
                className="h-12 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export PNG
              </Button>
              <Button
                onClick={() => {
                  alert("Floorplan saved to My Projects!")
                  setCurrentStep(1)
                  setFormData({
                    city: "",
                    authority: "",
                    plotSize: "",
                    floors: [],
                    bedrooms: "",
                    washrooms: "Auto-calculated",
                    publicZones: [],
                    serviceZones: [],
                    kitchenType: "",
                    specialFeatures: [],
                    orientation: "",
                    facing: "",
                    shape: "Regular",
                  })
                  setGeneratedFloorplan(null)
                  setPreferenceAnswered(false)
                  setModificationAnswered(false)
                }}
                className="h-12 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700"
              >
                <Save className="h-4 w-4 mr-2" />
                Save to Projects
              </Button>
            </div>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GenerateScreenBackground />

      {/* Content layer */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto p-6">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="p-3 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 rounded-2xl shadow-lg">
                <Building className="h-8 w-8 text-slate-900" />
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
                AI Floorplan Generator
              </h1>
            </div>
            <p className="text-lg text-gray-300 max-w-2xl mx-auto">
              Generate custom floorplans with AI assistance. Fully compliant with building regulations.
            </p>

            <div className="mt-6 max-w-md mx-auto">
              <div className="flex justify-between text-sm text-gray-400 mb-2">
                <span>Step {currentStep} of 7</span>
                <span>{Math.round((currentStep / 7) * 100)}% Complete</span>
              </div>
              <Progress value={(currentStep / 7) * 100} className="h-3 bg-slate-700 rounded-full" />
            </div>
          </div>

          {validationErrors.length > 0 && (
            <Alert className="mb-6 border-2 border-red-500 bg-red-900/30" variant="destructive">
              <AlertTriangle className="h-4 w-4 text-red-400" />
              <AlertTitle className="text-red-300">Validation Error</AlertTitle>
              <AlertDescription className="text-red-200">
                <ul className="list-disc list-inside">
                  {validationErrors.map((error, index) => (
                    <li key={index}>{error}</li>
                  ))}
                </ul>
              </AlertDescription>
            </Alert>
          )}

          <Card className="shadow-2xl border-2 border-purple-400/50 bg-slate-800/60 backdrop-blur-md">
            <CardHeader className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 text-slate-900 rounded-t-lg border-b border-pink-400/30">
              <CardTitle className="flex items-center gap-3 text-xl text-slate-900">
                <div className="p-2 bg-slate-900/30 rounded-lg">
                  <Sparkles className="h-6 w-6" />
                </div>
                <div className="text-left">
                  <div>
                    Step {currentStep}: {getStepTitle()}
                  </div>
                  <div className="text-sm font-normal opacity-90 mt-1">
                    {currentStep === 1 && "Select your location and plot details"}
                    {currentStep === 2 && "Configure floors and room requirements"}
                    {currentStep === 3 && "Choose zones and special features"}
                    {currentStep === 4 && "Discuss preferences with AI"}
                    {currentStep === 5 && "Review your generated design"}
                    {currentStep === 6 && "Refine your design with AI"}
                    {currentStep === 7 && "Save your final design"}
                  </div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8 text-white">
              {currentStep <= 3 ? renderFormSteps() : renderAdvancedSteps()}

              <div className="flex justify-between items-center pt-8 border-t border-purple-400/30 mt-8">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
                  disabled={currentStep === 1}
                  className="h-12 px-6 border-2 border-purple-400 text-white bg-slate-700 hover:bg-slate-600 hover:border-pink-400 transition-all duration-200"
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Button>

                {currentStep < 7 && currentStep < 4 ? (
                  <Button
                    onClick={() => setCurrentStep((prev) => prev + 1)}
                    disabled={
                      (currentStep === 1 && !isStep1Complete) ||
                      (currentStep === 2 && !isStep2Complete) ||
                      (currentStep === 3 && !isStep3Complete)
                    }
                    className="h-12 px-6 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 text-slate-900 font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    Next Step
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : currentStep === 3 ? (
                  <Button
                    onClick={() => setCurrentStep(4)}
                    disabled={!isStep3Complete}
                    className="h-12 px-8 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 text-slate-900 font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    Proceed to Next
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </Button>
                ) : currentStep === 4 ? (
                  <Button
                    onClick={handleGenerateFloorplan}
                    disabled={!preferenceAnswered || isGenerating}
                    className="h-12 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold transition-all duration-200 shadow-lg disabled:opacity-50"
                  >
                    {isGenerating ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4 mr-2" />
                        Generate Floorplan
                      </>
                    )}
                  </Button>
                ) : null}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Floating AI Chatbot */}
      <SimpleAIChatbot
        isOpen={showAIChat}
        onClose={() => setShowAIChat(false)}
        onModificationRequest={(request) => console.log("[v0] Modification:", request)}
      />
    </div>
  )
}
