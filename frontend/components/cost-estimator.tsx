// "use client"

// import { useEffect, useMemo, useState } from "react"
// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Separator } from "@/components/ui/separator"
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// import { Badge } from "@/components/ui/badge"
// import { Building, Ruler, Layers, DollarSign, AlertTriangle, Info } from "lucide-react"

// interface PlotData {
//   meta: {
//     plot_size_label: string
//     authority: string
//     city: string
//     frontend_key: string
//   }
//   available_options: {
//     max_floors: number
//     max_height_ft?: number
//     ground_coverage_percent?: number
//     FAR: string
//     mandatory_open_spaces: {
//       front: string
//       rear: string
//       side: string
//     }
//     bedrooms_range: { min: number; max: number }
//     washrooms_range: { min: number; max: number }
//   }
//   raw_bylaws: any
// }

// interface FormOptions {
//   cities: {
//     [cityName: string]: {
//       authorities: {
//         [authorityName: string]: {
//           plot_sizes: {
//             [plotSize: string]: PlotData
//           }
//         }
//       }
//     }
//   }
//   global_options: {
//     orientation: string[]
//     facing: string[]
//     shape: string[]
//   }
// }

// export default function CostEstimator() {
//   // -------------------------
//   // States for Backend Data
//   // -------------------------
//   const [formOptions, setFormOptions] = useState<FormOptions | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)

//   // -------------------------
//   // User Selection States
//   // -------------------------
//   const [city, setCity] = useState<string>("")
//   const [authority, setAuthority] = useState<string>("")
//   const [plotSize, setPlotSize] = useState<string>("")
//   const [currentPlotData, setCurrentPlotData] = useState<PlotData | null>(null)

//   // -------------------------
//   // Dimension States
//   // -------------------------
//   const [length, setLength] = useState("")
//   const [width, setWidth] = useState("")
//   const [floors, setFloors] = useState("")

//   // -------------------------
//   // Cost Calculation States
//   // -------------------------
//   const [material, setMaterial] = useState("2600")
//   const [laborRate, setLaborRate] = useState("500")
//   const [contingencyPercent, setContingencyPercent] = useState("5")
//   const [electricalCost, setElectricalCost] = useState("150") // per sq.ft
//   const [plumbingCost, setPlumbingCost] = useState("100") // per sq.ft
//   const [finishingCost, setFinishingCost] = useState("800") // per sq.ft
  
//   const [estimatedCost, setEstimatedCost] = useState<number | null>(null)
//   const [costBreakdown, setCostBreakdown] = useState<any>(null)

//   const API_BASE_URL = "/api"

//   // -------------------------
//   // Load Form Options from Backend
//   // -------------------------
//   useEffect(() => {
//     const loadFormOptions = async () => {
//       try {
//         setLoading(true)
//         setError(null)
        
//         console.log("[Cost Estimator] Fetching form options from backend...")
//         const response = await fetch(`${API_BASE_URL}/form-options`)
        
//         if (!response.ok) {
//           throw new Error(`Failed to fetch form options: ${response.status}`)
//         }

//         const options = await response.json()
//         setFormOptions(options)
//         console.log("[Cost Estimator] Loaded form options:", options)
//       } catch (err: any) {
//         console.error("[Cost Estimator] Error loading form options:", err)
//         setError(err.message || "Failed to load data from backend. Please ensure Flask backend is running.")
//       } finally {
//         setLoading(false)
//       }
//     }

//     loadFormOptions()
//   }, [])

//   // -------------------------
//   // Update Plot Data when selection changes
//   // -------------------------
//   useEffect(() => {
//     if (city && authority && plotSize && formOptions) {
//       const plotData = formOptions.cities[city]?.authorities[authority]?.plot_sizes[plotSize]
//       setCurrentPlotData(plotData || null)
      
//       // Auto-set floors based on max allowed
//       if (plotData?.available_options.max_floors) {
//         setFloors(String(plotData.available_options.max_floors))
//       }
      
//       // Reset cost when plot changes
//       setEstimatedCost(null)
//       setCostBreakdown(null)
      
//       console.log("[Cost Estimator] Updated plot data:", plotData)
//     }
//   }, [city, authority, plotSize, formOptions])

//   // -------------------------
//   // Auto-calculate dimensions based on plot size
//   // -------------------------
//   useEffect(() => {
//     if (currentPlotData && currentPlotData.raw_bylaws) {
//       const rawBylaws = currentPlotData.raw_bylaws
      
