"use client"

import { ProfileOverviewHeader } from "@/components/profile/profile-overview-header"
import { useAuth } from "@/context/auth-context"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Settings, Edit, Crown } from "lucide-react"
import { AnimatedAuthBackground } from "@/components/animated-auth-background"

export default function ProfilePage() {
  const { user } = useAuth()

  if (!user) {
    return <div>Please sign in to view your profile.</div>
  }

  return (
    <div className="relative min-h-screen bg-background">
      <AnimatedAuthBackground />

      <div className="relative z-10 container mx-auto py-8 px-4">
        {/* Profile Overview Header */}
        <ProfileOverviewHeader />

        {/* Profile Content */}
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{user.email}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <p className="text-sm">
                  {user.firstName} {user.lastName}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-muted-foreground">Gender</label>
                <p className="text-sm capitalize">{user.gender}</p>
              </div>
            </CardContent>
          </Card>

          {/* Account Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Account Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Settings className="mr-2 h-4 w-4" />
                Account Settings
              </Button>
              <Button variant="outline" className="w-full justify-start bg-transparent">
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
              <Button className="w-full justify-start bg-purple-600 hover:bg-purple-700">
                <Crown className="mr-2 h-4 w-4" />
                Switch to Pro
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
