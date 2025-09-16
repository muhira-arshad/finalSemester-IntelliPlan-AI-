"use client"

import type React from "react"

import { useEffect } from "react"

export function SmoothScrolling({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    let lenis: any

    const initLenis = async () => {
      // Make sure we’re in the browser and the root scrolling element is ready
      if (typeof window === "undefined" || !document.documentElement) return

      const Lenis = (await import("@studio-freight/lenis")).default

      // Prefer <html> and <body>, but fall back to the same element if <body> is
      // not yet available (e.g. during very early hydration in some previews).
      const wrapperEl = document.documentElement
      const contentEl = document.body ?? wrapperEl

      // If for some reason even <html> is missing, abort early.
      if (!wrapperEl || !contentEl) {
        console.warn("Lenis initialisation aborted – DOM not ready.")
        return
      }

      lenis = new Lenis({
        wrapper: wrapperEl,
        content: contentEl,
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        // smooth: true,
        // mouseMultiplier: 1,
        // smoothTouch: false,
        touchMultiplier: 2,
        infinite: false,
      })

      const raf = (time: number) => {
        lenis?.raf(time)
        requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)
    }

    initLenis()

    return () => {
      if (lenis) {
        lenis.destroy()
      }
    }
  }, [])

  return <>{children}</>
}
