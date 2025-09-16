"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Loader2, Send, Bot, User, CheckCircle, AlertTriangle } from 'lucide-react'
import { Alert, AlertDescription } from "@/components/ui/alert"

interface Message {
  id: string
  type: "bot" | "user"
  content: string
  timestamp: Date
  options?: string[]
  isTyping?: boolean
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

type ConversationStep =
  | "welcome"
  | "authority"
  | "plotSize"
  | "dimensions"
  | "orientation"
  | "facing"
  | "shape"
  | "floors"
  | "bedrooms"
  | "bathrooms"
  | "livingAreas"
  | "kitchen"
  | "serviceAreas"
  | "outdoorSpaces"
  | "specialFeatures"
  | "notes"
  | "generating"
  | "complete"

export default function HousePlanChatbot() {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentStep, setCurrentStep] = useState<ConversationStep>("welcome")
  const [userInput, setUserInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [backendOptions, setBackendOptions] = useState<BackendOptions | null>(null)
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
  const [connectionStatus, setConnectionStatus] = useState<"connecting" | "connected" | "fallback">("connecting")
  const [generatedPlan, setGeneratedPlan] = useState<any>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    fetchBackendOptions()
  }, [])

  useEffect(() => {
    if (backendOptions && messages.length === 0) {
      startConversation()
    }
  }, [backendOptions])

  const fetchBackendOptions = async () => {
    try {
      setConnectionStatus("connecting")
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch(`${apiUrl}/api/form-options`, {
        signal: controller.signal,
        headers: { "Content-Type": "application/json" },
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const data = await response.json()
      setBackendOptions(data)
      setConnectionStatus("connected")
    } catch (err) {
      console.log("[v0] Backend connection failed:", err)
      setConnectionStatus("fallback")
      // Use minimal fallback data
      setBackendOptions({
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
            },
          },
        },
        global_options: {
          orientation: ["North", "South", "East", "West"],
          facing: ["Standard", "Park", "Corner", "Double Road"],
          shape: ["Regular", "Irregular"],
        },
      })
    }
  }

  const addMessage = (type: "bot" | "user", content: string, options?: string[]) => {
    const uniqueId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`

    const message: Message = {
      id: uniqueId,
      type,
      content,
      timestamp: new Date(),
      options,
      isTyping: type === "bot",
    }

    setMessages((prev) => [...prev, message])

    if (type === "bot") {
      // Simulate typing effect
      setTimeout(() => {
        setMessages((prev) => prev.map((msg) => (msg.id === message.id ? { ...msg, isTyping: false } : msg)))
      }, 1000)
    }
  }

  const startConversation = () => {
    addMessage(
      "bot",
      "👋 Hello! I'm your House Plan Assistant. I'll help you generate a custom floor plan by asking you a few questions step by step. Let's start!",
    )

    setTimeout(() => {
      const authorities = Object.keys(backendOptions?.authorities || {})
      addMessage("bot", "Which building authority's regulations would you like to follow?", authorities)
      setCurrentStep("authority")
    }, 1500)
  }

  const handleUserResponse = async (response: string) => {
    addMessage("user", response)
    setUserInput("")
    setIsLoading(true)

    // Process response based on current step
    await processStep(currentStep, response)

    setIsLoading(false)
  }

  const processStep = async (step: ConversationStep, response: string) => {
    switch (step) {
      case "authority":
        const authorities = Object.keys(backendOptions?.authorities || {})
        if (authorities.includes(response)) {
          setFormData((prev) => ({ ...prev, authority: response }))
          addMessage("bot", `Great! You've selected ${response}. Now, what's your plot size?`)

          const plotSizes = Object.keys(backendOptions?.authorities?.[response]?.plot_sizes || {})
          const formattedSizes = plotSizes.map((size) =>
            size.replace("-", " ").replace(/\b\w/g, (l) => l.toUpperCase()),
          )
          addMessage("bot", "Please choose from these available plot sizes:", formattedSizes)
          setCurrentStep("plotSize")
        } else {
          addMessage("bot", "Please select a valid authority from the options provided.")
        }
        break

      case "plotSize":
        const plotSizes = Object.keys(backendOptions?.authorities?.[formData.authority]?.plot_sizes || {})
        const normalizedResponse = response.toLowerCase().replace(" ", "-")

        if (plotSizes.includes(normalizedResponse)) {
          setFormData((prev) => ({ ...prev, plotSize: normalizedResponse }))
          addMessage("bot", `Perfect! You've selected ${response}. Now I need the dimensions of your plot.`)
          addMessage("bot", "What's the front dimension of your plot in feet? (e.g., 25)")
          setCurrentStep("dimensions")
        } else {
          addMessage("bot", "Please select a valid plot size from the options provided.")
        }
        break

      case "dimensions":
        if (!formData.dimensions.front) {
          const frontDim = Number.parseFloat(response)
          if (frontDim > 0) {
            setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, front: response } }))
            addMessage("bot", `Got it! Front dimension is ${response} feet. Now, what's the depth dimension in feet?`)
          } else {
            addMessage("bot", "Please enter a valid positive number for the front dimension.")
          }
        } else {
          const depthDim = Number.parseFloat(response)
          if (depthDim > 0) {
            setFormData((prev) => ({ ...prev, dimensions: { ...prev.dimensions, depth: response } }))
            addMessage(
              "bot",
              `Excellent! Your plot is ${formData.dimensions.front}' x ${response}'. What's the orientation of your plot?`,
            )
            addMessage(
              "bot",
              "Choose the orientation:",
              backendOptions?.global_options?.orientation || ["North", "South", "East", "West"],
            )
            setCurrentStep("orientation")
          } else {
            addMessage("bot", "Please enter a valid positive number for the depth dimension.")
          }
        }
        break

      case "orientation":
        const orientations = backendOptions?.global_options?.orientation || []
        if (orientations.includes(response)) {
          setFormData((prev) => ({ ...prev, orientation: response }))
          addMessage("bot", `Great! ${response} orientation selected. What type of facing does your plot have?`)
          addMessage(
            "bot",
            "Choose the facing type:",
            backendOptions?.global_options?.facing || ["Standard", "Park", "Corner", "Double Road"],
          )
          setCurrentStep("facing")
        } else {
          addMessage("bot", "Please select a valid orientation from the options provided.")
        }
        break

      case "facing":
        const facingOptions = backendOptions?.global_options?.facing || []
        if (facingOptions.includes(response)) {
          setFormData((prev) => ({ ...prev, facing: response }))
          addMessage("bot", `Perfect! ${response} facing noted. How many floors do you want?`)

          const plotData = backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]
          const maxFloors = plotData?.max_floors || 3
          addMessage("bot", `Enter number of floors (1 to ${maxFloors}):`)
          setCurrentStep("floors")
        } else {
          addMessage("bot", "Please select a valid facing type from the options provided.")
        }
        break

      case "floors":
        const floors = Number.parseInt(response)
        const plotData = backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]
        const maxFloors = plotData?.max_floors || 3

        if (floors >= 1 && floors <= maxFloors) {
          setFormData((prev) => ({ ...prev, floors: response }))
          addMessage("bot", `${response} floor${floors > 1 ? "s" : ""} it is! Now, how many bedrooms do you need?`)

          const bedroomRange = plotData?.bedrooms
          if (bedroomRange) {
            addMessage("bot", `Enter number of bedrooms (${bedroomRange.min} to ${bedroomRange.max}):`)
          }
          setCurrentStep("bedrooms")
        } else {
          addMessage("bot", `Please enter a valid number of floors between 1 and ${maxFloors}.`)
        }
        break

      case "bedrooms":
        const bedrooms = Number.parseInt(response)
        const bedroomRange =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.bedrooms

        if (bedroomRange && bedrooms >= bedroomRange.min && bedrooms <= bedroomRange.max) {
          setFormData((prev) => ({ ...prev, bedrooms }))
          addMessage(
            "bot",
            `${bedrooms} bedroom${bedrooms > 1 ? "s" : ""} noted! How many bathrooms/washrooms do you need?`,
          )

          const bathroomRange =
            backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.washrooms
          if (bathroomRange) {
            addMessage("bot", `Enter number of bathrooms (${bathroomRange.min} to ${bathroomRange.max}):`)
          }
          setCurrentStep("bathrooms")
        } else {
          addMessage(
            "bot",
            `Please enter a valid number of bedrooms between ${bedroomRange?.min || 1} and ${bedroomRange?.max || 3}.`,
          )
        }
        break

      case "bathrooms":
        const bathrooms = Number.parseInt(response)
        const bathroomRange =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.washrooms

        if (bathroomRange && bathrooms >= bathroomRange.min && bathrooms <= bathroomRange.max) {
          setFormData((prev) => ({ ...prev, bathrooms }))
          addMessage(
            "bot",
            `${bathrooms} bathroom${bathrooms > 1 ? "s" : ""} perfect! Now, what living areas would you like?`,
          )

          const livingAreas =
            backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.living_areas || []
          addMessage(
            "bot",
            "Select living areas (you can choose multiple by typing them separated by commas, or type 'none' to skip):",
            livingAreas,
          )
          setCurrentStep("livingAreas")
        } else {
          addMessage(
            "bot",
            `Please enter a valid number of bathrooms between ${bathroomRange?.min || 1} and ${bathroomRange?.max || 3}.`,
          )
        }
        break

      case "livingAreas":
        const availableLivingAreas =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.living_areas || []

        if (response.toLowerCase() === "none") {
          setFormData((prev) => ({ ...prev, livingAreas: [] }))
          addMessage("bot", "No living areas selected. What type of kitchen would you like?")
        } else {
          const selectedAreas = response
            .split(",")
            .map((area) => area.trim())
            .filter((area) =>
              availableLivingAreas.some((available) => available.toLowerCase().includes(area.toLowerCase())),
            )

          if (selectedAreas.length > 0) {
            setFormData((prev) => ({ ...prev, livingAreas: selectedAreas }))
            addMessage(
              "bot",
              `Great! Selected living areas: ${selectedAreas.join(", ")}. What type of kitchen would you like?`,
            )
          } else {
            addMessage("bot", "Please select valid living areas from the options provided, or type 'none' to skip.")
            return
          }
        }

        const kitchenTypes =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.kitchen_types || []
        addMessage(
          "bot",
          "Select kitchen types (you can choose multiple by typing them separated by commas, or type 'none' to skip):",
          kitchenTypes,
        )
        setCurrentStep("kitchen")
        break

      case "kitchen":
        const availableKitchens =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.kitchen_types || []

        if (response.toLowerCase() === "none") {
          setFormData((prev) => ({ ...prev, kitchen: [] }))
          addMessage("bot", "No kitchen selected. What service areas would you like?")
        } else {
          const selectedKitchens = response
            .split(",")
            .map((kitchen) => kitchen.trim())
            .filter((kitchen) =>
              availableKitchens.some((available) => available.toLowerCase().includes(kitchen.toLowerCase())),
            )

          if (selectedKitchens.length > 0) {
            setFormData((prev) => ({ ...prev, kitchen: selectedKitchens }))
            addMessage(
              "bot",
              `Perfect! Selected kitchens: ${selectedKitchens.join(", ")}. What service areas would you like?`,
            )
          } else {
            addMessage("bot", "Please select valid kitchen types from the options provided, or type 'none' to skip.")
            return
          }
        }

        const serviceAreas =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.service_areas || []
        addMessage(
          "bot",
          "Select service areas (you can choose multiple by typing them separated by commas, or type 'none' to skip):",
          serviceAreas,
        )
        setCurrentStep("serviceAreas")
        break

      case "serviceAreas":
        const availableServiceAreas =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.service_areas || []

        if (response.toLowerCase() === "none") {
          setFormData((prev) => ({ ...prev, serviceAreas: [] }))
          addMessage("bot", "No service areas selected. What outdoor spaces would you like?")
        } else {
          const selectedServiceAreas = response
            .split(",")
            .map((area) => area.trim())
            .filter((area) =>
              availableServiceAreas.some((available) => available.toLowerCase().includes(area.toLowerCase())),
            )

          if (selectedServiceAreas.length > 0) {
            setFormData((prev) => ({ ...prev, serviceAreas: selectedServiceAreas }))
            addMessage(
              "bot",
              `Excellent! Selected service areas: ${selectedServiceAreas.join(", ")}. What outdoor spaces would you like?`,
            )
          } else {
            addMessage("bot", "Please select valid service areas from the options provided, or type 'none' to skip.")
            return
          }
        }

        const outdoorSpaces =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.outdoor_spaces || []
        addMessage(
          "bot",
          "Select outdoor spaces (you can choose multiple by typing them separated by commas, or type 'none' to skip):",
          outdoorSpaces,
        )
        setCurrentStep("outdoorSpaces")
        break

      case "outdoorSpaces":
        const availableOutdoorSpaces =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.outdoor_spaces || []

        if (response.toLowerCase() === "none") {
          setFormData((prev) => ({ ...prev, outdoorSpaces: [] }))
          addMessage("bot", "No outdoor spaces selected. Any special features you'd like to include?")
        } else {
          const selectedOutdoorSpaces = response
            .split(",")
            .map((space) => space.trim())
            .filter((space) =>
              availableOutdoorSpaces.some((available) => available.toLowerCase().includes(space.toLowerCase())),
            )

          if (selectedOutdoorSpaces.length > 0) {
            setFormData((prev) => ({ ...prev, outdoorSpaces: selectedOutdoorSpaces }))
            addMessage(
              "bot",
              `Great! Selected outdoor spaces: ${selectedOutdoorSpaces.join(", ")}. Any special features you'd like to include?`,
            )
          } else {
            addMessage("bot", "Please select valid outdoor spaces from the options provided, or type 'none' to skip.")
            return
          }
        }

        const specialFeatures =
          backendOptions?.authorities?.[formData.authority]?.plot_sizes?.[formData.plotSize]?.special_features || []
        if (specialFeatures.length > 0) {
          addMessage(
            "bot",
            "Select special features (you can choose multiple by typing them separated by commas, or type 'none' to skip):",
            specialFeatures,
          )
        } else {
          addMessage("bot", "Type any special features you'd like, or 'none' to skip:")
        }
        setCurrentStep("specialFeatures")
        break

      case "specialFeatures":
        if (response.toLowerCase() === "none") {
          setFormData((prev) => ({ ...prev, specialFeatures: [] }))
          addMessage("bot", "No special features selected. Any additional notes or specific requirements?")
        } else {
          const features = response.split(",").map((feature) => feature.trim())
          setFormData((prev) => ({ ...prev, specialFeatures: features }))
          addMessage(
            "bot",
            `Special features noted: ${features.join(", ")}. Any additional notes or specific requirements?`,
          )
        }

        addMessage("bot", "Type your additional notes or requirements, or 'none' if you don't have any:")
        setCurrentStep("notes")
        break

      case "notes":
        const notes = response.toLowerCase() === "none" ? "" : response
        setFormData((prev) => ({ ...prev, notes }))

        if (notes) {
          addMessage("bot", `Notes recorded: "${notes}". Perfect! I have all the information I need.`)
        } else {
          addMessage("bot", "No additional notes. Perfect! I have all the information I need.")
        }

        addMessage("bot", "🏗️ Let me generate your custom floor plan now. This may take a moment...")
        setCurrentStep("generating")

        // Generate the plan
        await generateFloorPlan()
        break
    }
  }

  const generateFloorPlan = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000"

      const payload = {
        authority: formData.authority,
        plot_size: formData.plotSize,
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

      const response = await fetch(`${apiUrl}/api/generate-plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data = await response.json()

      if (response.ok) {
        setGeneratedPlan(data)
        addMessage("bot", "🎉 Your floor plan has been generated successfully! Here's a summary:")

        // Display summary
        const summary = data.summary
        addMessage(
          "bot",
          `📋 **Plan Summary:**
• Authority: ${summary.authority}
• Plot Size: ${summary.plotSize}
• Dimensions: ${summary.dimensions}
• Floors: ${summary.floors}
• Orientation: ${summary.orientation}
• Facing: ${summary.facing}`,
        )

        // Display rooms
        if (data.rooms && data.rooms.length > 0) {
          const roomsList = data.rooms
            .map((room: any) => `• ${room.name} - ${room.size} (Floor ${room.floor})`)
            .join("\n")
          addMessage("bot", `🏠 **Rooms:**\n${roomsList}`)
        }

        addMessage(
          "bot",
          "Your floor plan is ready! You can scroll up to see all the details, or start a new conversation if you'd like to generate another plan.",
        )
        setCurrentStep("complete")
      } else {
        addMessage(
          "bot",
          `❌ Sorry, there was an error generating your floor plan: ${data.error || "Unknown error"}. Would you like to try again?`,
        )
        setCurrentStep("complete")
      }
    } catch (error) {
      addMessage(
        "bot",
        "❌ Sorry, I couldn't connect to the server to generate your floor plan. Please make sure the backend server is running and try again.",
      )
      setCurrentStep("complete")
    }
  }

  const handleQuickResponse = (option: string) => {
    handleUserResponse(option)
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey && userInput.trim()) {
      e.preventDefault()
      handleUserResponse(userInput.trim())
    }
  }

  const resetConversation = () => {
    setMessages([])
    setCurrentStep("welcome")
    setFormData({
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
    setGeneratedPlan(null)
    startConversation()
  }

  return (
    <Card className="w-full max-w-4xl mx-auto h-[600px] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Bot className="h-6 w-6 text-blue-600" />
            <h3 className="font-semibold text-gray-900">House Plan Assistant</h3>
          </div>
          <div className="flex items-center space-x-2">
            {connectionStatus === "connected" && (
              <Badge variant="outline" className="text-green-600 border-green-200">
                <CheckCircle className="h-3 w-3 mr-1" />
                Connected
              </Badge>
            )}
            {connectionStatus === "fallback" && (
              <Badge variant="outline" className="text-orange-600 border-orange-200">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Offline Mode
              </Badge>
            )}
            {currentStep === "complete" && (
              <Button size="sm" variant="outline" onClick={resetConversation}>
                New Plan
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Connection Status Alert */}
      {connectionStatus === "fallback" && (
        <Alert className="m-4 border-orange-200 bg-orange-50">
          <AlertTriangle className="h-4 w-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            Using offline mode with limited options. Start Flask server for full functionality.
          </AlertDescription>
        </Alert>
      )}

      {/* Messages */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={`flex ${message.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`flex items-start space-x-2 max-w-[80%] ${message.type === "user" ? "flex-row-reverse space-x-reverse" : ""}`}
              >
                <div
                  className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {message.type === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                </div>

                <div
                  className={`rounded-lg p-3 ${
                    message.type === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-900"
                  }`}
                >
                  {message.isTyping ? (
                    <div className="flex items-center space-x-1">
                      <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  ) : (
                    <div className="whitespace-pre-wrap">{message.content}</div>
                  )}

                  {message.options && message.options.length > 0 && !message.isTyping && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <Button
                          key={index}
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                          onClick={() => handleQuickResponse(option)}
                          disabled={isLoading}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start space-x-2 max-w-[80%]">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 text-gray-600 flex items-center justify-center">
                  <Bot className="h-4 w-4" />
                </div>
                <div className="bg-gray-100 text-gray-900 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Thinking...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        <div ref={messagesEndRef} />
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t">
        <div className="flex space-x-2">
          <Input
            ref={inputRef}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              currentStep === "complete"
                ? "Conversation complete. Click 'New Plan' to start over."
                : "Type your response..."
            }
            disabled={isLoading || currentStep === "complete" || currentStep === "generating"}
            className="flex-1"
          />
          <Button
            onClick={() => handleUserResponse(userInput.trim())}
            disabled={!userInput.trim() || isLoading || currentStep === "complete" || currentStep === "generating"}
            size="icon"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  )
}
