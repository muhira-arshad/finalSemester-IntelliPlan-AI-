"use client"

import { useState, useEffect } from "react"

export function StarryBackground() {
  const [stars, setStars] = useState<Array<{
    id: number
    size: number
    left: number
    top: number
    delay: number
    duration: number
    opacity: number
  }>>([])

  // Generate stars only on client side to avoid hydration mismatch
  useEffect(() => {
    if (typeof window === "undefined") return

    // Use a seeded random function for consistent star positions
    let seed = 12345
    const seededRandom = () => {
      seed = (seed * 9301 + 49297) % 233280
      return seed / 233280
    }

    const generatedStars = Array.from({ length: 200 }, (_, i) => ({
      id: i,
      size: seededRandom() * 2 + 0.5,
      left: seededRandom() * 100,
      top: seededRandom() * 100,
      delay: seededRandom() * 3,
      duration: seededRandom() * 3 + 2,
      opacity: seededRandom() * 0.8 + 0.2,
    }))

    setStars(generatedStars)
  }, [])

  return (
    <div className="starry-bg">
      {stars.map((star) => (
        <div
          key={star.id}
          className="star"
          style={{
            width: `${star.size}px`,
            height: `${star.size}px`,
            left: `${star.left}%`,
            top: `${star.top}%`,
            opacity: star.opacity,
            animationDelay: `${star.delay}s`,
            animationDuration: `${star.duration}s`,
          }}
        />
      ))}
    </div>
  )
}

