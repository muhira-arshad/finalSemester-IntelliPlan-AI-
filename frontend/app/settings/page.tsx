"use client"

import Link from "next/link"
import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { User, CreditCard, Edit, Share2, Database, Mail, CheckIcon as Checkbox, Palette } from "lucide-react" // Import Palette icon
import { useAuth } from "@/context/auth-context"
import { ThreeDBackground } from "@/components/three-d-background" // Import the 3D background
import { ThemeSwitch } from "@/components/theme-switch" // Import the new ThemeSwitch

export default function SettingsPage() {
  const { user } = useAuth()
  const [activeSection, setActiveSection] = useState("account")
  const [email, setEmail] = useState(user?.email || "user@example.com")
  const [isEmailConfirmed, setIsEmailConfirmed] = useState(true) // Simulate confirmation

  const handleEmailChange = () => {
    // Simulate email change logic
    alert(`Email change requested for ${email}`)
    setIsEmailConfirmed(false) // Simulate pending confirmation
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dedicated container for the 3D background */}
      <div className="fixed inset-0 z-0">
        <ThreeDBackground />
      </div>
      {/* Main content, now with a higher z-index */}
      <div className="relative z-10 py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8 text-foreground">Settings</h1>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar Navigation */}
            <Card className="md:col-span-1 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-4 space-y-2">
                <Button
                  variant={activeSection === "account" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("account")}
                >
                  <User className="mr-2 h-4 w-4" />
                  Account Settings
                </Button>
                <Button
                  variant={activeSection === "billing" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("billing")}
                >
                  <CreditCard className="mr-2 h-4 w-4" />
                  Billing
                </Button>
                <Button
                  variant={activeSection === "edit-profile" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("edit-profile")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
                <Button
                  variant={activeSection === "social" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("social")}
                >
                  <Share2 className="mr-2 h-4 w-4" />
                  Social networks
                </Button>
                <Button
                  variant={activeSection === "data" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("data")}
                >
                  <Database className="mr-2 h-4 w-4" />
                  Manage your data
                </Button>
                {/* New Appearance Button */}
                <Button
                  variant={activeSection === "appearance" ? "secondary" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setActiveSection("appearance")}
                >
                  <Palette className="mr-2 h-4 w-4" />
                  Appearance
                </Button>
              </CardContent>
            </Card>
            {/* Content Area */}
            <div className="md:col-span-3">
              {activeSection === "account" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Account Settings</CardTitle>
                    <CardDescription>Manage your account email and preferences.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground">
                        Email
                      </Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="email"
                          type="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className="flex-1"
                        />
                        <Button onClick={handleEmailChange}>Change Email</Button>
                      </div>
                      {!isEmailConfirmed && (
                        <p className="text-sm text-orange-500 flex items-center">
                          <Mail className="h-4 w-4 mr-1" />
                          Email change pending confirmation. Check your inbox.
                        </p>
                      )}
                      {isEmailConfirmed && (
                        <p className="text-sm text-green-500 flex items-center">
                          <Checkbox className="h-4 w-4 mr-1" />
                          Email is confirmed.
                        </p>
                      )}
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <h3 className="font-semibold text-foreground">Availability</h3>
                      <div className="flex items-center space-x-2">
                        <input type="checkbox" id="availableForHire" className="rounded" />
                        <Label htmlFor="availableForHire" className="text-sm">
                          Show a "Available for hire" badge on my profile.{" "}
                          <Link href="#" className="text-primary hover:underline">
                            Learn More
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
              {activeSection === "billing" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Billing</CardTitle>
                    <CardDescription>Manage your subscription and payment methods.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Billing information will appear here.</p>
                    <Button className="mt-4">Manage Subscription</Button>
                  </CardContent>
                </Card>
              )}
              {activeSection === "edit-profile" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Edit Profile</CardTitle>
                    <CardDescription>Update your personal information.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Profile editing form will go here.</p>
                    <Button className="mt-4">Save Changes</Button>
                  </CardContent>
                </Card>
              )}
              {activeSection === "social" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Social Networks</CardTitle>
                    <CardDescription>Connect your social media accounts.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Social network integration options.</p>
                    <Button className="mt-4">Connect Accounts</Button>
                  </CardContent>
                </Card>
              )}
              {activeSection === "data" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Manage Your Data</CardTitle>
                    <CardDescription>Export or delete your account data.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Data management options.</p>
                    <Button className="mt-4" variant="destructive">
                      Delete Account
                    </Button>
                  </CardContent>
                </Card>
              )}
              {/* New Appearance Section */}
              {activeSection === "appearance" && (
                <Card className="bg-background/80 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="text-foreground">Appearance</CardTitle>
                    <CardDescription>Customize the look and feel of the application.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="theme-switch" className="text-foreground">
                        Dark Mode
                      </Label>
                      <ThemeSwitch />
                    </div>
                    <p className="text-sm text-muted-foreground">Select your preferred theme for the application.</p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
