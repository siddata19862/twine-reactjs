import { useEffect, useState } from "react"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { AlertTriangle, Loader2, CheckCircle } from "lucide-react"

export default function ReferenceCheckBanner() {
  const [refStatus, setRefStatus] = useState(null)
  const [loading, setLoading] = useState(false)

  // --------------------------------------------------
  // Initial check
  // --------------------------------------------------
  useEffect(() => {
    let mounted = true

    async function check() {
      try {
        const status = await window.electron.invoke("references:check")
        console.log("status",status);
        if (mounted) setRefStatus(status)
      } catch (err) {
        console.error("Failed to check references", err)
      }
    }

    check()
    return () => {
      mounted = false
    }
  }, [])

  // --------------------------------------------------
  // Download handler
  // --------------------------------------------------
  const handleDownload = async () => {
    try {
      setLoading(true)
      const result = await window.electron.invoke("references:download")
      setRefStatus(result)
    } catch (err) {
      console.error("Failed to download references", err)
    } finally {
      setLoading(false)
    }
  }

  if (!refStatus) return null

  // --------------------------------------------------
  // ✅ ALL PRESENT → SUCCESS BOX
  // --------------------------------------------------
  if (refStatus.allPresent) {
    return (
      <div className="mb-4">
        <Alert className="border-emerald-200 bg-emerald-50 text-emerald-800">
          <CheckCircle className="h-4 w-4 text-emerald-600" />

          <AlertTitle>Reference files ready</AlertTitle>

          <AlertDescription className="text-sm">
            All required reference datasets are present on this system.
            You can safely run the pipeline.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  // --------------------------------------------------
  // ❌ MISSING FILES → ERROR BOX
  // --------------------------------------------------
  const missingFiles = Object.entries(refStatus.files)
    .filter(([, f]) => !f.exists)
    .map(([key]) => key)

  return (
    <div className="mb-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />

        <AlertTitle>Reference files not found</AlertTitle>

        <AlertDescription className="space-y-3">
          <p className="text-sm">
            Required reference datasets are missing from this system.
            These files must be downloaded before running the pipeline.
          </p>

          {missingFiles.length > 0 && (
            <ul className="list-disc pl-4 text-xs text-red-700">
              {missingFiles.map(f => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          )}

          <div className="pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={handleDownload}
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              {loading ? "Downloading…" : "Download now"}
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  )
}