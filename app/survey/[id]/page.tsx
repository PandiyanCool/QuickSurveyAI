"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SurveyForm } from "@/components/survey/SurveyForm";
import { Survey } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

interface SurveyPageProps {
  params: {
    id: string;
  };
}

export default function SurveyPage({ params }: SurveyPageProps) {
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurvey = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/GetSurvey?id=${params.id}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch survey");
        }

        const data = await response.json();
        setSurvey(data);
      } catch (error) {
        console.error("Error fetching survey:", error);
        toast({
          title: "Error",
          description: "Failed to load survey. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurvey();
  }, [params.id, toast]);

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
