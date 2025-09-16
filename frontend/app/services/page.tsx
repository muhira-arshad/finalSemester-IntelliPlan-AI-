"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  BookOpen,
  Video,
  Phone,
  Mail,
  MessageCircle,
  Download,
  Play,
  Send,
  ArrowRight,
  Instagram,
  Facebook,
  Youtube,
  Globe,
  Bell,
} from "lucide-react"
import { useAuth } from "@/context/auth-context"
import { motion, type Variants } from "framer-motion"
import { Services3DBackground } from "@/components/services-3d-background"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion" // Added import

export default function ServicesPage() {
  const { isSignedIn } = useAuth() // Get sign-in status
  const [contactForm, setContactForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const services = [
    {
      icon: BookOpen,
      title: "User Manual",
      description: "Comprehensive guide to using IntelliPlan AI effectively",
      content: "Step-by-step instructions, best practices, and troubleshooting tips",
      actions: [
        { label: "Download PDF", icon: Download, action: "download" },
        { label: "Read Manual", icon: BookOpen, action: "read" },
      ],
    },
    {
      icon: Video,
      title: "Video Tutorials",
      description: "Learn how to create stunning floor plans with our video guides",
      content: "From basic concepts to advanced techniques",
      actions: [{ label: "Watch Videos", icon: Play, action: "watch" }],
    },
    {
      icon: MessageCircle,
      title: "Live Chat Support",
      description: "Get instant help from our support team",
      content: "Available 24/7 for premium users",
      actions: [{ label: "Start Chat", icon: MessageCircle, action: "chat" }],
    },
    {
      icon: Mail,
      title: "Email Support",
      description: "Send us detailed questions and get comprehensive answers",
      content: "Response within 24 hours",
      actions: [{ label: "Send Email", icon: Send, action: "email" }],
    },
    {
      icon: Phone,
      title: "Phone Support",
      description: "Speak directly with our technical experts",
      content: "Available for Enterprise customers",
      actions: [{ label: "Call Now", icon: Phone, action: "phone" }],
    },
  ]

  const socialMediaLinks = [
    { name: "Instagram", icon: Instagram, link: "#", color: "text-pink-500" },
    { name: "Facebook", icon: Facebook, link: "#", color: "text-blue-600" },
    { name: "YouTube", icon: Youtube, link: "#", color: "text-red-600" },
    { name: "Google", icon: Globe, link: "#", color: "text-green-600" },
  ]

  const faqs = [
    {
      question: "What is IntelliPlan AI?",
      answer:
        "IntelliPlan AI is an AI-powered platform that generates 2D and 3D floor plans based on your descriptions and requirements, streamlining the design process for architects, real estate professionals, and homeowners.",
    },
    {
      question: "How accurate are the generated floor plans?",
      answer:
        "Our AI uses advanced algorithms and architectural best practices to ensure high accuracy in measurements and layouts. While highly precise, final designs should always be reviewed by a professional.",
    },
    {
      question: "Can I customize the generated plans?",
      answer:
        "Yes, you can specify various parameters like room dimensions, adjacencies, and styles. For more advanced customization, our platform allows for further editing and refinement.",
    },
    {
      question: "What file formats can I export my plans in?",
      answer:
        "You can export your 2D plans in common formats like DXF, and 3D models can be viewed interactively within the platform or exported for use in other 3D software (depending on your plan).",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a Free Tier that allows you to generate a limited number of floor plans per month, giving you a chance to experience the power of IntelliPlan AI.",
    },
    {
      question: "How does the AI handle complex design requests?",
      answer:
        "Our AI is designed to interpret complex natural language requests. For highly intricate or unique designs, it will provide the closest possible interpretation and allow for iterative refinement through further prompts.",
    },
  ]

  const handleServiceAction = (action: string) => {
    switch (action) {
      case "download":
        const link = document.createElement("a")
        link.href = "/placeholder.pdf"
        link.download = "IntelliPlan-AI-User-Manual.pdf"
        link.click()
        break
      case "read":
        window.open("/manual", "_blank")
        break
      case "watch":
        window.open("/tutorials", "_blank")
        break
      case "email":
        document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })
        break
      default:
        console.log(`Action: ${action}`)
    }
  }

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log("Contact form submitted:", contactForm)
    alert("Thank you for your message! We'll get back to you within 24 hours.")
    setContactForm({ name: "", email: "", subject: "", message: "" })
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

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Services3DBackground /> {/* The new 3D background */}
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
              Services & Support
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">We're Here to Help</h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Get the support you need to make the most of IntelliPlan AI with our comprehensive resources and dedicated
              support team
            </p>
          </motion.div>

          {/* Services Grid */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20"
          >
            {services.map((service, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow bg-background/80 backdrop-blur-sm"
              >
                <CardHeader>
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <service.icon className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{service.title}</CardTitle>
                  <CardDescription>{service.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">{service.content}</p>
                  <div className="space-y-2">
                    {service.actions.map((action, actionIndex) => (
                      <Button
                        key={actionIndex}
                        variant="outline"
                        size="sm"
                        className="w-full bg-transparent"
                        onClick={() => handleServiceAction(action.action)}
                      >
                        <action.icon className="mr-2 h-4 w-4" />
                        {action.label}
                      </Button>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </motion.div>

          {/* NEW: FAQ Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="mb-16 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl lg:text-4xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`faq-${index}`}>
                  <AccordionTrigger className="text-left text-lg font-medium">{faq.question}</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-muted-foreground">{faq.answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </motion.div>

          {/* Find Us Section (Social Media) */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="text-center mb-16 bg-background/80 backdrop-blur-sm p-8 rounded-lg shadow-lg"
          >
            <h2 className="text-3xl font-bold mb-8">Find Us On Social Media</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {socialMediaLinks.map((platform, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <Link href={platform.link} target="_blank" rel="noopener noreferrer">
                    <Card className="flex flex-col items-center justify-center p-6 h-full">
                      <platform.icon className={`h-10 w-10 mb-3 ${platform.color}`} />
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notification Card */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            className="mb-16"
          >
            <Card className="bg-primary/10 border-primary/20 text-center p-8 rounded-lg shadow-lg">
              <CardHeader>
                <CardTitle className="text-3xl font-bold">Don't Miss Out on the Latest Updates!</CardTitle>
                <CardDescription className="text-muted-foreground text-lg">
                  Stay informed about new features, improvements, and important announcements.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/notifications">
                  <Button size="lg">
                    <Bell className="mr-2 h-4 w-4" />
                    View Notifications
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </motion.div>

          {/* Contact Form */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={sectionVariants}
            id="contact-form"
            className="mb-16"
          >
            <div className="max-w-2xl mx-auto">
              <Card className="bg-background/80 backdrop-blur-sm shadow-lg">
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Contact Us</CardTitle>
                  <CardDescription>Send us a message and we'll get back to you within 24 hours</CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          placeholder="Your name"
                          value={contactForm.name}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Your email"
                          value={contactForm.email}
                          onChange={(e) => setContactForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject</Label>
                      <Input
                        id="subject"
                        placeholder="What's this about?"
                        value={contactForm.subject}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, subject: e.target.value }))}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us more about your question or issue..."
                        rows={5}
                        value={contactForm.message}
                        onChange={(e) => setContactForm((prev) => ({ ...prev, message: e.target.value }))}
                        required
                      />
                    </div>
                    <Button type="submit" className="w-full">
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </motion.div>

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
