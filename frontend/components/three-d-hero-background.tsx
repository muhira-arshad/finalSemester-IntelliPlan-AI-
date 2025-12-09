"use client"

import { useRef, useLayoutEffect, memo } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Environment } from "@react-three/drei"
import type { Mesh } from "three"
import gsap from "gsap"

function AnimatedSphere() {
  const meshRef = useRef<Mesh>(null)
  const initialized = useRef(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.005
      meshRef.current.rotation.y += 0.005
    }
  })

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !meshRef.current || initialized.current) return
    initialized.current = true

    const positionTween = gsap.to(meshRef.current.position, {
      duration: 5,
      y: 0.5,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    const scaleTween = gsap.to(meshRef.current.scale, {
      duration: 3,
      x: 1.2,
      y: 1.2,
      z: 1.2,
      repeat: -1,
      yoyo: true,
      ease: "power1.inOut",
    })

    return () => {
      positionTween.kill()
      scaleTween.kill()
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
  const initialized = useRef(false)

  useFrame(() => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.003
      meshRef.current.rotation.y += 0.007
    }
  })

  useLayoutEffect(() => {
    if (typeof window === "undefined" || !meshRef.current || initialized.current) return
    initialized.current = true

    const positionTween = gsap.to(meshRef.current.position, {
      duration: 4,
      x: 0.8,
      repeat: -1,
      yoyo: true,
      ease: "power2.inOut",
    })
    const rotationTween = gsap.to(meshRef.current.rotation, {
      duration: 6,
      z: Math.PI * 2,
      repeat: -1,
      ease: "none",
    })

    return () => {
      positionTween.kill()
      rotationTween.kill()
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

function ThreeDHeroBackgroundComponent() {
  if (typeof window === "undefined") return null

  return (
    <div className="absolute inset-0 z-0 bg-gradient-to-br from-black via-gray-950 to-black">
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true }}
        onCreated={({ gl }) => {
          gl.setClearColor("#05070f")
        }}
      >
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

export const ThreeDHeroBackground = memo(ThreeDHeroBackgroundComponent)
