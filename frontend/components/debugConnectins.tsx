// components/DebugConnection.tsx
"use client"

import { useState, useEffect } from "react"

export default function DebugConnection() {
  const [status, setStatus] = useState<{
    backend: 'checking' | 'connected' | 'error'
    cities: string[]
    totalOptions: number
    error?: string
  }>({
    backend: 'checking',
    cities: [],
    totalOptions: 0
  })

  useEffect(() => {
    checkConnection()
  }, [])

  const checkConnection = async () => {
    try {
      // Test 1: Check cities endpoint
      const citiesRes = await fetch('/api/cities')
      const citiesData = await citiesRes.json()
      
      if (citiesData.error) {
        setStatus({
          backend: 'error',
          cities: [],
          totalOptions: 0,
          error: citiesData.error
        })
        return
      }

      // Test 2: Check form options
      const optionsRes = await fetch('/api/form-options')
      const optionsData = await optionsRes.json()
      
      if (optionsData.error) {
        setStatus({
          backend: 'error',
          cities: citiesData.cities || [],
          totalOptions: 0,
          error: optionsData.error
        })
        return
      }

      // Count total options
      let total = 0
      Object.values(optionsData.cities || {}).forEach((city: any) => {
        Object.values(city.authorities || {}).forEach((auth: any) => {
          total += Object.keys(auth.plot_sizes || {}).length
        })
      })

      setStatus({
        backend: 'connected',
        cities: citiesData.cities || [],
        totalOptions: total,
      })
    } catch (error) {
      setStatus({
        backend: 'error',
        cities: [],
        totalOptions: 0,
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
  }

  if (status.backend === 'checking') {
    return (
      <div className="fixed bottom-4 right-4 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-lg">
        🔄 Checking Flask connection...
      </div>
    )
  }

  if (status.backend === 'error') {
    return (
      <div className="fixed bottom-4 right-4 bg-red-500 text-white px-4 py-3 rounded-lg shadow-lg max-w-md">
        <div className="font-bold mb-1">❌ Flask Backend Error</div>
        <div className="text-sm">{status.error}</div>
        <button 
          onClick={checkConnection}
          className="mt-2 bg-white text-red-500 px-3 py-1 rounded text-sm hover:bg-gray-100"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-3 rounded-lg shadow-lg">
      <div className="font-bold mb-1">✅ Flask Connected</div>
      <div className="text-sm">
        🏙️ Cities: {status.cities.join(', ')}
      </div>
      <div className="text-sm">
        📊 Total Options: {status.totalOptions}
      </div>
      <button 
        onClick={checkConnection}
        className="mt-2 bg-white text-green-500 px-3 py-1 rounded text-sm hover:bg-gray-100"
      >
        Refresh
      </button>
    </div>
  )
}

// Usage in your layout or page:
// import DebugConnection from '@/components/DebugConnection'
// 
// export default function RootLayout({ children }) {
//   return (
//     <html>
//       <body>
//         {children}
//         <DebugConnection />
//       </body>
//     </html>
//   )
// }