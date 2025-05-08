"use client"

import { useState } from "react"
import { Question, QuestionType } from "@/types"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Slider } from "@/components/ui/slider"
import { cn } from "@/lib/utils"

interface QuestionItemProps {
  question: Question;
  value: any;
  onChange: (questionId: string, value: any) => void;
  className?: string;
}

export function QuestionItem({ question, value, onChange, className }: QuestionItemProps) {
  const [checkboxValues, setCheckboxValues] = useState<string[]>(
    Array.isArray(value) ? value : []
  );
  
  const handleCheckboxChange = (option: string) => {
    const newValues = checkboxValues.includes(option)
      ? checkboxValues.filter(item => item !== option)
      : [...checkboxValues, option];
    
    setCheckboxValues(newValues);
    onChange(question.id, newValues);
  };

  return (
    <div className={cn("space-y-4 p-4 bg-card rounded-md shadow-sm", className)}>
      <div className="flex items-start gap-2">
        <h3 className="text-base font-medium flex-1">
          {question.text}
          {question.required && <span className="text-destructive ml-1">*</span>}
        </h3>
      </div>
      
      <div className="pt-2">
        {question.type === 'text' && (
          <Textarea 
            placeholder="Your answer"
            value={value || ''}
            onChange={(e) => onChange(question.id, e.target.value)}
            className="resize-none"
          />
        )}
        
        {question.type === 'radio' && question.options && (
          <RadioGroup
            value={value as string}
            onValueChange={(value) => onChange(question.id, value)}
          >
            <div className="space-y-2">
              {question.options.map((option) => (
                <div key={option} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${question.id}-${option}`} />
                  <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        )}
        
        {question.type === 'checkbox' && question.options && (
          <div className="space-y-2">
            {question.options.map((option) => (
              <div key={option} className="flex items-center space-x-2">
                <Checkbox
                  id={`${question.id}-${option}`}
                  checked={checkboxValues.includes(option)}
                  onCheckedChange={() => handleCheckboxChange(option)}
                />
                <Label htmlFor={`${question.id}-${option}`}>{option}</Label>
              </div>
            ))}
          </div>
        )}
        
        {question.type === 'scale' && (
          <div className="space-y-4">
            <Slider
              defaultValue={[value as number || 5]}
              max={10}
              min={1}
              step={1}
              onValueChange={(values) => onChange(question.id, values[0])}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>1</span>
              <span>10</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}