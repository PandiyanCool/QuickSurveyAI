"use client";

import { useState } from "react";
import Link from "next/link";
import { Survey } from "@/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { BarChart3Icon, LinkIcon, TrashIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface SurveyCardProps {
  survey: Survey;
  onDelete: (id: string) => void;
}

export function SurveyCard({ survey, onDelete }: SurveyCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleCopyLink = () => {
    const surveyUrl = `${window.location.origin}/survey/${survey.id}`;
    navigator.clipboard.writeText(surveyUrl);
    toast({
      title: "Link Copied!",
      description: "Survey link copied to clipboard",
    });
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      // In a real app, this would call an API endpoint
      await new Promise((resolve) => setTimeout(resolve, 1000));
      onDelete(survey.id);
      toast({
        title: "Survey Deleted",
        description: "The survey has been deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Deletion Failed",
        description: "Could not delete the survey. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{survey.title}</CardTitle>
        <CardDescription>
          Created{" "}
          {formatDistanceToNow(new Date(survey.createdAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {survey.description || "No description provided"}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">
              {survey.questions.length} questions
            </span>
            <span className="text-sm text-muted-foreground">•</span>
            <span className="text-sm font-medium">
              {survey.responses} responses
            </span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between gap-2">
        <Button variant="outline" size="sm" onClick={handleCopyLink}>
          <LinkIcon className="h-4 w-4 mr-2" />
          Share
        </Button>

        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/results/${survey.id}`}>
              <BarChart3Icon className="h-4 w-4 mr-2" />
              Results
            </Link>
          </Button>

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="sm">
                <TrashIcon className="h-4 w-4 mr-2" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This will permanently delete the survey "{survey.title}" and
                  all its responses. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete}>
                  {isDeleting ? "Deleting..." : "Delete"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardFooter>
    </Card>
  );
}
