"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import type { Group, Mesh } from "three"
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

function FloorPlan3DElements() {
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      // Subtle continuous rotation
      groupRef.current.rotation.y += 0.0005
      groupRef.current.rotation.x += 0.0001
    }
  })

  useEffect(() => {
    if (groupRef.current) {
      // Subtle floating animation for the entire group
      gsap.to(groupRef.current.position, {
        duration: 8,
        y: 0.1, // Small vertical float
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
  }, [])

  const wallColor = "#8A2BE2" // Purple color
  const wallThickness = 0.1
  const wallHeight = 1.0
  const floorHeight = 0.05 // Very thin floor/ceiling

  // Approximate dimensions for the overall structure to resemble the blueprint
  const overallWidth = 4.0
  const overallDepth = 2.5

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[Math.PI / 10, -Math.PI / 8, 0]}>
      {/* Floor */}
      <AnimatedWall
        position={[0, -wallHeight / 2 - floorHeight / 2, 0]}
        args={[overallWidth, floorHeight, overallDepth]}
        color={wallColor}
        delay={0}
      />

      {/* Outer Walls - Simplified to a main rectangular shape for clarity and performance */}
      {/* Back Wall */}
      <AnimatedWall
        position={[0, 0, -overallDepth / 2 + wallThickness / 2]}
        args={[overallWidth, wallHeight, wallThickness]}
        color={wallColor}
        delay={0.1}
      />
      {/* Front Wall */}
      <AnimatedWall
        position={[0, 0, overallDepth / 2 - wallThickness / 2]}
        args={[overallWidth, wallHeight, wallThickness]}
        color={wallColor}
        delay={0.2}
      />
      {/* Left Wall */}
      <AnimatedWall
        position={[-overallWidth / 2 + wallThickness / 2, 0, 0]}
        args={[wallThickness, wallHeight, overallDepth]}
        color={wallColor}
        delay={0.3}
      />
      {/* Right Wall */}
      <AnimatedWall
        position={[overallWidth / 2 - wallThickness / 2, 0, 0]}
        args={[wallThickness, wallHeight, overallDepth]}
        color={wallColor}
        delay={0.4}
      />

      {/* Simplified Internal Walls - Creating a basic room layout */}
      {/* Horizontal partition (middle) */}
      <AnimatedWall
        position={[0, 0, 0]}
        args={[overallWidth - wallThickness * 2, wallHeight, wallThickness]}
        color={wallColor}
        delay={0.5}
      />
      {/* Vertical partition (left room) */}
      <AnimatedWall
        position={[-overallWidth / 4, 0, overallDepth / 4]}
        args={[wallThickness, wallHeight, overallDepth / 2 - wallThickness]}
        color={wallColor}
        delay={0.6}
      />
      {/* Vertical partition (right room) */}
      <AnimatedWall
        position={[overallWidth / 4, 0, -overallDepth / 4]}
        args={[wallThickness, wallHeight, overallDepth / 2 - wallThickness]}
        color={wallColor}
        delay={0.7}
      />
    </group>
  )
}

export function ThreeDFloorPlanBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0.5, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <FloorPlan3DElements />
        <Environment preset="city" />
      </Canvas>
    </div>
  )
}