//       // Try to extract dimensions from plot size label
//       const plotLabel = currentPlotData.meta.plot_size_label.toLowerCase()
      
//       // For standard plot sizes, set typical dimensions
//       if (plotLabel.includes("3 marla")) {
//         setLength("22.5")
//         setWidth("30")
//       } else if (plotLabel.includes("5 marla")) {
//         setLength("25")
//         setWidth("50")
//       } else if (plotLabel.includes("7 marla")) {
//         setLength("32.5")
//         setWidth("56")
//       } else if (plotLabel.includes("10 marla")) {
//         setLength("35")
//         setWidth("65")
//       } else if (plotLabel.includes("1 kanal")) {
//         setLength("45")
//         setWidth("90")
//       } else if (plotLabel.includes("2 kanal")) {
//         setLength("90")
//         setWidth("90")
//       } else if (plotLabel.includes("500")) {
//         setLength("20")
//         setWidth("25")
//       } else if (plotLabel.includes("1000")) {
//         setLength("25")
//         setWidth("40")
//       } else if (plotLabel.includes("2000")) {
//         setLength("40")
//         setWidth("50")
//       }
//     }
//   }, [currentPlotData])

//   // -------------------------
//   // Derived Options
//   // -------------------------
//   const cityOptions = useMemo(() => {
//     if (!formOptions) return []
//     return Object.keys(formOptions.cities)
//   }, [formOptions])

//   const authorityOptions = useMemo(() => {
//     if (!formOptions || !city) return []
//     return Object.keys(formOptions.cities[city]?.authorities || {})
//   }, [formOptions, city])

//   const plotSizeOptions = useMemo(() => {
//     if (!formOptions || !city || !authority) return []
//     const plotSizes = formOptions.cities[city]?.authorities[authority]?.plot_sizes || {}
//     return Object.keys(plotSizes).map(key => ({
//       value: key,
//       label: plotSizes[key].meta.plot_size_label
//     }))
//   }, [formOptions, city, authority])

//   // -------------------------
//   // Calculations
//   // -------------------------
//   const totalArea = useMemo(() => {
//     const l = Number.parseFloat(length || "0")
//     const w = Number.parseFloat(width || "0")
//     const f = Number.parseInt(floors || "0", 10)
//     return l > 0 && w > 0 && f > 0 ? l * w * f : 0
//   }, [length, width, floors])

//   const coveredArea = useMemo(() => {
//     const l = Number.parseFloat(length || "0")
//     const w = Number.parseFloat(width || "0")
//     return l * w
//   }, [length, width])

//   const calculateCost = () => {
//     if (!totalArea || totalArea <= 0) {
//       alert("Please fill in valid Length, Width, and Floors.")
//       return
//     }

//     const materialRate = Number.parseFloat(material)
//     const labor = Number.parseFloat(laborRate)
//     const electrical = Number.parseFloat(electricalCost)
//     const plumbing = Number.parseFloat(plumbingCost)
//     const finishing = Number.parseFloat(finishingCost)
//     const contingency = Number.parseFloat(contingencyPercent) / 100

//     if (isNaN(materialRate) || isNaN(labor) || isNaN(contingency)) {
//       alert("Please fill all cost fields correctly.")
//       return
//     }

//     // Calculate individual costs
//     const structuralCost = totalArea * (materialRate + labor)
//     const electricalTotal = totalArea * electrical
//     const plumbingTotal = totalArea * plumbing
//     const finishingTotal = totalArea * finishing
    
//     const baseCost = structuralCost + electricalTotal + plumbingTotal + finishingTotal
//     const contingencyCost = baseCost * contingency
//     const totalCost = baseCost + contingencyCost

//     // Store breakdown
//     const breakdown = {
//       structural: {
//         label: "Structural (Material + Labor)",
//         amount: structuralCost,
//         rate: materialRate + labor,
//         area: totalArea
//       },
//       electrical: {
//         label: "Electrical Work",
//         amount: electricalTotal,
//         rate: electrical,
//         area: totalArea
//       },
//       plumbing: {
//         label: "Plumbing & Sanitary",
//         amount: plumbingTotal,
//         rate: plumbing,
//         area: totalArea
//       },
//       finishing: {
//         label: "Finishing Work",
//         amount: finishingTotal,
//         rate: finishing,
//         area: totalArea
//       },
//       contingency: {
//         label: `Contingency (${contingencyPercent}%)`,
//         amount: contingencyCost,
//         percent: contingencyPercent
//       },
//       total: totalCost
//     }

