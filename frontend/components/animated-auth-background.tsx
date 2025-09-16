"use client"

import { useRef, useEffect, useState } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Float, MeshDistortMaterial } from "@react-three/drei"
import { motion } from "framer-motion"
import gsap from "gsap"
import type * as THREE from "three"
import { FontLoader } from "three-stdlib"
import { TextGeometry } from "three-stdlib"
import type { Group, Mesh } from "three"

function FloatingGeometry() {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)
  const textRef = useRef<THREE.Mesh>(null)
  const [fontGeometry, setFontGeometry] = useState<THREE.BufferGeometry | null>(null)

  useEffect(() => {
    const loadFont = async () => {
      const loader = new FontLoader()
      const font = await loader.loadAsync("/fonts/helvetiker_bold.typeface.json") // ✅ Local path

      const geometry = new TextGeometry("IntelliPlan AI", {
        font,
        size: 0.3,
        height: 0.1,
        curveSegments: 12,
        bevelEnabled: false,
      } as any)

      setFontGeometry(geometry)
    }

    loadFont()
  }, [])

  useEffect(() => {
    if (!groupRef.current) return

    gsap.fromTo(
      groupRef.current.scale,
      { x: 0, y: 0, z: 0 },
      {
        x: 1,
        y: 1,
        z: 1,
        duration: 2,
        ease: "elastic.out(1, 0.5)",
        delay: 0.5,
      },
    )

    gsap.fromTo(
      groupRef.current.rotation,
      { y: -Math.PI },
      {
        y: 0,
        duration: 3,
        ease: "power2.out",
      },
    )
  }, [])

  useFrame((state) => {
    if (!groupRef.current) return

    const time = state.clock.getElapsedTime()
    groupRef.current.rotation.y = time * 0.1
    groupRef.current.rotation.x = Math.sin(time * 0.2) * 0.1

    if (sphereRef.current) {
      sphereRef.current.rotation.x = time * 0.3
      sphereRef.current.rotation.z = time * 0.2
    }

    if (torusRef.current) {
      torusRef.current.rotation.x = time * 0.4
      torusRef.current.rotation.y = time * 0.3
    }
  })

  return (
    <group ref={groupRef}>
      <Float speed={1.5} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh ref={sphereRef} position={[-2, 0, 0]}>
          <sphereGeometry args={[0.8, 32, 32]} />
          <MeshDistortMaterial color="#8A2BE2" distort={0.3} speed={2} roughness={0.2} metalness={0.8} />
        </mesh>
      </Float>

      <Float speed={2} rotationIntensity={0.3} floatIntensity={0.8}>
        <mesh ref={torusRef} position={[2, 0, 0]}>
          <torusGeometry args={[0.6, 0.3, 16, 32]} />
          <MeshDistortMaterial color="#FFD700" distort={0.4} speed={1.5} roughness={0.1} metalness={0.9} />
        </mesh>
      </Float>

      <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
        <mesh position={[0, 1.5, -1]}>
          <boxGeometry args={[0.8, 0.8, 0.8]} />
          <MeshDistortMaterial color="#FF6B6B" distort={0.2} speed={3} roughness={0.3} metalness={0.6} />
        </mesh>
      </Float>

      {fontGeometry && (
        <mesh ref={textRef} geometry={fontGeometry} position={[-1.5, -1.5, 0]} rotation={[0, 0, 0]}>
          <MeshDistortMaterial color="#FFFFFF" distort={0.1} speed={1} roughness={0.1} metalness={0.5} />
        </mesh>
      )}
    </group>
  )
}

export function AnimatedAuthBackground() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-black to-blue-900" />
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="absolute inset-0"
    >
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.3} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <pointLight position={[-10, -10, -10]} intensity={0.5} color="#8A2BE2" />
        <FloatingGeometry />
        <Environment preset="night" />
      </Canvas>

      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 pointer-events-none" />
    </motion.div>
  )
}
