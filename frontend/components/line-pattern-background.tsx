"use client"

import { Canvas } from "@react-three/fiber"
import { Line, Environment } from "@react-three/drei"
import { Vector3 } from "three"

function StaticLinePattern() {
  const lineColor = "#4A4A4A" // Darker gray for subtle lines
  const lineWidth = 0.8

  // Define points for a grid-like pattern with some diagonals
  const lines = [
    // Horizontal lines
    [new Vector3(-2, 0, 1.5), new Vector3(2, 0, 1.5)],
    [new Vector3(-2, 0, 0.5), new Vector3(2, 0, 0.5)],
    [new Vector3(-2, 0, -0.5), new Vector3(2, 0, -0.5)],
    [new Vector3(-2, 0, -1.5), new Vector3(2, 0, -1.5)],

    // Vertical lines
    [new Vector3(-1.5, 0, -2), new Vector3(-1.5, 0, 2)],
    [new Vector3(-0.5, 0, -2), new Vector3(-0.5, 0, 2)],
    [new Vector3(0.5, 0, -2), new Vector3(0.5, 0, 2)],
    [new Vector3(1.5, 0, -2), new Vector3(1.5, 0, 2)],

    // Diagonal connections for visual interest
    [new Vector3(-2, 0, 1.5), new Vector3(-0.5, 0, -0.5)],
    [new Vector3(2, 0, 1.5), new Vector3(0.5, 0, -0.5)],
    [new Vector3(-1.5, 0, 2), new Vector3(0.5, 0, -1.5)],
    [new Vector3(1.5, 0, 2), new Vector3(-0.5, 0, -1.5)],
    [new Vector3(-0.5, 0, 0.5), new Vector3(0.5, 0, -0.5)],
    [new Vector3(0.5, 0, 0.5), new Vector3(-0.5, 0, -0.5)],
  ]

  return (
    <group rotation={[Math.PI / 4, Math.PI / 8, 0]}>
      {" "}
      {/* Slight initial rotation for perspective */}
      {lines.map((points, index) => (
        <Line key={index} points={points} color={lineColor} lineWidth={lineWidth} transparent opacity={0.6} />
      ))}
    </group>
  )
}

export function LinePatternBackground() {
  return (
    <div className="absolute inset-0 z-0">
      <Canvas camera={{ position: [0, 2, 5], fov: 75 }}>
        {" "}
        {/* Adjust camera for a good view of the lines */}
        <ambientLight intensity={0.5} />
        <Environment preset="city" /> {/* Keeps a dark, ambient environment */}
        <StaticLinePattern />
      </Canvas>
    </div>
  )
}
