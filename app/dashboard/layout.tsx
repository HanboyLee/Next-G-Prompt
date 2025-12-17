import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen w-full bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-64 border-r bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hidden md:flex flex-col">
        <div className="h-14 flex items-center px-4 border-b">
          <Link href="/dashboard" className="font-bold text-lg tracking-tight">
            next-g-prompt
          </Link>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-1">
          <Link href="/dashboard/new">
             <Button variant="secondary" className="w-full justify-start">
               + New Prompt
             </Button>
          </Link>
          <div className="pt-4">
            <h3 className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Menu
            </h3>
            <Link href="/dashboard">
              <Button variant="ghost" className="w-full justify-start">
                My Prompts
              </Button>
            </Link>
            <Link href="/dashboard/collections">
              <Button variant="ghost" className="w-full justify-start">
                Collections
              </Button>
            </Link>
            <Link href="/dashboard/settings">
              <Button variant="ghost" className="w-full justify-start">
                Settings
              </Button>
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {children}
      </main>
    </div>
  )
}

