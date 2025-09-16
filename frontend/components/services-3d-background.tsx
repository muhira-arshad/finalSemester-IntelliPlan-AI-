"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Line, Stars } from "@react-three/drei" // Added Stars
import type { Mesh } from "three"
import gsap from "gsap"

function FloatingElements() {
  const coneRef = useRef<Mesh>(null) // New shape
  const octaRef = useRef<Mesh>(null) // New shape
  const cylinderRef = useRef<Mesh>(null) // New shape

  useFrame(() => {
    if (coneRef.current) {
      coneRef.current.rotation.x += 0.002
      coneRef.current.rotation.y += 0.001
    }
    if (octaRef.current) {
      octaRef.current.rotation.y += 0.003
      octaRef.current.rotation.z += 0.001
    }
    if (cylinderRef.current) {
      cylinderRef.current.rotation.x += 0.001
      cylinderRef.current.rotation.z += 0.002
    }
  })

  useEffect(() => {
    // GSAP animations for floating effect
    if (coneRef.current) {
      gsap.to(coneRef.current.position, {
        duration: 6,
        y: 0.3,
        x: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
    if (octaRef.current) {
      gsap.to(octaRef.current.position, {
        duration: 7,
        y: -0.4,
        x: -0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
    if (cylinderRef.current) {
      gsap.to(cylinderRef.current.position, {
        duration: 8,
        y: 0.5,
        z: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
  }, [])

  return (
    <>
      {/* Abstract Shapes */}
      <mesh ref={coneRef} position={[-1.5, 0.5, -1]}>
        <coneGeometry args={[0.3, 0.6, 32]} /> {/* Cone geometry */}
        <meshStandardMaterial color="#a78bfa" roughness={0.5} metalness={0.8} />
      </mesh>
      <mesh ref={octaRef} position={[1, -0.8, -0.5]}>
        <octahedronGeometry args={[0.4, 0]} /> {/* Octahedron geometry */}
        <meshStandardMaterial color="#ff69b4" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh ref={cylinderRef} position={[0, 1.2, -1.2]}>
        <cylinderGeometry args={[0.2, 0.2, 0.8, 32]} /> {/* Cylinder geometry */}
        <meshStandardMaterial color="#8a2be2" roughness={0.6} metalness={0.5} />
      </mesh>

      {/* Animated Lines */}
      <Line
        points={[
          [-2, 2, -2],
          [0, 0, 0],
          [2, -2, -2],
        ]}
        color="#d8b4fe"
        lineWidth={2}
        dashed={true}
        dashScale={0.5}
      />
      <Line
        points={[
          [-2, 2, -1],
          [0, 0, 0],
          [2, -2, -1],
        ]}
        color="#ff69b4"
        lineWidth={1.5}
        dashed={true}
        dashScale={0.8}
      />
    </>
  )
}

export function Services3DBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade /> {/* Increased count and factor */}
        <FloatingElements />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
