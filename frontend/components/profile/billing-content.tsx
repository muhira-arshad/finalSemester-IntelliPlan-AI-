import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function BillingContent() {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Premium subscription</CardTitle>
        <CardDescription>Manage your subscription and payment methods.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="font-medium">Current Plan:</p>
            <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
              Free Tier
            </Badge>
          </div>
          <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 text-white">
            <Link href="/features#pricing">Upgrade Plan</Link>
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Have a promo code?</h3>
          <div className="flex gap-2">
            <Input placeholder="Enter promo code" className="flex-1" />
            <Button>Submit</Button>
          </div>
        </div>

        {/* Mock usage limits */}
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Usage Limits</h3>
          <div className="grid gap-3">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Full catalog access</span>
              <span className="text-green-600">Upgrade plan</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Upload a texture</span>
              <span>5 left</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Renders</span>
              <span>0 left</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Plan recognition</span>
              <span>0 left</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
