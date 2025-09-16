"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Line } from "@react-three/drei"
import type { Mesh, Group } from "three"
import gsap from "gsap"

function AnimatedCategoryElements() {
  const groupRef = useRef<Group>(null)
  const planeRef = useRef<Mesh>(null)
  const dodecahedronRef = useRef<Mesh>(null)
  const cylinderRef = useRef<Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0003
    }
    if (planeRef.current) {
      planeRef.current.rotation.x += 0.0005
      planeRef.current.rotation.y += 0.0005
    }
    if (dodecahedronRef.current) {
      dodecahedronRef.current.rotation.x += 0.0008
      dodecahedronRef.current.rotation.z += 0.0008
    }
    if (cylinderRef.current) {
      cylinderRef.current.rotation.y += 0.001
    }
  })

  useEffect(() => {
    if (planeRef.current) {
      gsap.to(planeRef.current.position, {
        duration: 10,
        y: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
    if (dodecahedronRef.current) {
      gsap.to(dodecahedronRef.current.position, {
        duration: 8,
        x: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
    if (cylinderRef.current) {
      gsap.to(cylinderRef.current.position, {
        duration: 12,
        z: 0.6,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Large, subtle plane */}
      <mesh ref={planeRef} position={[0, 0, -2]}>
        <planeGeometry args={[5, 5, 1, 1]} />
        <meshBasicMaterial color="#333333" transparent opacity={0.1} wireframe />
      </mesh>

      {/* Dodecahedron */}
      <mesh ref={dodecahedronRef} position={[-1.5, 0.5, -0.5]}>
        <dodecahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#8a2be2" roughness={0.6} metalness={0.5} transparent opacity={0.6} />
      </mesh>

      {/* Cylinder */}
      <mesh ref={cylinderRef} position={[1.2, -0.7, 0.8]}>
        <cylinderGeometry args={[0.3, 0.3, 0.8, 32]} />
        <meshStandardMaterial color="#ff69b4" roughness={0.7} metalness={0.2} transparent opacity={0.6} />
      </mesh>

      {/* Connecting Lines */}
      <Line
        points={[
          [-1.5, 0.5, -0.5],
          [0, 0, 0],
          [1.2, -0.7, 0.8],
        ]}
        color="#d8b4fe"
        lineWidth={1.5}
        dashed={true}
        dashScale={0.5}
      />
    </group>
  )
}

export function Category3DBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <AnimatedCategoryElements />
        <Environment preset="city" /> {/* Changed environment to city */}
      </Canvas>
    </div>
  )
}
