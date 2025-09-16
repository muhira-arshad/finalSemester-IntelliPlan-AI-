"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ArchitecturalLoaderProps {
  message?: string
  size?: "sm" | "md" | "lg"
  className?: string
}

export function ArchitecturalLoader({ message = "Loading...", size = "md", className }: ArchitecturalLoaderProps) {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  }

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  }

  return (
    <div className={cn("flex flex-col items-center justify-center space-y-4", className)}>
      {/* Architectural Blueprint Animation */}
      <div className="relative">
        <motion.div
          className={cn("border-2 border-primary rounded-lg", sizeClasses[size])}
          animate={{
            rotate: [0, 90, 180, 270, 360],
            scale: [1, 1.1, 1, 0.9, 1],
          }}
          transition={{
            duration: 2,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        >
          {/* Blueprint Grid */}
          <div className="absolute inset-1 grid grid-cols-3 grid-rows-3 gap-0.5">
            {Array.from({ length: 9 }).map((_, i) => (
              <motion.div
                key={i}
                className="bg-primary/20 rounded-sm"
                animate={{
                  opacity: [0.2, 0.8, 0.2],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Number.POSITIVE_INFINITY,
                  delay: i * 0.1,
                }}
              />
            ))}
          </div>
        </motion.div>

        {/* Orbiting Elements */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        >
          <div
            className={cn(
              "absolute border border-primary/40 rounded-full",
              size === "sm" ? "w-12 h-12" : size === "md" ? "w-16 h-16" : "w-20 h-20",
            )}
          >
            <div className="absolute top-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 left-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 translate-y-1/2" />
            <div className="absolute left-0 top-1/2 w-1 h-1 bg-primary rounded-full -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute right-0 top-1/2 w-1 h-1 bg-primary rounded-full translate-x-1/2 -translate-y-1/2" />
          </div>
        </motion.div>
      </div>

      {/* Loading Text */}
      <motion.p
        className={cn("text-muted-foreground font-medium", textSizeClasses[size])}
        animate={{
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      >
        {message}
      </motion.p>

      {/* Progress Dots */}
      <div className="flex space-x-1">
        {Array.from({ length: 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="w-2 h-2 bg-primary rounded-full"
            animate={{
              scale: [0.8, 1.2, 0.8],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.2,
            }}
          />
        ))}
      </div>
    </div>
  )
}
