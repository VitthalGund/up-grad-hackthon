"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Trophy,
  Clock,
  Target,
  Brain,
  TrendingUp,
  TrendingDown,
  RotateCcw,
  Star,
  AlertTriangle,
  CheckCircle,
  XCircle,
  BarChart3,
} from "lucide-react"

interface QuizResultsProps {
  results: {
    score: number
    totalQuestions: number
    totalTime: number
    averageConfidence: number
    retryCount: number
    confidenceMismatches: number
    topicPerformance: { topic: string; correct: number; total: number }[]
    errorPatterns: string[]
  }
  onRetakeQuiz: () => void
  onViewAnalytics: () => void
  onContinueLearning: () => void
}

export function QuizResults({ results, onRetakeQuiz, onViewAnalytics, onContinueLearning }: QuizResultsProps) {
  const percentage = Math.round((results.score / results.totalQuestions) * 100)
  const averageTimePerQuestion = Math.round(results.totalTime / results.totalQuestions)

  const getPerformanceLevel = (percentage: number) => {
    if (percentage >= 90) return { level: "Excellent", color: "text-green-600", icon: Trophy }
    if (percentage >= 80) return { level: "Good", color: "text-blue-600", icon: CheckCircle }
    if (percentage >= 70) return { level: "Fair", color: "text-yellow-600", icon: Target }
    return { level: "Needs Improvement", color: "text-red-600", icon: XCircle }
  }

  const performance = getPerformanceLevel(percentage)
  const PerformanceIcon = performance.icon

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Overall Results */}
      <Card className="text-center">
        <CardHeader>
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
            <PerformanceIcon className={`w-10 h-10 ${performance.color}`} />
          </div>
          <CardTitle className="text-3xl font-bold">{percentage}%</CardTitle>
          <p className="text-lg text-muted-foreground">
            {results.score} out of {results.totalQuestions} questions correct
          </p>
          <Badge className={`${performance.color} bg-transparent border-current`} variant="outline">
            {performance.level}
          </Badge>
        </CardHeader>
        <CardContent>
          <Progress value={percentage} className="h-3 mb-4" />
          <p className="text-sm text-muted-foreground">
            Quiz completed in {formatTime(results.totalTime)} with {results.retryCount} retries
          </p>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="w-8 h-8 mx-auto mb-2 text-primary" />
            <p className="text-2xl font-bold">{formatTime(averageTimePerQuestion)}</p>
            <p className="text-sm text-muted-foreground">Avg. per Question</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Star className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
            <p className="text-2xl font-bold">{results.averageConfidence.toFixed(1)}/5</p>
            <p className="text-sm text-muted-foreground">Avg. Confidence</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <RotateCcw className="w-8 h-8 mx-auto mb-2 text-secondary" />
            <p className="text-2xl font-bold">{results.retryCount}</p>
            <p className="text-sm text-muted-foreground">Total Retries</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Brain className="w-8 h-8 mx-auto mb-2 text-accent" />
            <p className="text-2xl font-bold">{results.confidenceMismatches}</p>
            <p className="text-sm text-muted-foreground">Confidence Gaps</p>
          </CardContent>
        </Card>
      </div>

      {/* Topic Performance */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            Performance by Topic
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {results.topicPerformance.map((topic, index) => {
            const topicPercentage = Math.round((topic.correct / topic.total) * 100)
            return (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{topic.topic}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      {topic.correct}/{topic.total}
                    </span>
                    <span className="font-semibold">{topicPercentage}%</span>
                  </div>
                </div>
                <Progress value={topicPercentage} className="h-2" />
              </div>
            )
          })}
        </CardContent>
      </Card>

      {/* AI Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Powered Insights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Confidence Analysis */}
          {results.confidenceMismatches > 0 && (
            <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-200">Confidence Calibration</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                    You had {results.confidenceMismatches} confidence-accuracy mismatches. This suggests reviewing
                    self-assessment skills alongside content knowledge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Error Patterns */}
          {results.errorPatterns.length > 0 && (
            <div className="bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <TrendingDown className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-200">Common Error Patterns</h4>
                  <ul className="text-sm text-blue-700 dark:text-blue-300 mt-1 space-y-1">
                    {results.errorPatterns.map((pattern, index) => (
                      <li key={index}>• {pattern}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Performance Trend */}
          <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-green-800 dark:text-green-200">Personalized Recommendations</h4>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {percentage >= 80
                    ? "Great job! You're ready for more advanced topics. Consider exploring the next module."
                    : percentage >= 70
                      ? "Good progress! Review the topics where you scored below 80% before moving forward."
                      : "Focus on foundational concepts. We recommend reviewing the learning materials and retaking this quiz."}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Button onClick={onRetakeQuiz} variant="outline" className="gap-2 bg-transparent">
          <RotateCcw className="w-4 h-4" />
          Retake Quiz
        </Button>
        <Button onClick={onViewAnalytics} variant="outline" className="gap-2 bg-transparent">
          <BarChart3 className="w-4 h-4" />
          Detailed Analytics
        </Button>
        <Button onClick={onContinueLearning} className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Continue Learning
        </Button>
      </div>
    </div>
  )
}
