"use client"

import { useEffect, useRef } from "react"
import type * as THREE from "three"

export function ThreeDAdvancedBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | undefined>(undefined)

  useEffect(() => {
    if (!mountRef.current) return

    const initThree = async () => {
      const THREE = await import("three")

      const scene = new THREE.Scene()
      sceneRef.current = scene

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      rendererRef.current = renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x1a1a2e, 0.5)
      mountRef.current?.appendChild(renderer.domElement)

      // Stars
      const starsGeometry = new THREE.BufferGeometry()
      const starsCount = 2000
      const starsPositions = new Float32Array(starsCount * 3)
      const starsColors = new Float32Array(starsCount * 3)

      for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 20
        starsPositions[i + 1] = (Math.random() - 0.5) * 20
        starsPositions[i + 2] = (Math.random() - 0.5) * 20

        const colorChoice = Math.random()
        if (colorChoice < 0.4) {
          starsColors[i] = 1
          starsColors[i + 1] = 0.84
          starsColors[i + 2] = 0.2
        } else if (colorChoice < 0.7) {
          starsColors[i] = 1
          starsColors[i + 1] = 1
          starsColors[i + 2] = 1
        } else {
          starsColors[i] = 0.82
          starsColors[i + 1] = 0.82
          starsColors[i + 2] = 0.82
        }
      }

      starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3))
      starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3))

      const starsMaterial = new THREE.PointsMaterial({
        size: 0.008,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })

      const starsMesh = new THREE.Points(starsGeometry, starsMaterial)
      scene.add(starsMesh)

      // Floating particles
      const floatingGeometry = new THREE.BufferGeometry()
      const floatingCount = 300
      const floatingPositions = new Float32Array(floatingCount * 3)
      const floatingColors = new Float32Array(floatingCount * 3)

      for (let i = 0; i < floatingCount * 3; i += 3) {
        floatingPositions[i] = (Math.random() - 0.5) * 15
        floatingPositions[i + 1] = (Math.random() - 0.5) * 15
        floatingPositions[i + 2] = (Math.random() - 0.5) * 15

        floatingColors[i] = 0.3 + Math.random() * 0.2
        floatingColors[i + 1] = 0.6 + Math.random() * 0.3
        floatingColors[i + 2] = 1
      }

      floatingGeometry.setAttribute("position", new THREE.BufferAttribute(floatingPositions, 3))
      floatingGeometry.setAttribute("color", new THREE.BufferAttribute(floatingColors, 3))

      const floatingMaterial = new THREE.PointsMaterial({
        size: 0.015,
        vertexColors: true,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
      })

      const floatingMesh = new THREE.Points(floatingGeometry, floatingMaterial)
      scene.add(floatingMesh)

      // Mouse interaction
      let mouseX = 0
      let mouseY = 0

      const handleMouseMove = (event: MouseEvent) => {
        mouseX = (event.clientX / window.innerWidth) * 2 - 1
        mouseY = -(event.clientY / window.innerHeight) * 2 + 1
      }

      window.addEventListener("mousemove", handleMouseMove)

      // Animation loop
      const animate = () => {
        animationIdRef.current = requestAnimationFrame(animate)

        camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.01
        camera.position.y += (mouseY * 0.3 - camera.position.y) * 0.01

        starsMesh.rotation.y += 0.0001
        floatingMesh.rotation.z += 0.0003

        renderer.render(scene, camera)
      }
      animate()

      const handleResize = () => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }
      window.addEventListener("resize", handleResize)

      return () => {
        window.removeEventListener("resize", handleResize)
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }

    initThree()

    return () => {
      if (animationIdRef.current !== undefined) {
        cancelAnimationFrame(animationIdRef.current)
      }

      if (sceneRef.current) {
        sceneRef.current.traverse((object) => {
          const mesh = object as THREE.Mesh
          if (mesh.geometry) {
            mesh.geometry.dispose()
          }
          if (mesh.material) {
            if (Array.isArray(mesh.material)) {
              mesh.material.forEach((material) => material.dispose())
            } else {
              mesh.material.dispose()
            }
          }
        })
      }

      if (rendererRef.current) {
        rendererRef.current.dispose()
        if (mountRef.current && rendererRef.current.domElement) {
          mountRef.current.removeChild(rendererRef.current.domElement)
        }
      }
    }
  }, [])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}
