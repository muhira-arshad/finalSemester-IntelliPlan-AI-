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
  // Framer Motion Variants
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] } },
  }

  const cardContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.3 } },
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
      title: "AI-Driven Floor Plan Generation",
      description:
        "Instantly convert user requirements into optimized 2D residential layouts with intelligent AI algorithms designed for spatial efficiency.",
    },
    {
      icon: CheckCircle2,
      title: "Smart Requirement Assistant",
      description: "Interact with the AI chatbot to specify preferences, constraints, and customizations for your project.",
    },
    {
      icon: CheckCircle2,
      title: "Interactive Layout Preview",
      description:
        "Preview generated layouts immediately, make modifications, and iterate designs before finalizing plans.",
    },
    {
      icon: CheckCircle2,
      title: "Efficient Cost Estimation",
      description:
        "Automatically generate material and labor cost estimates based on the generated floor plan, tailored to your city rates.",
    },
  ]

  const coreFeatures = [
    { number: "01", title: "2D Plan Generator" },
    { number: "02", title: "Virtual Assistant for Preferences" },
    { number: "03", title: "Style Customization & Editing" },
    { number: "04", title: "Share & Export Options" },
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
                Transform Ideas into Optimized 2D Floor Plans
              </h1>
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link href="/generate">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto py-3 text-lg font-semibold rounded-md"
                    style={{ background: "linear-gradient(to right, #eab308, #d97706)", color: "black", border: "none" }}
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
                  src="/images/Muhira_malik__A_clean,_professional_2D_floor_plan_showing_Bedroom,_Living_Room_c7b74ab8-e6de-49e2-88a7-6848ab9ef39e.jpg"
                  alt="User-friendly interface"
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

{/* End-to-End Planning Section */}
<motion.section
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, amount: 0.3 }}
  variants={sectionVariants}
  className="mb-20"
>
  <h2 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight text-center mb-12">
    Seamless Planning & Design Workflow
  </h2>
  <div className="grid lg:grid-cols-2 gap-12 items-center">
    <div className="relative w-full h-[500px] lg:h-[600px] bg-gray-900 rounded-lg shadow-xl overflow-hidden group">
      {/* Video Player */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="w-full h-full object-cover"
        poster="/images/Muhira_malik__A_clean,_professional_2D_floor_plan_showing_Bedroom,_Living_Room_1c2bf38b-d95e-4134-8676-c9a98b7935ce.jpg"
      >
        <source 
          src="/images/Untitled video - Made with Clipchamp (1).mp4" 
          type="video/mp4"
        />
        Your browser does not support the video tag.
      </video>
      
      {/* Video Overlay with Play/Pause Button */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="absolute inset-0 flex items-center justify-center">
          <button
            className="bg-black/60 hover:bg-black/80 rounded-full p-4 transition-all duration-300 transform hover:scale-110"
          >
            <div className="w-4 h-4 bg-white rounded-sm" />
          </button>
        </div>
      </div>
    </div>
    <div className="space-y-8 text-center lg:text-left">
      <p className="text-xl text-gray-300 leading-relaxed">
        From user input to AI-generated 2D layouts, seamlessly iterate on designs and finalize plans with intelligent guidance.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
        <Link href="/generate">
          <Button
            size="lg"
            className="w-full sm:w-auto py-3 text-lg font-semibold rounded-md"
            style={{ background: "linear-gradient(to right, #eab308, #d97706)", color: "black", border: "none" }}
          >
            START DESIGNING
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
                src="/images/Muhira_malik__A_clean,_professional_2D_floor_plan_showing_Bedroom,_Living_Room_1c2bf38b-d95e-4134-8676-c9a98b7935ce.jpg"
                alt="Floor Plan Generator Interface"
                width={650}
                height={550}
                className="object-contain"
              />
            </div>
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">2D Floor Plan Generator (BETA)</h2>
              <p className="text-lg text-gray-300">
                Generate fully customized 2D residential layouts by specifying room dimensions, adjacencies, and constraints.
              </p>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Define room sizes and adjacency rules</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Generate multiple layout options instantly</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Export finalized layouts in DXF or PDF</span>
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
                Chat with an AI assistant to specify your preferences, request modifications, and guide the 2D layout generation process.
              </p>
            </div>
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4 order-1 lg:order-2">
              <Image
                src="/images/Hailuo_Image_interact these two images in t_454062471047716872.jpg"
                alt="AI Chatbot Interface"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>
          </motion.section>

          {/* Cost Estimation Section */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid lg:grid-cols-2 gap-12 items-center mb-20"
          >
            {/* Image */}
            <div className="relative w-full aspect-video bg-gray-900 rounded-lg shadow-xl flex items-center justify-center p-4">
              <Image
                src="images/Maheen_Shabirr____A_clean,_professional_SaaS-style_infographic_visualizing_an_AI_6d29ff2d-375e-495f-9fb7-bd9d2aa281b3.jpg"
                alt="Cost Estimation Interface"
                width={600}
                height={400}
                className="object-contain"
              />
            </div>

            {/* Content */}
            <div className="space-y-6 text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-bold leading-tight">Efficient Cost Estimation</h2>
              <p className="text-lg text-gray-300">
                Automatically calculate material, labor, electrical, plumbing, and finishing costs based on your generated floor plan, tailored to your city rates.
              </p>
              <ul className="space-y-3 text-lg text-gray-300">
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Enter plot dimensions and number of floors</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>Get detailed material & labor breakdown instantly</span>
                </li>
                <li className="flex items-center justify-center lg:justify-start space-x-2">
                  <CheckCircle2 className="h-5 w-5 text-yellow-400 flex-shrink-0" />
                  <span>View total cost per sqft and contingency estimates</span>
                </li>
              </ul>
              <div className="mt-4">
                <Link href="/cost-estimation">
                  <Button
                    size="lg"
                    className="w-full sm:w-auto py-3 text-lg font-semibold rounded-md"
                    style={{ background: "linear-gradient(to right, #eab308, #d97706)", color: "black", border: "none" }}
                  >
                    CALCULATE COST
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </motion.section>
        </div>
      </div>
    </div>
  )
}
