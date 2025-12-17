import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function CollectionsPage() {
  return (
    <div className="flex-1 p-8 pt-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Collections</h2>
          <p className="text-muted-foreground mt-1">
            Organize your prompts into collections
          </p>
        </div>
        <Button disabled>+ New Collection</Button>
      </div>

      <div className="flex flex-col items-center justify-center p-12 border border-dashed rounded-xl h-[400px] bg-slate-50/50 dark:bg-slate-900/20">
        <div className="text-5xl mb-4">📁</div>
        <h3 className="font-semibold text-lg mb-2">Coming Soon</h3>
        <p className="text-muted-foreground text-sm mb-6 text-center max-w-sm">
          Collections feature is under development. You'll be able to organize your prompts into folders.
        </p>
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
