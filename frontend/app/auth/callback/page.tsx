"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Loader2 } from "lucide-react"

export default function AuthCallback() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()

        if (error) {
          console.error("Auth callback error:", error.message)
          router.push("/auth/signin?error=" + encodeURIComponent(error.message))
          return
        }

        if (data.session) {
          console.log("✅ Auth callback successful, redirecting to home page...")
          // Always redirect to home page after successful authentication
          router.push("/")
        } else {
          // No session, redirect to signin
          router.push("/auth/signin")
        }
      } catch (error) {
        console.error("Unexpected error in auth callback:", error)
        router.push("/auth/signin?error=" + encodeURIComponent("Authentication failed"))
      }
    }

    handleAuthCallback()
  }, [router, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center bg-black text-white">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
        <p className="text-lg">Completing authentication...</p>
      </div>
    </div>
  )
}
