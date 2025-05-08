"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart, LineChart, PlusCircle, ClipboardList } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/theme/ModeToggle"
import { cn } from "@/lib/utils"

export function Header() {
  const pathname = usePathname()
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <ClipboardList className="h-6 w-6 text-primary" />
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">QuickSurvey</span>
            <span className="ml-1 text-xl font-bold text-primary">AI</span>
          </Link>
        </div>
        
        <nav className="hidden md:flex items-center gap-6">
          <Link 
            href="/" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname === "/" ? "text-primary" : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link 
            href="/create" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname?.startsWith("/create") ? "text-primary" : "text-muted-foreground"
            )}
          >
            Create Survey
          </Link>
          <Link 
            href="/dashboard" 
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              pathname?.startsWith("/dashboard") ? "text-primary" : "text-muted-foreground"
            )}
          >
            My Surveys
          </Link>
        </nav>
        
        <div className="flex items-center gap-2">
          <Button asChild variant="default" size="sm" className="hidden md:flex">
            <Link href="/create">
              <PlusCircle className="mr-2 h-4 w-4" />
              New Survey
            </Link>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}