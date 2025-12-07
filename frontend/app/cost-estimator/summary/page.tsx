"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { DollarSign, Download, Save, AlertTriangle, Home } from "lucide-react"
import { ThreeDBackground } from "@/components/three-d-background"
import { StarsBackground } from "@/components/startsBackground"

export default function CostSummary() {
  const router = useRouter()
  const [costData, setCostData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + Math.random() * 30
        })
      }, 100)

      const timer = setTimeout(() => {
        const data = sessionStorage.getItem("costEstimate")
        if (data) {
          setCostData(JSON.parse(data))
        }
        setLoading(false)
      }, 2000)

      return () => {
        clearInterval(interval)
        clearTimeout(timer)
      }
    }
  }, [loading])

  if (loading) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center overflow-hidden">
        <StarsBackground />
        <ThreeDBackground />
        <div className="relative z-10 w-full max-w-md px-6">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-2">Calculating Your Estimate</h2>
            <p className="text-gray-300">Processing data and generating summary...</p>
          </div>

          <div className="space-y-4">
            <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden border-2 border-purple-400 shadow-lg">
              <div
                className="h-full bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 rounded-full transition-all duration-300 ease-out shadow-lg"
                style={{ width: `${Math.min(loadingProgress, 100)}%` }}
              />
            </div>
            <p className="text-center text-yellow-400 font-semibold text-sm">
              {Math.min(Math.round(loadingProgress), 100)}%
            </p>
          </div>

          <div className="mt-12 flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-400 border-t-yellow-500"></div>
          </div>
        </div>
      </div>
    )
  }

  if (!costData) {
    return (
      <div className="relative min-h-screen bg-slate-900 flex items-center justify-center p-6 overflow-hidden">
        <StarsBackground />
        <ThreeDBackground />
        <div className="relative z-10">
          <Alert variant="destructive" className="max-w-md bg-red-900/50 border-red-600 text-white">
            <AlertTriangle className="h-4 w-4 text-red-400" />
            <AlertTitle>No Data Available</AlertTitle>
            <AlertDescription>Please generate a cost estimate first.</AlertDescription>
          </Alert>
        </div>
      </div>
    )
  }

  const { projectDetails, structural, electrical, plumbing, finishing, contingency, total } = costData

  const downloadCSV = () => {
    if (!costData) return

    const csvContent = [
      ["COST ESTIMATION REPORT"],
      [],
      ["PROJECT DETAILS"],
      ["City", projectDetails.city],
      ["Authority", projectDetails.authority],
      ["Plot Size", projectDetails.plotSize],
      ["Plot Dimensions", `${projectDetails.length}ft × ${projectDetails.width}ft`],
      ["Number of Floors", projectDetails.floors],
      ["Plot Area", `${projectDetails.plotArea.toLocaleString()} sq.ft`],
      ["Total Construction Area", `${projectDetails.totalArea.toLocaleString()} sq.ft`],
      [],
      ["COST BREAKDOWN"],
      ["Item", "Rate (PKR/sq.ft)", "Area (sq.ft)", "Total Amount (PKR)"],
      [structural.label, structural.rate, structural.area, structural.amount],
      [electrical.label, electrical.rate, electrical.area, electrical.amount],
      [plumbing.label, plumbing.rate, plumbing.area, plumbing.amount],
      [finishing.label, finishing.rate, finishing.area, finishing.amount],
      [contingency.label, "-", "-", contingency.amount],
      [],
      ["TOTAL ESTIMATED COST", "", "", total],
      ["Cost per Sq.Ft", "", "", (total / projectDetails.totalArea).toFixed(2)],
      ["Cost in Millions (PKR)", "", "", (total / 1000000).toFixed(2)],
      [],
      ["Generated on", new Date().toLocaleString()],
    ]

    const csvString = csvContent
      .map((row) =>
        row
          .map((cell) => {
            const cellStr = String(cell).replace(/"/g, '""')
            return cellStr.includes(",") || cellStr.includes('"') ? `"${cellStr}"` : cellStr
          })
          .join(","),
      )
      .join("\n")

    const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    link.href = URL.createObjectURL(blob)
    link.download = `cost-estimate-${new Date().getTime()}.csv`
    link.click()
  }

  const saveToProjects = async () => {
    setSaving(true)
    try {
      const projectData = {
        name: `Cost Estimate - ${costData.projectDetails.plotSize}`,
        type: "cost_estimate",
        data: costData,
        createdAt: new Date().toISOString(),
        totalCost: costData.total,
      }

      await new Promise((resolve) => setTimeout(resolve, 1000))

      const projects = JSON.parse(localStorage.getItem("projects") || "[]")
      projects.push(projectData)
      localStorage.setItem("projects", JSON.stringify(projects))

      alert("Cost estimate saved to My Projects successfully!")
      router.push("/my-projects")
    } catch (error) {
      console.error("Error saving project:", error)
      alert("Failed to save project")
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-slate-900 py-8 px-4 overflow-hidden">
      {/* Background layers */}
      <StarsBackground />
      <ThreeDBackground />

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center flex-col md:flex-row gap-4">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-gradient-to-r from-yellow-400 via-pink-400 to-purple-400 bg-clip-text">
              Cost Estimation Summary
            </h1>
            <p className="text-gray-400 mt-1">Generated on {new Date().toLocaleString()}</p>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push("/cost-estimator")}
            className="gap-2 border-2 border-purple-400 text-white bg-slate-800 hover:bg-slate-700 hover:border-pink-400 h-11"
          >
            <Home className="h-4 w-4" />
            Back to Calculator
          </Button>
        </div>

        {/* Project Details Card */}
        <Card className="border-2 border-purple-400 bg-slate-800/60 backdrop-blur-md shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white rounded-t-lg border-b border-purple-400/30">
            <CardTitle className="text-white">Project Details</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-400">City</p>
                <p className="text-lg font-semibold text-yellow-300">{projectDetails.city}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Authority</p>
                <p className="text-lg font-semibold text-yellow-300">{projectDetails.authority}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Plot Size</p>
                <p className="text-lg font-semibold text-yellow-300">{projectDetails.plotSize}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Dimensions</p>
                <p className="text-lg font-semibold text-yellow-300">
                  {projectDetails.length}ft × {projectDetails.width}ft
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Floors</p>
                <p className="text-lg font-semibold text-yellow-300">{projectDetails.floors}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Plot Area</p>
                <p className="text-lg font-semibold text-yellow-300">
                  {projectDetails.plotArea.toLocaleString()} sq.ft
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Construction Area</p>
                <p className="text-lg font-semibold text-yellow-300">
                  {projectDetails.totalArea.toLocaleString()} sq.ft
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cost Breakdown */}
        <Card className="border-2 border-pink-400 bg-slate-800/80 backdrop-blur-md shadow-2xl">
          <CardHeader className="bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 text-slate-900 rounded-t-lg border-b border-pink-400/30">
            <CardTitle className="text-slate-900 text-xl flex items-center gap-2 font-bold">
              <DollarSign className="h-6 w-6" />
              Cost Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4 text-white">
            {/* Individual costs */}
            <div className="space-y-3">
              <div className="flex justify-between items-center p-4 bg-slate-700/60 rounded-lg border border-purple-400/40">
                <div>
                  <p className="font-semibold text-yellow-300">{structural.label}</p>
                  <p className="text-sm text-gray-400">
                    PKR {structural.rate.toLocaleString()}/sq.ft × {structural.area.toLocaleString()} sq.ft
                  </p>
                </div>
                <p className="text-xl font-bold text-pink-300">
                  PKR {structural.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-700/60 rounded-lg border border-purple-400/40">
                <div>
                  <p className="font-semibold text-yellow-300">{electrical.label}</p>
                  <p className="text-sm text-gray-400">
                    PKR {electrical.rate.toLocaleString()}/sq.ft × {electrical.area.toLocaleString()} sq.ft
                  </p>
                </div>
                <p className="text-xl font-bold text-blue-300">
                  PKR {electrical.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-700/60 rounded-lg border border-purple-400/40">
                <div>
                  <p className="font-semibold text-yellow-300">{plumbing.label}</p>
                  <p className="text-sm text-gray-400">
                    PKR {plumbing.rate.toLocaleString()}/sq.ft × {plumbing.area.toLocaleString()} sq.ft
                  </p>
                </div>
                <p className="text-xl font-bold text-cyan-300">
                  PKR {plumbing.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-700/60 rounded-lg border border-purple-400/40">
                <div>
                  <p className="font-semibold text-yellow-300">{finishing.label}</p>
                  <p className="text-sm text-gray-400">
                    PKR {finishing.rate.toLocaleString()}/sq.ft × {finishing.area.toLocaleString()} sq.ft
                  </p>
                </div>
                <p className="text-xl font-bold text-orange-300">
                  PKR {finishing.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>

              <div className="flex justify-between items-center p-4 bg-slate-700/60 rounded-lg border border-purple-400/40">
                <div>
                  <p className="font-semibold text-yellow-300">{contingency.label}</p>
                  <p className="text-sm text-gray-400">Contingency buffer</p>
                </div>
                <p className="text-xl font-bold text-purple-300">
                  PKR {contingency.amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            <Separator className="bg-purple-400/30" />

            {/* Total Cost */}
            <div className="p-6 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 rounded-xl shadow-lg text-slate-900">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Total Estimated Cost</p>
                  <p className="text-xs opacity-80 mt-1">
                    {projectDetails.totalArea.toLocaleString()} sq.ft × PKR{" "}
                    {(total / projectDetails.totalArea).toLocaleString(undefined, { maximumFractionDigits: 0 })}/sq.ft
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold">
                    PKR {total.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </p>
                  <p className="text-sm opacity-80 mt-1">≈ PKR {(total / 1000000).toFixed(2)} Million</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 justify-end flex-col md:flex-row">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="gap-2 h-11 border-2 border-purple-400 text-white bg-slate-800 hover:bg-slate-700 hover:border-pink-400"
          >
            <Download className="h-4 w-4" />
            Download as CSV
          </Button>
          <Button
            onClick={saveToProjects}
            className="gap-2 h-11 bg-gradient-to-r from-yellow-500 via-pink-500 to-purple-600 hover:from-yellow-600 hover:via-pink-600 hover:to-purple-700 text-slate-900 font-semibold shadow-lg transition-all"
            disabled={saving}
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save to My Projects"}
          </Button>
        </div>

        {/* Info Alert */}
        <Alert className="bg-slate-800/80 border-2 border-purple-400">
          <AlertTriangle className="h-4 w-4 text-yellow-400" />
          <AlertTitle className="text-yellow-300">Important Note</AlertTitle>
          <AlertDescription className="text-gray-300">
            This is an estimated cost based on current market rates in your area. Actual costs may vary depending on
            material quality, labor availability, site conditions, and market fluctuations. Please consult with local
            contractors for accurate quotes.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
