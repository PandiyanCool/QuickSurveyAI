"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SurveyCard } from "@/components/dashboard/SurveyCard";
import { Button } from "@/components/ui/button";
import { Survey } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [surveys, setSurveys] = useState<Survey[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/GetSurveys`);

        if (!response.ok) {
          throw new Error("Failed to fetch surveys");
        }

        const data = await response.json();
        setSurveys(data);
      } catch (error) {
        console.error("Error fetching surveys:", error);
        toast({
          title: "Error",
          description: "Failed to load surveys. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSurveys();
  }, [toast]);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/DeleteSurvey`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete survey");
      }

      setSurveys(surveys.filter((survey) => survey.id !== id));
      toast({
        title: "Success",
        description: "Survey deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting survey:", error);
      toast({
        title: "Error",
        description: "Failed to delete survey. Please try again.",
        variant: "destructive",
      });
    }
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
              <p className="text-muted-foreground mb-4">
                You don&apos;t have any surveys yet.
              </p>
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
