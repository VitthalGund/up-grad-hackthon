"use client"

import { useState } from "react"
import { QuizQuestion } from "@/components/quiz-question"
import { QuizResults } from "@/components/quiz-results"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Brain, Clock, Target, Zap, ArrowLeft } from "lucide-react"
import Link from "next/link"

const sampleQuestions = [
  {
    id: "q1",
    text: "What is the primary purpose of data preprocessing in machine learning?",
    options: [
      "To make data look more visually appealing",
      "To clean, transform, and prepare data for analysis",
      "To reduce the size of the dataset",
      "To increase the complexity of the model",
    ],
    correctAnswer: 1,
    explanation:
      "Data preprocessing is essential for cleaning, transforming, and preparing raw data so that machine learning algorithms can work effectively with it.",
    difficulty: "easy" as const,
    topic: "Data Preprocessing",
  },
  {
    id: "q2",
    text: "Which technique is most effective for handling missing numerical data when the data is missing at random?",
    options: [
      "Delete all rows with missing values",
      "Replace with zero",
      "Use mean/median imputation",
      "Leave the missing values as they are",
    ],
    correctAnswer: 2,
    explanation:
      "Mean or median imputation is often the most appropriate method for handling missing numerical data when the missingness is random, as it preserves the overall distribution.",
    difficulty: "medium" as const,
    topic: "Data Preprocessing",
  },
  {
    id: "q3",
    text: "In the context of feature scaling, when should you use standardization over normalization?",
    options: [
      "When you want values between 0 and 1",
      "When the data follows a normal distribution",
      "When you have outliers in your data",
      "When working with categorical variables",
    ],
    correctAnswer: 1,
    explanation:
      "Standardization (z-score normalization) is preferred when data follows a normal distribution, as it preserves the shape of the distribution while centering it around zero.",
    difficulty: "hard" as const,
    topic: "Feature Engineering",
  },
  {
    id: "q4",
    text: "What is overfitting in machine learning?",
    options: [
      "When a model performs well on training data but poorly on new data",
      "When a model is too simple to capture patterns",
      "When there's too much training data",
      "When the model trains too quickly",
    ],
    correctAnswer: 0,
    explanation:
      "Overfitting occurs when a model learns the training data too well, including noise and random fluctuations, leading to poor generalization on new, unseen data.",
    difficulty: "medium" as const,
    topic: "Model Evaluation",
  },
  {
    id: "q5",
    text: "Which evaluation metric is most appropriate for a highly imbalanced binary classification problem?",
    options: ["Accuracy", "Precision and Recall", "Mean Squared Error", "R-squared"],
    correctAnswer: 1,
    explanation:
      "For imbalanced datasets, accuracy can be misleading. Precision and Recall (or F1-score) provide better insights into model performance across different classes.",
    difficulty: "hard" as const,
    topic: "Model Evaluation",
  },
]

