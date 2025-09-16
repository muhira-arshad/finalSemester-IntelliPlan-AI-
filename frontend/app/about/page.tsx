"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Users, Globe, Target, ArrowRight, Lightbulb, Heart, Crown } from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { About3DScene } from "@/components/about-3d-screen" // Import the new 3D scene
import { useAuth } from "@/context/auth-context" // Import useAuth

export default function AboutPage() {
  const { isSignedIn } = useAuth()

  // Framer Motion Variants for sections (fade in from bottom)
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Framer Motion Variants for floating cards
  const floatingCardVariants: Variants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
    },
    float: {
      y: [0, -10, 0], // Floating animation
      transition: {
        duration: 3,
        repeat: Number.POSITIVE_INFINITY,
        ease: "easeInOut",
        delay: Math.random() * 0.5, // Stagger delay
      },
    },
  }

  const whatIsIntelliPlan = [
    {
      title: "AI-Powered Design",
      description: "Transform ideas into precise 2D & 3D floor plans with advanced AI.",
      icon: Lightbulb,
    },
    {
      title: "Intuitive Interface",
      description: "Easy-to-use tools for seamless design and collaboration.",
      icon: Users,
    },
    {
      title: "Professional Outputs",
      description: "High-quality, export-ready plans for any project.",
      icon: Target,
    },
  ]

  const communityMissionCards = [
    {
      title: "Our Community",
      description: "Join a thriving network of designers, architects, and enthusiasts.",
      icon: Heart,
    },
    {
      title: "Global Reach",
      description: "Empowering users in over 120 countries with innovative tools.",
      icon: Globe,
    },
    {
      title: "Our Mission",
      description: "Democratizing design by making professional tools accessible to all.",
      icon: Crown,
    },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden">
      <About3DScene /> {/* The 3D background for the whole page */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionVariants}
            className="text-center mb-16 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <Badge variant="secondary" className="mb-4">
              About IntelliPlan AI
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Revolutionizing Floor Plan Design</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              IntelliPlan AI is a cutting-edge platform that harnesses the power of artificial intelligence to transform
              how architects, designers, and homeowners create floor plans.
            </p>
          </motion.div>

          {/* What IntelliPlan AI Is Section (3 cards + 3D animation) */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {whatIsIntelliPlan.map((item, index) => (
                <motion.div
                  key={index}
                  variants={floatingCardVariants}
                  initial="hidden"
                  whileInView="visible" // Trigger initial fade-in when in view
                  animate="float" // Start continuous float animation after 'visible' completes
                  viewport={{ once: true, amount: 0.5 }} // Ensure 'visible' only triggers once
                  className="col-span-1"
                >
                  <Card className="h-full flex flex-col items-center text-center p-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <item.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl mb-2">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </Card>
                </motion.div>
              ))}
              {/* Placeholder to complete the grid if needed, or adjust grid-cols */}
              <div className="hidden md:block"></div>
            </div>
            <div className="relative h-[400px] w-full">
              {/* This will be the dedicated spot for the 3D floor plan animation */}
              <About3DScene />
            </div>
          </motion.section>

          {/* Our Community, Global Reach, Our Mission Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="mb-20 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Our Core Pillars</h2>
            <div className="grid md:grid-cols-3 gap-8">
              {communityMissionCards.map((card, index) => (
                <motion.div
                  key={index}
                  variants={floatingCardVariants}
                  initial="hidden"
                  whileInView="visible" // Trigger initial fade-in when in view
                  animate="float" // Start continuous float animation after 'visible' completes
                  viewport={{ once: true, amount: 0.5 }} // Ensure 'visible' only triggers once
                >
                  <Card className="text-center h-full flex flex-col items-center p-6">
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                        <card.icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-xl">{card.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">{card.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Our Mission Story Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.7 }}
              variants={sectionVariants} // Use sectionVariants for this wrapper
              className="relative h-[400px] w-full"
            >
              {/* Another instance of the 3D floor plan animation */}
              <About3DScene />
            </motion.div>
            <div className="space-y-6">
              <h2 className="text-3xl font-bold mb-6">Our Mission: Empowering Your Design Journey</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To democratize professional floor plan design by making it accessible, affordable, and efficient for
                everyone. We believe that great design should not be limited by technical expertise or budget
                constraints.
              </p>
              <p className="text-lg text-muted-foreground">
                Through advanced AI technology, we're breaking down barriers and empowering individuals and
                professionals to bring their spatial visions to life with unprecedented ease and precision. Our journey
                began as a final year project, driven by a passion to innovate and make a real-world impact.
              </p>
            </div>
          </motion.section>

          {/* Conditional "Start Your Journey" Button */}
          {!isSignedIn && (
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={sectionVariants}
              className="text-center bg-primary py-12 rounded-lg shadow-lg"
            >
              <h2 className="text-3xl font-bold text-primary-foreground mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Sign up now and begin creating amazing floor plans with IntelliPlan AI!
              </p>
              <Link href="/auth/signup">
                <Button size="lg" variant="secondary">
                  Start Your Journey
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
