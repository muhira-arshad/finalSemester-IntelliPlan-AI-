"use client"

import { Check } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

// Enhanced Checkbox Component
export const EnhancedCheckbox = ({
  id,
  checked,
  onCheckedChange,
  label,
  className,
}: {
  id: string
  checked: boolean
  onCheckedChange: () => void
  label: string
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
        checked
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        className,
      )}
      onClick={onCheckedChange}
    >
      <div
        className={cn(
          "w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200",
          checked
            ? "border-primary bg-primary text-primary-foreground"
            : "border-muted-foreground bg-background hover:border-primary",
        )}
      >
        {checked && <Check className="h-3 w-3" />}
      </div>
      <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer flex-1">
        {label}
      </Label>
    </div>
  )
}

// Enhanced Radio Button Component
export const EnhancedRadio = ({
  id,
  name,
  value,
  checked,
  onChange,
  label,
  className,
}: {
  id: string
  name: string
  value: string
  checked: boolean
  onChange: (value: string) => void
  label: string
  className?: string
}) => {
  return (
    <div
      className={cn(
        "flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md",
        checked
          ? "border-primary bg-primary/5 shadow-sm"
          : "border-border bg-card hover:border-primary/50 hover:bg-primary/5",
        className,
      )}
      onClick={() => onChange(value)}
    >
      <div
        className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200",
          checked ? "border-primary bg-primary" : "border-muted-foreground bg-background hover:border-primary",
        )}
      >
        {checked && <div className="w-2 h-2 rounded-full bg-primary-foreground" />}
      </div>
      <Label htmlFor={id} className="text-sm font-medium text-foreground cursor-pointer flex-1">
        {label}
      </Label>
    </div>
  )
}
