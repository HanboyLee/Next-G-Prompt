"use client"

import { useEffect, useMemo, useState } from "react"
import { usePromptStore, estimateTokens, ToneType, FormatType, RoleType } from "@/store/use-prompt-store"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const TONES: { value: ToneType; label: string; icon: string }[] = [
  { value: 'professional', label: 'Professional', icon: '💼' },
  { value: 'casual', label: 'Casual', icon: '😊' },
  { value: 'friendly', label: 'Friendly', icon: '🤝' },
  { value: 'formal', label: 'Formal', icon: '📜' },
  { value: 'creative', label: 'Creative', icon: '🎨' },
]

const FORMATS: { value: FormatType; label: string }[] = [
  { value: 'markdown', label: 'Markdown' },
  { value: 'json', label: 'JSON' },
  { value: 'plain', label: 'Plain Text' },
  { value: 'structured', label: 'Structured' },
]

const ROLES: { value: RoleType; label: string; description: string }[] = [
  { value: 'assistant', label: 'AI Assistant', description: 'General helpful assistant' },
  { value: 'developer', label: 'Developer', description: 'Technical coding expert' },
  { value: 'analyst', label: 'Analyst', description: 'Data & business analysis' },
  { value: 'writer', label: 'Writer', description: 'Content & copywriting' },
  { value: 'expert', label: 'Expert', description: 'Domain specialist' },
  { value: 'custom', label: 'Custom', description: 'Define your own role' },
]

interface PromptEditorProps {
  onSave?: () => Promise<void>
  isSaving?: boolean
}

