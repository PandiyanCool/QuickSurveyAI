"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SurveyCard } from "@/components/dashboard/SurveyCard"
import { Button } from "@/components/ui/button"
import { Survey } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"
import { PlusCircle } from "lucide-react"

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  
  useEffect(() => {
    const fetchSurveys = async () => {
      // In a real app, we'd make an API call
      // For demo purposes, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSurveys: Survey[] = [
        {
          id: 'survey1',
          title: "Product Feedback Survey",
          description: "Gathering user feedback about our new product features",
          questions: Array(4).fill({}),
          createdAt: new Date().toISOString(),
          responses: 37
        },
        {
          id: 'survey2',
          title: "Customer Satisfaction Survey",
          description: "Evaluating customer support and overall experience",
          questions: Array(5).fill({}),
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
          responses: 123
        },
        {
          id: 'survey3',
          title: "Website Usability Study",
          description: "Collecting insights on website navigation and user experience",
          questions: Array(6).fill({}),
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          responses: 89
        }
      ];
      
      setSurveys(mockSurveys);
      setLoading(false);
    };
    
    fetchSurveys();
  }, []);
  
  const handleDelete = (id: string) => {
    setSurveys(surveys.filter(survey => survey.id !== id));
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <h1 className="text-3xl font-bold tracking-tight">My Surveys</h1>
            <Button asChild>
              <Link href="/create">
                <PlusCircle className="mr-2 h-4 w-4" />
                Create New Survey
              </Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border rounded-md p-4">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : surveys.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {surveys.map((survey) => (
                <SurveyCard
                  key={survey.id}
                  survey={survey}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">You don't have any surveys yet.</p>
              <Button asChild>
                <Link href="/create">
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Create Your First Survey
                </Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}