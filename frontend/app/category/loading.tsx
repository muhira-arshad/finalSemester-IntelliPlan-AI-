export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="relative w-24 h-24">
        <div className="absolute inset-0 border-4 border-t-0 border-r-0 border-b-4 border-l-4 border-yellow-400 rounded-full animate-spin"></div>
        <div className="absolute inset-0 flex items-center justify-center text-yellow-400 text-5xl font-bold">
          {/* This is a simple representation of the winking smiley, adjust as needed */}
          <span className="relative top-[-0.1em] right-[-0.05em]">)</span>
          <span className="relative top-[-0.1em] left-[-0.05em]">.</span>
        </div>
      </div>
    </div>
  )
}
// 