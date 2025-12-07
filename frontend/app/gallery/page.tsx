"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, MoreHorizontal, ExternalLink, Pencil, Copy, Folder, Trash2, X, Eye } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ThreeDBackground } from "@/components/three-d-background"
import { motion, type Variants } from "framer-motion"
import { useAuth } from "@/context/auth-context"
import { useToast } from "@/components/ui/use-toast"

const ALL_GALLERY_ITEMS = [
  {
    id: 1,
    title: "Modern Villa",
    type: "3D",
    category: "Residential",
    image: "/images/modern villa Layout.jpg",
    date: "2025-07-18T05:21:09",
  },
  {
    id: 2,
    title: "Apartment Layout",
    type: "2D",
    category: "Residential",
    image: "/images/apartment-layout.jpg",
    date: "2025-07-17T10:30:00",
  },
  {
    id: 3,
    title: "Office Space",
    type: "3D",
    category: "Commercial",
    image: "/images/officespace.jpg",
    date: "2025-07-16T14:00:00",
  },
  {
    id: 4,
    title: "Studio Design",
    type: "2D",
    category: "Residential",
    image: "/images/studio.jfif",
    date: "2025-07-15T09:15:00",
  },
  {
    id: 5,
    title: "Family Home",
    type: "3D",
    category: "Residential",
    image: "/images/family home.jfif",
    date: "2025-07-14T18:45:00",
  },
  {
    id: 6,
    title: "Loft Space",
    type: "2D",
    category: "Residential",
    image: "/images/loft layout.webp",
    date: "2025-07-13T11:20:00",
  },
  {
    id: 7,
    title: "Restaurant Layout",
    type: "3D",
    category: "Commercial",
    image: "/images/Restaurant-layout.jpg",
    date: "2025-07-12T07:00:00",
  },
  {
    id: 8,
    title: "Tiny House",
    type: "2D",
    category: "Residential",
    image: "/images/tiny images.jfif",
    date: "2025-07-11T20:00:00",
  },
  {
    id: 9,
    title: "Warehouse Design",
    type: "3D",
    category: "Industrial",
    image: "/images/social-warehouse-layout.avif",
    date: "2025-07-10T16:30:00",
  },
  {
    id: 10,
    title: "Penthouse Suite",
    type: "2D",
    category: "Residential",
    image: "/images/penthouse.webp",
    date: "2025-07-09T13:00:00",
  },
   {
    id: 11,
    title: "Retail Store",
    type: "3D",
    category: "Commercial",
    image: "/images/retail store.webp",
    date: "2025-07-08T10:00:00",
  },
  {
    id: 12,
    title: "Cottage Plan",
    type: "2D",
    category: "Residential",
    image: "/images/cottage.jfif",
    date: "2025-07-07T08:00:00",
  },
  {
    id: 13,
    title: "Beach House",
    type: "3D",
    category: "Residential",
    image: "/images/beach.jfif",
    date: "2025-07-06T15:00:00",
  },
  {
    id: 14,
    title: "Urban Apartment",
    type: "2D",
    category: "Residential",
    image: "/images/urban apartment.jfif",
    date: "2025-07-05T11:00:00",
  },
  {
    id: 15,
    title: "Cafe Design",
    type: "3D",
    category: "Commercial",
    image: "/images/cafe.jfif",
    date: "2025-07-04T09:00:00",
  },
  {
    id: 16,
    title: "Small Office",
    type: "2D",
    category: "Commercial",
    image: "/images/small office.jpg",
    date: "2025-07-03T17:00:00",
  },
]

