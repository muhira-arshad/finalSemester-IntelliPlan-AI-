"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  Menu,
  X,
  Wrench,
  Info,
  ImageIcon,
  User,
  Settings,
  Heart,
  Bell,
  LogOut,
  LayoutDashboard,
  Calculator,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation"
import Image from "next/image"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const { isSignedIn, user, signOut, isLoading } = useAuth()
  const router = useRouter()

  const navItems = [
    {
      href: "/generate",
      label: "Generate",
      icon: Wrench,
      onClick: () => {
        if (isLoading) return
        if (isSignedIn) {
          router.push("/generate")
        } else {
          router.push("/auth/signup?message=Please sign up to create a plan.")
        }
        setIsOpen(false)
      },
    },
    { href: "/cost-estimator", label: "Cost Estimator", icon: Calculator },
    { href: "/features", label: "Features", icon: Wrench },
    { href: "/gallery", label: "Gallery", icon: ImageIcon },
    { href: "/services", label: "Services", icon: Info },
    { href: "/about", label: "About", icon: Info },
  ]

  const userDropdownItems = [
    { href: "/my-projects", label: "My Projects", icon: LayoutDashboard },
    { href: "/settings", label: "Settings", icon: Settings },
    { href: "/favorites", label: "Favorites", icon: Heart },
    { href: "/notifications", label: "Notifications", icon: Bell },
    { href: "/profile", label: "Profile", icon: User },
  ]

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center space-x-2">
              <Image src="/images/logo.png" alt="IntelliPlan AI Logo" width={280} height={280} className="h-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center justify-center flex-1 px-8">
            <div className="flex items-center space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                  onClick={item.onClick}
                  style={isLoading && item.label === "Generate" ? { pointerEvents: "none", opacity: 0.6 } : {}}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Right Side Actions - Removed ThemeToggle component */}
          <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
            {isLoading ? (
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
            ) : isSignedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={user?.gender?.toLowerCase() === "female" ? "/images/female.png" : "/images/male.png"}
                        alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                        width={1500}
                        height={1500}
                      />
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user?.firstName?.[0]?.toUpperCase() || "U"}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent className="w-56 bg-card text-card-foreground border-border" align="end" forceMount>
                  {/* User Info */}
                  <DropdownMenuItem className="flex flex-col items-start !cursor-default">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage
                          src={user?.gender?.toLowerCase() === "female" ? "/images/female.png" : "/images/male.png"}
                          alt={`${user?.firstName || "User"} ${user?.lastName || ""}`}
                          width={1500}
                          height={1500}
                        />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {user?.firstName?.[0]?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none text-foreground">
                          {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                      </div>
                    </div>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Dropdown links */}
                  {userDropdownItems.map((item) => (
                    <DropdownMenuItem
                      key={item.href}
                      asChild
                      className="text-foreground hover:bg-accent hover:text-accent-foreground"
                    >
                      <Link href={item.href}>
                        <item.icon className="mr-2 h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </DropdownMenuItem>
                  ))}

                  <DropdownMenuSeparator className="bg-border" />

                  {/* Logout */}
                  <DropdownMenuItem
                    onClick={signOut}
                    className="text-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/auth/signin">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/auth/signup">
                  <Button size="sm" className="btn-neon-hover">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle - Removed ThemeToggle from mobile view */}
          <div className="md:hidden flex items-center space-x-2">
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-2 px-2 py-2 text-sm font-medium transition-colors text-foreground hover:text-primary"
                  onClick={item.onClick}
                  style={isLoading && item.label === "Generate" ? { pointerEvents: "none", opacity: 0.6 } : {}}
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              ))}

              <div className="flex flex-col space-y-2 pt-2">
                {isLoading ? (
                  <div className="flex justify-center py-2">
                    <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
                  </div>
                ) : isSignedIn ? (
                  <>
                    {userDropdownItems.map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        className="flex items-center space-x-2 px-2 py-2 text-sm font-medium transition-colors text-foreground hover:text-primary"
                        onClick={() => setIsOpen(false)}
                      >
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent border-border text-foreground hover:bg-accent hover:text-accent-foreground"
                      onClick={signOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Link href="/auth/signin" className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup" className="flex-1">
                      <Button size="sm" className="w-full btn-neon-hover">
                        Sign Up
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navigation
