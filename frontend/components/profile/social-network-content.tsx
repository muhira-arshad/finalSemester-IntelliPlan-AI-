import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Linkedin, Twitter, Instagram } from "lucide-react"

export function SocialNetworksContent() {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Social Networks</CardTitle>
        <CardDescription>Link your social media accounts.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-4">
        <div className="space-y-2">
          <Label htmlFor="linkedin">LinkedIn URL</Label>
          <div className="flex items-center gap-2">
            <Linkedin className="h-5 w-5 text-muted-foreground" />
            <Input id="linkedin" placeholder="https://linkedin.com/in/yourprofile" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="twitter">Twitter URL</Label>
          <div className="flex items-center gap-2">
            <Twitter className="h-5 w-5 text-muted-foreground" />
            <Input id="twitter" placeholder="https://twitter.com/yourhandle" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="instagram">Instagram URL</Label>
          <div className="flex items-center gap-2">
            <Instagram className="h-5 w-5 text-muted-foreground" />
            <Input id="instagram" placeholder="https://instagram.com/yourprofile" />
          </div>
        </div>
        <Button>Save Social Links</Button>
      </CardContent>
    </Card>
  )
}
