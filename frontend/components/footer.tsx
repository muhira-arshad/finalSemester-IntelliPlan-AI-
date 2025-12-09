import Link from "next/link"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-background/80 backdrop-blur-sm border-t border-gray-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Contact us here</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">support@intelliplan.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
              </div>
              <div className="flex space-x-2 pt-2">
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Instagram className="h-5 w-5" />
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-primary">
                  <Facebook className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>

          {/* About IntelliPlan */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">About IntelliPlan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  What is IntelliPlan?
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  For Personal use
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  For Real Estate
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  For Design Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">Popular Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="text-muted-foreground hover:text-primary transition-colors">
                  Create a Free account
                </Link>
              </li>
              <li>
                <Link href="/features" className="text-muted-foreground hover:text-primary transition-colors">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Design Tips
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4 text-foreground">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Our Company
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-muted-foreground hover:text-primary transition-colors">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Privacy policy & GDPR
                </Link>
              </li>
              <li>
                <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-muted-foreground hover:text-primary transition-colors">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 IntelliPlan AI Inc. All rights reserved | CS Final Year Project</p>
        </div>
      </div>
    </footer>
  )
}
