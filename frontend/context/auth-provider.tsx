// "use client"

// import type React from "react"
// import { createContext, useState, useContext, useEffect, useCallback } from "react"
// import { useRouter } from "next/navigation"
// import { supabase } from "@/lib/supabase"
// import type { User as SupabaseUser, Session, AuthError } from "@supabase/supabase-js"

// interface AuthUser {
//   id: string
//   email: string
//   firstName: string
//   gender: string
//   lastName: string
//   avatarUrl?: string
// }

// interface AuthContextType {
//   isSignedIn: boolean
//   user: AuthUser | null
//   isLoading: boolean
//   session: Session | null
//   signUp: (
//     email: string,
//     password: string,
//     firstName: string,
//     lastName: string,
//     gender: string,
//   ) => Promise<{ error: AuthError | null }>
//   signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
//   signInWithGoogle: () => Promise<{ error: AuthError | null }>
//   signOut: () => Promise<void>
//   resetPassword: (email: string) => Promise<{ error: AuthError | null }>
//   updatePassword: (password: string) => Promise<{ error: AuthError | null }>
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined)

// export function AuthProvider({
//   children,
//   initialSession = null,
// }: {
//   children: React.ReactNode
//   initialSession?: Session | null
// }) {
//   const [isSignedIn, setIsSignedIn] = useState(!!initialSession)
//   const [user, setUser] = useState<AuthUser | null>(
//     initialSession?.user
//       ? {
//           id: initialSession.user.id,
//           email: initialSession.user.email || "",
//           firstName: initialSession.user.user_metadata?.first_name || "",
//           lastName: initialSession.user.user_metadata?.last_name || "",
//           gender: initialSession.user.user_metadata?.gender || "",
//           avatarUrl: initialSession.user.user_metadata?.avatar_url,
//         }
//       : null,
//   )
//   const [session, setSession] = useState<Session | null>(initialSession)
//   const [isLoading, setIsLoading] = useState(true)

//   const router = useRouter()

//   const convertToAuthUser = useCallback((supabaseUser: SupabaseUser): AuthUser => {
//     return {
//       id: supabaseUser.id,
//       email: supabaseUser.email || "",
//       firstName: supabaseUser.user_metadata?.first_name || "",
//       lastName: supabaseUser.user_metadata?.last_name || "",
//       gender: supabaseUser.user_metadata?.gender || "",
//       avatarUrl: supabaseUser.user_metadata?.avatar_url,
//     }
//   }, [])

//   useEffect(() => {
//     const storedUser = localStorage.getItem("user")
//     if (storedUser) {
//       try {
//         const parsedUser = JSON.parse(storedUser)
//         setUser(parsedUser)
//         setIsSignedIn(true)
//       } catch (error) {
//         console.error("Invalid user in localStorage", error)
//         localStorage.removeItem("user")
//       }
//     }
//   }, [])

//   useEffect(() => {
//     let mounted = true

//     const setupAuthListener = async () => {
//       const {
//         data: { subscription },
//       } = supabase.auth.onAuthStateChange((event, session) => {
//         if (!mounted) return

//         console.log("AuthContext: Auth state changed:", event)

//         setSession(session)

//         if (session?.user) {
//           const convertedUser = convertToAuthUser(session.user)
//           setUser(convertedUser)
//           setIsSignedIn(true)

//           localStorage.setItem("user", JSON.stringify(convertedUser))
//           document.cookie = `intellplan_user=true; path=/; max-age=3600`

//           if (event === "SIGNED_IN") {
//             setTimeout(() => {
//               router.push("/")
//             }, 100)
//           }
//         } else {
//           setUser(null)
//           setIsSignedIn(false)

//           localStorage.removeItem("user")
//           document.cookie = `intellplan_user=; path=/; max-age=0`

//           if (event === "SIGNED_OUT") {
//             router.push("/")
//           }
//         }

//         setIsLoading(false)
//       })

//       return () => {
//         subscription.unsubscribe()
//       }
//     }

//     setupAuthListener()

//     return () => {
//       mounted = false
//     }
//   }, [convertToAuthUser, router])

//   const signUp = useCallback(
//     async (email: string, password: string, firstName: string, lastName: string, gender: string) => {
//       try {
//         const { data, error } = await supabase.auth.signUp({
//           email: email.trim().toLowerCase(),
//           password,
//           options: {
//             data: {
//               first_name: firstName.trim(),
//               last_name: lastName.trim(),
//               gender: gender,
//               avatar_url: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}&gender=${gender}`,
//             },
//             emailRedirectTo: `${window.location.origin}/auth/callback`,
//           },
//         })

//         return { error }
//       } catch (error: any) {
//         return {
//           error: {
//             message: error.message || "Unexpected error during signup",
//             name: "UnexpectedError",
//             status: 500,
//           } as AuthError,
//         }
//       }
//     },
//     [],
//   )

//   const signIn = useCallback(async (email: string, password: string) => {
//     try {
//       const { data, error } = await supabase.auth.signInWithPassword({
//         email: email.trim().toLowerCase(),
//         password,
//       })

//       return { error }
//     } catch (error: any) {
//       return { error: error as AuthError }
//     }
//   }, [])

//   const signInWithGoogle = useCallback(async () => {
//     try {
//       const { error } = await supabase.auth.signInWithOAuth({
//         provider: "google",
//         options: {
//           redirectTo: `${window.location.origin}/auth/callback`,
//         },
//       })

//       return { error }
//     } catch (error) {
//       return { error: error as AuthError }
//     }
//   }, [])

//   const signOut = useCallback(async () => {
//     try {
//       await supabase.auth.signOut()
//       setUser(null)
//       setSession(null)
//       setIsSignedIn(false)
//       localStorage.removeItem("user")
//       document.cookie = `intellplan_user=; path=/; max-age=0`
//       router.push("/")
//     } catch (error: any) {
//       console.error("SignOut Error:", error.message)
//     }
//   }, [router])

//   const resetPassword = useCallback(async (email: string) => {
//     try {
//       const { error } = await supabase.auth.resetPasswordForEmail(email, {
//         redirectTo: `${window.location.origin}/auth/reset-password`,
//       })
//       return { error }
//     } catch (error) {
//       return { error: error as AuthError }
//     }
//   }, [])

//   const updatePassword = useCallback(async (password: string) => {
//     try {
//       const { error } = await supabase.auth.updateUser({ password })
//       return { error }
//     } catch (error) {
//       return { error: error as AuthError }
//     }
//   }, [])

//   return (
//     <AuthContext.Provider
//       value={{
//         isSignedIn,
//         user,
//         isLoading,
//         session,
//         signUp,
//         signIn,
//         signInWithGoogle,
//         signOut,
//         resetPassword,
//         updatePassword,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   )
// }

// export function useAuth() {
//   const context = useContext(AuthContext)
//   if (!context) throw new Error("useAuth must be used within an AuthProvider")
//   return context
// }
