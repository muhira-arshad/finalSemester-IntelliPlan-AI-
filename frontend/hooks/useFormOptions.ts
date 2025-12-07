// // hooks/useFormOptions.ts
// "use client"

// import { useState, useEffect } from 'react'

// interface FormOptions {
//   cities: Record<string, any>
//   global_options: {
//     orientation: string[]
//     facing: string[]
//     shape: string[]
//   }
// }

// interface UseFormOptionsReturn {
//   data: FormOptions | null
//   loading: boolean
//   error: string | null
//   retry: () => void
//   isBackendConnected: boolean
// }

// export function useFormOptions(): UseFormOptionsReturn {
//   const [data, setData] = useState<FormOptions | null>(null)
//   const [loading, setLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isBackendConnected, setIsBackendConnected] = useState(false)

//   const fetchData = async () => {
//     setLoading(true)
//     setError(null)

//     try {
//       console.log('🔄 Fetching form options...')
      
//       const response = await fetch('/api/form-options', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         cache: 'no-store',
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP ${response.status}: ${response.statusText}`)
//       }

//       const result = await response.json()

//       // Check if we got an error from the API
//       if (result.error) {
//         setError(result.error)
//         setIsBackendConnected(false)
//         console.error('❌ Backend error:', result.error)
//         return
//       }

//       // Validate data structure
//       if (!result.cities || Object.keys(result.cities).length === 0) {
//         setError('No cities data received from backend')
//         setIsBackendConnected(false)
//         console.error('❌ Invalid data structure:', result)
//         return
//       }

//       // Success!
//       setData(result)
//       setIsBackendConnected(true)
//       console.log('✅ Form options loaded successfully')
//       console.log(`📊 Cities: ${Object.keys(result.cities).join(', ')}`)
      
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Unknown error'
//       setError(`Failed to load form options: ${errorMessage}`)
//       setIsBackendConnected(false)
//       console.error('❌ Error fetching form options:', err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   useEffect(() => {
//     fetchData()
//   }, [])

//   return {
//     data,
//     loading,
//     error,
//     retry: fetchData,
//     isBackendConnected,
//   }
// }

// // components/FormOptionsLoader.tsx
// "use client"

// import { useFormOptions } from '@/hooks/useFormOptions'
// import { ReactNode } from 'react'

// interface FormOptionsLoaderProps {
//   children: (data: NonNullable<ReturnType<typeof useFormOptions>['data']>) => ReactNode
//   loadingComponent?: ReactNode
//   errorComponent?: (error: string, retry: () => void) => ReactNode
// }

// export default function FormOptionsLoader({
//   children,
//   loadingComponent,
//   errorComponent,
// }: FormOptionsLoaderProps) {
//   const { data, loading, error, retry, isBackendConnected } = useFormOptions()

//   if (loading) {
//     return (
//       loadingComponent || (
//         <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
//           <p className="text-gray-600">Loading form options from backend...</p>
//           <p className="text-sm text-gray-500">Connecting to Flask server on port 5000</p>
//         </div>
//       )
//     )
//   }

//   if (error || !data) {
//     return (
//       errorComponent?.(error || 'Unknown error', retry) || (
//         <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4 p-6">
//           <div className="text-red-500 text-6xl">⚠️</div>
//           <h2 className="text-2xl font-bold text-gray-800">Backend Connection Error</h2>
//           <div className="max-w-2xl text-center space-y-2">
//             <p className="text-red-600 font-medium">{error}</p>
//             <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-left">
//               <p className="font-semibold mb-2">Troubleshooting Steps:</p>
//               <ol className="list-decimal list-inside space-y-1 text-sm text-gray-700">
//                 <li>Ensure Flask backend is running on port 5000</li>
//                 <li>Check Flask terminal for errors</li>
//                 <li>Verify JSON files are loaded (should show "X plot sizes", not 0)</li>
//                 <li>Test Flask directly: <code className="bg-gray-200 px-1 rounded">curl http://127.0.0.1:5000/api/health</code></li>
//                 <li>Check <code className="bg-gray-200 px-1 rounded">.env.local</code> has: <code className="bg-gray-200 px-1 rounded">NEXT_PUBLIC_BACKEND_URL=http://127.0.0.1:5000</code></li>
//               </ol>
//             </div>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={retry}
//               className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
//             >
//               🔄 Retry Connection
//             </button>
//             <a
//               href="http://127.0.0.1:5000/api/health"
//               target="_blank"
//               rel="noopener noreferrer"
//               className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
//             >
//               🔍 Test Flask Direct
//             </a>
//           </div>
//           <p className="text-xs text-gray-500 mt-4">
//             Backend Status: <span className={isBackendConnected ? 'text-green-600' : 'text-red-600'}>
//               {isBackendConnected ? '✅ Connected' : '❌ Disconnected'}
//             </span>
//           </p>
//         </div>
//       )
//     )
//   }

//   return <>{children(data)}</>
// }

// // Usage Example: app/residential-form/page.tsx
// /*
// "use client"

// import FormOptionsLoader from '@/components/FormOptionsLoader'

// export default function ResidentialFormPage() {
//   return (
//     <FormOptionsLoader>
//       {(formOptions) => (
//         <div>
//           <h1>Residential Housing Form</h1>
          
//           <select>
//             <option value="">Select City</option>
//             {Object.keys(formOptions.cities).map((city) => (
//               <option key={city} value={city}>
//                 {city}
//               </option>
//             ))}
//           </select>

//           // Rest of your form...
//         </div>
//       )}
//     </FormOptionsLoader>
//   )
// }
// */

// // Alternative: Direct component usage
// /*
// "use client"

// import { useFormOptions } from '@/hooks/useFormOptions'

// export default function ResidentialForm() {
//   const { data, loading, error, retry, isBackendConnected } = useFormOptions()

//   if (loading) {
//     return <div>Loading...</div>
//   }

//   if (error) {
//     return (
//       <div>
//         <p>Error: {error}</p>
//         <button onClick={retry}>Retry</button>
//       </div>
//     )
//   }

//   if (!data) {
//     return <div>No data available</div>
//   }

//   return (
//     <form>
//       <select>
//         {Object.keys(data.cities).map((city) => (
//           <option key={city} value={city}>{city}</option>
//         ))}
//       </select>
//       // ... rest of form
//     </form>
//   )
// }
// */