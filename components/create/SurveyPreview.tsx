"use client";

import { useState, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Survey, Question, QuestionType } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  PlusCircle,
  PencilIcon,
  TrashIcon,
  LinkIcon,
  Loader2,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { QuestionItem } from "@/components/survey/QuestionItem";

interface SurveyPreviewProps {
  initialSurvey: Survey;
}

const API_BASE_URL =
  "https://quicksurveyai-functions-app.azurewebsites.net/api";

export function SurveyPreview({ initialSurvey }: SurveyPreviewProps) {
  const [survey, setSurvey] = useState<Survey>(initialSurvey);
  const [editingTitle, setEditingTitle] = useState(false);
  const [editingDescription, setEditingDescription] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [shareUrl, setShareUrl] = useState("");
  const router = useRouter();
  const { toast } = useToast();

  const updateSurveyTitle = (title: string) => {
    setSurvey((prev) => ({ ...prev, title }));
    setEditingTitle(false);
  };

  const updateSurveyDescription = (description: string) => {
    setSurvey((prev) => ({ ...prev, description }));
    setEditingDescription(false);
  };

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Math.random().toString(36).substring(2, 12),
      text: "New question",
      type: "text",
      required: true,
      options: [],
    };

    setSurvey((prev) => ({
      ...prev,
      questions: [...prev.questions, newQuestion],
    }));
  };

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.map((q) =>
        q.id === id ? { ...q, ...updates } : q
      ),
    }));
  };

  const deleteQuestion = (id: string) => {
    setSurvey((prev) => ({
      ...prev,
      questions: prev.questions.filter((q) => q.id !== id),
    }));
  };

  const handleSave = async () => {
    if (survey.questions.length === 0) {
      toast({
        title: "No questions added",
        description: "Please add at least one question to your survey",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Ensure all questions have required fields
      const validQuestions = survey.questions.every(
        (q) => q.text && q.type && q.text.trim() !== ""
      );

      if (!validQuestions) {
        toast({
          title: "Invalid Questions",
          description: "All questions must have text and type",
          variant: "destructive",
        });
        return;
      }

      const response = await fetch(`${API_BASE_URL}/SaveSurvey`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: survey.title,
          title: survey.title,
          description: survey.description,
          questions: survey.questions.map((q) => ({
            id: q.id,
            text: q.text,
            type: q.type,
            required: q.required,
            options: q.options,
          })),
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.body || "Failed to save survey");
      }

      const data = await response.json();

      // Generate a shareable URL
      const shareUrl = `${window.location.origin}/survey/${data.id}`;
      setShareUrl(shareUrl);

      toast({
        title: "Survey Created!",
        description: "Your survey has been saved and is ready to share.",
      });
    } catch (error: any) {
      console.error("Error saving survey:", error);
      toast({
        title: "Failed to save",
        description:
          error.message || "Could not save your survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const copyShareLink = () => {
    navigator.clipboard.writeText(shareUrl);
    toast({
      title: "Link Copied!",
      description: "Survey link copied to clipboard",
    });
  };

  return (
    <div className="space-y-6 w-full max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            {editingTitle ? (
              <Input
                value={survey.title}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setSurvey((prev) => ({ ...prev, title: e.target.value }))
                }
                onBlur={(e: React.FocusEvent<HTMLInputElement>) =>
                  updateSurveyTitle(e.target.value)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  e.key === "Enter" && updateSurveyTitle(e.currentTarget.value)
                }
                className="text-2xl font-bold"
                autoFocus
              />
            ) : (
              <CardTitle
                className="text-2xl cursor-pointer hover:text-primary transition-colors"
                onClick={() => setEditingTitle(true)}
              >
                {survey.title} <PencilIcon className="inline ml-2 h-4 w-4" />
              </CardTitle>
            )}
          </div>

          {editingDescription ? (
            <Textarea
              value={survey.description}
              onChange={(e) =>
                setSurvey((prev) => ({ ...prev, description: e.target.value }))
              }
              onBlur={(e) => updateSurveyDescription(e.target.value)}
              className="mt-2"
              autoFocus
            />
          ) : (
            <CardDescription
              className="cursor-pointer hover:text-muted-foreground transition-colors"
              onClick={() => setEditingDescription(true)}
            >
              {survey.description || "Add a description..."}{" "}
              <PencilIcon className="inline ml-1 h-3 w-3" />
            </CardDescription>
          )}
        </CardHeader>
      </Card>

      {survey.questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <input
                type="text"
                value={question.text}
                onChange={(e) =>
                  updateQuestion(question.id, { text: e.target.value })
                }
                className="font-medium text-base flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => deleteQuestion(question.id)}
              >
                <TrashIcon className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center space-x-2">
                <Label htmlFor={`question-type-${question.id}`}>Type:</Label>
                <Select
                  value={question.type}
                  onValueChange={(value: QuestionType) =>
                    updateQuestion(question.id, {
                      type: value,
                      options:
                        value === "radio" || value === "checkbox"
                          ? ["Option 1", "Option 2", "Option 3"]
                          : undefined,
                    })
                  }
                >
                  <SelectTrigger className="w-32">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">Text</SelectItem>
                    <SelectItem value="radio">Multiple Choice</SelectItem>
                    <SelectItem value="checkbox">Checkboxes</SelectItem>
                    <SelectItem value="scale">Scale (1-10)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={question.required}
                  onCheckedChange={(checked) =>
                    updateQuestion(question.id, { required: checked })
                  }
                  id={`required-${question.id}`}
                />
                <Label htmlFor={`required-${question.id}`}>Required</Label>
              </div>
            </div>

            {(question.type === "radio" || question.type === "checkbox") &&
              question.options && (
                <div className="space-y-3 pl-4 border-l-2 border-muted mt-2">
                  <Label>Options:</Label>
                  {question.options.map((option, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <Input
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...question.options!];
                          newOptions[i] = e.target.value;
                          updateQuestion(question.id, { options: newOptions });
                        }}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          const newOptions = question.options?.filter(
                            (_, index) => index !== i
                          );
                          updateQuestion(question.id, { options: newOptions });
                        }}
                      >
                        <TrashIcon className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const newOptions = [
                        ...(question.options || []),
                        `Option ${(question.options?.length || 0) + 1}`,
                      ];
                      updateQuestion(question.id, { options: newOptions });
                    }}
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add Option
                  </Button>
                </div>
              )}
          </CardContent>
        </Card>
      ))}

      <div className="flex justify-center">
        <Button onClick={addQuestion} variant="outline" className="mt-2">
          <PlusCircle className="mr-2 h-4 w-4" />
          Add Question
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription>
            This is how participants will see your survey
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {survey.questions.map((question) => (
            <QuestionItem
              key={question.id}
              question={question}
              value={null}
              onChange={() => {}}
              className="border border-dashed"
            />
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end gap-4">
        {shareUrl ? (
          <div className="flex flex-1 items-center gap-2">
            <Input
              value={shareUrl}
              readOnly
              onClick={(e) => e.currentTarget.select()}
            />
            <Button variant="outline" size="icon" onClick={copyShareLink}>
              <LinkIcon className="h-4 w-4" />
            </Button>
          </div>
        ) : null}

        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            <>Save & Share</>
          )}
        </Button>
      </div>
    </div>
  );
}
