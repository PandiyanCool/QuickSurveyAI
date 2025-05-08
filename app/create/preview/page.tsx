"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { SurveyPreview } from "@/components/create/SurveyPreview"
import { Survey, Question } from "@/types"
import { Skeleton } from "@/components/ui/skeleton"

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  
  useEffect(() => {
    const generateSurvey = async () => {
      const id = searchParams.get('id') || '';
      const topic = searchParams.get('topic') || '';
      
      // In a real app, we'd make an API call
      // For demo purposes, we'll simulate the response
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Generate mock questions based on the topic
      const questions: Question[] = [
        {
          id: 'q1',
          text: `How would you rate your experience with ${topic}?`,
          type: 'scale',
          required: true
        },
        {
          id: 'q2',
          text: `What features of ${topic} do you find most valuable?`,
          type: 'checkbox',
          options: ['Ease of use', 'Performance', 'Design', 'Functionality', 'Customer support'],
          required: true
        },
        {
          id: 'q3',
          text: `How likely are you to recommend ${topic} to others?`,
          type: 'radio',
          options: ['Very likely', 'Somewhat likely', 'Neutral', 'Somewhat unlikely', 'Very unlikely'],
          required: true
        },
        {
          id: 'q4',
          text: `What improvements would you suggest for ${topic}?`,
          type: 'text',
          required: false
        }
      ];
      
      setSurvey({
        id,
        title: `${topic} Feedback Survey`,
        description: `Help us improve ${topic} by sharing your thoughts and experiences.`,
        questions,
        createdAt: new Date().toISOString(),
        responses: 0
      });
      
      setLoading(false);
    };
    
    generateSurvey();
  }, [searchParams]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-1 py-12">
        <div className="container max-w-7xl mx-auto px-4">
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
            <SurveyPreview initialSurvey={survey} />
          ) : (
            <div className="text-center">
              <p>Something went wrong. Please try again.</p>
            </div>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
}