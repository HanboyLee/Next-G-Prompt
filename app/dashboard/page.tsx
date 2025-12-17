import Link from "next/link"
import { getPrompts } from "@/app/actions/prompt"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DeletePromptButton } from "@/components/dashboard/delete-button"

export default async function DashboardPage() {
  const prompts = await getPrompts()

  return (
    <div className="flex-1 p-8 pt-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">My Prompts</h2>
          <p className="text-muted-foreground mt-1">
            Create and manage your prompt templates
          </p>
        </div>
        <Link href="/dashboard/new">
          <Button>+ New Prompt</Button>
        </Link>
      </div>

      {prompts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl h-[400px] bg-slate-50/50 dark:bg-slate-900/20">
          <div className="text-5xl mb-4">📝</div>
          <h3 className="font-semibold text-lg mb-2">No prompts yet</h3>
          <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
            Create your first prompt template to get started. Use variables like {`{{topic}}`} to make them reusable.
          </p>
          <Link href="/dashboard/new">
            <Button size="lg">Create Your First Prompt</Button>
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
                      Edit →
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

