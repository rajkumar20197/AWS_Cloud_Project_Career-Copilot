import { useState, useEffect } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Lightbulb, CheckCircle, Code, ExternalLink, ChevronDown, ChevronUp } from 'lucide-react';

interface Question {
  id: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  description: string;
  company: string;
  topics: string[];
  hints: string[];
  solution: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export function DailyQuestionCard() {
  const [question, setQuestion] = useState(null as Question | null);
  const [showHints, setShowHints] = useState(false);
  const [showSolution, setShowSolution] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDailyQuestion();
  }, []);

  const fetchDailyQuestion = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/student/daily-question');
      const data = await response.json();
      if (data.success) {
        setQuestion(data.question);
      }
    } catch (error) {
      console.error('Error fetching daily question:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-2/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </Card>
    );
  }

  if (!question) {
    return null;
  }

  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800 border-green-200',
    Medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    Hard: 'bg-red-100 text-red-800 border-red-200'
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Lightbulb className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold">Daily Interview Question</h2>
            <p className="text-sm text-slate-600">Challenge yourself every day</p>
          </div>
        </div>
        <Badge className={`${difficultyColors[question.difficulty]} border`}>
          {question.difficulty}
        </Badge>
      </div>

      {/* Question */}
      <div className="mb-6">
        <h3 className="text-xl font-semibold mb-2">{question.question}</h3>
        <p className="text-slate-700 mb-4">{question.description}</p>
        
        <div className="flex flex-wrap gap-2 text-sm">
          <div className="flex items-center gap-1 text-slate-600">
            <span className="font-medium">🏢 {question.company}</span>
          </div>
          <span className="text-slate-400">•</span>
          <div className="flex items-center gap-1">
            {question.topics.map((topic, i) => (
              <Badge key={i} variant="outline" className="text-xs">
                {topic}
              </Badge>
            ))}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <Button
          onClick={() => setShowHints(!showHints)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <Lightbulb className="w-4 h-4" />
          {showHints ? 'Hide' : 'Show'} Hints
          {showHints ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={() => setShowSolution(!showSolution)}
          variant="outline"
          className="flex items-center gap-2"
        >
          <CheckCircle className="w-4 h-4" />
          {showSolution ? 'Hide' : 'Show'} Solution
          {showSolution ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </Button>
        
        <Button
          onClick={() => window.open('https://leetcode.com', '_blank')}
          className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
        >
          <Code className="w-4 h-4" />
          Practice on LeetCode
          <ExternalLink className="w-4 h-4" />
        </Button>
      </div>

      {/* Hints Section */}
      {showHints && (
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg animate-in slide-in-from-top">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <Lightbulb className="w-5 h-5 text-blue-600" />
            Hints
          </h4>
          <ol className="list-decimal list-inside space-y-2">
            {question.hints.map((hint, i) => (
              <li key={i} className="text-slate-700">{hint}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Solution Section */}
      {showSolution && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg animate-in slide-in-from-top">
          <h4 className="font-semibold mb-3 flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            Solution
          </h4>
          <pre className="bg-slate-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm mb-4">
            <code>{question.solution}</code>
          </pre>
          <div className="space-y-1 text-sm text-slate-600">
            <p className="flex items-center gap-2">
              <span className="font-medium">⏱️ Time Complexity:</span>
              <code className="bg-slate-200 px-2 py-1 rounded">{question.timeComplexity}</code>
            </p>
            <p className="flex items-center gap-2">
              <span className="font-medium">💾 Space Complexity:</span>
              <code className="bg-slate-200 px-2 py-1 rounded">{question.spaceComplexity}</code>
            </p>
          </div>
        </div>
      )}
    </Card>
  );
}
