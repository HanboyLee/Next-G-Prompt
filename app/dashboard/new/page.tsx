"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { PromptEditor } from "@/components/dashboard/prompt-editor"
import { Button } from "@/components/ui/button"
import { usePromptStore } from "@/store/use-prompt-store"
import { createPrompt } from "@/app/actions/prompt"

export default function NewPromptPage() {
  const router = useRouter()
  const [isSaving, setIsSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { title, content, variables, settings, isDirty, reset } = usePromptStore()

  const handleSave = async () => {
    if (!content.trim()) return
    
    setError(null)
    setIsSaving(true)
    try {
      const result = await createPrompt({
        title: title || "Untitled Prompt",
        content,
        variables: JSON.stringify(variables),
        tags: `${settings.tone},${settings.format},${settings.role}`,
      })
      
      if (result.success) {
        reset()
        router.push("/dashboard")
      } else {
        setError(result.error || "Failed to save prompt")
      }
    } catch (err) {
      setError("An unexpected error occurred")
    } finally {
      setIsSaving(false)
    }
  }

  const handleCopy = async () => {
    // Generate the final prompt with variables filled in
    let finalPrompt = content
    Object.entries(variables).forEach(([key, value]) => {
      finalPrompt = finalPrompt.replaceAll(`{{${key}}}`, value || `{{${key}}}`)
    })
    
    await navigator.clipboard.writeText(finalPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="h-full flex flex-col">
      <header className="h-14 border-b flex items-center px-6 justify-between bg-white dark:bg-slate-900 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="font-semibold text-sm">
            {title || "Untitled Prompt"}
          </h1>
          {isDirty && (
            <span className="text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              Unsaved
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="ghost" 
            size="sm"
            onClick={handleCopy}
            disabled={!content}
            className="text-xs"
          >
            {copied ? "✓ Copied!" : "📋 Copy"}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (isDirty && !confirm("Discard unsaved changes?")) return
              reset()
              router.push("/dashboard")
            }}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button 
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !content.trim()}
            className="text-xs px-4"
          >
            {isSaving ? "Saving..." : "💾 Save Prompt"}
          </Button>
        </div>
      </header>
      {error && (
        <div className="bg-red-50 dark:bg-red-950 border-b border-red-200 dark:border-red-900 px-6 py-2 flex items-center justify-between">
          <span className="text-sm text-red-600 dark:text-red-400">❌ {error}</span>
          <button 
            onClick={() => setError(null)} 
            className="text-red-400 hover:text-red-600 text-sm"
          >
            Dismiss
          </button>
        </div>
      )}
      <div className="flex-1 overflow-hidden">
        <PromptEditor />
      </div>
    </div>
  )
}

