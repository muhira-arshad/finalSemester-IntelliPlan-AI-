"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Play,
  Zap,
  Eye,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Sparkles,
  LayoutGrid,
  MessageSquare,
  Users,
  X,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { ThreeDHeroBackground } from "@/components/three-d-hero-background"
import { MapPatternBackground } from "@/components/map-pattern-background"
import { About3DScene } from "@/components/about-3d-screen"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isVideoPlaying, setIsVideoPlaying] = useState(true)
  const [is3DReady, setIs3DReady] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)
  const router = useRouter()
  const { isSignedIn } = useAuth()

  // Updated gallery images with actual image paths
  const galleryImages = [
  {
    id: 1,
    title: "Modern Villa",
    type: "3D",
    category: "Residential",
    image: "/images/modern villa Layout.jpg",
    date: "2025-07-18T05:21:09",
  },
  {
    id: 2,
    title: "Apartment Layout",
    type: "2D",
    category: "Residential",
    image: "/images/apartment-layout.jpg",
    date: "2025-07-17T10:30:00",
  },
  {
    id: 3,
    title: "Office Space",
    type: "3D",
    category: "Commercial",
    image: "/images/officespace.jpg",
    date: "2025-07-16T14:00:00",
  },
  {
    id: 4,
    title: "Studio Design",
    type: "2D",
    category: "Residential",
    image: "/images/studio.jfif",
    date: "2025-07-15T09:15:00",
  },
  {
    id: 5,
    title: "Family Home",
    type: "3D",
    category: "Residential",
    image: "/images/family home.jfif",
    date: "2025-07-14T18:45:00",
  },
  {
    id: 6,
    title: "Loft Space",
    type: "2D",
    category: "Residential",
    image: "/images/loft layout.webp",
    date: "2025-07-13T11:20:00",
  },
  {
    id: 7,
    title: "Restaurant Layout",
    type: "3D",
    category: "Commercial",
    image: "/images/Restaurant-layout.jpg",
    date: "2025-07-12T07:00:00",
  },
  {
    id: 8,
    title: "Tiny House",
    type: "2D",
    category: "Residential",
    image: "/images/tiny images.jfif",
    date: "2025-07-11T20:00:00",
  },
  {
    id: 9,
    title: "Warehouse Design",
    type: "3D",
    category: "Industrial",
    image: "/images/social-warehouse-layout.avif",
    date: "2025-07-10T16:30:00",
  },
  {
    id: 10,
    title: "Penthouse Suite",
    type: "2D",
    category: "Residential",
    image: "/images/penthouse.webp",
    date: "2025-07-09T13:00:00",
  },
  {
    id: 11,
    title: "Retail Store",
    type: "3D",
    category: "Commercial",
    image: "/images/retail store.webp",
    date: "2025-07-08T10:00:00",
  },
  {
    id: 12,
    title: "Cottage Plan",
    type: "2D",
    category: "Residential",
    image: "/images/cottage.jfif",
    date: "2025-07-07T08:00:00",
  },
  {
    id: 13,
    title: "Beach House",
    type: "3D",
    category: "Residential",
    image: "/images/beach.jfif",
    date: "2025-07-06T15:00:00",
  },
  {
    id: 14,
    title: "Urban Apartment",
    type: "2D",
    category: "Residential",
    image: "/images/urban apartment.jfif",
    date: "2025-07-05T11:00:00",
  },
  {
    id: 15,
    title: "Cafe Design",
    type: "3D",
    category: "Commercial",
    image: "/images/cafe.jfif",
    date: "2025-07-04T09:00:00",
  },
  {
    id: 16,
    title: "Small Office",
    type: "2D",
    category: "Commercial",
    image: "/images/small office.jpg",
    date: "2025-07-03T17:00:00",
  },
]
  // Initialize 3D background after component mounts
  useEffect(() => {
    setIsMounted(true)
    // Small delay to ensure DOM is fully ready
    const timer = setTimeout(() => {
      setIs3DReady(true)
    }, 100)

    return () => clearTimeout(timer)
  }, [])

  // Autoplay logic for the carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length)
    }, 3000) // Change slide every 3 seconds

    return () => clearInterval(intervalId)
  }, [galleryImages.length])

  // Video control functions
  const toggleVideoPlay = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause()
      } else {
        videoRef.current.play()
      }
      setIsVideoPlaying(!isVideoPlaying)
    }
  }

  // Manual navigation functions for carousel
  const goToPrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)
  }

  const goToNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % galleryImages.length)
  }

  // Framer Motion Variants for sections (fade in from bottom)
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Framer Motion Variants for 2D/3D cards with more pronounced 3D tilt and hover
  const card3DVariants: Variants = {
    hidden: { opacity: 0, y: 50, rotateX: -10, rotateY: 0, transformPerspective: 500 },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      rotateY: 0,
      transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      scale: 1.05,
      rotateX: 5,
      rotateY: 5,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Framer Motion Variants for general floating elements (like the demo video placeholder)
  const floatingElementVariants: Variants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Framer Motion Variants for the new carousel items
  const carouselItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.7, x: 0, zIndex: 0 },
    left: {
      x: -300,
      opacity: 0.6,
      scale: 0.85,
      zIndex: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    center: {
      x: -50,
      opacity: 1,
      scale: 1,
      zIndex: 2,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    right: {
      x: 200,
      opacity: 0.6,
      scale: 0.85,
      zIndex: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  }

  // Features data
  const features = [
    {
      icon: <Sparkles className="h-6 w-6 text-primary" />,
      title: "AI-Powered Generation",
      description: "Leverage advanced AI to transform your textual descriptions into detailed floor plans.",
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: "Intuitive Chatbot Interface",
      description: "Communicate your design needs naturally through our user-friendly conversational AI.",
    },
    {
      icon: <LayoutGrid className="h-6 w-6 text-primary" />,
      title: "Customizable Layouts",
      description: "Specify room dimensions, number of rooms, and special requirements for tailored designs.",
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-primary" />,
      title: "High-Quality Outputs",
      description: "Receive clear, precise, and visually appealing floor plan images ready for use.",
    },
    {
      icon: <Users className="h-6 w-6 text-primary" />,
      title: "Multi-User Support",
      description: "Designed for individual users and teams, with scalable solutions for all.",
    },
  ]

  // Pricing plans data
  const pricingPlans = [
    {
      name: "Basic",
      price: "$19",
      period: "/month",
      description: "Perfect for trying out IntelliPlan AI.",
      features: [
        { text: "5 Floor Plan Generations/month", included: true },
        { text: "Basic AI Model", included: true },
        { text: "Standard Resolution", included: true },
        { text: "Community Support", included: true },
      ],
      buttonText: "Buy Now",
      link: "/auth/signup",
      badgeColor: "bg-blue-500",
      isHighlighted: false,
    },
    {
      name: "Standard",
      price: "$29",
      period: "/month",
      description: "For individuals and small projects.",
      features: [
        { text: "50 Floor Plan Generations/month", included: true },
        { text: "Advanced AI Model", included: true },
        { text: "High Resolution", included: true },
        { text: "Priority Email Support", included: true },
        { text: "Access to Premium Templates", included: true },
      ],
      buttonText: "Buy Now",
      link: "/auth/signup",
      badgeColor: "bg-cyan-400",
      isHighlighted: true,
    },
    {
      name: "Premium",
      price: "$39",
      period: "/month",
      description: "Tailored solutions for businesses and large-scale needs.",
      features: [
        { text: "Unlimited Generations", included: true },
        { text: "Dedicated AI Model", included: true },
        { text: "Ultra High Resolution", included: true },
        { text: "24/7 Phone & Chat Support", included: true },
        { text: "API Access & Integrations", included: true },
        { text: "Custom Training", included: true },
      ],
      buttonText: "Buy Now",
      link: "/services",
      badgeColor: "bg-blue-500",
      isHighlighted: false,
    },
  ]

  // Prevent SSR hydration mismatch
  if (!isMounted) {
    return (
      <div className="relative min-h-screen overflow-hidden bg-black text-white">
        <div className="fixed inset-0 z-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black" />
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dedicated container for the ThreeDHeroBackground */}
      <div className="fixed inset-0 z-0 w-full h-full">
        {is3DReady && <ThreeDHeroBackground />}
      </div>

      {/* Main content, now with a higher z-index and semi-transparent background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="relative container mx-auto px-4 py-20"
        >
          <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
            {/* Text content - takes 7 columns */}
            <div className="lg:col-span-7 space-y-6 lg:pr-12">
              <Badge variant="secondary" className="w-fit">
                AI-Powered Floor Planning
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-foreground">
                Transform Your Vision into
                <span className="text-primary"> Intelligent Floor Plans</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                IntelliPlan AI revolutionizes architectural design by generating stunning 2D floor plans through
                advanced artificial intelligence. Simply describe your requirements, and watch your dream space come to
                life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={() => {
                    if (isSignedIn) {
                      router.push("/generate")
                    } else {
                      router.push("/auth/signup?message=Please sign up to try the demo.")
                    }
                  }}
                >
                  Try Demo
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                <Link href="/features">
                  <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                    <Play className="mr-2 h-4 w-4" />
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>

            {/* Video card - takes 5 columns and is pushed to the right */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              variants={floatingElementVariants}
              whileHover="hover"
              className="lg:col-span-5 lg:ml-auto"
            >
              {/* Changed from aspect-video to custom height */}
              <div className="rounded-lg overflow-hidden shadow-xl relative group h-[400px] lg:h-[500px]">
                {/* Video Player */}
                <video
                  ref={videoRef}
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-full object-cover"
                  poster="/placeholder.svg?height=500&width=600"
                >
                  <source src="/images/video11 - Made with Clipchamp.mp4" type="video/mp4" />
                  Your browser does not support the video tag.
                </video>

                {/* Video Overlay with Play/Pause Button */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={toggleVideoPlay}
                      className="bg-black/60 hover:bg-black/80 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
                    >
                      {isVideoPlaying ? (
                        <div className="w-4 h-4 bg-white rounded-sm" />
                      ) : (
                        <Play className="h-6 w-6 text-white" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* How Generation Works */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="py-20 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg mb-16"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
                  Advanced AI-Driven Floor Plan Generation
                </h2>
                <p className="text-lg text-muted-foreground">
                  Our sophisticated artificial intelligence engine processes your requirements through natural language
                  understanding, spatial optimization algorithms, and architectural best practices to generate
                  professionally crafted floor plans that perfectly match your vision and functional needs.
                </p>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Intelligent Requirement Analysis</h3>
                      <p className="text-muted-foreground">
                        AI processes your natural language descriptions and preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Spatial Optimization</h3>
                      <p className="text-muted-foreground">Advanced algorithms optimize space utilization and flow</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground">Professional Rendering</h3>
                      <p className="text-muted-foreground">Generate high-quality 2D and 3D visualizations instantly</p>
                    </div>
                  </div>
                </div>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.7 }}
                variants={floatingElementVariants}
                whileHover="hover"
                className="relative"
              >
                <Card className="p-6 shadow-xl bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="aspect-square bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg flex items-center justify-center">
                      <Image
                        src="/images/Muhira_arshad__A_clean,_modern,_SaaS-style_portrait_infographic_(tall_vertical_8c18aac8-03bc-4f3f-a22b-ac8772a3dcc2.png"
                        alt="AI-Driven Floor Plan Generation"
                        width={100}
                        height={100}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* 2D Floor Plans */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="py-20 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg mb-16"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.7 }}
                variants={card3DVariants}
                whileHover="hover"
                className="relative"
              >
                <Card className="p-6 shadow-xl bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg flex items-center justify-center">
                      <Image
                        src="/images/Gemini_Generated_Image_8phgun8phgun8phg.png"
                        alt="2D Floor Plan Example"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  2D Planning
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Precise 2D Floor Plans</h2>
                <p className="text-lg text-muted-foreground">
                  Generate detailed 2D floor plans with accurate measurements, room layouts, and architectural elements.
                  Perfect for construction planning, real estate listings, and space optimization.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Accurate measurements and dimensions</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Professional architectural symbols</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Customizable room layouts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Export in multiple formats</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.section>

        {/* 3D Floor Plans */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="py-20 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg mb-16"
        >
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <Badge variant="secondary" className="w-fit">
                  Conceptual Visualization
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Immersive 3D Floor Plans</h2>
                <p className="text-lg text-muted-foreground">
                  IntelliPlan AI generates clean 2D architectural layouts that are optimized for future 3D modeling.
Our system prepares your plan with correct dimensions, room proportions, and layout logic — allowing effortless conversion into 3D in any modeling software
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Room-level geometry ready for 3D modeling</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Supports CAD and drafting exports</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Ideal for architects, planners, and visualization artists</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Lighting and material simulation</span>
                  </li>
                </ul>
              </div>
              <motion.div
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.7 }}
                variants={card3DVariants}
                whileHover="hover"
                className="relative"
              >
                <Card className="p-6 shadow-xl bg-background/80 backdrop-blur-sm">
                  <CardContent className="p-0">
                    <div className="aspect-video bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg flex items-center justify-center">
                      <Image
                        src="/images/Gemini_Generated_Image_6b5wp56b5wp56b5w.png"
                        alt="2D Floor Plan Example"
                        width={600}
                        height={400}
                        className="w-full h-full object-cover"
                      />
                      
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </motion.section>

        {/* Gallery Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={sectionVariants}
          className="py-20 bg-background/80 backdrop-blur-sm rounded-lg shadow-lg mb-16"
        >
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4 text-foreground">Gallery of Generated Plans</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Explore our collection of AI-generated floor plans created by users worldwide
              </p>
              <Link href="/gallery">
                <Button variant="outline">
                  View Full Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            {/* Carousel Structure */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden">
              {galleryImages.map((item, idx) => {
                let positionState = "hidden"
                const isCurrent = idx === currentSlide
                const isPrev = idx === (currentSlide - 1 + galleryImages.length) % galleryImages.length
                const isNext = idx === (currentSlide + 1) % galleryImages.length

                if (isCurrent) {
                  positionState = "center"
                } else if (isPrev) {
                  positionState = "left"
                } else if (isNext) {
                  positionState = "right"
                }

                return (
                  <motion.div
                    key={item.id}
                    className="absolute w-[550px] h-[350px] rounded-lg overflow-hidden shadow-lg cursor-pointer"
                    variants={carouselItemVariants}
                    initial="hidden"
                    animate={positionState}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    style={{
                      left: "35%",
                      transform: "translateX(-60%)",
                    }}
                  >
                    <Card className="group h-full">
                      <CardContent className="p-0 h-full">
                        <div className="relative h-full">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill={true}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                            <div className="text-center text-white">
                              <h3 className="font-semibold text-lg">{item.title}</h3>
                              <Badge variant="secondary" className="mt-2">
                                {item.type}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )
              })}
              {/* Navigation Arrows */}
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={goToPrevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 z-30"
              >
                <ChevronLeft className="h-6 w-6" />
                <span className="sr-only">Previous slide</span>
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={goToNextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-background/70 hover:bg-background/90 z-30"
              >
                <ChevronRight className="h-6 w-6" />
                <span className="sr-only">Next slide</span>
              </Button>
            </div>
            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {galleryImages.map((_, idx) => (
                <button
                  key={idx}
                  aria-label={`Go to slide ${idx + 1}`}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-2.5 w-2.5 rounded-full transition-colors ${
                    idx === currentSlide ? "bg-primary" : "bg-muted-foreground/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features and Pricing Sections */}
        <div className="relative min-h-screen overflow-hidden">
          <MapPatternBackground />
          {/* Background Text Overlay */}
          <div className="absolute inset-0 flex items-center justify-center z-0 pointer-events-none">
            <h2 className="font-heading text-7xl md:text-8xl lg:text-9xl text-foreground/5 opacity-10 select-none whitespace-nowrap">
              READY TO START YOUR JOURNEY NOW WITH INTELLIPLAN AI
            </h2>
          </div>
          <div className="relative z-10 container py-12 md:py-20">
            <section className="relative z-10 mb-16 text-center bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">
                Unlock the Power of AI for Your Designs
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                IntelliPlan AI offers a suite of powerful features designed to streamline your floor plan creation
                process.
              </p>
            </section>

            <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              {features.map((feature, index) => (
                <Card
                  key={index}
                  className="flex flex-col items-center text-center p-6 bg-background/80 backdrop-blur-sm"
                >
                  <div className="mb-4">{feature.icon}</div>
                  <CardTitle className="mb-2 text-foreground">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </Card>
              ))}
            </section>

            <section className="relative z-10 text-center mb-16 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg">
              <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl mb-4 text-foreground">
                Choose Your Plan
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Select the plan that best fits your needs. All plans include core features with varying levels of usage.
              </p>
            </section>

            <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4">
              {pricingPlans.map((plan, index) => (
                <Card
                  key={index}
                  className={`flex flex-col justify-between rounded-lg overflow-hidden transition-all duration-300 ${
                    plan.isHighlighted
                      ? "ring-2 ring-cyan-400 scale-105 bg-slate-900/95 border-0"
                      : "bg-slate-900/80 border border-slate-800 hover:border-slate-700"
                  }`}
                >
                  <div>
                    <div className={`${plan.badgeColor} rounded-full inline-block px-4 py-1 mx-6 mt-6 mb-4`}>
                      <p className="text-xs font-semibold text-white uppercase tracking-wide">{plan.name}</p>
                    </div>

                    <CardHeader className="pb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-cyan-400">{plan.price}</span>
                        <span className="text-sm text-gray-400">{plan.period}</span>
                      </div>
                    </CardHeader>

                    <CardContent className="pb-6">
                      <ul className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <li key={i} className="flex items-center gap-3">
                            {feature.included ? (
                              <CheckCircle2 className="h-5 w-5 text-green-400 flex-shrink-0" />
                            ) : (
                              <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                            )}
                            <span className={`text-sm ${feature.included ? "text-gray-200" : "text-gray-500"}`}>
                              {feature.text}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </div>

                  <CardFooter className="pt-4 px-6 pb-6">
                    <Button
                      className={`w-full font-semibold py-2 ${
                        plan.isHighlighted
                          ? "bg-cyan-400 hover:bg-cyan-500 text-slate-900"
                          : "bg-slate-700 hover:bg-slate-600 text-gray-200"
                      }`}
                      asChild
                    >
                      <Link href={plan.link}>{plan.buttonText}</Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </section>
          </div>
        </div>

        {/* CTA Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="bg-gradient-to-br from-[#FFD300] via-[#6050DC] to-[#1B03A3] py-20 rounded-lg shadow-lg"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Ready to Create Your Perfect Floor Plan?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of architects, designers, and homeowners who trust IntelliPlan AI for their floor planning
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  if (isSignedIn) {
                    router.push("/generate")
                  } else {
                    router.push("/auth/signup?message=Please sign up to start generating.")
                  }
                }}
              >
                Start Generating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>

              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white/30 text-white hover:bg-white/10 bg-transparent"
                >
                  Start Free Trial
                </Button>
              </Link>
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  )
}