"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MapPin, Star } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/context/auth-context"

export function ProfileOverviewHeader() {
  const { user } = useAuth()

  return (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-6 p-6 border-b">
      {/* ✅ Avatar with proper size */}
      <Avatar className="h-24 w-24">
        <AvatarImage
          src={user?.gender?.toLowerCase() === "female" ? "/images/female.png" : "/images/male.png"}
          alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
          className="object-cover"
        />
        <AvatarFallback className="bg-primary text-primary-foreground text-xl">
          {user?.firstName?.[0]?.toUpperCase() || "U"}
        </AvatarFallback>
      </Avatar>

      {/* User Info */}
      <div className="flex-1 text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center gap-2 mb-2">
          <h2 className="text-2xl font-bold">
            {user?.firstName} {user?.lastName}
          </h2>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
            User 195707968
          </Badge>
        </div>

        <div className="text-muted-foreground text-sm flex flex-col md:flex-row items-center md:items-start gap-2">
          <span className="flex items-center gap-1">
            <MapPin className="h-4 w-4" /> France
          </span>
          <span>Member since 2025</span>
        </div>

        <div className="mt-4 flex flex-col sm:flex-row items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1 text-blue-600 border-blue-600">
            <Star className="h-4 w-4 fill-blue-600 text-blue-600" />
            Available for hire
          </Badge>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Checkbox id="available-for-hire" />
            <label htmlFor="available-for-hire" className="cursor-pointer">
              Show a "Available for hire" badge on my profile.
            </label>
            <Link href="#" className="text-primary hover:underline">
              Learn More
            </Link>
          </div>
        </div>
      </div>

      <Button className="mt-4 md:mt-0 bg-purple-600 hover:bg-purple-700 text-white">Switch to Pro</Button>
    </div>
  )
}
