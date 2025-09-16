"use client"

import type React from "react"
import { createContext, useState, useContext, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import type {
  User as SupabaseUser,
  Session,
  AuthError,
  AuthChangeEvent,
} from "@supabase/supabase-js"

interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  gender: string
  avatarUrl?: string
}

interface AuthContextType {
  isSignedIn: boolean
  user: AuthUser | null
  isLoading: boolean
  session: Session | null
  signUp: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    gender: string
  ) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
  updatePassword: (password: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({
  children,
  initialSession = null,
}: {
  children: React.ReactNode
  initialSession?: Session | null
}) {
  const [isSignedIn, setIsSignedIn] = useState(!!initialSession)
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(initialSession)
  const [isLoading, setIsLoading] = useState(true)

  const router = useRouter()

  // 🔹 Convert Supabase user → AuthUser
  const convertToAuthUser = useCallback((supabaseUser: SupabaseUser): AuthUser => {
    return {
      id: supabaseUser.id,
      email: supabaseUser.email || "",
      firstName: supabaseUser.user_metadata?.first_name || "",
      lastName: supabaseUser.user_metadata?.last_name || "",
      gender: supabaseUser.user_metadata?.gender || "",
      avatarUrl: supabaseUser.user_metadata?.avatar_url,
    }
  }, [])

  // 🔹 Load from localStorage if exists
  useEffect(() => {
    const storedUser = localStorage.getItem("user")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        setIsSignedIn(true)
      } catch (error) {
        console.error("Invalid user in localStorage", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  // 🔹 Setup Supabase Auth listener
  useEffect(() => {
    let mounted = true

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      (_event: AuthChangeEvent, session: Session | null) => {
        if (!mounted) return

        setSession(session)

        if (session?.user) {
          const convertedUser = convertToAuthUser(session.user)
          setUser(convertedUser)
          setIsSignedIn(true)

          localStorage.setItem("user", JSON.stringify(convertedUser))
          document.cookie = `intellplan_user=true; path=/; max-age=3600`

          if (_event === "SIGNED_IN") {
            router.push("/")
          }
        } else {
          setUser(null)
          setIsSignedIn(false)

          localStorage.removeItem("user")
          document.cookie = `intellplan_user=; path=/; max-age=0`

          if (_event === "SIGNED_OUT") {
            router.push("/login")
          }
        }

        setIsLoading(false)
      }
    )

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [convertToAuthUser, router])

  // 🔹 Sign Up
  const signUp = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
      gender: string
    ) => {
      try {
        const { error } = await supabase.auth.signUp({
          email: email.trim().toLowerCase(),
          password,
          options: {
            data: {
              first_name: firstName.trim(),
              last_name: lastName.trim(),
              gender: gender.trim(),
              avatar_url:
                gender.trim().toLowerCase() === "female"
                  ? "C:\Users\X1 Carbon\Desktop\intellplan-ai-website (2)\frontend\public\images\female.png"
                  : "/C:\Users\X1 Carbon\Desktop\intellplan-ai-website (2)\frontend\public\images\male.png", // ✅ default avatar based on gender
            },
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        })

        return { error }
      } catch (error: any) {
        return {
          error: {
            message: error.message || "Unexpected error during signup",
            name: "UnexpectedError",
            status: 500,
          } as AuthError,
        }
      }
    },
    []
  )

  // 🔹 Sign In
  const signIn = useCallback(async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      })

      return { error }
    } catch (error: any) {
      return { error: error as AuthError }
    }
  }, [])

  // 🔹 Google Sign In
  const signInWithGoogle = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })

      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [])

  // 🔹 Sign Out
  const signOut = useCallback(async () => {
    try {
      await supabase.auth.signOut()
      setUser(null)
      setSession(null)
      setIsSignedIn(false)
      localStorage.removeItem("user")
      document.cookie = `intellplan_user=; path=/; max-age=0`
      router.push("/login")
    } catch (error: any) {
      console.error("SignOut Error:", error.message)
    }
  }, [router])

  // 🔹 Reset Password
  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [])

  // 🔹 Update Password
  const updatePassword = useCallback(async (password: string) => {
    try {
      const { error } = await supabase.auth.updateUser({ password })
      return { error }
    } catch (error) {
      return { error: error as AuthError }
    }
  }, [])

  return (
    <AuthContext.Provider
      value={{
        isSignedIn,
        user,
        isLoading,
        session,
        signUp,
        signIn,
        signInWithGoogle,
        signOut,
        resetPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error("useAuth must be used within an AuthProvider")
  return context
}
