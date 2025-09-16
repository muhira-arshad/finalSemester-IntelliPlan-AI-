"use client"

import type React from "react"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { motion, type Variants, type Transition } from "framer-motion" // Import Variants and Transition

export function NewsletterSection() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Newsletter signup:", formData)
    alert("Thank you for subscribing!")
    setFormData({ firstName: "", lastName: "", email: "" })
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  // Framer Motion Variants for sections (fade in from bottom)
  const sectionVariants: Variants = {
    // Explicitly type as Variants
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number], // Explicitly type ease as a tuple
      } as Transition, // Explicitly type the transition object
    },
  }

  return (
    <section className="relative py-16 overflow-hidden bg-black text-white">
      {/* Subtle gradient glow from bottom right */}
      <div
        className="absolute bottom-0 right-0 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-500/20 to-transparent filter blur-3xl opacity-50"
        style={{ transform: "translate(30%, 30%)" }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.5 }}
          variants={sectionVariants}
          className="bg-gray-950 rounded-lg shadow-2xl p-8 md:p-12 lg:p-16 flex flex-col lg:flex-row items-center lg:items-start justify-between gap-12"
        >
          {/* Left Section: Heading and Form */}
          <div className="flex-1 text-center lg:text-left max-w-2xl">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-8">
              <span className="font-serif italic text-gray-300">Join our community</span>
              <br />
              <span className="text-white">of 20,000+</span>
              <br />
              <span className="text-white">subscribers</span>
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4 max-w-md lg:max-w-none mx-auto lg:mx-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  type="text"
                  placeholder="First Name"
                  value={formData.firstName}
                  onChange={(e) => handleInputChange("firstName", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
                <Input
                  type="text"
                  placeholder="Last Name"
                  value={formData.lastName}
                  onChange={(e) => handleInputChange("lastName", e.target.value)}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                  required
                />
              </div>
              <Input
                type="email"
                placeholder="Enter your e-mail"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-500 focus:ring-yellow-400 focus:border-yellow-400"
                required
              />
              <Button
                type="submit"
                className="w-full py-3 text-lg font-semibold rounded-md"
                style={{
                  background: "linear-gradient(to right, #eab308, #d97706)", // Orange-to-brown gradient
                  color: "black", // Text color for the button
                  border: "none",
                }}
              >
                SUBSCRIBE NOW
              </Button>
            </form>
          </div>

          {/* Right Section: Benefits List */}
          <div className="flex-1 text-center lg:text-left lg:pl-12">
            <ul className="space-y-4 text-lg md:text-xl text-gray-300">
              <li>Industry Updates</li>
              <li>Trending news on artificial intelligence, design & architecture</li>
              <li>High-quality content</li>
              <li>No spam, ever</li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
