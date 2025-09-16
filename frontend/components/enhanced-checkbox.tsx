"use client"

import { Check, AlertTriangle } from "lucide-react"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

interface EnhancedCheckboxProps {
  id: string
  checked: boolean
  onCheckedChange: () => void
  label: string
  disabled?: boolean
  disabledReason?: string
  className?: string
}

export function EnhancedCheckbox({
  id,
  checked,
  onCheckedChange,
  label,
  disabled,
  disabledReason,
  className,
}: EnhancedCheckboxProps) {
  return (
    <div className="relative group">
      <div
        className={cn(
          "flex items-center space-x-4 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
          "hover:shadow-lg hover:shadow-primary/10 hover:-translate-y-0.5",
          checked
            ? "border-primary bg-gradient-to-r from-primary/10 to-secondary/5 shadow-md shadow-primary/20"
            : "border-border bg-card/50 hover:border-primary/50 hover:bg-primary/5",
          disabled ? "opacity-50 cursor-not-allowed hover:transform-none hover:shadow-none" : "",
          className,
        )}
        onClick={() => !disabled && onCheckedChange()}
        title={disabled ? disabledReason : undefined}
      >
        <div
          className={cn(
            "w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all duration-300",
            "group-hover:scale-110",
            checked
              ? "border-primary bg-gradient-to-br from-primary to-secondary text-primary-foreground shadow-lg"
              : "border-muted-foreground bg-background hover:border-primary hover:bg-primary/5",
          )}
        >
          {checked && <Check className="h-4 w-4 animate-in zoom-in-50 duration-200" />}
        </div>

        <Label
          htmlFor={id}
          className="text-sm font-medium text-foreground cursor-pointer flex-1 text-pretty leading-relaxed"
        >
          {label}
        </Label>

        {disabled && disabledReason && (
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            <span className="text-xs text-orange-600 max-w-32 text-pretty">{disabledReason}</span>
          </div>
        )}
      </div>
    </div>
  )
}
