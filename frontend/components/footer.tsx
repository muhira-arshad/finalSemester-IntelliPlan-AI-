import Link from "next/link"
import { Facebook, Instagram, Mail, Phone } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Contact Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact us here</h3>
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span className="text-sm">support@intelliplan.ai</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span className="text-sm">+1 (555) 123-4567</span>
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
            <h3 className="font-semibold text-lg mb-4">About IntelliPlan</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  What is IntelliPlan?
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary">
                  For Personal use
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary">
                  For Real Estate
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary">
                  For Design Professionals
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Popular Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/signup" className="hover:text-primary">
                  Create a Free account
                </Link>
              </li>
              <li>
                <Link href="/features" className="hover:text-primary">
                  Pricing
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  Support
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  Design Tips
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* About Us */}
          <div>
            <h3 className="font-semibold text-lg mb-4">About Us</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/about" className="hover:text-primary">
                  Our Company
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-primary">
                  Partners
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Privacy policy & GDPR
                </Link>
              </li>
              <li>
                <Link href="#" className="hover:text-primary">
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-primary">
                  Contact us
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 IntelliPlan AI Inc. All rights reserved | CS Final Year Project</p>
        </div>
      </div>
    </footer>
  )
}
