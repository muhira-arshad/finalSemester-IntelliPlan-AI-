"use client"

import { useState, useEffect } from "react"
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
  Heart,
  Crown,
  Dumbbell,
  LayoutGrid,
  MessageSquare,
  Users,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { ThreeDHeroBackground } from "@/components/three-d-hero-background"
import { MapPatternBackground } from "@/components/map-pattern-background"
import { About3DScene } from "@/components/about-3d-screen"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/auth-context"

export default function HomePage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const router = useRouter()
  const { isSignedIn, isLoading } = useAuth() // Destructure isLoading

  const galleryImages = [
    { id: 1, title: "Modern Villa", type: "3D", image: "/placeholder.svg?height=200&width=300" },
    { id: 2, title: "Apartment Layout", type: "2D", image: "/placeholder.svg?height=200&width=300" },
    { id: 3, title: "Office Space", type: "3D", image: "/placeholder.svg?height=200&width=300" },
    { id: 4, title: "Studio Design", type: "2D", image: "/placeholder.svg?height=200&width=300" },
    { id: 5, title: "Family Home", type: "3D", image: "/placeholder.svg?height=200&width=300" },
    { id: 6, title: "Loft Space", type: "2D", image: "/placeholder.svg?height=200&width=300" },
  ]

  // Autoplay logic for the carousel
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % galleryImages.length)
    }, 3000) // Change slide every 3 seconds

    // Cleanup on unmount
    return () => clearInterval(intervalId)
  }, [galleryImages.length])

  // Manual navigation functions
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
      y: -10, // Slight lift on hover
      transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Framer Motion Variants for the new carousel items
  const carouselItemVariants: Variants = {
    hidden: { opacity: 0, scale: 0.7, x: 0, zIndex: 0 }, // For items not in the immediate view
    left: {
      x: -300, // Adjusted to shift left more
      opacity: 0.6,
      scale: 0.85,
      zIndex: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    center: {
      x: -50, // Shift center by 50px to the left
      opacity: 1,
      scale: 1,
      zIndex: 2,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
    right: {
      x: 200, // Adjusted to shift left more
      opacity: 0.6,
      scale: 0.85,
      zIndex: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  }

  // Features data (moved from app/features/page.tsx)
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

  // Pricing plans data (moved from app/features/page.tsx)
  const pricingPlans = [
    {
      name: "Free Tier",
      price: "$0",
      description: "Perfect for trying out IntelliPlan AI.",
      features: ["5 Floor Plan Generations/month", "Basic AI Model", "Standard Resolution", "Community Support"],
      buttonText: "Start Free",
      link: "/auth/signup",
      icon: Heart, // Icon for Free Tier
      isHighlighted: false,
    },
    {
      name: "Pro Plan",
      price: "$19/month",
      description: "For individuals and small projects.",
      features: [
        "50 Floor Plan Generations/month",
        "Advanced AI Model",
        "High Resolution",
        "Priority Email Support",
        "Access to Premium Templates",
      ],
      buttonText: "Choose Pro",
      link: "/auth/signup",
      icon: Crown, // Icon for Pro Plan
      isHighlighted: true, // Highlight this plan
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "Tailored solutions for businesses and large-scale needs.",
      features: [
        "Unlimited Generations",
        "Dedicated AI Model",
        "Ultra High Resolution",
        "24/7 Phone & Chat Support",
        "API Access & Integrations",
        "Custom Training",
      ],
      buttonText: "Contact Sales",
      link: "/services",
      icon: Dumbbell, // Icon for Enterprise
      isHighlighted: false,
    },
  ]

  const handleTryDemoClick = () => {
    if (isLoading) return // Do nothing if still loading auth state
    if (isSignedIn) {
      router.push("/generate")
    } else {
      router.push("/auth/signup?message=Please sign up to try the demo.")
    }
  }

  const handleStartGeneratingClick = () => {
    if (isLoading) return // Do nothing if still loading auth state
    if (isSignedIn) {
      router.push("/generate")
    } else {
      router.push("/auth/signup?message=Please sign up to start generating.")
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-black text-white">
      {/* Dedicated container for the ThreeDHeroBackground */}
      <div className="fixed inset-0 z-0">
        <ThreeDHeroBackground />
      </div>

      {/* Main content, now with a higher z-index and semi-transparent background */}
      <div className="relative z-10">
        {/* Hero Section */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="relative container mx-auto px-4 py-20" // Removed bg-background/80 backdrop-blur-sm rounded-lg shadow-lg from hero
        >
          <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <Badge variant="secondary" className="w-fit">
                AI-Powered Floor Planning
              </Badge>
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight text-foreground">
                Transform Your Vision into
                <span className="text-primary"> Intelligent Floor Plans</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                IntelliPlan AI revolutionizes architectural design by generating stunning 2D and 3D floor plans through
                advanced artificial intelligence. Simply describe your requirements, and watch your dream space come to
                life.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="w-full sm:w-auto"
                  onClick={handleTryDemoClick}
                  disabled={isLoading} // Disable button while loading auth state
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
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              variants={floatingElementVariants}
              whileHover="hover"
              className="relative"
            >
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center shadow-xl">
                <div className="text-center">
                  <Play className="h-16 w-16 mx-auto mb-4 text-primary" />
                  <p className="text-lg font-medium text-foreground">IntelliPlan AI Demo Video</p>
                  <p className="text-muted-foreground">See how AI creates your perfect floor plan</p>
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
                      <div className="text-center">
                        <Zap className="h-16 w-16 mx-auto mb-4 text-primary" />
                        <p className="text-lg font-medium text-foreground">AI Generation Process</p>
                        <p className="text-muted-foreground">Intelligent floor plan creation</p>
                      </div>
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
                      <div className="text-center">
                        <Eye className="h-16 w-16 mx-auto mb-4 text-blue-600" />
                        <p className="text-lg font-medium text-foreground">2D Floor Plans</p>
                        <p className="text-muted-foreground">Precise architectural layouts</p>
                      </div>
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
                  3D Visualization
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold text-foreground">Immersive 3D Floor Plans</h2>
                <p className="text-lg text-muted-foreground">
                  Experience your space in stunning 3D with realistic textures, lighting, and furniture placement.
                  Perfect for presentations, client visualization, and design validation.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Photorealistic 3D rendering</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Interactive walkthrough capability</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    <span>Furniture and fixture placement</span>
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
                      {/* Ensure About3DScene is used here */}
                      <About3DScene />
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

            {/* New Carousel Structure */}
            <div className="relative h-[350px] flex items-center justify-center overflow-hidden">
              {galleryImages.map((item, idx) => {
                let positionState = "hidden"
                // Determine if this item is the current, previous, or next
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
                            src={item.image || "/placeholder.svg"}
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

        {/* NEW: Features and Pricing Sections (moved from app/features/page.tsx) */}
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
              <h2 className="font-heading text-4xl md:text-5xl lg:text-6xl mb-4 text-foreground">
                Flexible Pricing Plans
              </h2>
              <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
                Choose the plan that best fits your needs, from individual projects to large-scale enterprise solutions.
              </p>
            </section>

             <section className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pricingPlans.map((plan, index) => (
            <Card
              key={index}
              className={`flex flex-col justify-between p-6 shadow-lg ${
                plan.isHighlighted
                  ? "bg-gradient-to-br from-purple-600 to-pink-500 text-primary-foreground"
                  : "bg-card text-card-foreground" // Use card colors for non-highlighted
              }`}
            >
                  <CardHeader className="pb-4 text-center">
                    {plan.icon && (
                      <plan.icon
                        className={`h-10 w-10 mx-auto mb-4 bg-clip-text text-transparent ${
  plan.isHighlighted
    ? "bg-gradient-to-r from-[#FFD95A] to-[#FFB347]" // lighter gold-orange
    : "bg-gradient-to-r from-[#FFD700] to-[#FF8C00]" // deeper gold-orange
}`}

                      />
                    )}
                    <CardTitle className="text-xl uppercase font-bold">{plan.name}</CardTitle>
                    <CardDescription
                      className={`mt-2 ${plan.isHighlighted ? "text-primary-foreground/80" : "text-gray-300"}`}
                    >
                      {plan.description}
                    </CardDescription>
                    <p className="text-5xl font-bold mt-4">{plan.price}</p>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <ul className="space-y-3">
                      {plan.features.map((feature, i) => (
                        <li key={i} className="flex items-center text-lg">
                          <CheckCircle2
                            className={`h-5 w-5 mr-3 ${
                              plan.isHighlighted ? "text-yellow-300" : "text-green-400"
                            } flex-shrink-0`}
                          />
                          {feature}
                        </li>
                      ))}
                    </ul>
                    <Link
                      href={plan.link}
                      className={`flex items-center justify-center gap-2 mt-6 text-sm font-medium ${
                        plan.isHighlighted
                          ? "text-yellow-300 hover:text-yellow-200"
                          : "text-primary-foreground hover:text-gray-300"
                      }`}
                    >
                      See more benefits <ArrowRight className="h-4 w-4" />
                    </Link>
                  </CardContent>
                  <CardFooter className="pt-6">
                    <Button
                      className={`w-full text-lg py-6 ${
                        plan.isHighlighted
                          ? "bg-yellow-400 hover:bg-yellow-500 text-black font-semibold"
                          : "bg-gray-600 hover:bg-gray-700 text-white"
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
          className="bg-primary py-20 rounded-lg shadow-lg"
        >
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-4">
              Ready to Create Your Perfect Floor Plan?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of architects, designers, and homeowners who trust IntelliPlan AI for their floor planning
              needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                onClick={handleStartGeneratingClick}
                disabled={isLoading} // Disable button while loading auth state
              >
                Start Generating
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Link href="/auth/signup">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
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