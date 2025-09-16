"use client"

import { useRef, useEffect } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, Stars } from "@react-three/drei"
import type { Mesh, Group } from "three"
import gsap from "gsap"
import { Line } from "@react-three/drei"

function AnimatedHomeElements() {
  const groupRef = useRef<Group>(null)
  const sphereRef = useRef<Mesh>(null)
  const boxRef = useRef<Mesh>(null)
  const octahedronRef = useRef<Mesh>(null)

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.0002
    }
    if (sphereRef.current) {
      sphereRef.current.rotation.x += 0.0005
    }
    if (boxRef.current) {
      boxRef.current.rotation.y += 0.0007
    }
    if (octahedronRef.current) {
      octahedronRef.current.rotation.z += 0.0006
    }
  })

  useEffect(() => {
    if (sphereRef.current) {
      gsap.to(sphereRef.current.position, {
        duration: 7,
        y: 0.3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      })
      gsap.to(sphereRef.current.scale, {
        duration: 5,
        x: 1.1,
        y: 1.1,
        z: 1.1,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      })
    }
    if (boxRef.current) {
      gsap.to(boxRef.current.position, {
        duration: 6,
        x: -0.4,
        repeat: -1,
        yoyo: true,
        ease: "power2.inOut",
      })
    }
    if (octahedronRef.current) {
      gsap.to(octahedronRef.current.position, {
        duration: 8,
        z: 0.5,
        repeat: -1,
        yoyo: true,
        ease: "power3.inOut",
      })
    }
  }, [])

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Sphere */}
      <mesh ref={sphereRef} position={[-1.5, 0.5, -1]}>
        <sphereGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial color="#6a0dad" roughness={0.5} metalness={0.8} transparent opacity={0.7} />
      </mesh>

      {/* Box */}
      <mesh ref={boxRef} position={[1, -0.8, -0.5]}>
        <boxGeometry args={[0.6, 0.6, 0.6]} />
        <meshStandardMaterial color="#ff1493" roughness={0.7} metalness={0.2} transparent opacity={0.7} />
      </mesh>

      {/* Octahedron */}
      <mesh ref={octahedronRef} position={[0, 1.2, -1.2]}>
        <octahedronGeometry args={[0.4, 0]} />
        <meshStandardMaterial color="#00ced1" roughness={0.6} metalness={0.5} transparent opacity={0.7} />
      </mesh>

      {/* Connecting Lines */}
      <Line
        points={[
          [-1.5, 0.5, -1],
          [0, 0, 0],
          [1, -0.8, -0.5],
        ]}
        color="#9370db"
        lineWidth={1.5}
        dashed={true}
        dashScale={0.5}
      />
      <Line
        points={[
          [1, -0.8, -0.5],
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

export function Home3DBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 0, 3], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[5, 5, 5]} intensity={1} />
        <pointLight position={[-5, -5, -5]} intensity={0.8} />
        <Stars radius={50} depth={50} count={5000} factor={4} saturation={0} fade />
        <AnimatedHomeElements />
        <Environment preset="night" /> {/* Changed environment preset for a different feel */}
      </Canvas>
    </div>
  )
}
