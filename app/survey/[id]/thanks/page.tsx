import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle2Icon, HomeIcon } from "lucide-react"

interface ThanksPageProps {
  params: {
    id: string;
  };
}

export default function ThanksPage({ params }: ThanksPageProps) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12 flex items-center justify-center">
        <div className="container max-w-md mx-auto px-4">
          <Card className="text-center">
            <CardHeader>
              <div className="flex justify-center mb-4">
                <CheckCircle2Icon className="h-16 w-16 text-primary/80" />
              </div>
              <CardTitle className="text-2xl">Thank You!</CardTitle>
              <CardDescription>
                Your response has been submitted successfully.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We appreciate you taking the time to complete this survey. Your feedback is valuable to us.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button asChild>
                <Link href="/">
                  <HomeIcon className="mr-2 h-4 w-4" />
                  Return Home
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}