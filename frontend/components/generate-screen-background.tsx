"use client"

import { useRef, useMemo, Suspense } from "react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Stars, Environment } from "@react-three/drei"
import type { Mesh } from "three"
import * as THREE from "three"

function FloatingShape({
  position,
  color,
  scale,
  rotationSpeed,
  floatAmplitude,
  geometryType,
}: {
  position: [number, number, number]
  color: string
  scale: number
  rotationSpeed: number
  floatAmplitude: number
  geometryType: "sphere" | "dodecahedron" | "torus" | "octahedron" | "icosahedron"
}) {
  const meshRef = useRef<Mesh>(null)
  const initialY = useRef(position[1])
  const time = useRef(Math.random() * Math.PI * 2)

  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: color,
        emissive: color,
        emissiveIntensity: 0.5,
        roughness: 0.4,
        metalness: 0.7,
        transparent: true,
        opacity: 0.8,
      }),
    [color],
  )

  useFrame((_, delta) => {
    if (meshRef.current) {
      time.current += delta * 0.5
      meshRef.current.rotation.x += rotationSpeed * delta
      meshRef.current.rotation.y += rotationSpeed * delta * 1.5
      meshRef.current.position.y = initialY.current + Math.sin(time.current) * floatAmplitude
    }
  })

  const geometry = useMemo(() => {
    switch (geometryType) {
      case "dodecahedron":
        return <dodecahedronGeometry args={[scale, 0]} />
      case "torus":
        return <torusGeometry args={[scale, scale / 3, 12, 24]} />
      case "octahedron":
        return <octahedronGeometry args={[scale, 0]} />
      case "icosahedron":
        return <icosahedronGeometry args={[scale, 0]} />
      default:
        return <sphereGeometry args={[scale, 24, 24]} />
    }
  }, [geometryType, scale])

  return (
    <mesh ref={meshRef} position={position} material={material}>
      {geometry}
    </mesh>
  )
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#ff69b4" />
      <pointLight position={[-10, -10, -10]} intensity={0.6} color="#8a2be2" />
      <pointLight position={[0, 5, 5]} intensity={0.5} color="#ffd700" />

      <Stars radius={100} depth={50} count={3000} factor={4} fade speed={0.5} />

      {/* Top-left cluster */}
      <FloatingShape
        position={[-4, 3, -4]}
        color="#8a2be2"
        scale={1.0}
        rotationSpeed={0.3}
        floatAmplitude={0.4}
        geometryType="sphere"
      />
      <FloatingShape
        position={[-3, 4, -5]}
        color="#da70d6"
        scale={0.5}
        rotationSpeed={0.4}
        floatAmplitude={0.3}
        geometryType="octahedron"
      />

      {/* Top-right cluster */}
      <FloatingShape
        position={[4, 3, -3]}
        color="#ff69b4"
        scale={0.8}
        rotationSpeed={0.5}
        floatAmplitude={0.35}
        geometryType="dodecahedron"
      />
      <FloatingShape
        position={[5, 2, -4]}
        color="#ffd700"
        scale={0.4}
        rotationSpeed={0.6}
        floatAmplitude={0.25}
        geometryType="icosahedron"
      />

      {/* Bottom-left cluster */}
      <FloatingShape
        position={[-4.5, -2.5, -3]}
        color="#00bfff"
        scale={0.7}
        rotationSpeed={0.35}
        floatAmplitude={0.3}
        geometryType="torus"
      />
      <FloatingShape
        position={[-3, -3.5, -5]}
        color="#9370db"
        scale={0.9}
        rotationSpeed={0.25}
        floatAmplitude={0.4}
        geometryType="sphere"
      />

      {/* Bottom-right cluster */}
      <FloatingShape
        position={[4, -3, -4]}
        color="#4a00b0"
        scale={1.1}
        rotationSpeed={0.3}
        floatAmplitude={0.35}
        geometryType="sphere"
      />
      <FloatingShape
        position={[3.5, -2, -3]}
        color="#ff1493"
        scale={0.45}
        rotationSpeed={0.5}
        floatAmplitude={0.2}
        geometryType="octahedron"
      />

      {/* Center floating elements */}
      <FloatingShape
        position={[1, 1, -6]}
        color="#ba55d3"
        scale={1.3}
        rotationSpeed={0.15}
        floatAmplitude={0.5}
        geometryType="icosahedron"
      />
      <FloatingShape
        position={[-1, -1, -7]}
        color="#7b68ee"
        scale={1.5}
        rotationSpeed={0.1}
        floatAmplitude={0.45}
        geometryType="dodecahedron"
      />

      <Environment preset="night" />
    </>
  )
}

export function GenerateScreenBackground() {
  return (
    <>
      {/* Gradient base layer */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900/30 to-slate-900 z-0" />

      {/* 3D Canvas layer */}
      <div className="fixed inset-0 z-[1]" style={{ pointerEvents: "none" }}>
        <Canvas
          camera={{ position: [0, 0, 6], fov: 75 }}
          dpr={[1, 1.5]}
          gl={{ alpha: true, antialias: true, powerPreference: "high-performance" }}
          style={{ background: "transparent" }}
        >
          <Suspense fallback={null}>
            <Scene />
          </Suspense>
        </Canvas>
      </div>
    </>
  )
}
