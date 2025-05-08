"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, SparklesIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

export function TopicInput() {
  const [topic, setTopic] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleGenerate = async () => {
    if (!topic.trim()) {
      toast({
        title: "Topic Required",
        description: "Please enter a survey topic to continue",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const response = await fetch(`${API_BASE_URL}/GenerateSurvey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          numQuestions: 5,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate survey");
      }

      const data = await response.json();

      // Navigate to the preview page with the generated survey
      router.push(
        `/create/preview?id=${Date.now()}&topic=${encodeURIComponent(
          topic
        )}&questions=${encodeURIComponent(JSON.stringify(data.questions))}`
      );
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate survey questions. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle className="text-2xl">Create a New Survey</CardTitle>
        <CardDescription>
          Enter a topic and we&apos;ll generate relevant questions using AI
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="topic">Survey Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Customer Satisfaction, Product Feedback"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            placeholder="Add some context about your survey"
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end">
        <Button onClick={handleGenerate} disabled={isGenerating}>
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating
            </>
          ) : (
            <>
              <SparklesIcon className="mr-2 h-4 w-4" />
              Generate Survey
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
