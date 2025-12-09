export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-black via-gray-950 to-black text-white">
      <div className="relative">
        <div className="absolute inset-0 rounded-full bg-white/10 blur-xl animate-pulse" />
        <div className="relative flex items-center gap-2 text-sm font-semibold tracking-wide">
          <div className="h-2 w-2 rounded-full bg-white animate-ping" />
          Loading sign in...
        </div>
      </div>
    </div>
  )
}
