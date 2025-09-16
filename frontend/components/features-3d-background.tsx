"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Stars } from "@react-three/drei"
import type { Mesh, Group } from "three"
import gsap from "gsap"
import { Line } from "@react-three/drei"

function AnimatedPlanningElements() {
  const cubeRef = useRef<Mesh>(null)
  const pyramidRef = useRef<Mesh>(null)
  const torusKnotRef = useRef<Mesh>(null)
  const groupRef = useRef<Group>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0005
    }
    if (cubeRef.current) {
      cubeRef.current.rotation.x += 0.001
      cubeRef.current.rotation.y += 0.001
    }
    if (pyramidRef.current) {
      pyramidRef.current.rotation.y += 0.0015
      pyramidRef.current.rotation.z += 0.0008
    }
    if (torusKnotRef.current) {
      torusKnotRef.current.rotation.x += 0.0007
      torusKnotRef.current.rotation.y += 0.0007
    }
  })

  useEffect(() => {
    if (cubeRef.current) {
      gsap.to(cubeRef.current.position, {
        duration: 8,
        y: 0.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
    }
    if (pyramidRef.current) {
      gsap.to(pyramidRef.current.position, {
        duration: 7,
        x: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
    if (torusKnotRef.current) {
      gsap.to(torusKnotRef.current.position, {
        duration: 9,
        z: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Cube */}
      <mesh ref={cubeRef} position={[-1.5, 0.5, -1]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#a78bfa" roughness={0.5} metalness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* Pyramid */}
      <mesh ref={pyramidRef} position={[1, -0.8, -0.5]}>
        <coneGeometry args={[0.5, 0.8, 4]} /> {/* 4 segments for a pyramid */}
        <meshStandardMaterial color="#ff69b4" roughness={0.7} metalness={0.2} transparent opacity={0.7} />
      </mesh>

      {/* Torus Knot */}
      <mesh ref={torusKnotRef} position={[0, 1.2, -1.2]}>
        <torusKnotGeometry args={[0.3, 0.1, 100, 16]} />
        <meshStandardMaterial color="#8a2be2" roughness={0.6} metalness={0.5} transparent opacity={0.7} />
      </mesh>

      {/* Connecting Lines */}
      <Line
        points={[
          [-1.5, 0.5, -1],
          [0, 0, 0],
          [1, -0.8, -0.5],
        ]}
        color="#d8b4fe"
        lineWidth={1.5}
        dashed={true}
        dashScale={0.5}
      />
      <Line
        points={[
          [-1.5, 0.5, -1],
          [0, 0, 0],
          [0, 1.2, -1.2],
        ]}
        color="#ff69b4"
        lineWidth={1.5}
        dashed={true}
        dashScale={0.5}
      />
    </group>
  )
}

export function Features3DBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade />
        <AnimatedPlanningElements />
        <Environment preset="sunset" />
      </Canvas>
    </div>
  )
}
