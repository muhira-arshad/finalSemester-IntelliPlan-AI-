"use client"

import { useRef, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls } from "@react-three/drei"
import type { Mesh } from "three"
import gsap from "gsap"

// Reusable AnimatedWall component for individual wall segments
interface AnimatedWallProps {
  position: [number, number, number]
  args: [number, number, number] // width, height, depth
  color: string
  delay?: number // Staggered animation delay
}

function AnimatedWall({ position, args, color, delay = 0 }: AnimatedWallProps) {
  const meshRef = useRef<Mesh>(null)

  useEffect(() => {
    if (meshRef.current) {
      // Animate wall appearance (scale up from bottom)
      gsap.fromTo(
        meshRef.current.scale,
        { y: 0.01 }, // Start with almost no height
        { y: 1, duration: 1.5, ease: "elastic.out(1, 0.5)", delay: delay },
      )
      gsap.fromTo(
        meshRef.current.position,
        { y: position[1] - args[1] / 2 }, // Start from below its final position
        { y: position[1], duration: 1.5, ease: "elastic.out(1, 0.5)", delay: delay },
      )
    }
  }, [position, args, delay])

  return (
    <mesh ref={meshRef} position={position}>
      <boxGeometry args={args} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.2} />
    </mesh>
  )
}

function FloorPlanElements() {
  return (
    <>
      <AnimatedWall position={[0, 0.5, -1]} args={[2, 1, 0.1]} color="#4F46E5" delay={0.1} /> {/* Back wall */}
      <AnimatedWall position={[0, 0.5, 1]} args={[2, 1, 0.1]} color="#4F46E5" delay={0.2} />  {/* Front wall */}
      <AnimatedWall position={[-1, 0.5, 0]} args={[0.1, 1, 2]} color="#4F46E5" delay={0.3} /> {/* Left wall */}
      <AnimatedWall position={[1, 0.5, 0]} args={[0.1, 1, 2]} color="#4F46E5" delay={0.4} />  {/* Right wall */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.1, 0.05, 2.1]} />
        <meshStandardMaterial color="#D1D5DB" />
      </mesh>
    </>
  )
}




export function FloorPlanGenerator3D() {
  return (
    
    <Canvas camera={{ position: [0, 0.5, 3], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <pointLight position={[5, 5, 5]} intensity={1} />
      <pointLight position={[-5, -5, -5]} intensity={0.8} />
      {/* FloorPlanElements is now empty, providing a blank canvas */}
      <FloorPlanElements />
      <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
      <Environment preset="city" />
    </Canvas>
  )
}
