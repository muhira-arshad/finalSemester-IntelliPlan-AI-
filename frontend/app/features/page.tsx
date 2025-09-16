"use client"

import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  CheckCircle2,
  ArrowRight,
  Apple,
  ComputerIcon as Windows,
  Chrome,
  ChromeIcon as Firefox,
  SmartphoneIcon as Android,
} from "lucide-react"
import { motion, type Variants } from "framer-motion"
import { Features3DBackground } from "@/components/features-3d-background"
import { FeatureCard } from "@/components/feature-card"

export default function FeaturesPage() {
  // Framer Motion Variants for sections (fade in from bottom)
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  // Variants for staggered feature cards
  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  }

  const cardItemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  }

  const platformIcons = [
    { icon: Apple, label: "Apple" },
    { icon: Windows, label: "Windows" },
    { icon: Chrome, label: "Chrome" },
    { icon: Firefox, label: "Firefox" },
    { icon: Android, label: "Android" },
  ]

  const topFeatures = [
    {
      icon: CheckCircle2,
      title: "Unlimited Optionality",
      description:
        "Put generative architecture at the center of a collaborative workspace where architects and designers can generate designs through early design concepts faster.",
    },
    {
      icon: CheckCircle2,
      title: "Real-Time Collaboration",
      description: "Collaborate with all your key stakeholders under one platform.",
    },
    {
      icon: CheckCircle2,
      title: "Streamline Planning",
      description:
        "Make it allows you to go directly from conversational prompts and customer requirements to a fully interactive 3D model quickly.",
    },
    {
      icon: CheckCircle2,
      title: "Visualize Concepts",
      description: "Quickly visualize all your early-stage concepts in a fully interactive environment.",
    },
  ]

  const coreFeatures = [
    { number: "01", title: "Plan Generator (BETA)" },
    { number: "02", title: "Virtual Assistant" },
    { number: "03", title: "Virtual Designer" },
    { number: "04", title: "Regulatory Assistant" },
  ]

  return (
    <div className="min-h-screen relative overflow-hidden bg-black text-white">
      <Features3DBackground />
      <div className="relative z-10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          {/* Hero Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="space-y-8 text-center lg:text-left">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                Better residential planning for better business
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto py-3 text-lg font-semibold rounded-md"
                    style={{
                      background: "linear-gradient(to right, #eab308, #d97706)",
                      color: "black",
                      border: "none",
                    }}
                  >
                    GET STARTED
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <div className="flex space-x-4 text-gray-400">
                  {platformIcons.map((platform, index) => (
                    <platform.icon key={index} className="h-6 w-6" />
                  ))}
                </div>
              </div>
              <div className="w-full flex justify-center lg:justify-start">
                <Image
                  src="/placeholder.svg?height=200&width=200"
                  alt="Smiling person"
                  width={200}
                  height={200}
                  className="rounded-full object-cover"
                />
              </div>
            </div>
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={cardContainerVariants}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              {topFeatures.map((feature, index) => (
                <FeatureCard
                  key={index}
                  icon={feature.icon}
                  title={feature.title}
                  description={feature.description}
                  variants={cardItemVariants}
                />
              ))}
            </motion.div>
          </motion.section>

          {/* End-to-end planning, simplified section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="mb-20"
          >
            <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center mb-12">
              End-to-end planning, simplified
            </h2>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4">
                <Image
                  src="/placeholder.svg?height=400&width=600"
                  alt="Laptop with floor plans"
                  width={600}
                  height={400}
                  className="object-contain"
                />
              </div>
              <div className="space-y-8 text-center lg:text-left">
                <p className="text-xl text-gray-300 leading-relaxed">
                  Seamlessly design, explore, and comply—empowering your creative vision with intelligent automation
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <Link href="/generate">
                    <Button
                      size="lg"
                      className="w-full sm:w-auto py-3 text-lg font-semibold rounded-md"
                      style={{
                        background: "linear-gradient(to right, #eab308, #d97706)",
                        color: "black",
                        border: "none",
                      }}
                    >
                      GET STARTED
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </Link>
                  <div className="flex space-x-4 text-gray-400">
                    {platformIcons.map((platform, index) => (
                      <platform.icon key={index} className="h-6 w-6" />
                    ))}
                  </div>
                </div>
                <ul className="space-y-3 text-lg text-gray-300">
                  {coreFeatures.map((feature, index) => (
                    <li key={index} className="flex items-center justify-center lg:justify-start space-x-3">
                      <span className="font-bold text-yellow-400">{feature.number}</span>
                      <span>{feature.title}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.section>

          {/* Residential Plan Generator Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Available Designs"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Residential Plan Generator (BETA)</h2>
              <p className="text-lg text-gray-300">
                Create customized residential architectural plans instantly based on programming needs.
              </p>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Specify room dimension & adjacency constraints</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Generate design options instantly</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Export designs to .DXF</span>
                </li>
              </ul>
            </div>
          </motion.section>

          {/* Virtual Assistant Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="space-y-6 text-center lg:text-left order-2 lg:order-1">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Virtual Assistant</h2>
              <p className="text-lg text-gray-300">
                Get expert guidance at your fingertips, ask questions about materials, costs, and regulations, and
                informed responses to make confident design decisions
              </p>
            </div>
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4 order-1 lg:order-2">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Virtual Assistant UI"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          </motion.section>

          {/* Virtual Designer Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4">
              <Image
                src="/placeholder.svg?height=400&width=600"
                alt="Virtual Designer UI"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Virtual Designer</h2>
              <p className="text-lg text-gray-300">
                Transform styles with a click. Experiment with diverse interior and exterior aesthetics, visualize style
                transformations, and personalize designs to delight your clients
              </p>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Transition between design styles effortlessly</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Customize elements to create your ideal aesthetic</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Preview design changes instantly for informed decisions</span>
                </li>
              </ul>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
