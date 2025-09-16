"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Sparkles, Zap, Home } from "lucide-react"

export function LoadingPopup() {
  const [isVisible, setIsVisible] = useState(true)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer)
          setTimeout(() => setIsVisible(false), 500)
          return 100
        }
        return prev + 2
      })
    }, 50)

    return () => clearInterval(timer)
  }, [])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="bg-gradient-card rounded-2xl p-8 max-w-md w-full mx-4 text-center"
          >
            {/* Logo and Title */}
            <div className="mb-6">
              <div className="w-16 h-16 bg-gradient-purple rounded-full flex items-center justify-center mx-auto mb-4">
                <Home className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">IntelliPlan AI</h2>
              <p className="text-purple-300">Initializing your design workspace...</p>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between text-sm text-purple-300 mb-2">
                <span>Loading</span>
                <span>{progress}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                <motion.div
                  className="progress-bar h-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            </div>

            {/* Loading Steps */}
            <div className="space-y-3 text-left">
              <motion.div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  progress > 20 ? "bg-purple-900/30 text-purple-300" : "text-gray-500"
                }`}
                animate={{ opacity: progress > 20 ? 1 : 0.5 }}
              >
                <Sparkles className="h-4 w-4" />
                <span className="text-sm">Loading AI Engine</span>
                {progress > 20 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-green-400">
                    ✓
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  progress > 60 ? "bg-purple-900/30 text-purple-300" : "text-gray-500"
                }`}
                animate={{ opacity: progress > 60 ? 1 : 0.5 }}
              >
                <Zap className="h-4 w-4" />
                <span className="text-sm">Preparing Design Tools</span>
                {progress > 60 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-green-400">
                    ✓
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
                  progress > 90 ? "bg-purple-900/30 text-purple-300" : "text-gray-500"
                }`}
                animate={{ opacity: progress > 90 ? 1 : 0.5 }}
              >
                <Home className="h-4 w-4" />
                <span className="text-sm">Finalizing Interface</span>
                {progress > 90 && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto text-green-400">
                    ✓
                  </motion.div>
                )}
              </motion.div>
            </div>

            {/* Floating particles */}
            <div className="absolute inset-0 pointer-events-none">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-purple-400 rounded-full"
                  animate={{
                    x: [0, Math.random() * 100 - 50],
                    y: [0, Math.random() * 100 - 50],
                    opacity: [0, 1, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: i * 0.5,
                  }}
                  style={{
                    left: `${20 + Math.random() * 60}%`,
                    top: `${20 + Math.random() * 60}%`,
                  }}
                />
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
