"use client" // Error components must be Client Components

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { AlertCircle, RefreshCw } from 'lucide-react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Client-side error caught by error.tsx:", error)
  }, [error])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-black text-white p-4 text-center">
      <AlertCircle className="h-16 w-16 text-red-500 mb-6" />
      <h2 className="text-3xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-lg text-gray-400 mb-8">
        We apologize for the inconvenience. Please try again.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
        className="bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Try again
      </Button>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 p-4 bg-gray-800 rounded-lg text-left max-w-md">
          <h3 className="text-lg font-semibold text-red-400 mb-2">Error Details (Development Only):</h3>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap break-all">
            {error.message}
          </pre>
          {error.digest && (
            <p className="text-xs text-gray-500 mt-2">Digest: {error.digest}</p>
          )}
        </div>
      )}
    </div>
  )
}
