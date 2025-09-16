"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Stars } from "@react-three/drei"
import type { Mesh, Group } from "three"
import gsap from "gsap"
import { Line } from "@react-three/drei"

function AbstractElements() {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<Mesh>(null)
  const torusRef = useRef<Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.001
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.0005
    }
    if (torusRef.current) {
      torusRef.current.rotation.y += 0.0007
    }
  })

  useEffect(() => {
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        duration: 8,
        y: 0.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
    if (sphereRef.current) {
      gsap.to(sphereRef.current.position, {
        duration: 5,
        x: 0.1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
      gsap.to(sphereRef.current.scale, {
        duration: 4,
        x: 1.05,
        y: 1.05,
        z: 1.05,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
    if (torusRef.current) {
      gsap.to(torusRef.current.position, {
        duration: 6,
        z: 0.15,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sphere */}
      <mesh ref={sphereRef} position={[-0.7, 0, 0.5]}>
        <sphereGeometry args={[0.4, 32, 32]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.6} metalness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Torus */}
      <mesh ref={torusRef} position={[0.7, 0, -0.5]}>
        <torusGeometry args={[0.3, 0.1, 16, 100]} />
        <meshStandardMaterial color="#ff69b4" roughness={0.6} metalness={0.2} transparent opacity={0.8} />
      </mesh>

      {/* Connecting lines (optional, for abstract flow) */}
      <Line
        points={[
          [-0.7, 0.4, 0.5],
          [0, 0, 0],
          [0.7, 0.4, -0.5],
        ]}
        color="#d8b4fe"
        lineWidth={2}
        dashed={true}
        dashScale={0.5}
      />
    </group>
  )
}

export function About3DScene() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 1.5, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <Stars radius={50} depth={30} count={2000} factor={2} saturation={0} fade />
        <AbstractElements />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
