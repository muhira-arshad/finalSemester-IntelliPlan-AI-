"use client"

import { useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import type * as THREE from "three"

export function ThreeDBackground() {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const animationIdRef = useRef<number | undefined>(undefined)
  const { theme } = useTheme()

  useEffect(() => {
    if (!mountRef.current) return

    const initThree = async () => {
      const THREE = await import("three")
      const { gsap } = await import("gsap")

      // Scene setup
      const scene = new THREE.Scene()
      sceneRef.current = scene

      // Camera setup
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
      camera.position.z = 5

      // Renderer setup
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
      rendererRef.current = renderer
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setClearColor(0x000000, 0)
      mountRef.current?.appendChild(renderer.domElement)

      // Create multiple particle systems for layered effect
      const particleSystems: THREE.Points[] = []

      // Main stars
      const starsGeometry = new THREE.BufferGeometry()
      const starsCount = 2000
      const starsPositions = new Float32Array(starsCount * 3)
      const starsColors = new Float32Array(starsCount * 3)

      for (let i = 0; i < starsCount * 3; i += 3) {
        starsPositions[i] = (Math.random() - 0.5) * 20
        starsPositions[i + 1] = (Math.random() - 0.5) * 20
        starsPositions[i + 2] = (Math.random() - 0.5) * 20

        // Color variation between purple and pink
        const colorChoice = Math.random()
        if (colorChoice < 0.3) {
          // Purple stars
          starsColors[i] = 0.54 // R
          starsColors[i + 1] = 0.36 // G
          starsColors[i + 2] = 0.96 // B
        } else if (colorChoice < 0.6) {
          // Pink stars
          starsColors[i] = 0.92 // R
          starsColors[i + 1] = 0.28 // G
          starsColors[i + 2] = 0.6 // B
        } else {
          // White stars
          starsColors[i] = 1
          starsColors[i + 1] = 1
          starsColors[i + 2] = 1
        }
      }

      starsGeometry.setAttribute("position", new THREE.BufferAttribute(starsPositions, 3))
      starsGeometry.setAttribute("color", new THREE.BufferAttribute(starsColors, 3))

      const starsMaterial = new THREE.PointsMaterial({
        size: 0.01,
        vertexColors: true,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending,
      })

      const starsMesh = new THREE.Points(starsGeometry, starsMaterial)
      scene.add(starsMesh)
      particleSystems.push(starsMesh)

      // Floating particles
      const floatingGeometry = new THREE.BufferGeometry()
      const floatingCount = 500
      const floatingPositions = new Float32Array(floatingCount * 3)
      const floatingColors = new Float32Array(floatingCount * 3)

      for (let i = 0; i < floatingCount * 3; i += 3) {
        floatingPositions[i] = (Math.random() - 0.5) * 15
        floatingPositions[i + 1] = (Math.random() - 0.5) * 15
        floatingPositions[i + 2] = (Math.random() - 0.5) * 15

        // Gradient colors
        floatingColors[i] = 0.8 + Math.random() * 0.2 // R
        floatingColors[i + 1] = 0.3 + Math.random() * 0.3 // G
        floatingColors[i + 2] = 0.9 + Math.random() * 0.1 // B
      }

      floatingGeometry.setAttribute("position", new THREE.BufferAttribute(floatingPositions, 3))
      floatingGeometry.setAttribute("color", new THREE.BufferAttribute(floatingColors, 3))

      const floatingMaterial = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        blending: THREE.AdditiveBlending,
      })

      const floatingMesh = new THREE.Points(floatingGeometry, floatingMaterial)
      scene.add(floatingMesh)
      particleSystems.push(floatingMesh)

      // Create geometric shapes
      const geometries = [
        new THREE.OctahedronGeometry(0.1),
        new THREE.TetrahedronGeometry(0.08),
        new THREE.IcosahedronGeometry(0.06),
      ]

      const shapeMaterials = [
        new THREE.MeshBasicMaterial({
          color: 0x8b5cf6,
          transparent: true,
          opacity: 0.3,
          wireframe: true,
        }),
        new THREE.MeshBasicMaterial({
          color: 0xec4899,
          transparent: true,
          opacity: 0.25,
          wireframe: true,
        }),
        new THREE.MeshBasicMaterial({
          color: 0xa855f7,
          transparent: true,
          opacity: 0.2,
          wireframe: true,
        }),
      ]

      const shapes: THREE.Mesh[] = []
      for (let i = 0; i < 20; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)]
        const material = shapeMaterials[Math.floor(Math.random() * shapeMaterials.length)]
        const shape = new THREE.Mesh(geometry, material)

        shape.position.set((Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 10)

        scene.add(shape)
        shapes.push(shape)

        // GSAP animation for shapes
        gsap.to(shape.rotation, {
          x: Math.PI * 2,
          y: Math.PI * 2,
          z: Math.PI * 2,
          duration: 10 + Math.random() * 10,
          repeat: -1,
          ease: "none",
        })

        gsap.to(shape.position, {
          y: shape.position.y + (Math.random() - 0.5) * 2,
          duration: 3 + Math.random() * 4,
          repeat: -1,
          yoyo: true,
          ease: "power2.inOut",
        })
      }

      // GSAP animations for particle systems
      gsap.to(starsMesh.rotation, {
        x: Math.PI * 2,
        duration: 100,
        repeat: -1,
        ease: "none",
      })

      gsap.to(floatingMesh.rotation, {
        y: Math.PI * 2,
        duration: 80,
        repeat: -1,
        ease: "none",
      })

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

        // Smooth camera movement based on mouse
        camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.02
        camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.02

        // Rotate particle systems
        particleSystems.forEach((system, index) => {
          system.rotation.x += 0.0005 * (index + 1)
          system.rotation.y += 0.001 * (index + 1)
        })

        // Animate shapes
        shapes.forEach((shape, index) => {
          shape.rotation.x += 0.002 * ((index % 3) + 1)
          shape.rotation.y += 0.003 * ((index % 2) + 1)
        })

        renderer.render(scene, camera)
      }
      animate()

      // Handle resize
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
    const mesh = object as THREE.Mesh; // Narrow type
    if (mesh.geometry) {
      mesh.geometry.dispose();
    }
    if (mesh.material) {
      if (Array.isArray(mesh.material)) {
        mesh.material.forEach((material) => material.dispose());
      } else {
        mesh.material.dispose();
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
  }, [theme])

  return <div ref={mountRef} className="fixed inset-0 -z-10" />
}
