"use client"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import { motion, type Variants } from "framer-motion"

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  variants?: Variants
}

export function FeatureCard({ icon: Icon, title, description, variants }: FeatureCardProps) {
  return (
    <motion.div variants={variants}>
      <Card className="bg-gray-900 text-white border-none rounded-lg shadow-lg p-6 h-full">
        <CardContent className="p-0">
          <div className="flex items-center mb-4">
            <div className="w-10 h-10 rounded-full bg-yellow-400/20 flex items-center justify-center mr-4">
              <Icon className="h-5 w-5 text-yellow-400" />
            </div>
            <h3 className="font-semibold text-xl">{title}</h3>
          </div>
          <p className="text-gray-400 text-base">{description}</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}
