import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Terminal, Download, Trash2 } from "lucide-react"

export function ManageDataContent() {
  return (
    <Card className="shadow-none border-none">
      <CardHeader className="px-0 pt-0">
        <CardTitle className="text-xl">Manage Your Data</CardTitle>
        <CardDescription>Export or delete your account data.</CardDescription>
      </CardHeader>
      <CardContent className="px-0 space-y-6">
        <Alert>
          <Terminal className="h-4 w-4" />
          <AlertDescription>
            Be careful when managing your data. Deleting your account is irreversible.
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Export Data</h3>
          <p className="text-sm text-muted-foreground">
            Download a copy of your account data, including profile information and project metadata.
          </p>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export My Data
          </Button>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg text-destructive">Delete Account</h3>
          <p className="text-sm text-muted-foreground">
            Permanently delete your IntelliPlan AI account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Delete My Account
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
