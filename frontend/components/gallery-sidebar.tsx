"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Lock, FolderKanban, Palette, ImageIcon, Sparkles, Archive, Award } from "lucide-react"

export function GallerySidebar() {
  const sidebarNavItems = [
    {
      label: "All Projects",
      icon: FolderKanban,
      href: "/my-projects",
      badge: null,
    },
    {
      label: "Contest design",
      icon: Award,
      href: "#",
      badge: null,
    },
    {
      label: "All Renders",
      icon: ImageIcon,
      href: "/gallery",
      badge: null,
    },
    {
      label: "All Textures",
      icon: Palette,
      href: "#",
      badge: null,
    },
    {
      label: "Design generator",
      icon: Sparkles,
      href: "/generate",
      badge: "PRO",
    },
    {
      label: "Archived",
      icon: Archive,
      href: "#",
      badge: null,
    },
  ]

  return (
    <div className="w-full lg:w-64 p-4 lg:p-6 space-y-6">
      {/* Unlock All Features */}
      <Card className="bg-gradient-to-r from-purple-600 to-pink-500 text-white border-none shadow-lg">
        <CardContent className="p-4 flex flex-col items-center text-center">
          <Lock className="h-8 w-8 mb-3" />
          <h3 className="font-semibold text-lg mb-2">Unlock all features</h3>
          <p className="text-sm opacity-90 mb-4">Upgrade to Pro for unlimited access</p>
          <Link href="/features" className="w-full">
            <Button variant="secondary" className="w-full bg-yellow-400 hover:bg-yellow-500 text-black font-semibold">
              Upgrade Now
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Navigation Links */}
      <nav className="space-y-1">
        {sidebarNavItems.map((item, index) => (
          <Link key={index} href={item.href}>
            <Button
              variant="ghost"
              className="w-full justify-start text-left px-4 py-2 rounded-lg hover:bg-muted/50 transition-colors"
            >
              {item.icon && <item.icon className="mr-3 h-5 w-5 text-muted-foreground" />}
              <span className="flex-1">{item.label}</span>
              {item.badge && (
                <span className="ml-auto px-2 py-0.5 text-xs font-semibold bg-primary/10 text-primary rounded-full">
                  {item.badge}
                </span>
              )}
            </Button>
          </Link>
        ))}
      </nav>

      {/* New articles from design blog */}
      <div className="pt-6 border-t border-muted-foreground/20">
        <h3 className="font-semibold text-lg mb-4">New articles from design blog</h3>
        <ul className="space-y-3 text-sm text-muted-foreground">
          <li>
            <Link href="#" className="hover:text-primary hover:underline">
              The Ultimate College Dorm Room Essentials Guide
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary hover:underline">
              Midjourney vs. DALL-E 3 for Interior Design Comparison Guide
            </Link>
          </li>
          <li>
            <Link href="#" className="hover:text-primary hover:underline">
              What is a Split Floor Plan? A Complete Guide
            </Link>
          </li>
        </ul>
      </div>
    </div>
  )
}
