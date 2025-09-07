"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Clock, Star, CheckCircle, XCircle, RotateCcw, Lightbulb, Brain, TrendingUp, AlertCircle } from "lucide-react"

interface QuizQuestionProps {
  question: {
    id: string
    text: string
    options: string[]
    correctAnswer: number
    explanation: string
    difficulty: "easy" | "medium" | "hard"
    topic: string
  }
  questionNumber: number
  totalQuestions: number
  onAnswer: (data: {
    questionId: string
    selectedAnswer: number
    isCorrect: boolean
    timeSpent: number
    confidence: number
    retries: number
  }) => void
  onNext: () => void
}

export function QuizQuestion({ question, questionNumber, totalQuestions, onAnswer, onNext }: QuizQuestionProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [confidence, setConfidence] = useState(3)
  const [timeSpent, setTimeSpent] = useState(0)
  const [retries, setRetries] = useState(0)
  const [showResult, setShowResult] = useState(false)
  const [showExplanation, setShowExplanation] = useState(false)
  const [showHint, setShowHint] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent((prev) => prev + 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleSubmit = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === question.correctAnswer
    setIsCorrect(correct)
    setShowResult(true)
    setShowExplanation(true)

    onAnswer({
      questionId: question.id,
      selectedAnswer,
      isCorrect: correct,
      timeSpent,
      confidence,
      retries,
    })
  }

  const handleRetry = () => {
    setSelectedAnswer(null)
    setShowResult(false)
    setShowExplanation(false)
    setRetries((prev) => prev + 1)
  }

  const handleNext = () => {
    onNext()
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "hard":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <Badge variant="outline">
              Question {questionNumber} of {totalQuestions}
            </Badge>
            <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              {question.topic}
            </Badge>
          </div>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatTime(timeSpent)}
            </div>
            {retries > 0 && (
              <div className="flex items-center gap-1">
                <RotateCcw className="w-4 h-4" />
                {retries} retries
              </div>
            )}
          </div>
        </div>

        <Progress value={(questionNumber / totalQuestions) * 100} className="h-2 mb-4" />

        <CardTitle className="text-xl leading-relaxed">{question.text}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Answer Options */}
        <RadioGroup
          value={selectedAnswer?.toString()}
          onValueChange={(value) => setSelectedAnswer(Number.parseInt(value))}
          disabled={showResult}
          className="space-y-3"
        >
          {question.options.map((option, index) => (
            <div
              key={index}
              className={`flex items-center space-x-3 p-4 rounded-lg border-2 transition-all ${
                showResult
                  ? index === question.correctAnswer
                    ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                    : index === selectedAnswer && !isCorrect
                      ? "border-red-500 bg-red-50 dark:bg-red-950/20"
                      : "border-muted"
                  : selectedAnswer === index
                    ? "border-primary bg-primary/5"
                    : "border-muted hover:border-primary/50 hover:bg-muted/50"
              }`}
            >
              <RadioGroupItem value={index.toString()} id={`option-${index}`} />
              <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer text-base">
                {option}
              </Label>
              {showResult && index === question.correctAnswer && <CheckCircle className="w-5 h-5 text-green-600" />}
              {showResult && index === selectedAnswer && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
            </div>
          ))}
        </RadioGroup>

        {/* Confidence Rating */}
        {!showResult && (
          <div className="bg-muted/50 rounded-lg p-4">
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Brain className="w-4 h-4 text-primary" />
              How confident are you in your answer?
            </h4>
            <div className="flex items-center gap-2 mb-2">
              {[1, 2, 3, 4, 5].map((rating) => (
                <Button
                  key={rating}
                  variant={confidence >= rating ? "default" : "outline"}
                  size="sm"
                  onClick={() => setConfidence(rating)}
                  className="w-10 h-10 p-0"
                >
                  <Star className={`w-4 h-4 ${confidence >= rating ? "fill-current" : ""}`} />
                </Button>
              ))}
            </div>
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Not confident</span>
              <span>Very confident</span>
            </div>
          </div>
        )}

        {/* Hint Section */}
        {!showResult && (
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowHint(!showHint)}>
              <Lightbulb className="w-4 h-4 mr-2" />
              {showHint ? "Hide Hint" : "Need a Hint?"}
            </Button>
            {showHint && (
              <div className="flex-1 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 ml-2">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  Think about the key concepts we covered in the previous lesson. Focus on the fundamental principles.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Result and Explanation */}
        {showResult && (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border-2 ${
                isCorrect
                  ? "border-green-500 bg-green-50 dark:bg-green-950/20"
                  : "border-red-500 bg-red-50 dark:bg-red-950/20"
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <h4 className={`font-semibold ${isCorrect ? "text-green-800" : "text-red-800"}`}>
                  {isCorrect ? "Correct!" : "Incorrect"}
                </h4>
              </div>

              {/* Confidence Analysis */}
              <div className="mb-3">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">Your confidence:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((rating) => (
                      <Star
                        key={rating}
                        className={`w-3 h-3 ${confidence >= rating ? "fill-current text-yellow-500" : "text-gray-300"}`}
                      />
                    ))}
                  </div>
                  <span className="text-muted-foreground">({confidence}/5)</span>
                </div>
                {((isCorrect && confidence <= 2) || (!isCorrect && confidence >= 4)) && (
                  <div className="flex items-center gap-1 mt-1 text-xs text-orange-600">
                    <AlertCircle className="w-3 h-3" />
                    <span>Confidence-accuracy mismatch detected</span>
                  </div>
                )}
              </div>

              <p className={`text-sm ${isCorrect ? "text-green-700" : "text-red-700"}`}>{question.explanation}</p>
            </div>

            {/* Performance Metrics */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="bg-muted/50 rounded-lg p-3">
                <Clock className="w-4 h-4 mx-auto mb-1 text-primary" />
                <p className="text-sm font-medium">{formatTime(timeSpent)}</p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <RotateCcw className="w-4 h-4 mx-auto mb-1 text-secondary" />
                <p className="text-sm font-medium">{retries}</p>
                <p className="text-xs text-muted-foreground">Retries</p>
              </div>
              <div className="bg-muted/50 rounded-lg p-3">
                <TrendingUp className="w-4 h-4 mx-auto mb-1 text-accent" />
                <p className="text-sm font-medium">{confidence}/5</p>
                <p className="text-xs text-muted-foreground">Confidence</p>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-4">
          <div>
            {showResult && !isCorrect && retries < 2 && (
              <Button variant="outline" onClick={handleRetry} className="gap-2 bg-transparent">
                <RotateCcw className="w-4 h-4" />
                Try Again
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            {!showResult ? (
              <Button onClick={handleSubmit} disabled={selectedAnswer === null} className="px-8">
                Submit Answer
              </Button>
            ) : (
              <Button onClick={handleNext} className="px-8">
                {questionNumber === totalQuestions ? "Finish Quiz" : "Next Question"}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