//     setEstimatedCost(totalCost)
//     setCostBreakdown(breakdown)
    
//     console.log("[Cost Estimator] Cost breakdown:", breakdown)
//   }

//   const resetForm = () => {
//     setCity("")
//     setAuthority("")
//     setPlotSize("")
//     setLength("")
//     setWidth("")
//     setFloors("")
//     setMaterial("2600")
//     setLaborRate("500")
//     setContingencyPercent("5")
//     setElectricalCost("150")
//     setPlumbingCost("100")
//     setFinishingCost("800")
//     setEstimatedCost(null)
//     setCostBreakdown(null)
//     setCurrentPlotData(null)
//   }

//   // -------------------------
//   // Render Loading/Error States
//   // -------------------------
//   if (loading) {
//     return (
//       <div className="space-y-4">
//         <div className="h-24 rounded-lg bg-muted animate-pulse" />
//         <div className="h-64 rounded-lg bg-muted animate-pulse" />
//         <div className="h-40 rounded-lg bg-muted animate-pulse" />
//       </div>
//     )
//   }

//   if (error) {
//     return (
//       <Alert variant="destructive" className="border-red-200 bg-red-50">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>Error Loading Data</AlertTitle>
//         <AlertDescription>
//           {error}
//           <br />
//           <br />
//           <strong>Solution:</strong> Make sure Flask backend is running on http://127.0.0.1:5000
//         </AlertDescription>
//       </Alert>
//     )
//   }

//   if (!formOptions) {
//     return (
//       <Alert variant="destructive">
//         <AlertTriangle className="h-4 w-4" />
//         <AlertTitle>No Data Available</AlertTitle>
//         <AlertDescription>
//           Failed to load bylaws data. Please refresh the page.
//         </AlertDescription>
//       </Alert>
//     )
//   }

//   // -------------------------
//   // Main Render
//   // -------------------------
//   return (
//     <div className="space-y-6">
//       {/* Project Details Card */}
//       <Card className="border-2 border-border bg-card shadow-lg">
//         <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
//           <CardTitle className="text-foreground text-2xl flex items-center gap-2">
//             <Building className="h-6 w-6 text-blue-600" />
//             Project Details
//           </CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6 pt-6">
//           {/* City, Authority & Plot Selection */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//             <div className="space-y-2">
//               <Label className="text-sm font-semibold flex items-center gap-2">
//                 <Building className="h-4 w-4 text-blue-500" />
//                 City
//               </Label>
//               <Select 
//                 value={city} 
//                 onValueChange={(v) => { 
//                   setCity(v)
//                   setAuthority("")
//                   setPlotSize("")
//                   setEstimatedCost(null)
//                 }}
//               >
//                 <SelectTrigger className="h-11 border-2 hover:border-blue-300 transition-colors">
//                   <SelectValue placeholder="Select City" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {cityOptions.map((c) => (
//                     <SelectItem key={c} value={c} className="py-3">
//                       <div className="flex items-center gap-2">
//                         <Building className="h-4 w-4 text-blue-500" />
//                         {c}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-semibold flex items-center gap-2">
//                 <Building className="h-4 w-4 text-green-500" />
//                 Authority
//               </Label>
//               <Select 
//                 value={authority} 
//                 onValueChange={(v) => { 
//                   setAuthority(v)
//                   setPlotSize("")
//                   setEstimatedCost(null)
//                 }}
//                 disabled={!city}
//               >
//                 <SelectTrigger className="h-11 border-2 hover:border-green-300 transition-colors">
//                   <SelectValue placeholder={city ? "Select Authority" : "Select city first"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {authorityOptions.map((auth) => (
//                     <SelectItem key={auth} value={auth} className="py-3">
//                       <Badge variant="outline" className="font-medium">
//                         {auth}
//                       </Badge>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>

//             <div className="space-y-2">
//               <Label className="text-sm font-semibold flex items-center gap-2">
//                 <Ruler className="h-4 w-4 text-purple-500" />
//                 Plot Size
//               </Label>
//               <Select 
//                 value={plotSize} 
//                 onValueChange={(v) => { 
//                   setPlotSize(v)
//                   setEstimatedCost(null)
//                 }}
//                 disabled={!authority}
//               >
//                 <SelectTrigger className="h-11 border-2 hover:border-purple-300 transition-colors">
//                   <SelectValue placeholder={authority ? "Select Plot Size" : "Select authority first"} />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {plotSizeOptions.map((opt) => (
//                     <SelectItem key={opt.value} value={opt.value} className="py-3">
//                       <div className="flex items-center gap-2">
//                         <Ruler className="h-4 w-4 text-purple-500" />
//                         {opt.label}
//                       </div>
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>

