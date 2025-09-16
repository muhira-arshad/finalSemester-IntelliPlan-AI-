// "use client"

// import { useEffect, useState } from "react"
// import Image from "next/image"
// import { StarsBackground } from "./startsBackground"

// export const SplashScreen = ({ children }: { children: React.ReactNode }) => {
//   const [isVisible, setIsVisible] = useState(true)
//   const [fadeOut, setFadeOut] = useState(false)
//   const [fadeIn, setFadeIn] = useState(false)
//   const [mounted, setMounted] = useState(false)

//   useEffect(() => {
//     // Ensure DOM is mounted (prevents hydration errors)
//     setMounted(true)

//     const fadeInTimeout = setTimeout(() => {
//       setFadeIn(true)
//     }, 100)

//     const splashTimeout = setTimeout(() => {
//       setFadeOut(true)
//       setTimeout(() => setIsVisible(false), 700) // delay to match fade-out duration
//     }, 2500)

//     return () => {
//       clearTimeout(fadeInTimeout)
//       clearTimeout(splashTimeout)
//     }
//   }, [])

//   if (!mounted) return null // Prevent rendering before DOM is ready

//   if (isVisible) {
//     return (
//       <div
//         className={`fixed inset-0 z-[9999] flex items-center justify-center bg-black transition-opacity duration-700 ${
//           fadeOut ? "opacity-0" : "opacity-100"
//         }`}
//       >
//         {/* ✨ Stars background */}
//         <StarsBackground />

//         {/* 🔥 Logo with fade-in effect */}
//         <div
//           className={`z-10 transition-opacity duration-1000 ${
//             fadeIn ? "opacity-100" : "opacity-0"
//           }`}
//         >
//           <Image
//             src="/images/logo.png"
//             alt="IntelliPlan AI"
//             width={500}
//             height={400}
//             priority
//             className="object-contain"
//           />
//         </div>
//       </div>
//     )
//   }

//   return <>{children}</>
// }
