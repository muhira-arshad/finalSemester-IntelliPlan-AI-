"use client"

import { useState, useEffect, useRef } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2 } from 'lucide-react'
import { useAuth } from "@/context/auth-context"
import { motion } from "framer-motion"

interface GoogleSignInPromptProps {
  delay?: number // Delay in milliseconds before showing the prompt
}

export function GoogleSignInPrompt({ delay = 3000 }: GoogleSignInPromptProps) {
  const { isSignedIn, isLoading, signInWithGoogle } = useAuth()
  const [showPrompt, setShowPrompt] = useState(false)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (isLoading) return

    if (isSignedIn) {
      if (timerRef.current) clearTimeout(timerRef.current)
      setShowPrompt(false)
      return
    }

    timerRef.current = setTimeout(() => {
      setShowPrompt(true)
    }, delay)

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [isSignedIn, isLoading, delay])

  const handleGoogleSignIn = async () => {
    setIsSigningIn(true)
    try {
      const { error } = await signInWithGoogle()
      if (error) {
        console.error("Google sign-in failed:", error.message)
      } else {
        setShowPrompt(false)
      }
    } catch (error) {
      console.error("Unexpected error during Google sign-in:", error)
    } finally {
      setIsSigningIn(false)
    }
//   }

  if (!showPrompt || isSignedIn || isLoading) {
    return null
  }

  return (
    <Dialog open={showPrompt} onOpenChange={setShowPrompt}>
      <DialogContent
        className="bg-white text-black border border-gray-300 max-w-sm rounded-lg shadow-2xl p-0 overflow-hidden"
        style={{
          position: "fixed",
          top: "1rem",
          right: "1rem",
          transform: "none",
          margin: 0
        }}
      >
        {/* Header section */}
        <div className="flex items-center space-x-3 p-4 border-b border-gray-200">
          <img
            src="https://ssl.gstatic.com/images/branding/product/1x/avatar_circle_blue_512dp.png"
            alt="Profile"
            className="w-10 h-10 rounded-full"
          />
          <div>
            <p className="font-medium text-sm">Elisa Beckett</p>
            <p className="text-xs text-gray-500">elisa.g.beckett@gmail.com</p>
          </div>
        </div>

        {/* Continue button */}
        <div className="p-4">
          <Button
            type="button"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded"
            onClick={handleGoogleSignIn}
            disabled={isSigningIn}
          >
            {isSigningIn ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing In...
              </>
            ) : (
              <>Continue as Elisa</>
            )}
          </Button>

          <p className="mt-3 text-xs text-gray-500">
            To continue, google.com will share your name, email address, and profile picture with this site.
            See this site's{" "}
            <a href="#" className="text-blue-600 underline">
              privacy policy
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline">
              terms of service
            </a>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}}
