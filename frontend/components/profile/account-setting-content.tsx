"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useState } from "react"
import { useAuth } from "@/hooks/use-auth"

export function AccountSettingsContent() {
  const { user } = useAuth()
  const [email, setEmail] = useState(user?.email || "fa22-bcs-132@cuilahore.edu.pk")
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true) // Mock state

  const handleChangeEmail = () => {
    // Simulate email change logic
    console.log("Changing email to:", email)
    setIsEmailConfirmed(false) // Simulate pending confirmation
    alert("Email change requested. Please check your inbox for confirmation.")
  }

  return (
    <Card className="shadow-none border-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Account Settings</CardTitle>
        <CardDescription>Manage your account preferences.</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="flex items-center gap-2">
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleChangeEmail}>Change Email</Button>
            </div>
            {!isEmailConfirmed && (
              <p className="text-sm text-muted-foreground">{email} is pending confirmation. Please check your inbox.</p>
            )}
            {isEmailConfirmed && <p className="text-sm text-green-600">{email} is confirmed.</p>}
          </div>
          {/* Add more account settings here */}
        </div>
      </CardContent>
    </Card>
  )
}
