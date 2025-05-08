"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Question, QuestionType, SurveyResponse } from "@/types"
import { 
  PieChart, 
  Pie, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  ResponsiveContainer, 
  Cell 
} from "recharts"

interface ResponsesChartProps {
  question: Question;
  responses: SurveyResponse[];
}

export function ResponsesChart({ question, responses }: ResponsesChartProps) {
  const [chartData, setChartData] = useState<any[]>([]);
  
  useEffect(() => {
    const prepareChartData = () => {
      if (question.type === 'text') {
        // For text questions, we don't show a chart
        return [];
      }
      
      if (question.type === 'scale') {
        // For scale questions, we create a distribution
        const counts = Array(10).fill(0);
        
        responses.forEach(response => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer && typeof answer.value === 'number') {
            counts[answer.value - 1]++;
          }
        });
        
        return Array.from({ length: 10 }, (_, i) => ({
          name: (i + 1).toString(),
          count: counts[i]
        }));
      }
      
      if (question.type === 'radio') {
        // For radio questions, we count each option
        const counts: Record<string, number> = {};
        
        question.options?.forEach(option => {
          counts[option] = 0;
        });
        
        responses.forEach(response => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer && typeof answer.value === 'string') {
            counts[answer.value] = (counts[answer.value] || 0) + 1;
          }
        });
        
        return Object.entries(counts).map(([name, count]) => ({
          name,
          count
        }));
      }
      
      if (question.type === 'checkbox') {
        // For checkbox questions, we count each option
        const counts: Record<string, number> = {};
        
        question.options?.forEach(option => {
          counts[option] = 0;
        });
        
        responses.forEach(response => {
          const answer = response.answers.find(a => a.questionId === question.id);
          if (answer && Array.isArray(answer.value)) {
            answer.value.forEach(option => {
              counts[option] = (counts[option] || 0) + 1;
            });
          }
        });
        
        return Object.entries(counts).map(([name, count]) => ({
          name,
          count
        }));
      }
      
      return [];
    };
    
    setChartData(prepareChartData());
  }, [question, responses]);
  
  if (question.type === 'text' || chartData.length === 0) {
    return null;
  }
  
  // Chart colors
  const COLORS = ['hsl(var(--chart-1))', 'hsl(var(--chart-2))', 'hsl(var(--chart-3))', 'hsl(var(--chart-4))', 'hsl(var(--chart-5))'];
  
  const renderChart = () => {
    if (question.type === 'radio' || question.type === 'checkbox') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="count"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      );
    }
    
    if (question.type === 'scale') {
      return (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value} responses`, 'Count']} />
            <Legend />
            <Bar dataKey="count" name="Responses" fill="hsl(var(--chart-1))" />
          </BarChart>
        </ResponsiveContainer>
      );
    }
    
    return null;
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{question.text}</CardTitle>
        <CardDescription>
          {responses.length} total responses
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderChart()}
      </CardContent>
    </Card>
  );
}