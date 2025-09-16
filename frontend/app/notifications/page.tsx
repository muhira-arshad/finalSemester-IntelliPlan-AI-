"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Bell, CheckCircle, Info, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { ThreeDBackground } from "@/components/three-d-background" // Import the 3D background

export default function NotificationsPage() {
  const notifications = [
    {
      id: 1,
      type: "update",
      icon: CheckCircle,
      title: "New Feature: 3D Walkthroughs!",
      description: "Explore your designs with immersive 3D walkthroughs. Available now for Professional plans.",
      date: "2025-07-15",
      read: false,
    },
    {
      id: 2,
      type: "info",
      icon: Info,
      title: "Maintenance Scheduled",
      description: "Scheduled maintenance on July 20th, 2 AM - 4 AM UTC. Services may be briefly interrupted.",
      date: "2025-07-10",
      read: true,
    },
    {
      id: 3,
      type: "alert",
      icon: AlertTriangle,
      title: "Storage Limit Reached",
      description: "You've used 90% of your free plan storage. Consider upgrading to a Professional plan.",
      date: "2025-07-08",
      read: false,
    },
    {
      id: 4,
      type: "update",
      icon: CheckCircle,
      title: "Improved AI Generation Speed",
      description: "Our AI now generates floor plans 2x faster! Enjoy quicker design iterations.",
      date: "2025-07-01",
      read: true,
    },
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dedicated container for the 3D background */}
      <div className="fixed inset-0 z-0">
        <ThreeDBackground />
      </div>

      {/* Main content, now with a higher z-index */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
            <Badge variant="secondary" className="mb-4">
              Notifications
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">Your Latest Updates</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Stay informed about new features, important announcements, and account activity.
            </p>
          </div>

          {/* Notifications List */}
          <div className="max-w-3xl mx-auto space-y-4">
            {notifications.map((notification) => (
              <Card
                key={notification.id}
                className={`bg-background/80 backdrop-blur-sm ${!notification.read ? "border-primary/50 bg-primary/5" : ""}`}
              >
                <CardContent className="p-4 flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {notification.type === "update" && <notification.icon className="h-6 w-6 text-green-500" />}
                    {notification.type === "info" && <notification.icon className="h-6 w-6 text-blue-500" />}
                    {notification.type === "alert" && <notification.icon className="h-6 w-6 text-orange-500" />}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-foreground">{notification.title}</h3>
                    <p className="text-muted-foreground text-sm mb-2">{notification.description}</p>
                    <span className="text-xs text-muted-foreground">{notification.date}</span>
                  </div>
                  {!notification.read && (
                    <Badge variant="default" className="flex-shrink-0">
                      New
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>

          {notifications.length === 0 && (
            <div className="text-center py-12 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <Bell className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">No new notifications.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
