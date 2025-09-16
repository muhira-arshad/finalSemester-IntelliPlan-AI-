"use client"

import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { BookOpen, Briefcase, Users, ShoppingCart, LayoutGrid, Lightbulb } from "lucide-react"
import { motion, type Variants } from "framer-motion" // Import motion and Variants
import { Services3DBackground } from "@/components/services-3d-background" // Import the 3D background

export default function HelpCenterPage() {
  const helpSections = [
    {
      title: "Glossary",
      description: "Understand key terms and definitions related to AI and floor planning.",
      icon: BookOpen,
      content: [
        {
          question: "What is AI Floor Plan Generation?",
          answer:
            "AI Floor Plan Generation uses artificial intelligence to automatically create floor plans based on textual descriptions or other inputs, optimizing for space, flow, and design principles.",
        },
        {
          question: "What is 2D vs. 3D Visualization?",
          answer:
            "2D visualization provides a top-down, flat representation with measurements, while 3D visualization offers an immersive, realistic view with depth, textures, and lighting.",
        },
        {
          question: "What are Spatial Optimization Algorithms?",
          answer:
            "These are algorithms used by AI to arrange rooms and elements within a space efficiently, maximizing usability and adhering to design best practices.",
        },
      ],
    },
    {
      title: "Business Features",
      description: "Learn how IntelliPlan AI can benefit your business operations.",
      icon: Briefcase,
      content: [
        {
          question: "How can IntelliPlan AI help my real estate business?",
          answer:
            "IntelliPlan AI can quickly generate professional floor plans for listings, helping potential buyers visualize properties better and speeding up the sales process.",
        },
        {
          question: "Is there API access for integration?",
          answer:
            "Yes, Enterprise plans offer API access for seamless integration with your existing business workflows and applications.",
        },
      ],
    },
    {
      title: "Team Collaboration",
      description: "Discover tools for effective teamwork on your projects.",
      icon: Users,
      content: [
        {
          question: "Can multiple users work on the same project?",
          answer:
            "Yes, our Professional and Enterprise plans include collaboration features that allow multiple team members to work on and share projects.",
        },
      ],
    },
    {
      title: "Marketplace",
      description: "Explore templates, assets, and services from our community.",
      icon: ShoppingCart,
      content: [
        {
          question: "What kind of templates are available?",
          answer:
            "Our marketplace offers a variety of pre-designed templates for different property types and styles, which you can customize with AI.",
        },
      ],
    },
    {
      title: "Project Types",
      description: "Understand the different types of projects you can create.",
      icon: LayoutGrid,
      content: [
        {
          question: "What types of floor plans can I generate?",
          answer:
            "You can generate residential, commercial, industrial, and custom floor plans, including apartments, houses, offices, retail spaces, and more.",
        },
      ],
    },
  ]

  // Framer Motion Variants for sections (fade in from bottom)
  const sectionVariants: Variants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
    },
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Services3DBackground /> {/* The 3D background */}
      <div className="relative z-10 py-20">
        <div className="container mx-auto px-4">
          {/* Header */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.5 }}
            variants={sectionVariants}
            className="text-center mb-12 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <Badge variant="secondary" className="mb-4">
              Help Center
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">Find the Answers You Need</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Browse our comprehensive resources, guides, and frequently asked questions to make the most of IntelliPlan
              AI.
            </p>
          </motion.div>

          {/* Help Sections Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
          >
            {helpSections.map((section, index) => (
              <Card
                key={index}
                className="hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm p-6 rounded-lg shadow-lg"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <section.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl text-center">{section.title}</CardTitle>
                  <CardDescription className="text-center">{section.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    {section.content.map((item, itemIndex) => (
                      <AccordionItem key={itemIndex} value={`item-${index}-${itemIndex}`}>
                        <AccordionTrigger className="text-left text-base">{item.question}</AccordionTrigger>
                        <AccordionContent>
                          <p className="text-muted-foreground">{item.answer}</p>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* Still need help? */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="text-center bg-muted/50 rounded-lg p-8 shadow-lg"
          >
            <h2 className="text-2xl font-bold mb-4">Can't find what you're looking for?</h2>
            <p className="text-muted-foreground mb-6">Our support team is ready to assist you. Reach out directly!</p>
            <Link href="/services#contact-form">
              <Button size="lg">
                <Lightbulb className="mr-2 h-4 w-4" />
                Contact Support
              </Button>
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
