"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SurveyPreview } from "@/components/create/SurveyPreview";
import { Survey, Question } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreviewPage() {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [survey, setSurvey] = useState<Survey | null>(null);

  useEffect(() => {
    const generateSurvey = async () => {
      const id = searchParams.get("id") || "";
      const topic = searchParams.get("topic") || "";
      const questionsJson = searchParams.get("questions") || "[]";

      try {
        const questionsArray = JSON.parse(decodeURIComponent(questionsJson));

        // Convert the string questions into Question objects
        const questions: Question[] = questionsArray.map(
          (text: string, index: number) => ({
            id: `q${index + 1}`,
            text,
            type: "text", // Default to text type for AI-generated questions
            required: true,
          })
        );

        setSurvey({
          id,
          topic: `${topic} Survey`,
          description: `Please provide your feedback on ${topic}.`,
          questions,
          createdAt: new Date().toISOString(),
          responses: 0,
        });
      } catch (error) {
        console.error("Error parsing questions:", error);
        // Handle error appropriately
      } finally {
        setLoading(false);
      }
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
