"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export interface FloatingNotification {
  id: string
  title: string
  message: string
  type: "success" | "error" | "info"
  duration?: number
}

let notificationId = 0

export function FloatingNotificationContainer() {
  const [notifications, setNotifications] = useState<FloatingNotification[]>([])

  useEffect(() => {
    // Global notification handler
    const handleNotification = (event: CustomEvent<FloatingNotification>) => {
      const id = String(notificationId++)
      const notification = { ...event.detail, id }
      setNotifications((prev) => [...prev, notification])

      if (event.detail.duration !== 0) {
        setTimeout(() => {
          removeNotification(id)
        }, event.detail.duration || 4000)
      }
    }

    window.addEventListener("show-notification", handleNotification as EventListener)
    return () => window.removeEventListener("show-notification", handleNotification as EventListener)
  }, [])

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id))
  }

  return (
    <div className="fixed bottom-6 right-6 z-[999]">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20, x: 400 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: 400 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="mb-3"
          >
            <div className="bg-background border border-border rounded-lg shadow-lg p-4 max-w-sm">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  {notification.type === "success" && <CheckCircle className="h-6 w-6 text-green-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{notification.title}</p>
                  <p className="text-sm text-muted-foreground mt-1">{notification.message}</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="flex-shrink-0 h-6 w-6"
                  onClick={() => removeNotification(notification.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}

export function showNotification(notification: Omit<FloatingNotification, "id">) {
  const event = new CustomEvent("show-notification", { detail: notification })
  window.dispatchEvent(event)
}
