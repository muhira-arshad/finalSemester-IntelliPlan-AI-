"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Mail, Lock, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { AnimatedAuthBackground } from "@/components/animated-auth-background"
import Image from "next/image"

export default function SignInPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signIn, signInWithGoogle, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const [showResendVerification, setShowResendVerification] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })

  useEffect(() => {
    const urlMessage = searchParams.get("message")
    const error = searchParams.get("error")

    if (urlMessage) {
      setMessage(urlMessage)
      setMessageType("success")
    } else if (error) {
      setMessage("Authentication failed. Please try again.")
      setMessageType("error")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)
    setMessage("")
    setShowResendVerification(false)

    try {
      console.log("🚀 Starting sign in process...")

      const { error } = await signIn(formData.email, formData.password)

      if (error) {
        console.error("🔥 Sign in failed:", error.message)

        if (error.message.includes("Invalid login credentials")) {
          setMessage("Invalid email or password. Please check your credentials.")
        } else if (error.message.includes("Email not confirmed")) {
          setMessage("Please verify your email address before signing in. Check your inbox for a verification email.")
          setShowResendVerification(true)
        } else if (error.message.includes("Too many requests")) {
          setMessage("Too many sign-in attempts. Please wait a moment and try again.")
        } else {
          setMessage(error.message)
        }
        setMessageType("error")
      } else {
        console.log("✅ Sign in successful, redirect should happen automatically")
        setMessage("Sign in successful! Redirecting...")
        setMessageType("success")
      }
    } catch (error: any) {
      console.error("💥 Unexpected error during sign in:", error)
      setMessage("An unexpected error occurred. Please try again.")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setIsLoading(true)
    setMessage("")

    try {
      const { error } = await signInWithGoogle()
      if (error) {
        setMessage(error.message)
        setMessageType("error")
      }
    } catch (error) {
      setMessage("Failed to sign in with Google")
      setMessageType("error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (message) setMessage("")
  }

  const handleResendVerification = () => {
    localStorage.setItem(`email_confirmed_${formData.email}`, "true")
    setMessage("Email verified successfully! You can now sign in.")
    setMessageType("success")
    setShowResendVerification(false)
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-black text-white p-4 lg:p-8">
      <AnimatedAuthBackground />

      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-gray-950/80"
      >
        {/* Left Section: Marketing */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:w-1/2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 flex flex-col justify-center items-center text-center lg:text-left lg:items-start min-h-[300px] lg:min-h-[700px] relative"
        >
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3, type: "spring", stiffness: 100 }}
              className="mb-8"
            >
              <div className="flex flex-col items-center lg:items-start">
                <Image src="/images/logo.png" alt="IntelliPlan AI Logo" width={350} height={250} className="mb-4" />
                
              </div>
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-4xl md:text-5xl font-bold leading-tight text-white max-w-md mb-6"
            >
              Welcome Back to <br />
              <span className="text-yellow-400">IntelliPlan AI</span>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="text-lg text-gray-300 max-w-md"
            >
              Continue creating amazing floor plans with the power of artificial intelligence.
            </motion.p>
          </div>
        </motion.div>

        {/* Right Section: Sign In Form */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="lg:w-1/2"
        >
          <Card className="bg-gray-900/90 text-white border-none rounded-none p-8 shadow-lg backdrop-blur-sm h-full">
            <CardHeader className="text-center lg:text-left">
              <motion.div
                initial={{ opacity: 0, y: -15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold text-white mb-2">Sign In</CardTitle>
                <CardDescription className="text-gray-400 text-lg">
                  Welcome back! Please sign in to your account
                </CardDescription>
              </motion.div>
            </CardHeader>

            <CardContent className="space-y-6">
              <AnimatePresence>
                {message && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert variant={messageType === "error" ? "destructive" : "default"} className="border-gray-700">
                      {messageType === "success" ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <AlertCircle className="h-4 w-4" />
                      )}
                      <AlertDescription>
                        {message}
                        {showResendVerification && (
                          <div className="mt-3">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={handleResendVerification}
                              className="bg-yellow-500/10 border-yellow-500 text-yellow-400 hover:bg-yellow-500/20"
                            >
                              Verify Email (Demo)
                            </Button>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}
              </AnimatePresence>

              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="space-y-2"
                >
                  <Label htmlFor="email" className="text-gray-300">
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.7 }}
                  className="space-y-2"
                >
                  <Label htmlFor="password" className="text-gray-300">
                    Password
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => handleInputChange("password", e.target.value)}
                      className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                      required
                      disabled={isLoading}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-gray-300"
                      onClick={() => setShowPassword(!showPassword)}
                      disabled={isLoading}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.8 }}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="remember"
                      className="rounded bg-gray-800 border-gray-600 text-yellow-400 focus:ring-yellow-400"
                    />
                    <Label htmlFor="remember" className="text-sm text-gray-300">
                      Remember me
                    </Label>
                  </div>
                  <Link href="/auth/forgot-password" className="text-sm text-yellow-400 hover:underline font-medium">
                    Forgot password?
                  </Link>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                    disabled={isLoading || authLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Signing In...
                      </>
                    ) : (
                      "Sign In"
                    )}
                  </Button>
                </motion.div>
              </motion.form>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1 }}
                className="relative"
              >
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full bg-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-gray-900 px-2 text-gray-400">Or continue with</span>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 1.1 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full bg-gray-800/50 border-gray-600 text-white hover:bg-gray-700/50 transition-all duration-300 transform hover:scale-105"
                  onClick={handleGoogleSignIn}
                  disabled={isLoading || authLoading}
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                      <path
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                        fill="#4285F4"
                      />
                      <path
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                        fill="#34A853"
                      />
                      <path
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                        fill="#FBBC05"
                      />
                      <path
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                        fill="#EA4335"
                      />
                    </svg>
                  )}
                  Continue with Google
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                className="text-center text-sm text-gray-400"
              >
                Don't have an account?{" "}
                <Link href="/auth/signup" className="text-yellow-400 hover:underline font-medium">
                  Sign up
                </Link>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </div>
  )
}
