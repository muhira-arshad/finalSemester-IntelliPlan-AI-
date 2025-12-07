import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "next-themes"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { SmoothScrolling } from "@/components/smooth-scrolling"
import { AuthProvider } from "@/context/auth-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "IntelliPlan AI - AI-Powered Floor Plan Generation",
  description:
    "Generate stunning 2D floor plans using artificial intelligence. Perfect for architects, real estate professionals, and homeowners.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScrolling>
            <AuthProvider>
              <Navigation />
              <main className="min-h-screen">{children}</main>
              <Footer />
            </AuthProvider>
          </SmoothScrolling>
        </ThemeProvider>
      </body>
    </html>
  )
}
