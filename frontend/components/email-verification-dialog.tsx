"use client"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Mail, CheckCircle } from "lucide-react"
import { motion } from "framer-motion"

interface EmailVerificationDialogProps {
  isOpen: boolean
  onClose: () => void
  email: string
}

export function EmailVerificationDialog({ isOpen, onClose, email }: EmailVerificationDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 text-white border-gray-700 max-w-md">
        <DialogHeader className="text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, type: "spring" }}
            className="mx-auto mb-4 w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center"
          >
            <Mail className="w-8 h-8 text-yellow-400" />
          </motion.div>
          <DialogTitle className="text-2xl font-bold text-white">Welcome to IntelliPlan AI!</DialogTitle>
          <DialogDescription className="text-gray-300 text-lg">
            Please verify your email address to complete your registration.
          </DialogDescription>
        </DialogHeader>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-4"
        >
          <div className="bg-gray-800/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <span className="text-sm font-medium text-green-400">Verification email sent!</span>
            </div>
            <p className="text-sm text-gray-300">We've sent a verification link to:</p>
            <p className="text-sm font-medium text-yellow-400 mt-1 break-all">{email}</p>
          </div>

          <div className="text-sm text-gray-400 space-y-2">
            <p>📧 Check your inbox and click the verification link</p>
            <p>📁 Don't forget to check your spam/junk folder</p>
            <p>⏰ The verification link will expire in 24 hours</p>
            <p>🔒 You must verify your email before you can sign in</p>
          </div>

          <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-lg p-3">
            <p className="text-xs text-yellow-400 font-medium">
              💡 After clicking the verification link, you'll be redirected back to sign in with your credentials.
            </p>
          </div>

          <Button
            onClick={onClose}
            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-semibold"
          >
            Continue to Sign In
          </Button>
        </motion.div>
      </DialogContent>
    </Dialog>
  )
}
