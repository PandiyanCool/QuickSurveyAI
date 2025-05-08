import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SparklesIcon, LineChartIcon, MoveRightIcon, BriefcaseIcon } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-20 md:py-28 bg-gradient-to-b from-background to-muted/30">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl">
                  Create AI-Powered Surveys<br />
                  <span className="text-primary">In Seconds</span>
                </h1>
                <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl">
                  Generate professional surveys with AI, collect responses, and get instant insights with beautiful visualizations.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button size="lg" asChild>
                  <Link href="/create">
                    <SparklesIcon className="mr-2 h-4 w-4" />
                    Create Survey
                  </Link>
                </Button>
                <Button variant="outline" size="lg" asChild>
                  <Link href="/dashboard">
                    <LineChartIcon className="mr-2 h-4 w-4" />
                    View Examples
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 md:py-24">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4 mb-12">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">How It Works</h2>
              <p className="text-muted-foreground md:text-lg max-w-[700px]">
                QuickSurvey AI makes it easy to create, share and analyze surveys in minutes, not hours.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <SparklesIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">1. Generate</h3>
                <p className="text-muted-foreground">
                  Enter your topic and our AI generates relevant survey questions instantly.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <BriefcaseIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">2. Collect</h3>
                <p className="text-muted-foreground">
                  Share your survey with a simple link and gather responses from anywhere.
                </p>
              </div>
              
              <div className="flex flex-col items-center text-center p-6 bg-card rounded-lg border shadow-sm">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                  <LineChartIcon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">3. Analyze</h3>
                <p className="text-muted-foreground">
                  View beautiful visualizations and AI-generated insights from your data.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-muted/40">
          <div className="container px-4 md:px-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">Ready to start collecting insights?</h2>
              <p className="text-muted-foreground md:text-lg max-w-[600px]">
                Create your first AI-powered survey in seconds, with no login required.
              </p>
              <Button size="lg" className="mt-4" asChild>
                <Link href="/create">
                  Get Started <MoveRightIcon className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}