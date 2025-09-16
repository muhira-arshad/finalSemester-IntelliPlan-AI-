"use client"

import Link from "next/link"
import { useAuth } from "@/context/auth-context"
import { Card } from "@/components/ui/card"
import { LayoutGrid, ImageIcon, Folder } from "lucide-react"

export default function CategoryPage() {
  const { user } = useAuth()
  const firstName = user?.firstName || user?.email?.split("@")[0] || "Guest"

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white p-4 overflow-hidden">
      {/* Purple geometric objects */}
      <div className="absolute top-1/4 right-1/4 w-32 h-32 bg-purple-600 rounded-xl transform rotate-45 opacity-70 blur-xl" />
      <div className="absolute bottom-1/4 left-1/4 w-24 h-24 bg-purple-800 rounded-full opacity-50 blur-2xl" />

      <div className="text-center mb-12 z-10">
        <h1 className="text-5xl md:text-6xl font-bold mb-4">
          Welcome, <span className="text-purple-400 capitalize">{firstName}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-400">What would you like to do?</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 max-w-4xl w-full z-10">
        {/* Create Plan Card */}
        <Link href="/generate" className="group">
          <Card className="flex flex-col items-center justify-center p-8 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 rounded-lg shadow-lg h-48 w-full">
            <LayoutGrid className="w-16 h-16 text-yellow-400 mb-4" />
            <span className="text-xl font-semibold">Create plan</span>
          </Card>
        </Link>

        {/* Create Image Card */}
        <Link href="#" className="group">
          <Card className="flex flex-col items-center justify-center p-8 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 rounded-lg shadow-lg h-48 w-full">
            <ImageIcon className="w-16 h-16 text-yellow-400 mb-4" />
            <span className="text-xl font-semibold">Create image</span>
          </Card>
        </Link>

        {/* Create Project Card */}
        <Link href="#" className="group relative">
          <Card className="flex flex-col items-center justify-center p-8 bg-zinc-900 hover:bg-zinc-800 transition-colors duration-200 rounded-lg shadow-lg h-48 w-full">
            <Folder className="w-16 h-16 text-yellow-400 mb-4" />
            <span className="text-xl font-semibold">Create project</span>
            <span className="absolute top-2 right-2 bg-yellow-500 text-zinc-900 text-xs font-bold px-2 py-1 rounded-full">
              Pro
            </span>
          </Card>
        </Link>
      </div>
    </div>
  )
}
