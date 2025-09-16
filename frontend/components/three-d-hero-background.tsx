"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Environment } from "@react-three/drei"
import type { Mesh } from "three"
import gsap from "gsap"

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.005
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        duration: 5,
        y: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
      gsap.to(meshRef.current.scale, {
        duration: 3,
        x: 1.2,
        y: 1.2,
        z: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
  }, [])

  return (
    <mesh ref={meshRef} position={[0, 0, 0]}>
      <sphereGeometry args={[0.5, 32, 32]} />
      <meshStandardMaterial
        color="#8a2be2"
        emissive="#8a2be2"
        emissiveIntensity={0.5}
        roughness={0.5}
        metalness={0.8}
      />
    </mesh>
  )
}

function AnimatedDodecahedron() {
  const meshRef = useRef<Mesh>(null)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.007
    }
  })

  useEffect(() => {
    if (meshRef.current) {
      gsap.to(meshRef.current.position, {
        duration: 4,
        x: 0.8,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
      gsap.to(meshRef.current.rotation, {
        duration: 6,
        z: Math.PI * 2,
        repeat: -1,
        ease: "none",
      })
    }
  }, [])

  return (
    <mesh ref={meshRef} position={[-1.5, 0.5, -1]}>
      <dodecahedronGeometry args={[0.4, 0]} />
      <meshStandardMaterial
        color="#ff69b4"
        emissive="#ff69b4"
        emissiveIntensity={0.3}
        roughness={0.7}
        metalness={0.2}
      />
    </mesh>
  )
}

export function ThreeDHeroBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade />
        <AnimatedSphere />
        <AnimatedDodecahedron />
        <Environment preset="sunset" /> {/* Adds a nice ambient lighting */}
        {/* <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} /> */}
      </Canvas>
    </div>
  )
}