export default function QuizPage() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [quizStarted, setQuizStarted] = useState(false)
  const [quizCompleted, setQuizCompleted] = useState(false)
  const [answers, setAnswers] = useState<any[]>([])
  const [startTime, setStartTime] = useState<number>(0)

  const handleStartQuiz = () => {
    setQuizStarted(true)
    setStartTime(Date.now())
  }

  const handleAnswer = (answerData: any) => {
    setAnswers((prev) => [...prev, answerData])
  }

  const handleNextQuestion = () => {
    if (currentQuestion < sampleQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    } else {
      setQuizCompleted(true)
    }
  }

  const calculateResults = () => {
    const totalTime = Math.floor((Date.now() - startTime) / 1000)
    const correctAnswers = answers.filter((answer) => answer.isCorrect).length
    const totalRetries = answers.reduce((sum, answer) => sum + answer.retries, 0)
    const averageConfidence = answers.reduce((sum, answer) => sum + answer.confidence, 0) / answers.length
    const confidenceMismatches = answers.filter(
      (answer) => (answer.isCorrect && answer.confidence <= 2) || (!answer.isCorrect && answer.confidence >= 4),
    ).length

    // Group by topic
    const topicPerformance = sampleQuestions.reduce(
      (acc, question, index) => {
        const topic = question.topic
        if (!acc[topic]) {
          acc[topic] = { correct: 0, total: 0 }
        }
        acc[topic].total++
        if (answers[index]?.isCorrect) {
          acc[topic].correct++
        }
        return acc
      },
      {} as Record<string, { correct: number; total: number }>,
    )

    // Identify error patterns
    const errorPatterns = []
    const incorrectAnswers = answers.filter((answer) => !answer.isCorrect)
    if (incorrectAnswers.length > 0) {
      const avgIncorrectTime =
        incorrectAnswers.reduce((sum, answer) => sum + answer.timeSpent, 0) / incorrectAnswers.length
      if (avgIncorrectTime < 30) {
        errorPatterns.push("Rushing through questions - consider taking more time to read carefully")
      }
      if (incorrectAnswers.some((answer) => answer.confidence >= 4)) {
        errorPatterns.push("Overconfidence in incorrect answers - review self-assessment skills")
      }
    }

    return {
      score: correctAnswers,
      totalQuestions: sampleQuestions.length,
      totalTime,
      averageConfidence,
      retryCount: totalRetries,
      confidenceMismatches,
      topicPerformance: Object.entries(topicPerformance).map(([topic, data]) => ({
        topic,
        correct: data.correct,
        total: data.total,
      })),
      errorPatterns,
    }
  }

  const handleRetakeQuiz = () => {
    setCurrentQuestion(0)
    setQuizStarted(false)
    setQuizCompleted(false)
    setAnswers([])
    setStartTime(0)
  }

  const handleViewAnalytics = () => {
    // Navigate to analytics page
    console.log("Navigate to analytics")
  }

  const handleContinueLearning = () => {
    // Navigate back to dashboard
    console.log("Navigate to dashboard")
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Brain className="w-8 h-8 text-primary" />
            </div>
            <CardTitle className="text-2xl font-bold">Adaptive Knowledge Check</CardTitle>
            <CardDescription>
              Test your understanding with our AI-powered quiz that adapts to your learning patterns
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quiz Info */}
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
                <p className="font-semibold">{sampleQuestions.length} Questions</p>
                <p className="text-sm text-muted-foreground">Mixed difficulty</p>
              </div>
              <div className="text-center p-4 bg-muted/50 rounded-lg">
                <Clock className="w-6 h-6 mx-auto mb-2 text-secondary" />
                <p className="font-semibold">~15 Minutes</p>
                <p className="text-sm text-muted-foreground">Self-paced</p>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h3 className="font-semibold">What makes this quiz special:</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-primary/10 text-primary">
                    <Brain className="w-3 h-3 mr-1" />
                    AI Analysis
                  </Badge>
                  <span className="text-sm">Tracks confidence vs. accuracy patterns</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-secondary/10 text-secondary">
                    <Zap className="w-3 h-3 mr-1" />
                    Adaptive
                  </Badge>
                  <span className="text-sm">Provides personalized feedback and recommendations</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-accent/10 text-accent">
                    <Target className="w-3 h-3 mr-1" />
                    Detailed
                  </Badge>
                  <span className="text-sm">Comprehensive performance analytics</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <Button onClick={handleStartQuiz} size="lg" className="w-full">
                Start Quiz
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full bg-transparent">
                <Link href="/dashboard">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Dashboard
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (quizCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
        <div className="container mx-auto py-8">
          <QuizResults
            results={calculateResults()}
            onRetakeQuiz={handleRetakeQuiz}
            onViewAnalytics={handleViewAnalytics}
            onContinueLearning={handleContinueLearning}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted p-4">
      <div className="container mx-auto py-8">
        <div className="mb-6">
          <Button asChild variant="outline" size="sm">
            <Link href="/dashboard">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Link>
          </Button>
        </div>

        <QuizQuestion
          question={sampleQuestions[currentQuestion]}
          questionNumber={currentQuestion + 1}
          totalQuestions={sampleQuestions.length}
          onAnswer={handleAnswer}
          onNext={handleNextQuestion}
        />
      </div>
    </div>
  )
}
