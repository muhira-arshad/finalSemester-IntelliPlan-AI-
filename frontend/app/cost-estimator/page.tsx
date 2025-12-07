"use client"

import { useEffect, useMemo, useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Building, Ruler, Layers, DollarSign, AlertTriangle, Info } from "lucide-react"
import { useRouter } from "next/navigation"
import { ThreeDBackground } from "@/components/three-d-background"
import { StarsBackground } from "@/components/startsBackground"

interface PlotData {
  meta: {
    plot_size_label: string
    authority: string
    city: string
    frontend_key: string
  }
  available_options: {
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
  }
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

const MATERIAL_PRESETS = {
  "2200": {
    name: "Basic (PKR 2,200/sq.ft)",
    laborRate: "300",
    electrical: "100",
    plumbing: "70",
    finishing: "500",
    contingency: "5",
  },
  "2600": {
    name: "Standard (PKR 2,600/sq.ft)",
    laborRate: "500",
    electrical: "150",
    plumbing: "100",
    finishing: "800",
    contingency: "5",
  },
  "3000": {
    name: "Premium (PKR 3,000/sq.ft)",
    laborRate: "700",
    electrical: "200",
    plumbing: "150",
    finishing: "1200",
    contingency: "7",
  },
  "3500": {
    name: "Luxury (PKR 3,500/sq.ft)",
    laborRate: "900",
    electrical: "250",
    plumbing: "200",
    finishing: "1500",
    contingency: "10",
  },
}

export default function CostEstimator() {
  const [formOptions, setFormOptions] = useState<FormOptions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [calculating, setCalculating] = useState(false)
  const router = useRouter()

  const [city, setCity] = useState<string>("")
  const [authority, setAuthority] = useState<string>("")
  const [plotSize, setPlotSize] = useState<string>("")
  const [currentPlotData, setCurrentPlotData] = useState<PlotData | null>(null)

  const [length, setLength] = useState("")
  const [width, setWidth] = useState("")
  const [floors, setFloors] = useState("")

  const [material, setMaterial] = useState("2600")
  const [laborRate, setLaborRate] = useState("500")
  const [contingencyPercent, setContingencyPercent] = useState("5")
  const [electricalCost, setElectricalCost] = useState("150")
  const [plumbingCost, setPlumbingCost] = useState("100")
  const [finishingCost, setFinishingCost] = useState("800")

  const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
  const [costBreakdown, setCostBreakdown] = useState<any>(null)

  const API_BASE_URL = "/api"

  const handleMaterialChange = (value: string) => {
    setMaterial(value)
    const preset = MATERIAL_PRESETS[value as keyof typeof MATERIAL_PRESETS]
    if (preset) {
      setLaborRate(preset.laborRate)
      setElectricalCost(preset.electrical)
      setPlumbingCost(preset.plumbing)
      setFinishingCost(preset.finishing)
      setContingencyPercent(preset.contingency)
    }
  }

  useEffect(() => {
    const loadFormOptions = async () => {
      try {
        setLoading(true)
        setError(null)

        console.log("[Cost Estimator] Fetching form options from backend...")
        const response = await fetch(`${API_BASE_URL}/form-options`)

        if (!response.ok) {
          throw new Error(`Failed to fetch form options: ${response.status}`)
        }

        const options = await response.json()
        setFormOptions(options)
        console.log("[Cost Estimator] Loaded form options:", options)
      } catch (err: any) {
        console.error("[Cost Estimator] Error loading form options:", err)
        setError(err.message || "Failed to load data from backend. Please ensure Flask backend is running.")
      } finally {
        setLoading(false)
      }
    }

    loadFormOptions()
  }, [])

  useEffect(() => {
    if (city && authority && plotSize && formOptions) {
      const plotData = formOptions.cities[city]?.authorities[authority]?.plot_sizes[plotSize]
      setCurrentPlotData(plotData || null)

      if (plotData?.available_options.max_floors) {
        setFloors(String(plotData.available_options.max_floors))
      }

      setEstimatedCost(null)
      setCostBreakdown(null)

      console.log("[Cost Estimator] Updated plot data:", plotData)
    }
  }, [city, authority, plotSize, formOptions])

  useEffect(() => {
    if (currentPlotData && currentPlotData.raw_bylaws) {
      const plotLabel = currentPlotData.meta.plot_size_label.toLowerCase()

      if (plotLabel.includes("3 marla")) {
        setLength("22.5")
        setWidth("30")
      } else if (plotLabel.includes("5 marla")) {
        setLength("25")
        setWidth("50")
      } else if (plotLabel.includes("7 marla")) {
        setLength("32.5")
        setWidth("56")
      } else if (plotLabel.includes("10 marla")) {
        setLength("35")
        setWidth("65")
      } else if (plotLabel.includes("1 kanal")) {
        setLength("45")
        setWidth("90")
      } else if (plotLabel.includes("2 kanal")) {
        setLength("90")
        setWidth("90")
      } else if (plotLabel.includes("500")) {
        setLength("20")
        setWidth("25")
      } else if (plotLabel.includes("1000")) {
        setLength("25")
        setWidth("40")
      } else if (plotLabel.includes("2000")) {
        setLength("40")
        setWidth("50")
      }
    }
  }, [currentPlotData])

  const cityOptions = useMemo(() => {
    if (!formOptions) return []
    return Object.keys(formOptions.cities)
  }, [formOptions])

  const authorityOptions = useMemo(() => {
    if (!formOptions || !city) return []
    return Object.keys(formOptions.cities[city]?.authorities || {})
  }, [formOptions, city])

  const plotSizeOptions = useMemo(() => {
    if (!formOptions || !city || !authority) return []
    const plotSizes = formOptions.cities[city]?.authorities[authority]?.plot_sizes || {}
    return Object.keys(plotSizes).map((key) => ({
      value: key,
      label: plotSizes[key].meta.plot_size_label,
    }))
  }, [formOptions, city, authority])

  const totalArea = useMemo(() => {
    const l = Number.parseFloat(length || "0")
    const w = Number.parseFloat(width || "0")
    const f = Number.parseInt(floors || "0", 10)
    return l > 0 && w > 0 && f > 0 ? l * w * f : 0
  }, [length, width, floors])

  const coveredArea = useMemo(() => {
    const l = Number.parseFloat(length || "0")
    const w = Number.parseFloat(width || "0")
    return l * w
  }, [length, width])

  const calculateCost = async () => {
    if (!totalArea || totalArea <= 0) {
      alert("Please fill in valid Length, Width, and Floors.")
      return
    }

    const materialRate = Number.parseFloat(material)
    const labor = Number.parseFloat(laborRate)
    const electrical = Number.parseFloat(electricalCost)
    const plumbing = Number.parseFloat(plumbingCost)
    const finishing = Number.parseFloat(finishingCost)
    const contingency = Number.parseFloat(contingencyPercent) / 100

    if (isNaN(materialRate) || isNaN(labor) || isNaN(contingency)) {
      alert("Please fill all cost fields correctly.")
      return
    }

    setCalculating(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    const structuralCost = totalArea * (materialRate + labor)
    const electricalTotal = totalArea * electrical
    const plumbingTotal = totalArea * plumbing
    const finishingTotal = totalArea * finishing

    const baseCost = structuralCost + electricalTotal + plumbingTotal + finishingTotal
    const contingencyCost = baseCost * contingency
    const totalCost = baseCost + contingencyCost

    const breakdown = {
      projectDetails: {
        city,
        authority,
        plotSize: currentPlotData?.meta.plot_size_label || "",
        length: Number.parseFloat(length),
        width: Number.parseFloat(width),
        floors: Number.parseInt(floors),
        plotArea: coveredArea,
        totalArea,
      },
      structural: {
        label: "Structural (Material + Labor)",
        amount: structuralCost,
        rate: materialRate + labor,
        area: totalArea,
      },
      electrical: {
        label: "Electrical Work",
        amount: electricalTotal,
        rate: electrical,
        area: totalArea,
      },
      plumbing: {
        label: "Plumbing & Sanitary",
        amount: plumbingTotal,
        rate: plumbing,
        area: totalArea,
      },
      finishing: {
        label: "Finishing Work",
        amount: finishingTotal,
        rate: finishing,
        area: totalArea,
      },
      contingency: {
        label: `Contingency (${contingencyPercent}%)`,
        amount: contingencyCost,
        percent: contingencyPercent,
      },
      total: totalCost,
    }

    setEstimatedCost(totalCost)
    setCostBreakdown(breakdown)

    setCalculating(false)

    sessionStorage.setItem("costEstimate", JSON.stringify(breakdown))
    router.push("/cost-estimator/summary")

    console.log("[Cost Estimator] Cost breakdown:", breakdown)
  }

  const resetForm = () => {
    setCity("")
    setAuthority("")
    setPlotSize("")
    setLength("")
    setWidth("")
    setFloors("")
    setMaterial("2600")
    setLaborRate("500")
    setContingencyPercent("5")
    setElectricalCost("150")
    setPlumbingCost("100")
    setFinishingCost("800")
    setEstimatedCost(null)
    setCostBreakdown(null)
    setCurrentPlotData(null)
  }

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
        <StarsBackground />
        <ThreeDBackground />
        <div className="relative z-10">
          <div className="space-y-4">
            <div className="h-24 rounded-lg bg-muted animate-pulse" />
            <div className="h-64 rounded-lg bg-muted animate-pulse" />
            <div className="h-40 rounded-lg bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
        <StarsBackground />
        <ThreeDBackground />
        <div className="relative z-10 max-w-lg">
          <Alert variant="destructive" className="border-red-500 bg-red-950/50">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Error Loading Data</AlertTitle>
            <AlertDescription className="mt-2 text-sm">
              {error}
              <br />
              <br />
              <strong>Solution:</strong> Make sure Flask backend is running on http://127.0.0.1:5000
            </AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  if (!formOptions) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
        <StarsBackground />
        <ThreeDBackground />
        <div className="relative z-10">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>Failed to load bylaws data. Please refresh the page.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-900 py-8 px-4 overflow-hidden">
      {/* Background layers */}
      <StarsBackground />
      <ThreeDBackground />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Project Details Card */}
        <Card className="border-2 border-purple-400 bg-slate-800/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg border-b border-purple-400/30">
            <CardTitle className="text-white text-2xl flex items-center gap-2">
              <Building className="h-6 w-6" />
              Project Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            {/* City, Authority & Plot Selection */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label className="text-sm font-semibold text-yellow-300 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  City
                </Label>
                <Select
                  value={city}
                  onValueChange={(v) => {
                    setCity(v)
                    setAuthority("")
                    setPlotSize("")
                    setEstimatedCost(null)
                  }}
                >
                  <SelectTrigger className="h-11 border-2 border-purple-400 bg-slate-700 text-white hover:border-pink-400 transition-colors focus:ring-yellow-400">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-400">
                    {cityOptions.map((c) => (
                      <SelectItem key={c} value={c} className="py-3 text-white hover:bg-purple-600">
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4 text-yellow-400" />
                          {c}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-yellow-300 flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Authority
                </Label>
                <Select
                  value={authority}
                  onValueChange={(v) => {
                    setAuthority(v)
                    setPlotSize("")
                    setEstimatedCost(null)
                  }}
                  disabled={!city}
                >
                  <SelectTrigger className="h-11 border-2 border-purple-400 bg-slate-700 text-white hover:border-pink-400 transition-colors focus:ring-yellow-400 disabled:opacity-50">
                    <SelectValue placeholder={city ? "Select Authority" : "Select city first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-400">
                    {authorityOptions.map((auth) => (
                      <SelectItem key={auth} value={auth} className="py-3 text-white hover:bg-purple-600">
                        <Badge variant="outline" className="font-medium border-purple-400 text-white bg-slate-700">
                          {auth}
                        </Badge>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-semibold text-yellow-300 flex items-center gap-2">
                  <Ruler className="h-4 w-4" />
                  Plot Size
                </Label>
                <Select
                  value={plotSize}
                  onValueChange={(v) => {
                    setPlotSize(v)
                    setEstimatedCost(null)
                  }}
                  disabled={!authority}
                >
                  <SelectTrigger className="h-11 border-2 border-purple-400 bg-slate-700 text-white hover:border-pink-400 transition-colors focus:ring-yellow-400 disabled:opacity-50">
                    <SelectValue placeholder={authority ? "Select Plot Size" : "Select authority first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-800 border-purple-400">
                    {plotSizeOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value} className="py-3 text-white hover:bg-purple-600">
                        <div className="flex items-center gap-2">
                          <Ruler className="h-4 w-4 text-yellow-400" />
                          {opt.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bylaw Information */}
            {currentPlotData && (
              <Alert className="bg-gradient-to-r from-indigo-600 to-purple-600 border-pink-400 shadow-lg">
                <Info className="h-4 w-4 text-yellow-300" />
                <AlertTitle className="text-yellow-300 font-semibold">Bylaw Information</AlertTitle>
                <AlertDescription className="text-white/90">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                    <div>
                      <span className="text-xs text-yellow-300">Max Floors:</span>
                      <div className="font-bold text-pink-200">{currentPlotData.available_options.max_floors}</div>
                    </div>
                    <div>
                      <span className="text-xs text-yellow-300">Coverage:</span>
                      <div className="font-bold text-pink-200">
                        {currentPlotData.available_options.ground_coverage_percent}%
                      </div>
                    </div>
                    <div>
                      <span className="text-xs text-yellow-300">FAR:</span>
                      <div className="font-bold text-pink-200">{currentPlotData.available_options.FAR}</div>
                    </div>
                    {currentPlotData.available_options.max_height_ft && (
                      <div>
                        <span className="text-xs text-yellow-300">Max Height:</span>
                        <div className="font-bold text-pink-200">
                          {currentPlotData.available_options.max_height_ft}ft
                        </div>
                      </div>
                    )}
                  </div>
                </AlertDescription>
              </Alert>
            )}

            <Separator className="bg-purple-400/30" />

            {/* Dimensions */}
            <div>
              <Label className="text-lg font-semibold mb-3 text-yellow-300 flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Plot Dimensions
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white text-sm">Length (ft)</Label>
                  <Input
                    type="number"
                    value={length}
                    onChange={(e) => setLength(e.target.value)}
                    placeholder="e.g. 30"
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm">Width (ft)</Label>
                  <Input
                    type="number"
                    value={width}
                    onChange={(e) => setWidth(e.target.value)}
                    placeholder="e.g. 50"
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white placeholder-gray-400"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-white text-sm flex items-center gap-2">
                    <Layers className="h-4 w-4" />
                    Number of Floors
                    {currentPlotData && (
                      <Badge variant="secondary" className="text-xs bg-purple-600 text-yellow-300">
                        Max: {currentPlotData.available_options.max_floors}
                      </Badge>
                    )}
                  </Label>
                  <Input
                    type="number"
                    value={floors}
                    onChange={(e) => setFloors(e.target.value)}
                    placeholder="e.g. 2"
                    max={currentPlotData?.available_options.max_floors}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Quick Info */}
              <div className="grid grid-cols-2 gap-4 mt-4">
                <Card className="bg-slate-700/60 border-purple-400/40">
                  <CardContent className="pt-4">
                    <div className="text-sm text-yellow-300">Plot Area</div>
                    <div className="text-2xl font-bold text-pink-300">{coveredArea.toLocaleString()} sq.ft</div>
                  </CardContent>
                </Card>
                <Card className="bg-slate-700/60 border-purple-400/40">
                  <CardContent className="pt-4">
                    <div className="text-sm text-yellow-300">Total Construction Area</div>
                    <div className="text-2xl font-bold text-pink-300">{totalArea.toLocaleString()} sq.ft</div>
                  </CardContent>
                </Card>
              </div>
            </div>

            <Separator className="bg-purple-400/30" />

            {/* Cost Parameters */}
            <div>
              <Label className="text-lg font-semibold mb-3 text-yellow-300 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Cost Parameters (Per Sq.Ft)
              </Label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label className="text-white text-sm">Material Grade</Label>
                  <Select value={material} onValueChange={handleMaterialChange}>
                    <SelectTrigger className="h-11 border-2 border-purple-400 bg-slate-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-800 border-purple-400">
                      {Object.entries(MATERIAL_PRESETS).map(([key, preset]) => (
                        <SelectItem key={key} value={key} className="py-3 text-white hover:bg-purple-600">
                          {preset.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Labor Rate (PKR/sq.ft)</Label>
                  <Input
                    type="number"
                    value={laborRate}
                    onChange={(e) => setLaborRate(e.target.value)}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Contingency (%)</Label>
                  <Input
                    type="number"
                    value={contingencyPercent}
                    onChange={(e) => setContingencyPercent(e.target.value)}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Electrical (PKR/sq.ft)</Label>
                  <Input
                    type="number"
                    value={electricalCost}
                    onChange={(e) => setElectricalCost(e.target.value)}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Plumbing (PKR/sq.ft)</Label>
                  <Input
                    type="number"
                    value={plumbingCost}
                    onChange={(e) => setPlumbingCost(e.target.value)}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white text-sm">Finishing (PKR/sq.ft)</Label>
                  <Input
                    type="number"
                    value={finishingCost}
                    onChange={(e) => setFinishingCost(e.target.value)}
                    className="h-11 border-2 border-purple-400 bg-slate-700 text-white"
                  />
                </div>
              </div>
            </div>

            <Separator className="bg-purple-400/30" />

            {/* Action Buttons */}
            <div className="flex gap-3 justify-end flex-col md:flex-row">
              <Button
                variant="outline"
                onClick={resetForm}
                className="gap-2 h-11 border-2 border-purple-400 text-white bg-slate-800 hover:bg-slate-700 hover:border-pink-400"
              >
                Reset
              </Button>
              <Button
                onClick={calculateCost}
                className="gap-2 h-11 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 text-slate-900 font-semibold shadow-lg transition-all"
                disabled={calculating}
              >
                <DollarSign className="h-4 w-4" />
                {calculating ? "Calculating..." : "Calculate Cost"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
