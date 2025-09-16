"use client"

import { useTheme } from "next-themes"
import { Moon, Sun } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme()

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <div className="relative w-20 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center p-1 cursor-pointer transition-colors duration-300" onClick={toggleTheme}>
      <motion.div
        className="absolute w-8 h-8 rounded-full bg-white dark:bg-yellow-400 shadow-md flex items-center justify-center"
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        initial={false}
        animate={{ x: theme === "dark" ? "calc(100% - 4px)" : "4px" }}
      >
        {theme === "dark" ? (
          <Moon className="h-5 w-5 text-gray-800" />
        ) : (
          <Sun className="h-5 w-5 text-yellow-500" />
        )}
      </motion.div>
      <div className="absolute left-2 top-1/2 -translate-y-1/2">
        <Sun className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
      <div className="absolute right-2 top-1/2 -translate-y-1/2">
        <Moon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
      </div>
    </div>
  )
}
