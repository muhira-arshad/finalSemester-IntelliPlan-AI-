"use client"

import { Canvas } from "@react-three/fiber"
import { Stars, Sparkles as DreiBrushSparks } from "@react-three/drei"

export function AdvancedThreeDBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }} style={{ background: "transparent" }}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} fade />
        <DreiBrushSparks count={200} scale={2} size={5.5} speed={0.002} />
      </Canvas>
    </div>
  )
}
