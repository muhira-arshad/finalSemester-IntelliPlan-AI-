"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment } from "@react-three/drei"
import type { Mesh } from "three"
import gsap from "gsap"

// A component to represent a single animated abstract shape
function AbstractShape({
  position,
  color,
  scale,
  rotationSpeed,
  floatAmplitude,
  floatDuration,
  delay,
  geometryType = "sphere", // Added geometryType prop
}: {
  position: [number, number, number]
  color: string
  scale: number
  rotationSpeed: number
  floatAmplitude: number
  floatDuration: number
  delay: number
  geometryType?: "sphere" | "dodecahedron" | "torus"
}) {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += rotationSpeed / 2
      meshRef.current.rotation.y += rotationSpeed
      meshRef.current.rotation.z += rotationSpeed / 3
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        y: position[1] + floatAmplitude,
        duration: floatDuration,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: delay,
      })
      gsap.from(meshRef.current.scale, {
        x: 0.01,
        y: 0.01,
        z: 0.01,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        delay: delay + 0.5,
      })
    }
  }, [delay, floatAmplitude, floatDuration, position])

  const GeometryComponent = () => {
    switch (geometryType) {
      case "dodecahedron":
        return <dodecahedronGeometry args={[scale, 0]} />
      case "torus":
        return <torusGeometry args={[scale, scale / 2, 16, 32]} />
      case "sphere":
      default:
        return <sphereGeometry args={[scale, 32, 32]} />
    }
  }

  return (
    <mesh ref={meshRef} position={position}>
      <GeometryComponent />
      <meshStandardMaterial
        color={color}
        emissive={color}
        emissiveIntensity={0.8} // Increased emissive intensity
        roughness={0.5}
        metalness={0.8}
      />
    </mesh>
  )
}

export function AbstractGradientBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }} style={{ background: "#000000" }}>
        {" "}
        {/* Ensure black background */}
        <ambientLight intensity={0.5} /> {/* Slightly increased ambient light */}
        <pointLight position={[10, 10, 10]} intensity={1.5} /> {/* Increased point light intensity */}
        <pointLight position={[-10, -10, -10]} intensity={1} /> {/* Increased point light intensity */}
        <AbstractShape
          position={[-1.8, 1.5, -2]}
          color="#8a2be2" // Blue-violet
          scale={1.5} // Larger scale
          rotationSpeed={0.005}
          floatAmplitude={0.3}
          floatDuration={4}
          delay={0.5}
          geometryType="sphere"
        />
        <AbstractShape
          position={[2.2, -0.8, -1]}
          color="#ff69b4" // Hot pink
          scale={1.0}
          rotationSpeed={0.008}
          floatAmplitude={0.4}
          floatDuration={5}
          delay={1}
          geometryType="dodecahedron" // Varied shape
        />
        <AbstractShape
          position={[-0.7, -2.5, -3]}
          color="#4a00b0" // Darker purple
          scale={1.8} // Larger scale
          rotationSpeed={0.003}
          floatAmplitude={0.25}
          floatDuration={3}
          delay={1.5}
          geometryType="sphere"
        />
        <AbstractShape
          position={[1.5, 2.5, -2.5]}
          color="#00bfff" // Deep sky blue
          scale={1.2}
          rotationSpeed={0.006}
          floatAmplitude={0.35}
          floatDuration={4.5}
          delay={0.7}
          geometryType="torus" // Varied shape
        />
        <AbstractShape
          position={[-3, -0.5, -1.5]}
          color="#da70d6" // Orchid
          scale={0.9}
          rotationSpeed={0.007}
          floatAmplitude={0.2}
          floatDuration={3.5}
          delay={0.9}
          geometryType="sphere"
        />
        <AbstractShape
          position={[0.5, 3.5, -3.5]}
          color="#9370db" // Medium purple
          scale={1.1}
          rotationSpeed={0.004}
          floatAmplitude={0.3}
          floatDuration={4.2}
          delay={1.2}
          geometryType="dodecahedron"
        />
        <Environment preset="night" /> {/* Provides a dark, atmospheric environment */}
      </Canvas>
    </div>
  )
}
