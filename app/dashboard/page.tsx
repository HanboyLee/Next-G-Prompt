'use client'

import Link from "next/link"
import { getPrompts } from "@/app/actions/prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeletePromptButton } from "@/components/dashboard/delete-button"
import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

interface Prompt {
  id: string
  title: string
  content: string
  tags: string | null
  updatedAt: Date
}

export default function DashboardPage() {
  const t = useTranslations('dashboard')
  const tCommon = useTranslations('common')
  const [prompts, setPrompts] = useState<Prompt[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getPrompts().then((data) => {
      setPrompts(data)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex-1 p-8 pt-6 overflow-y-auto">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded animate-pulse mb-8" />
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex-1 p-8 pt-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{t('title')}</h2>
          <p className="text-muted-foreground mt-1">
            {t('description')}
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>{t('newPrompt')}</Button>
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl h-[400px] bg-slate-50/50 dark:bg-slate-900/20">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-semibold text-lg mb-2">{t('noPrompts')}</h3>
          <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
            {t('noPromptsHint')}
          </p>
          <Link href="/dashboard/new">
            <Button size="lg">{t('createFirst')}</Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {prompts.map((prompt) => (
            <Card key={prompt.id} className="group hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {prompt.title}
                  </CardTitle>
                  <DeletePromptButton promptId={prompt.id} promptTitle={prompt.title} />
                </div>
                {prompt.tags && (
                  <div className="flex gap-1.5 mt-2 flex-wrap">
                    {prompt.tags.split(",").slice(0, 3).map((tag, i) => (
                      <span 
                        key={i} 
                        className="text-[10px] px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-muted-foreground"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground line-clamp-3 font-mono">
                  {prompt.content}
                </p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <span className="text-xs text-muted-foreground">
                    {new Date(prompt.updatedAt).toLocaleDateString()}
                  </span>
                  <Link href={`/dashboard/edit/${prompt.id}`}>
                    <Button variant="link" size="sm" className="h-auto p-0 text-xs">
                      {tCommon('edit')} →
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
