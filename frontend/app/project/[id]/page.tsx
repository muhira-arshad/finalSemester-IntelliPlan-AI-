"use client"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, Share2, Edit, Trash2, Folder } from "lucide-react"
import { motion } from "framer-motion"
import { showNotification } from "@/components/floating-notification"
import { useAuth } from "@/context/auth-context"
import { cn } from "@/lib/utils"

// Mock data - same as in gallery
const ALL_GALLERY_ITEMS = [
  {
    id: 1,
    title: "Modern Villa",
    type: "3D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-18T05:21:09",
  },
  {
    id: 2,
    title: "Apartment Layout",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-17T10:30:00",
  },
  {
    id: 3,
    title: "Office Space",
    type: "3D",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-16T14:00:00",
  },
  {
    id: 4,
    title: "Studio Design",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-15T09:15:00",
  },
  {
    id: 5,
    title: "Family Home",
    type: "3D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-14T18:45:00",
  },
  {
    id: 6,
    title: "Loft Space",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-13T11:20:00",
  },
  {
    id: 7,
    title: "Restaurant Layout",
    type: "3D",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-12T07:00:00",
  },
  {
    id: 8,
    title: "Tiny House",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-11T20:00:00",
  },
  {
    id: 9,
    title: "Warehouse Design",
    type: "3D",
    category: "Industrial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-10T16:30:00",
  },
  {
    id: 10,
    title: "Penthouse Suite",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-09T13:00:00",
  },
  {
    id: 11,
    title: "Retail Store",
    type: "3D",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-08T10:00:00",
  },
  {
    id: 12,
    title: "Cottage Plan",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-07T08:00:00",
  },
  {
    id: 13,
    title: "Beach House",
    type: "3D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-06T15:00:00",
  },
  {
    id: 14,
    title: "Urban Apartment",
    type: "2D",
    category: "Residential",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-05T11:00:00",
  },
  {
    id: 15,
    title: "Cafe Design",
    type: "3D",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-04T09:00:00",
  },
  {
    id: 16,
    title: "Small Office",
    type: "2D",
    category: "Commercial",
    image: "/placeholder.svg?height=300&width=400",
    date: "2025-07-03T17:00:00",
  },
]

export default function ProjectDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isSignedIn } = useAuth()
  const projectId = Number(params.id)

  const project = ALL_GALLERY_ITEMS.find((item) => item.id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist.</p>
          <Button onClick={() => router.back()}>Go Back</Button>
        </div>
      </div>
    )
  }

  const handleMoveToMyProjects = () => {
    if (!isSignedIn) {
      router.push("/auth/signup")
      return
    }
    showNotification({
      title: "Success",
      message: `"${project.title}" has been saved to My Projects`,
      type: "success",
      duration: 4000,
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-background"
    >
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Gallery
          </Button>
          <Badge variant="secondary">{project.type}</Badge>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative w-full h-96 md:h-[500px] rounded-lg overflow-hidden mb-8 shadow-lg"
        >
          <Image src={project.image || "/placeholder.svg"} alt={project.title} fill className="object-cover" priority />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8 mb-8"
        >
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4">{project.title}</h1>
            <p className="text-muted-foreground mb-6">
              A beautiful {project.category.toLowerCase()} space designed with precision and creativity.
            </p>

            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <p className="text-sm text-muted-foreground">Type</p>
                <p className="text-lg font-semibold">{project.type}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Category</p>
                <p className="text-lg font-semibold">{project.category}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Created</p>
                <p className="text-lg font-semibold">{new Date(project.date).toLocaleDateString("en-GB")}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Size</p>
                <p className="text-lg font-semibold">2500 sq ft</p>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-4">About This Project</h2>
              <p className="text-foreground leading-relaxed">
                This is a professionally designed {project.category.toLowerCase()} space that showcases modern
                architectural principles. Every detail has been carefully considered to create a harmonious and
                functional environment. The design incorporates contemporary elements while maintaining timeless appeal.
              </p>
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-lg p-6 sticky top-8">
              <h3 className="font-semibold mb-4">Actions</h3>
              <div className="space-y-3">
                <Button className="w-full" variant="default">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Share2 className="mr-2 h-4 w-4" />
                  Share
                </Button>
                <Button className="w-full bg-transparent" variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button className="w-full bg-transparent" variant="outline" onClick={handleMoveToMyProjects}>
                  <Folder className="mr-2 h-4 w-4" />
                  Save to My Projects
                </Button>
                <Button className={cn("w-full", "text-destructive hover:text-destructive")} variant="outline">
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
