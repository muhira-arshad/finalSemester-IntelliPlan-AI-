import type React from "react"
import { cn } from "@/lib/utils"

export function MapPatternBackground({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "absolute inset-0 z-0",
        // Subtle grid pattern drawn with CSS gradients to avoid missing assets
        "bg-[length:20px_20px] bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)]",
        "after:absolute after:inset-0 after:bg-gradient-to-br after:from-background/80 after:to-background/60 after:backdrop-blur-sm",
        className,
      )}
      {...props}
    />
  )
}
