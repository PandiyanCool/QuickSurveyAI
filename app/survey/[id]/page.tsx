"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SurveyForm } from "@/components/survey/SurveyForm"
import { Survey } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

interface SurveyPageProps {
  params: {
    id: string;
  };
}

export default function SurveyPage({ params }: SurveyPageProps) {
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  
  useEffect(() => {
    const fetchSurvey = async () => {
      // In a real app, we'd make an API call
      // For demo purposes, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSurvey({
        id: params.id,
        title: "Product Feedback Survey",
        description: "Help us improve our product by sharing your thoughts and experiences.",
        questions: [
          {
            id: 'q1',
            text: "How would you rate your overall experience with our product?",
            type: 'scale',
            required: true
          },
          {
            id: 'q2',
            text: "Which features do you find most valuable?",
            type: 'checkbox',
            options: ['Ease of use', 'Performance', 'Design', 'Functionality', 'Customer support'],
            required: true
          },
          {
            id: 'q3',
            text: "How likely are you to recommend our product to others?",
            type: 'radio',
            options: ['Very likely', 'Somewhat likely', 'Neutral', 'Somewhat unlikely', 'Very unlikely'],
            required: true
          },
          {
            id: 'q4',
            text: "What improvements would you suggest for our product?",
            type: 'text',
            required: false
          }
        ],
        createdAt: new Date().toISOString(),
        responses: 42
      });
      
      setLoading(false);
    };
    
    fetchSurvey();
  }, [params.id]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-5xl mx-auto px-4">
          {loading ? (
            <div className="space-y-6">
              <div className="space-y-2">
                <Skeleton className="h-8 w-full max-w-md" />
                <Skeleton className="h-4 w-full max-w-sm" />
              </div>
              
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-2 border rounded-md p-6">
                  <Skeleton className="h-6 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : survey ? (
            <SurveyForm survey={survey} />
          ) : (
            <div className="text-center">
              <p>Survey not found. Please check the URL and try again.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}