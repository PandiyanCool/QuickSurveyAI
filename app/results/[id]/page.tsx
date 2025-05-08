"use client"

import { useEffect, useState } from "react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ResponsesChart } from "@/components/dashboard/ResponsesChart"
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary"
import { Survey, SurveyResponse } from "@/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, LinkIcon } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface ResultsPageProps {
  params: {
    id: string;
  };
}

export default function ResultsPage({ params }: ResultsPageProps) {
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const [responses, setResponses] = useState<SurveyResponse[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchData = async () => {
      // In a real app, we'd make API calls
      // For demo purposes, we'll simulate the responses
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockSurvey: Survey = {
        id: params.id,
        title: "Product Feedback Survey",
        description: "Results from our product feedback survey",
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
        responses: 37
      };
      
      // Generate mock responses
      const mockResponses: SurveyResponse[] = Array.from({ length: 37 }, (_, i) => ({
        id: `resp-${i}`,
        surveyId: params.id,
        answers: [
          {
            questionId: 'q1',
            value: Math.floor(Math.random() * 10) + 1
          },
          {
            questionId: 'q2',
            value: ['Ease of use', 'Design', 'Performance'].slice(0, Math.floor(Math.random() * 3) + 1)
          },
          {
            questionId: 'q3',
            value: mockSurvey.questions[2].options![Math.floor(Math.random() * 5)]
          },
          {
            questionId: 'q4',
            value: "This is a text response for testing purposes."
          }
        ],
        createdAt: new Date().toISOString()
      }));
      
      setSurvey(mockSurvey);
      setResponses(mockResponses);
      setLoading(false);
    };
    
    fetchData();
  }, [params.id]);
  
  const handleCopyLink = () => {
    const surveyUrl = `${window.location.origin}/survey/${params.id}`;
    navigator.clipboard.writeText(surveyUrl);
    toast({
      title: "Link Copied!",
      description: "Survey link copied to clipboard"
    });
  };
  
  const handleExport = () => {
    // In a real app, this would generate and download a CSV or PDF
    toast({
      title: "Export Started",
      description: "Your data is being prepared for download."
    });
    
    // Simulate a download
    setTimeout(() => {
      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully."
      });
    }, 1500);
  };
  
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
                  <Skeleton className="h-48 w-full" />
                </div>
              ))}
            </div>
          ) : survey ? (
            <div className="space-y-6">
              <Card>
                <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <CardTitle className="text-2xl">{survey.title}</CardTitle>
                    <CardDescription>{survey.description}</CardDescription>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <Button variant="outline" size="sm" onClick={handleCopyLink}>
                      <LinkIcon className="h-4 w-4 mr-2" />
                      Share
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleExport}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-sm font-medium">{survey.responses} total responses</p>
                      <p className="text-sm text-muted-foreground">Updated just now</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Tabs defaultValue="charts">
                <TabsList className="grid w-full max-w-md mx-auto grid-cols-2">
                  <TabsTrigger value="charts">Charts</TabsTrigger>
                  <TabsTrigger value="insights">Insights</TabsTrigger>
                </TabsList>
                
                <TabsContent value="charts" className="mt-6 space-y-6">
                  {survey.questions.map((question) => (
                    <ResponsesChart 
                      key={question.id} 
                      question={question} 
                      responses={responses} 
                    />
                  ))}
                </TabsContent>
                
                <TabsContent value="insights" className="mt-6">
                  <AnalyticsSummary survey={survey} responses={responses} />
                </TabsContent>
              </Tabs>
            </div>
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