"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send, MessageCircle, X, Check } from "lucide-react"
import { GenerateScreenBackground } from "@/components/generate-screen-background"

interface Message {
  role: "user" | "assistant"
  content: string
}

// Floating chatbot version (for overlay use)
export function SimpleAIChatbot({
  isOpen,
  onClose,
  onModificationRequest,
}: {
  isOpen: boolean
  onClose: () => void
  onModificationRequest?: (request: string) => void
}) {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI floorplan assistant. I can help you modify your generated floorplan based on your preferences. What changes would you like to make?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const aiResponse: Message = {
        role: "assistant",
        content: `I'll help you with: "${input}". This modification will be applied to your floorplan.`,
      }
      setMessages((prev) => [...prev, aiResponse])
      onModificationRequest?.(input)
    } catch (error) {
      console.error("[v0] Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-4 right-4 w-96 h-96 shadow-2xl z-50 flex flex-col bg-slate-800/95 border-purple-400/50 backdrop-blur-sm">
      <CardHeader className="flex flex-row items-center justify-between pb-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-t-lg">
        <div className="flex items-center gap-2">
          <MessageCircle className="h-5 w-5 text-white" />
          <CardTitle className="text-lg text-white">AI Assistant</CardTitle>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose} className="text-white hover:bg-white/20">
          <X className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col overflow-hidden p-4">
        <ScrollArea className="flex-1 mb-4 pr-4">
          <div className="space-y-4">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                      : "bg-slate-700 text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-slate-700 text-gray-200 p-3 rounded-lg rounded-bl-none">
                  <div className="flex gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
        <div className="flex gap-2">
          <Input
            placeholder="Type your modification..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            disabled={isLoading}
            className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400"
          />
          <Button
            size="icon"
            onClick={handleSendMessage}
            disabled={isLoading || !input.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

// Inline chatbot version (embedded in form)
interface InlineChatbotProps {
  mode: "preference" | "modify"
  onComplete: (response: string) => void
  isAnswered: boolean
}

export function InlineAIChatbot({ mode, onComplete, isAnswered }: InlineChatbotProps) {
  const [input, setInput] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const question =
    mode === "preference"
      ? "What's your top priority for this floorplan? (e.g., natural light, privacy, open concept, storage)"
      : "What would you like to modify in your floorplan?"

  const handleSubmit = () => {
    if (!input.trim()) return
    setSubmitted(true)
    onComplete(input)
  }

  if (isAnswered || submitted) {
    return (
      <div className="bg-slate-700/50 p-4 rounded-xl border border-green-500/30">
        <div className="flex items-center gap-2 text-green-400 mb-2">
          <Check className="h-5 w-5" />
          <span className="font-medium">Response recorded</span>
        </div>
        <p className="text-gray-300 text-sm">Your preference: "{input}"</p>
      </div>
    )
  }

  return (
    <div className="bg-slate-700/50 p-6 rounded-xl border border-purple-400/30">
      <div className="flex items-start gap-3 mb-4">
        <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
          <MessageCircle className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-white font-medium">AI Assistant</p>
          <p className="text-gray-300 text-sm mt-1">{question}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Input
          placeholder="Type your response..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSubmit()}
          className="bg-slate-800 border-slate-600 text-white placeholder:text-gray-400"
        />
        <Button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
        >
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

// Full-page chatbot screen with 3D background
export function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI floorplan assistant. I can help you modify your generated floorplan based on your preferences. What changes would you like to make?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = async () => {
    if (!input.trim()) return

    const userMessage: Message = { role: "user", content: input }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const aiResponse: Message = {
        role: "assistant",
        content: `I'll help you with: "${input}". This modification will be applied to your floorplan. Is there anything else you'd like to change?`,
      }
      setMessages((prev) => [...prev, aiResponse])
    } catch (error) {
      console.error("[v0] Chat error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <GenerateScreenBackground />

      {/* Content layer */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        <Card className="w-full max-w-2xl h-[600px] shadow-2xl flex flex-col bg-slate-800/80 border-purple-400/50 backdrop-blur-md">
          <CardHeader className="bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-t-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-lg">
                <MessageCircle className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl text-white">AI Floorplan Assistant</CardTitle>
                <p className="text-sm text-white/80">Ask me anything about your floorplan</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col overflow-hidden p-6">
            <ScrollArea className="flex-1 mb-4 pr-4">
              <div className="space-y-4">
                {messages.map((msg, idx) => (
                  <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`max-w-md p-4 rounded-2xl ${
                        msg.role === "user"
                          ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
                          : "bg-slate-700 text-gray-200 rounded-bl-none border border-slate-600"
                      }`}
                    >
                      <p className="text-sm leading-relaxed">{msg.content}</p>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-slate-700 text-gray-200 p-4 rounded-2xl rounded-bl-none border border-slate-600">
                      <div className="flex gap-2">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.1s" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0.2s" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <div className="flex gap-3 pt-4 border-t border-slate-700">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                disabled={isLoading}
                className="bg-slate-700 border-slate-600 text-white placeholder:text-gray-400 h-12"
              />
              <Button
                onClick={handleSendMessage}
                disabled={isLoading || !input.trim()}
                className="h-12 px-6 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
