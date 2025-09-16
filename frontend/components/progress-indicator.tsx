"use client"

import { Check } from "lucide-react"

interface ProgressIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, stepLabels }: ProgressIndicatorProps) {
  return (
    <div className="w-full mb-8">
      <div className="flex items-center justify-between relative">
        {/* Progress line */}
        <div className="absolute top-5 left-0 w-full h-0.5 bg-border z-0">
          <div
            className="h-full bg-primary transition-all duration-500 ease-out"
            style={{ width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%` }}
          />
        </div>

        {/* Step indicators */}
        {stepLabels.map((label, index) => {
          const stepNumber = index + 1
          const isCompleted = stepNumber < currentStep
          const isCurrent = stepNumber === currentStep

          return (
            <div key={stepNumber} className="flex flex-col items-center relative z-10">
              <div
                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  transition-all duration-300 ease-out
                  ${
                    isCompleted
                      ? "bg-primary text-primary-foreground shadow-lg animate-pulse-glow"
                      : isCurrent
                        ? "bg-primary text-primary-foreground shadow-lg scale-110"
                        : "bg-muted text-muted-foreground"
                  }
                `}
              >
                {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
              </div>
              <span
                className={`
                  mt-2 text-xs font-medium text-center max-w-20 leading-tight
                  transition-colors duration-300
                  ${isCurrent ? "text-primary" : "text-muted-foreground"}
                `}
              >
                {label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
