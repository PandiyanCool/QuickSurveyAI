"use client";

import { Survey, SurveyResponse, Question } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface AnalyticsSummaryProps {
  survey: Survey;
  responses: SurveyResponse[];
}

export function AnalyticsSummary({ survey, responses }: AnalyticsSummaryProps) {
  const getInsightForQuestion = (question: Question): string => {
    if (responses.length === 0) {
      return "No responses yet.";
    }
    const answers = responses
      .flatMap((r) => r.answers || [])
      .filter((a) => a && a.questionId === question.id);

    if (question.type === "text") {
      return `${answers.length} text responses received.`;
    }

    if (question.type === "scale") {
      const values = answers
        .map((a) => a.value)
        .filter((value): value is number => typeof value === "number");

      if (values.length === 0) return "No responses yet.";

      const average =
        values.reduce((sum, value) => sum + value, 0) / values.length;
      const highest = Math.max(...values);
      const lowest = Math.min(...values);

      return `Average rating: ${average.toFixed(
        1
      )} out of 10. Highest: ${highest}, Lowest: ${lowest}.`;
    }

    if (question.type === "radio") {
      const counts: Record<string, number> = {};

      answers.forEach((answer) => {
        if (typeof answer.value === "string") {
          counts[answer.value] = (counts[answer.value] || 0) + 1;
        }
      });

      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

      if (entries.length === 0) return "No responses yet.";

      const [topOption, topCount] = entries[0];
      const percentage = Math.round((topCount / answers.length) * 100);

      return `Most common response: "${topOption}" (${percentage}% of responses).`;
    }

    if (question.type === "checkbox") {
      const counts: Record<string, number> = {};

      answers.forEach((answer) => {
        if (Array.isArray(answer.value)) {
          answer.value.forEach((option: string | number) => {
            counts[option] = (counts[option] || 0) + 1;
          });
        }
      });

      const entries = Object.entries(counts).sort((a, b) => b[1] - a[1]);

      if (entries.length === 0) return "No responses yet.";

      const [topOption, topCount] = entries[0];
      const percentage = Math.round((topCount / answers.length) * 100);

      return `Most selected option: "${topOption}" (selected in ${percentage}% of responses).`;
    }

    return "No insights available.";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Analytics Summary</CardTitle>
        <CardDescription>
          Key insights from {responses.length} survey responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Accordion type="single" collapsible className="w-full">
          {survey.questions.map((question, index) => (
            <AccordionItem key={question.id} value={question.id}>
              <AccordionTrigger>
                <span className="text-left">{question.text}</span>
              </AccordionTrigger>
              <AccordionContent>
                <p className="text-muted-foreground">
                  {getInsightForQuestion(question)}
                </p>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </CardContent>
    </Card>
  );
}
