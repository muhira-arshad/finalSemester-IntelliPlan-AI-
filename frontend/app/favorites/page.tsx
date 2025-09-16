"use client"

import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Heart } from "lucide-react"
import { ThreeDBackground } from "@/components/three-d-background" // Import the 3D background

export default function FavoritesPage() {
  const favoriteItems = [
    {
      id: 1,
      title: "Modern Villa",
      type: "3D",
      category: "Residential",
      image: "/placeholder.svg?height=300&width=400",
      likes: 124,
    },
    {
      id: 2,
      title: "Office Space",
      type: "3D",
      category: "Commercial",
      image: "/placeholder.svg?height=300&width=400",
      likes: 156,
    },
    {
      id: 3,
      title: "Tiny House",
      type: "2D",
      category: "Residential",
      image: "/placeholder.svg?height=300&width=400",
      likes: 234,
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
              My Favorites
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6 text-foreground">Your Liked Floor Plans</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse through the floor plans you've marked as your favorites from the gallery.
            </p>
          </div>

          {/* Favorites Grid */}
          {favoriteItems.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {favoriteItems.map((item) => (
                <Card
                  key={item.id}
                  className="group cursor-pointer hover:shadow-lg transition-all duration-300 bg-background/80 backdrop-blur-sm"
                >
                  <CardContent className="p-0">
                    <div className="relative overflow-hidden rounded-t-lg">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Button variant="secondary" size="sm">
                          View Details
                        </Button>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-foreground text-lg">{item.title}</h3>
                        <Badge variant="secondary">{item.type}</Badge>
                      </div>
                      <div className="flex items-center justify-between text-sm text-muted-foreground">
                        <span>{item.category}</span>
                        <div className="flex items-center space-x-1">
                          <Heart className="h-4 w-4 text-red-500 fill-red-500" />
                          <span>{item.likes}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground">You haven't favorited any plans yet.</p>
              <p className="text-muted-foreground">
                Explore the{" "}
                <Link href="/gallery" className="text-primary hover:underline">
                  gallery
                </Link>{" "}
                to find designs you love!
              </p>
            </div>
          )}

          {/* Load More */}
          {favoriteItems.length > 0 && (
            <div className="text-center mt-12">
              <Button variant="outline" size="lg">
                Load More Favorites
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
