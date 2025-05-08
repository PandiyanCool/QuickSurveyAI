"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Question, Survey } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QuestionItem } from "@/components/survey/QuestionItem";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

interface SurveyFormProps {
  survey: Survey;
}

export function SurveyForm({ survey }: SurveyFormProps) {
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const handleQuestionChange = (questionId: string, value: any) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateAnswers = () => {
    for (const question of survey.questions) {
      if (question.required) {
        const answer = answers[question.id];
        const isEmpty =
          answer === undefined ||
          answer === "" ||
          (Array.isArray(answer) && answer.length === 0);

        if (isEmpty) {
          toast({
            title: "Please answer all required questions",
            description: `"${question.text}" is required`,
            variant: "destructive",
          });
          return false;
        }
      }
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateAnswers()) return;

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/SaveResponse`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          surveyId: survey.id,
          responses: Object.entries(answers).map(([questionId, value]) => ({
            questionId,
            value,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save response");
      }

      const data = await response.json();

      toast({
        title: "Thank you for your response!",
        description: "Your answers have been submitted successfully.",
      });

      // Redirect to a thank you page
      router.push(`/survey/${survey.id}/thanks`);
    } catch (error) {
      toast({
        title: "Something went wrong",
        description: "Your answers could not be submitted. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">{survey.title}</CardTitle>
        <CardDescription>{survey.description}</CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {survey.questions.map((question) => (
          <QuestionItem
            key={question.id}
            question={question}
            value={answers[question.id]}
            onChange={handleQuestionChange}
          />
        ))}
      </CardContent>

      <CardFooter className="flex justify-end space-x-2 pt-6">
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Submit Response
        </Button>
      </CardFooter>
    </Card>
  );
}