export function PromptEditor({ onSave, isSaving }: PromptEditorProps) {
  const { 
    title,
    content, 
    setTitle,
    setContent, 
    variables, 
    setVariable,
    settings,
    setSetting,
    isDirty
  } = usePromptStore()
  
  const [activeTab, setActiveTab] = useState<'variables' | 'settings'>('variables')

  // Auto-detect variables: {{variableName}}
  const detectedVariables = useMemo(() => {
    const regex = /{{([a-zA-Z0-9_]+)}}/g
    const matches = Array.from(content.matchAll(regex)).map(m => m[1])
    return Array.from(new Set(matches))
  }, [content])

  // Token estimation
  const tokenCount = useMemo(() => estimateTokens(content), [content])
  
  // Compiled preview with variable values filled in
  const previewText = useMemo(() => {
    let text = content
    detectedVariables.forEach(v => {
      const val = variables[v] || `{{${v}}}`
      text = text.replaceAll(`{{${v}}}`, val === "" ? `{{${v}}}` : val)
    })
    return text
  }, [content, variables, detectedVariables])

  // Highlight variables in content for visual feedback
  const highlightedContent = useMemo(() => {
    return content.replace(
      /{{([a-zA-Z0-9_]+)}}/g,
      '<span class="variable-highlight">{{$1}}</span>'
    )
  }, [content])

  return (
    <div className="flex h-full flex-col lg:flex-row">
      {/* Left: Editor */}
      <div className="flex-1 flex flex-col p-6 border-r overflow-hidden">
        {/* Title Input */}
        <div className="mb-4">
          <Input 
            placeholder="Prompt title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="text-lg font-semibold border-none shadow-none px-0 focus-visible:ring-0 bg-transparent"
          />
        </div>
        
        <Label htmlFor="prompt-input" className="mb-2 block text-sm font-medium text-muted-foreground">
          Prompt Template
        </Label>
        <div className="flex-1 relative">
          <Textarea 
            id="prompt-input"
            placeholder="Write your prompt here. Use {{variable}} to insert dynamic slots.

Example:
You are a {{role}} specialist. Please help me with {{task}}.

Focus on: {{focus_areas}}
Output format: {{format}}"
            className="h-full font-mono text-sm p-4 resize-none focus-visible:ring-1 bg-white dark:bg-slate-950"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        
        {/* Stats Bar */}
        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
          <div className="flex items-center gap-4">
            <span>{content.length} characters</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>~{tokenCount} tokens</span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span>{detectedVariables.length} variables</span>
          </div>
          {isDirty && (
            <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              Unsaved
            </span>
          )}
        </div>
      </div>

      {/* Right: Configuration & Preview */}
      <div className="w-full lg:w-[420px] flex flex-col bg-slate-50/50 dark:bg-slate-900/30">
        {/* Tab Switcher */}
        <div className="flex border-b bg-white dark:bg-slate-900">
          <button
            onClick={() => setActiveTab('variables')}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === 'variables' 
                ? "text-foreground border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Variables ({detectedVariables.length})
          </button>
          <button
            onClick={() => setActiveTab('settings')}
            className={cn(
              "flex-1 px-4 py-3 text-sm font-medium transition-colors",
              activeTab === 'settings' 
                ? "text-foreground border-b-2 border-primary" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            Settings
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'variables' ? (
            <>
              {detectedVariables.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-sm text-muted-foreground">
                    No variables detected yet.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Type <code className="bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded">{`{{name}}`}</code> to create one
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {detectedVariables.map((v) => (
                    <div key={v} className="space-y-1.5">
                      <Label htmlFor={`var-${v}`} className="text-xs uppercase text-slate-500 font-semibold">
                        {v}
                      </Label>
                      <Input 
                        id={`var-${v}`}
                        placeholder={`Enter value for ${v}...`}
                        value={variables[v] || ""}
                        onChange={(e) => setVariable(v, e.target.value)}
                        className="bg-white dark:bg-slate-900"
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div className="space-y-6">
              {/* Tone Selection */}
              <div>
                <Label className="text-xs uppercase text-slate-500 font-semibold mb-3 block">
                  Tone
                </Label>
                <div className="grid grid-cols-2 gap-2">
                  {TONES.map((tone) => (
                    <button
                      key={tone.value}
                      onClick={() => setSetting('tone', tone.value)}
                      className={cn(
                        "px-3 py-2 rounded-lg text-sm font-medium transition-all border",
                        settings.tone === tone.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                      )}
                    >
                      <span className="mr-1.5">{tone.icon}</span>
                      {tone.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Format Selection */}
              <div>
                <Label className="text-xs uppercase text-slate-500 font-semibold mb-3 block">
                  Output Format
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FORMATS.map((format) => (
                    <button
                      key={format.value}
                      onClick={() => setSetting('format', format.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium transition-all border",
                        settings.format === format.value
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                      )}
                    >
                      {format.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <Label className="text-xs uppercase text-slate-500 font-semibold mb-3 block">
                  AI Role
                </Label>
                <div className="space-y-2">
                  {ROLES.map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setSetting('role', role.value)}
                      className={cn(
                        "w-full px-3 py-2.5 rounded-lg text-left transition-all border",
                        settings.role === role.value
                          ? "bg-primary/10 border-primary"
                          : "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-primary/50"
                      )}
                    >
                      <div className="font-medium text-sm">{role.label}</div>
                      <div className="text-xs text-muted-foreground">{role.description}</div>
                    </button>
                  ))}
                </div>
                {settings.role === 'custom' && (
                  <Input
                    className="mt-3 bg-white dark:bg-slate-900"
                    placeholder="Define custom role..."
                    value={settings.customRole}
                    onChange={(e) => setSetting('customRole', e.target.value)}
                  />
                )}
              </div>
            </div>
          )}
        </div>

        {/* Live Preview */}
        <div className="border-t h-1/3 min-h-[200px] p-4 overflow-y-auto bg-gradient-to-b from-slate-100 to-slate-50 dark:from-slate-950 dark:to-slate-900">
          <h3 className="font-semibold mb-3 text-xs uppercase tracking-wide text-slate-500 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Preview
          </h3>
          <div className="whitespace-pre-wrap font-mono text-sm p-4 bg-white dark:bg-slate-900 border rounded-lg shadow-sm min-h-[100px]">
            {previewText || (
              <span className="text-muted-foreground opacity-50 italic">
                Start typing to see preview...
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
