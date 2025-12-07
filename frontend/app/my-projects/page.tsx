"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  User,
  Settings,
  Plus,
  Download,
  Share,
  Eye,
  Trash2,
  Calendar,
  BarChart3,
  MoreHorizontal,
  ExternalLink,
  Pencil,
  Copy,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/auth-context"
import { ThreeDBackground } from "@/components/three-d-background"

export default function MyProjectsPage() {
  const [activeTab, setActiveTab] = useState("plans")
  const { user } = useAuth()
  const [selectedProject, setSelectedProject] = useState<(typeof userPlans)[0] | null>(null)
  const [renameProject, setRenameProject] = useState<(typeof userPlans)[0] | null>(null)
  const [newName, setNewName] = useState("")

  const userPlans = [
    {
      id: 1,
      title: "Modern Villa",
      type: "3D",
      createdAt: "2024-01-15",
      status: "completed",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      title: "Apartment Layout",
      type: "2D",
      createdAt: "2024-01-14",
      status: "completed",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      title: "Office Space",
      type: "3D",
      createdAt: "2024-01-13",
      status: "processing",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      title: "Studio Design",
      type: "2D",
      createdAt: "2024-01-12",
      status: "completed",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  const stats = [
    { label: "Plans Created", value: "12", icon: BarChart3 },
    { label: "This Month", value: "4", icon: Calendar },
    { label: "Downloads", value: "8", icon: Download },
    { label: "Shares", value: "3", icon: Share },
  ]

  const handleAction = (action: string, project?: (typeof userPlans)[0]) => {
    switch (action) {
      case "open":
        setSelectedProject(project || null)
        break
      case "rename":
        setRenameProject(project || null)
        setNewName(project?.title || "")
        break
      case "duplicate":
        alert(`Duplicating project: ${project?.title}`)
        break
      case "move-to":
        alert(`Moving "${project?.title}" to My Projects`)
        break
      case "delete":
        if (confirm(`Are you sure you want to delete "${project?.title}"?`)) {
          alert(`Deleting project: ${project?.title}`)
        }
        break
      default:
        console.log(`Action: ${action}`)
    }
  }

  const handleRename = () => {
    if (newName.trim()) {
      alert(`Renamed "${renameProject?.title}" to "${newName}"`)
      setRenameProject(null)
      setNewName("")
    }
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
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" alt={user?.firstName || "User"} />
                <AvatarFallback>{user?.firstName?.[0] || "U"}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-2xl font-bold text-foreground">My Projects</h1>
                <p className="text-muted-foreground">Manage your AI-generated floor plans</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/generate">
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  New Plan
                </Button>
              </Link>
              <Link href="/settings">
                <Button variant="outline">
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-background/80 backdrop-blur-sm">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                    </div>
                    <stat.icon className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3 bg-background/80 backdrop-blur-sm">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="plans">My Plans</TabsTrigger>
              <TabsTrigger value="profile">Profile</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Welcome to My Projects!</CardTitle>
                  <CardDescription>This is where you can manage all your AI-generated floor plans.</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Start by creating a new plan or explore your existing designs.
                  </p>
                  <Link href="/generate">
                    <Button>
                      <Plus className="mr-2 h-4 w-4" />
                      Create New Plan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="plans" className="space-y-6">
              <div className="flex justify-between items-center bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-foreground">My Floor Plans</h2>
                <Link href="/generate">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Create New Plan
                  </Button>
                </Link>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userPlans.map((plan) => (
                  <Card
                    key={plan.id}
                    className="group hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm"
                  >
                    <CardContent className="p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <img
                          src={plan.image || "/placeholder.svg"}
                          alt={plan.title}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <Button size="sm" variant="secondary" onClick={() => handleAction("open", plan)}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                      <div className="p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-foreground">{plan.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                                <span className="sr-only">More actions</span>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="z-[9999]">
                              <DropdownMenuItem onClick={() => handleAction("open", plan)}>
                                <ExternalLink className="mr-2 h-4 w-4" />
                                Open
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleAction("rename", plan)}>
                                <Pencil className="mr-2 h-4 w-4" />
                                Rename
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleAction("duplicate", plan)}>
                                <Copy className="mr-2 h-4 w-4" />
                                Duplicate
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive focus:text-destructive"
                                onClick={() => handleAction("delete", plan)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                          <span>{plan.createdAt}</span>
                          <Badge variant="secondary">{plan.type}</Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="profile" className="space-y-6">
              <Card className="bg-background/80 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-foreground">Your Profile</CardTitle>
                  <CardDescription>
                    Click the button below to view and manage your full profile details.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/profile">
                    <Button>
                      <User className="mr-2 h-4 w-4" />
                      Go to Profile
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {selectedProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProject(null)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <div className="p-6">
              <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={selectedProject.image || "/placeholder.svg"}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold">{selectedProject.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="text-lg font-semibold capitalize">{selectedProject.status}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-lg font-semibold">{selectedProject.createdAt}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="text-lg font-semibold">2500 sq ft</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button>Download</Button>
                <Button variant="outline">Share</Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renameProject && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg w-full max-w-sm">
            <div className="p-6 border-b">
              <h2 className="text-xl font-bold">Rename Project</h2>
            </div>
            <div className="p-6 space-y-4">
              <Input
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Enter new name"
                className="w-full"
              />
              <div className="flex gap-3">
                <Button onClick={handleRename} className="flex-1">
                  Rename
                </Button>
                <Button variant="outline" onClick={() => setRenameProject(null)} className="flex-1">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
