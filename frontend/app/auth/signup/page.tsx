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
import { Eye, EyeOff, Mail, Lock, User, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { AnimatedAuthBackground } from "@/components/animated-auth-background"
import { EmailVerificationDialog } from "@/components/email-verification-dialog"
import Image from "next/image"

// Enhanced password validation function
const validatePassword = (password: string) => {
  const minLength = password.length >= 8
  const hasUppercase = /[A-Z]/.test(password)
  const hasLowercase = /[a-z]/.test(password)
  const hasNumber = /\d/.test(password)
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

  return {
    isValid: minLength && hasUppercase && hasLowercase && hasNumber && hasSpecialChar,
    requirements: {
      minLength,
      hasUppercase,
      hasLowercase,
      hasNumber,
      hasSpecialChar,
    },
  }
}

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { signUp, signInWithGoogle, isLoading: authLoading } = useAuth()

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "info">("info")
  const [showVerificationDialog, setShowVerificationDialog] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "male" as "male" | "female",
  })

  useEffect(() => {
    const urlMessage = searchParams.get("message")
    if (urlMessage) {
      setMessage(urlMessage)
      setMessageType("info")
    }
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation checks
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match!")
      setMessageType("error")
      return
    }

    const passwordValidation = validatePassword(formData.password)
    if (!passwordValidation.isValid) {
      setMessage("Password must meet all requirements listed below")
      setMessageType("error")
      return
    }

    // Trim and validate inputs
    const email = formData.email.trim().toLowerCase()
    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()

    if (!email || !firstName || !lastName) {
      setMessage("Please fill in all required fields")
      setMessageType("error")
      return
    }

    setIsLoading(true)
    setMessage("")

    try {
      console.log("🎯 Attempting signup with cleaned data:", { email, firstName, lastName, gender: formData.gender })

      const { error } = await signUp(email, formData.password, firstName, lastName, formData.gender)

      if (error) {
        console.error("🔥 Signup failed:", error)

        // Handle specific error cases with user-friendly messages
        if (error.message.includes("already registered") || error.message.includes("already been registered")) {
          setMessage("This email is already registered. Please use a different email or sign in instead.")
        } else if (error.message.includes("Database error")) {
          setMessage("There's a temporary issue with our system. Please try again in a few moments.")
        } else if (error.message.includes("Invalid email")) {
          setMessage("Please enter a valid email address.")
        } else {
          setMessage(`Signup failed: ${error.message}`)
        }
        setMessageType("error")
      } else {
        console.log("🎉 Signup successful!")
        // Show verification dialog
        setShowVerificationDialog(true)
        // Clear form
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          password: "",
          confirmPassword: "",
          gender: "male",
        })
      }
    } catch (error: any) {
      console.error("💥 Unexpected error during signup:", error)
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

  const handleVerificationDialogClose = () => {
    setShowVerificationDialog(false)
    router.push("/auth/signin")
  }

  const passwordValidation = validatePassword(formData.password)

  return (
    <>
      <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black text-white p-4 lg:p-8">
        <AnimatedAuthBackground />
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative z-10 flex flex-col lg:flex-row w-full max-w-6xl mx-auto rounded-2xl overflow-hidden shadow-2xl backdrop-blur-sm bg-gray-950/80"
        >
          {/* Left Section: Marketing */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="lg:w-1/2 bg-gradient-to-br from-purple-900/50 to-blue-900/50 p-8 flex flex-col justify-center items-center text-center lg:text-left lg:items-start min-h-[300px] lg:min-h-[700px] relative"
          >
            <div className="relative z-10">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.8, delay: 0.5, type: "spring" }}
                className="mb-8"
              >
                <div className="flex flex-col items-center lg:items-start">
                  <Image
                    src="/images/intelliplan-logo.jpg"
                    alt="IntelliPlan AI Logo"
                    width={200}
                    height={80}
                    className="mb-4"
                  />
                  <div className="text-2xl font-semibold text-white">IntelliPlan AI</div>
                </div>
              </motion.div>
              <motion.h1
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.7 }}
                className="text-4xl md:text-5xl font-bold leading-tight text-white max-w-md mb-6"
              >
                Create Your Future <br />
                <span className="text-yellow-400">Living Spaces</span>
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.9 }}
                className="text-lg text-gray-300 max-w-md"
              >
                Join thousands of architects and designers using AI to revolutionize floor plan creation.
              </motion.p>
            </div>
          </motion.div>

          {/* Right Section: Sign Up Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="lg:w-1/2"
          >
            <Card className="bg-gray-900/90 text-white border-none rounded-none p-8 shadow-lg backdrop-blur-sm h-full">
              <CardHeader className="text-center lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.6 }}
                >
                  <CardTitle className="text-3xl font-bold text-white mb-2">Create Account</CardTitle>
                  <CardDescription className="text-gray-400 text-lg">
                    Join IntelliPlan AI and start creating amazing floor plans
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
                        <AlertDescription>{message}</AlertDescription>
                      </Alert>
                    </motion.div>
                  )}
                </AnimatePresence>

                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.8 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="firstName" className="text-gray-300">
                        First Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="firstName"
                          type="text"
                          placeholder="First name"
                          value={formData.firstName}
                          onChange={(e) => handleInputChange("firstName", e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                          required
                          disabled={isLoading}
                          maxLength={50}
                        />
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: 1.1 }}
                      className="space-y-2"
                    >
                      <Label htmlFor="lastName" className="text-gray-300">
                        Last Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          id="lastName"
                          type="text"
                          placeholder="Last name"
                          value={formData.lastName}
                          onChange={(e) => handleInputChange("lastName", e.target.value)}
                          className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                          required
                          disabled={isLoading}
                          maxLength={50}
                        />
                      </div>
                    </motion.div>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
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
                        maxLength={100}
                      />
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.25 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="gender" className="text-gray-300">
                      Gender
                    </Label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => handleInputChange("gender", "male")}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          formData.gender === "male"
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                        }`}
                        disabled={isLoading}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-blue-400" />
                          </div>
                          <span className="text-sm font-medium">Male</span>
                        </div>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleInputChange("gender", "female")}
                        className={`p-3 rounded-lg border transition-all duration-300 ${
                          formData.gender === "female"
                            ? "border-yellow-400 bg-yellow-400/10 text-yellow-400"
                            : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                        }`}
                        disabled={isLoading}
                      >
                        <div className="flex flex-col items-center space-y-2">
                          <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-pink-400" />
                          </div>
                          <span className="text-sm font-medium">Female</span>
                        </div>
                      </button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.3 }}
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
                        placeholder="Create a password"
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
                    {/* Password Requirements */}
                    {formData.password && (
                      <div className="text-xs space-y-1 mt-2">
                        <div className="text-gray-400">Password must contain:</div>
                        <div
                          className={`flex items-center space-x-2 ${passwordValidation.requirements.minLength ? "text-green-400" : "text-red-400"}`}
                        >
                          <span>{passwordValidation.requirements.minLength ? "✓" : "✗"}</span>
                          <span>At least 8 characters</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${passwordValidation.requirements.hasUppercase ? "text-green-400" : "text-red-400"}`}
                        >
                          <span>{passwordValidation.requirements.hasUppercase ? "✓" : "✗"}</span>
                          <span>One uppercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${passwordValidation.requirements.hasLowercase ? "text-green-400" : "text-red-400"}`}
                        >
                          <span>{passwordValidation.requirements.hasLowercase ? "✓" : "✗"}</span>
                          <span>One lowercase letter</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${passwordValidation.requirements.hasNumber ? "text-green-400" : "text-red-400"}`}
                        >
                          <span>{passwordValidation.requirements.hasNumber ? "✓" : "✗"}</span>
                          <span>One number</span>
                        </div>
                        <div
                          className={`flex items-center space-x-2 ${passwordValidation.requirements.hasSpecialChar ? "text-green-400" : "text-red-400"}`}
                        >
                          <span>{passwordValidation.requirements.hasSpecialChar ? "✓" : "✗"}</span>
                          <span>One special character</span>
                        </div>
                      </div>
                    )}
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                    className="space-y-2"
                  >
                    <Label htmlFor="confirmPassword" className="text-gray-300">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                        className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400 transition-all duration-300"
                        required
                        disabled={isLoading}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-gray-500 hover:text-gray-300"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        disabled={isLoading}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.5 }}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      id="terms"
                      className="rounded bg-gray-800 border-gray-600 text-yellow-400 focus:ring-yellow-400"
                      required
                      disabled={isLoading}
                    />
                    <Label htmlFor="terms" className="text-sm text-gray-300">
                      I agree to the{" "}
                      <Link href="/terms" className="text-yellow-400 hover:underline">
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link href="/privacy" className="text-yellow-400 hover:underline">
                        Privacy Policy
                      </Link>
                    </Label>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 1.6 }}
                  >
                    <Button
                      type="submit"
                      className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold py-3 transition-all duration-300 transform hover:scale-105"
                      disabled={isLoading || authLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating Account...
                        </>
                      ) : (
                        "Create Account"
                      )}
                    </Button>
                  </motion.div>
                </motion.form>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 1.7 }}
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
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 1.8 }}
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
                  transition={{ duration: 0.5, delay: 1.9 }}
                  className="text-center text-sm text-gray-400"
                >
                  Already have an account?{" "}
                  <Link href="/auth/signin" className="text-yellow-400 hover:underline font-medium">
                    Sign in
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>

      {/* Email Verification Dialog */}
      <EmailVerificationDialog
        isOpen={showVerificationDialog}
        onClose={handleVerificationDialogClose}
        email={formData.email}
      />
    </>
  )
}
