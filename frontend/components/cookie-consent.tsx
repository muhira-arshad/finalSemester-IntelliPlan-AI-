"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { setConsent, hasConsent, type ConsentStatus } from "@/lib/cookie-utils"
import Image from "next/image" // Import Image for the logo

export function CookieConsent() {
  const [isOpen, setIsOpen] = useState(false)
  const [showPreferences, setShowPreferences] = useState(false)
  const [essentialChecked, setEssentialChecked] = useState(true) // Essential cookies are always true
  const [analyticsChecked, setAnalyticsChecked] = useState(true)
  const [marketingChecked, setMarketingChecked] = useState(true)

  useEffect(() => {
    // Only run on client side after hydration
    if (!hasConsent()) {
      const timer = setTimeout(() => {
        setIsOpen(true)
      }, 10000) // 10 seconds delay
      return () => clearTimeout(timer) // Cleanup on unmount
    }
  }, [])

  const handleAcceptAll = useCallback(() => {
    const consent: ConsentStatus = {
      essential: true,
      analytics: true,
      marketing: true,
      timestamp: new Date().toISOString(),
    }
    setConsent(consent)
    setIsOpen(false)
  }, [])

  const handleDeclineAll = useCallback(() => {
    const consent: ConsentStatus = {
      essential: true, // Essential cookies are always accepted
      analytics: false,
      marketing: false,
      timestamp: new Date().toISOString(),
    }
    setConsent(consent)
    setIsOpen(false)
  }, [])

  const handleSavePreferences = useCallback(() => {
    const consent: ConsentStatus = {
      essential: true,
      analytics: analyticsChecked,
      marketing: marketingChecked,
      timestamp: new Date().toISOString(),
    }
    setConsent(consent)
    setIsOpen(false)
  }, [analyticsChecked, marketingChecked])

  if (!isOpen) {
    return null
  }

  return (
    <Dialog
      open={isOpen}
      // Prevent closing on outside click or escape key
      onOpenChange={() => {}}
    >
      <DialogContent
        className="sm:max-w-[425px] rounded-lg shadow-lg p-6 bg-card text-card-foreground"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">Manage Your Cookie Preferences</DialogTitle>
          {!showPreferences && (
            <DialogDescription className="text-muted-foreground mt-2">
              We use cookies to improve your experience on our site. By continuing to use our site, you agree to our use
              of cookies.
            </DialogDescription>
          )}
        </DialogHeader>

        {!showPreferences ? (
          <div className="grid gap-4 py-4">
            <p className="text-sm text-muted-foreground">
              This website uses cookies to ensure you get the best experience. You can choose to accept all cookies,
              decline non-essential ones, or manage your preferences below.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 py-4">
            <div className="flex items-center space-x-2">
              <Checkbox id="essential" checked={essentialChecked} disabled />
              <Label htmlFor="essential" className="text-base font-medium text-foreground">
                Essential Cookies
              </Label>
              <p className="text-sm text-muted-foreground ml-auto">Always required</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="analytics"
                checked={analyticsChecked}
                onCheckedChange={(checked) => setAnalyticsChecked(!!checked)}
              />
              <Label htmlFor="analytics" className="text-base font-medium text-foreground">
                Analytics Cookies
              </Label>
              <p className="text-sm text-muted-foreground ml-auto">Optional</p>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="marketing"
                checked={marketingChecked}
                onCheckedChange={(checked) => setMarketingChecked(!!checked)}
              />
              <Label htmlFor="marketing" className="text-base font-medium text-foreground">
                Marketing Cookies
              </Label>
              <p className="text-sm text-muted-foreground ml-auto">Optional</p>
            </div>
          </div>
        )}

        <DialogFooter className="flex flex-col sm:flex-row sm:justify-end gap-2 mt-4">
          {!showPreferences ? (
            <>
              <Button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Accept
              </Button>
              <Button
                onClick={handleDeclineAll}
                variant="outline"
                className="w-full sm:w-auto border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
              >
                Decline
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowPreferences(true)}
                className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10"
              >
                Manage Preference
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setShowPreferences(false)} className="w-full sm:w-auto">
                Back
              </Button>
              <Button onClick={handleSavePreferences} className="w-full sm:w-auto">
                Save Preferences
              </Button>
            </>
          )}
        </DialogFooter>
        <div className="text-right text-xs text-muted-foreground mt-2">
          Powered By{" "}
          <Image
            src="/placeholder.svg?height=16&width=60"
            alt="Mandatly Logo"
            width={60}
            height={16}
            className="inline-block ml-1"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