export default function GalleryPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("last-updated")
  const [selectedItem, setSelectedItem] = useState<(typeof ALL_GALLERY_ITEMS)[0] | null>(null)
  const [renameItem, setRenameItem] = useState<(typeof ALL_GALLERY_ITEMS)[0] | null>(null)
  const [newName, setNewName] = useState("")
  const itemsPerPage = 8
  const [loadedCount, setLoadedCount] = useState(itemsPerPage)

  const { isSignedIn } = useAuth()
  const router = useRouter()
  const { toast } = useToast()

  const filteredAndSortedItems = ALL_GALLERY_ITEMS.filter(
    (item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()),
  ).sort((a, b) => {
    if (sortBy === "last-updated") {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    } else if (sortBy === "name-asc") {
      return a.title.localeCompare(b.title)
    } else if (sortBy === "name-desc") {
      return b.title.localeCompare(a.title)
    }
    return 0
  })

  const displayedItems = filteredAndSortedItems.slice(0, loadedCount)
  const hasMore = loadedCount < filteredAndSortedItems.length

  const loadMore = () => {
    setLoadedCount((prev) => prev + itemsPerPage)
  }

  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.07,
        delayChildren: 0.2,
      },
    },
  }

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 20, rotateX: 0, rotateY: 0 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      scale: 1.03,
      rotateX: 3,
      rotateY: 3,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  const handleAction = (action: string, item?: (typeof ALL_GALLERY_ITEMS)[0]) => {
    switch (action) {
      case "open":
        setSelectedItem(item || null)
        break
      case "open-new-tab":
        if (item) {
          window.open(`/project/${item.id}`, "_blank")
        }
        break
      case "download":
        if (!isSignedIn) {
          router.push("/auth/signup")
          return
        }
        alert(`Downloading project: ${item?.title}`)
        break
      case "rename":
        setRenameItem(item || null)
        setNewName(item?.title || "")
        break
      case "duplicate":
        alert(`Duplicating project: ${item?.title}`)
        break
      case "move-to":
        if (!isSignedIn) {
          router.push("/auth/signup")
          return
        }
        toast({
          title: "Success",
          description: `"${item?.title}" has been saved to My Projects`,
        })
        break
      case "delete":
        if (confirm(`Are you sure you want to delete "${item?.title}"?`)) {
          alert(`Deleting project: ${item?.title}`)
        }
        break
      default:
        console.log(`Action: ${action}`)
    }
  }

  const handleRename = () => {
    if (newName.trim()) {
      alert(`Renamed "${renameItem?.title}" to "${newName}"`)
      setRenameItem(null)
      setNewName("")
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <div className="fixed inset-0 z-0">
        <ThreeDBackground />
      </div>
      <div className="relative z-10 w-full">
        <main className="p-4 lg:p-8 pt-8">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionVariants}
            className="text-center mb-8"
          >
            <Badge variant="secondary" className="mb-4">
              My Projects
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Your AI-Generated Floor Plans</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Manage and explore all your designs created with IntelliPlan AI
            </p>
          </motion.div>

          <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-center md:justify-start max-w-2xl">
            <div className="relative flex-1 w-full md:max-w-xs">
              <Input
                placeholder="Search by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 h-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent text-muted-foreground"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full md:w-auto bg-transparent">
                  {sortBy === "last-updated" ? "Last updated" : sortBy === "name-asc" ? "Name (A-Z)" : "Name (Z-A)"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="z-[9999]">
                <DropdownMenuItem onClick={() => setSortBy("last-updated")}>Last updated</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-asc")}>Name (A-Z)</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSortBy("name-desc")}>Name (Z-A)</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <motion.div
            className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <Link href="/generate">
              <motion.div variants={cardItemVariants} whileHover="hover" className="h-full">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 flex flex-col items-center justify-center p-6 h-full border-2 border-dashed border-primary/50 bg-primary/5">
                  <Plus className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-semibold text-xl text-primary">New Project</h3>
                  <p className="text-sm text-muted-foreground text-center">Start designing your next space</p>
                </Card>
              </motion.div>
            </Link>

            {displayedItems.map((item) => (
              <motion.div key={item.id} variants={cardItemVariants} whileHover="hover" className="h-full">
                <Card className="group cursor-pointer hover:shadow-lg transition-all duration-300 h-full flex flex-col">
                  <CardContent className="p-0 flex-1 flex flex-col">
                    <div className="relative overflow-hidden rounded-t-lg aspect-[4/3]">
                      <Image
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="sm" onClick={() => handleAction("open", item)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-lg">{item.title}</h3>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                              <span className="sr-only">More actions</span>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="z-[9999]">
                            <DropdownMenuItem onClick={() => handleAction("open-new-tab", item)}>
                              <ExternalLink className="mr-2 h-4 w-4" />
                              Open
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("rename", item)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleAction("duplicate", item)}>
                              <Copy className="mr-2 h-4 w-4" />
                              Duplicate
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleAction("move-to", item)}>
                              <Folder className="mr-2 h-4 w-4" />
                              Move To My Projects
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => handleAction("delete", item)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span>
                          {new Date(item.date).toLocaleDateString("en-GB", {
                            day: "2-digit",
                            month: "2-digit",
                            year: "numeric",
                          })}
                          ,{" "}
                          {new Date(item.date).toLocaleTimeString("en-GB", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {hasMore && (
            <div className="text-center mt-8">
              <Button onClick={loadMore} variant="outline">
                Load More
              </Button>
            </div>
          )}
        </main>
      </div>

      {selectedItem && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="bg-background rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
            <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-background">
              <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
              <Button variant="ghost" size="icon" onClick={() => setSelectedItem(null)} className="hover:bg-accent">
                <X className="h-6 w-6" />
                <span className="sr-only">Close</span>
              </Button>
            </div>
            <div className="p-6">
              <div className="relative aspect-video w-full mb-6 rounded-lg overflow-hidden">
                <Image
                  src={selectedItem.image || "/placeholder.svg"}
                  alt={selectedItem.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <p className="text-sm text-muted-foreground">Type</p>
                  <p className="text-lg font-semibold">{selectedItem.type}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Category</p>
                  <p className="text-lg font-semibold">{selectedItem.category}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Created</p>
                  <p className="text-lg font-semibold">{new Date(selectedItem.date).toLocaleDateString("en-GB")}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Size</p>
                  <p className="text-lg font-semibold">2500 sq ft</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button onClick={() => handleAction("download", selectedItem)}>Download</Button>
                <Button variant="outline">Share</Button>
                <Button variant="outline">Edit</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {renameItem && (
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
                <Button variant="outline" onClick={() => setRenameItem(null)} className="flex-1">
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
