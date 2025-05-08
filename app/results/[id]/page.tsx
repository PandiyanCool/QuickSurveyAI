"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ResponsesChart } from "@/components/dashboard/ResponsesChart";
import { AnalyticsSummary } from "@/components/dashboard/AnalyticsSummary";
import { Survey, SurveyResponse } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, LinkIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

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
      try {
        // Fetch survey
        const surveyResponse = await fetch(
          `${API_BASE_URL}/GetSurvey?id=${params.id}`
        );
        if (!surveyResponse.ok) {
          throw new Error("Failed to fetch survey");
        }
        const surveyData = await surveyResponse.json();
        setSurvey(surveyData);

        // Fetch responses
        const responsesResponse = await fetch(
          `${API_BASE_URL}/GetResponses?surveyId=${params.id}`
        );
        if (!responsesResponse.ok) {
          throw new Error("Failed to fetch responses");
        }
        const responsesData = await responsesResponse.json();
        setResponses(responsesData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast({
          title: "Error",
          description: "Failed to load survey results. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id, toast]);

  const handleCopyLink = () => {
    const surveyUrl = `${window.location.origin}/survey/${params.id}`;
    navigator.clipboard.writeText(surveyUrl);
    toast({
      title: "Link Copied!",
      description: "Survey link copied to clipboard",
    });
  };

  const handleExport = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/ExportResults?surveyId=${params.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to export results");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `survey-results-${params.id}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Export Complete",
        description: "Your data has been exported successfully.",
      });
    } catch (error) {
      console.error("Error exporting results:", error);
      toast({
        title: "Export Failed",
        description: "Failed to export survey results. Please try again.",
        variant: "destructive",
      });
    }
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
                    <CardTitle className="text-2xl">{survey.topic}</CardTitle>
                    <CardDescription>{survey.description}</CardDescription>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCopyLink}
                    >
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
                      <p className="text-sm font-medium">
                        {survey.responses} total responses
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Updated just now
                      </p>
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
