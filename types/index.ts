export interface Survey {
  id: string;
  topic: string;
  description: string;
  questions: Question[];
  createdAt: string;
  responses: number;
}

export interface Question {
  id: string;
  text: string;
  type: QuestionType;
  options?: string[];
  required: boolean;
}

export type QuestionType = 'text' | 'radio' | 'checkbox' | 'scale';

export interface SurveyResponse {
  id: string;
  surveyId: string;
  answers: Answer[];
  createdAt: string;
}

export interface Answer {
  questionId: string;
  value: string | string[] | number;
}

export interface SurveyInsight {
  questionText: string;
  questionType: QuestionType;
  insight: string;
  data: any; // For chart data
}