import type React from "react"
import { cn } from "@/lib/utils"

export function MapPatternBackground({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0",
        "bg-[url('/grid-pattern.png')] bg-repeat [background-size:20px_20px]", // Subtle grid pattern
        "after:absolute after:inset-0 after:bg-gradient-to-br after:from-background/80 after:to-background/60 after:backdrop-blur-sm", // Gradient overlay with blur
        className,
      )}
      {...props}
    />
  )
}