//           {/* Bylaw Information */}
//           {currentPlotData && (
//             <Alert className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
//               <Info className="h-4 w-4 text-blue-600" />
//               <AlertTitle className="text-blue-900 font-semibold">Bylaw Information</AlertTitle>
//               <AlertDescription className="text-blue-800">
//                 <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
//                   <div>
//                     <span className="text-xs text-blue-600">Max Floors:</span>
//                     <div className="font-bold">{currentPlotData.available_options.max_floors}</div>
//                   </div>
//                   <div>
//                     <span className="text-xs text-blue-600">Coverage:</span>
//                     <div className="font-bold">{currentPlotData.available_options.ground_coverage_percent}%</div>
//                   </div>
//                   <div>
//                     <span className="text-xs text-blue-600">FAR:</span>
//                     <div className="font-bold">{currentPlotData.available_options.FAR}</div>
//                   </div>
//                   {currentPlotData.available_options.max_height_ft && (
//                     <div>
//                       <span className="text-xs text-blue-600">Max Height:</span>
//                       <div className="font-bold">{currentPlotData.available_options.max_height_ft}ft</div>
//                     </div>
//                   )}
//                 </div>
//               </AlertDescription>
//             </Alert>
//           )}

//           <Separator />

//           {/* Dimensions */}
//           <div>
//             <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
//               <Ruler className="h-5 w-5 text-orange-500" />
//               Plot Dimensions
//             </Label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label>Length (ft)</Label>
//                 <Input 
//                   type="number" 
//                   value={length} 
//                   onChange={(e) => setLength(e.target.value)} 
//                   placeholder="e.g. 30"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Width (ft)</Label>
//                 <Input 
//                   type="number" 
//                   value={width} 
//                   onChange={(e) => setWidth(e.target.value)} 
//                   placeholder="e.g. 50"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label className="flex items-center gap-2">
//                   <Layers className="h-4 w-4" />
//                   Number of Floors
//                   {currentPlotData && (
//                     <Badge variant="secondary" className="text-xs">
//                       Max: {currentPlotData.available_options.max_floors}
//                     </Badge>
//                   )}
//                 </Label>
//                 <Input 
//                   type="number" 
//                   value={floors} 
//                   onChange={(e) => setFloors(e.target.value)} 
//                   placeholder="e.g. 2"
//                   max={currentPlotData?.available_options.max_floors}
//                   className="h-11 border-2"
//                 />
//               </div>
//             </div>

//             {/* Quick Info */}
//             <div className="grid grid-cols-2 gap-4 mt-4">
//               <Card className="bg-blue-50 border-blue-200">
//                 <CardContent className="pt-4">
//                   <div className="text-sm text-blue-600">Plot Area</div>
//                   <div className="text-2xl font-bold text-blue-900">
//                     {coveredArea.toLocaleString()} sq.ft
//                   </div>
//                 </CardContent>
//               </Card>
//               <Card className="bg-green-50 border-green-200">
//                 <CardContent className="pt-4">
//                   <div className="text-sm text-green-600">Total Construction Area</div>
//                   <div className="text-2xl font-bold text-green-900">
//                     {totalArea.toLocaleString()} sq.ft
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           </div>

//           <Separator />

//           {/* Cost Parameters */}
//           <div>
//             <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
//               <DollarSign className="h-5 w-5 text-green-500" />
//               Cost Parameters (Per Sq.Ft)
//             </Label>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="space-y-2">
//                 <Label>Material Rate</Label>
//                 <Select value={material} onValueChange={setMaterial}>
//                   <SelectTrigger className="h-11">
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="2200">Basic (PKR 2,200/sq.ft)</SelectItem>
//                     <SelectItem value="2600">Standard (PKR 2,600/sq.ft)</SelectItem>
//                     <SelectItem value="3000">Premium (PKR 3,000/sq.ft)</SelectItem>
//                     <SelectItem value="3500">Luxury (PKR 3,500/sq.ft)</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="space-y-2">
//                 <Label>Labor Rate (PKR)</Label>
//                 <Input 
//                   type="number" 
//                   value={laborRate} 
//                   onChange={(e) => setLaborRate(e.target.value)} 
//                   placeholder="e.g. 500"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Electrical Work (PKR)</Label>
//                 <Input 
//                   type="number" 
//                   value={electricalCost} 
//                   onChange={(e) => setElectricalCost(e.target.value)} 
//                   placeholder="e.g. 150"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Plumbing & Sanitary (PKR)</Label>
//                 <Input 
//                   type="number" 
//                   value={plumbingCost} 
//                   onChange={(e) => setPlumbingCost(e.target.value)} 
//                   placeholder="e.g. 100"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Finishing Work (PKR)</Label>
//                 <Input 
//                   type="number" 
//                   value={finishingCost} 
//                   onChange={(e) => setFinishingCost(e.target.value)} 
//                   placeholder="e.g. 800"
//                   className="h-11 border-2"
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>Contingency (%)</Label>
//                 <Input 
//                   type="number" 
//                   value={contingencyPercent} 
//                   onChange={(e) => setContingencyPercent(e.target.value)} 
//                   placeholder="e.g. 5"
//                   className="h-11 border-2"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Action Buttons */}
//           <div className="flex gap-3 justify-end pt-4">
//             <Button 
//               variant="outline" 
//               onClick={resetForm}
//               className="h-11 px-6"
//             >
//               Reset All
//             </Button>
//             <Button 
//               onClick={calculateCost}
//               className="h-11 px-8 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
//               disabled={!totalArea || totalArea <= 0}
//             >
//               <DollarSign className="h-4 w-4 mr-2" />
//               Calculate Cost
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       {/* Cost Breakdown */}
//       {estimatedCost && costBreakdown && (
//         <Card className="border-2 border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-xl">
//           <CardHeader className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
//             <CardTitle className="text-2xl flex items-center gap-2">
//               <DollarSign className="h-6 w-6" />
//               Cost Estimation Summary
//             </CardTitle>
//           </CardHeader>
//           <CardContent className="pt-6 space-y-6">
//             {/* Breakdown Details */}
//             <div className="space-y-3">
//               {Object.entries(costBreakdown).map(([key, value]: [string, any]) => {
//                 if (key === 'total') return null
//                 return (
//                   <div key={key} className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border">
//                     <div>
//                       <div className="font-semibold text-gray-800">{value.label}</div>
//                       {value.rate && (
//                         <div className="text-sm text-gray-500">
//                           PKR {value.rate.toLocaleString()}/sq.ft × {value.area.toLocaleString()} sq.ft
//                         </div>
//                       )}
//                       {value.percent && (
//                         <div className="text-sm text-gray-500">
//                           {value.percent}% of base cost
//                         </div>
//                       )}
//                     </div>
//                     <div className="text-lg font-bold text-gray-900">
//                       PKR {value.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//                     </div>
//                   </div>
//                 )
//               })}
//             </div>

//             <Separator className="bg-green-300" />

//             {/* Total Cost */}
//             <div className="p-6 bg-gradient-to-r from-green-600 to-emerald-700 rounded-xl shadow-lg">
//               <div className="flex justify-between items-center">
//                 <div>
//                   <div className="text-white text-sm font-medium">Total Estimated Cost</div>
//                   <div className="text-white/80 text-xs mt-1">
//                     {totalArea.toLocaleString()} sq.ft × PKR {(estimatedCost / totalArea).toLocaleString(undefined, { maximumFractionDigits: 0 })}/sq.ft
//                   </div>
//                 </div>
//                 <div className="text-right">
//                   <div className="text-4xl font-bold text-white">
//                     PKR {estimatedCost.toLocaleString(undefined, { maximumFractionDigits: 0 })}
//                   </div>
//                   <div className="text-white/80 text-sm mt-1">
//                     ≈ PKR {(estimatedCost / 1000000).toFixed(2)} Million
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Additional Info */}
//             <Alert className="bg-blue-50 border-blue-200">
//               <Info className="h-4 w-4 text-blue-600" />
//               <AlertTitle className="text-blue-900">Note</AlertTitle>
//               <AlertDescription className="text-blue-800">
//                 This is an estimated cost based on current market rates. Actual costs may vary depending on:
//                 material quality, labor availability, site conditions, and market fluctuations.
//               </AlertDescription>
//             </Alert>
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }