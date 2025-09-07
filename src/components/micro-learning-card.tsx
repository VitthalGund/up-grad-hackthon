"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  RotateCcw,
  Lightbulb,
  Clock,
  Brain,
  CheckCircle,
  ArrowRight,
  Volume2,
  VolumeX,
} from "lucide-react"

interface MicroLearningCardProps {
  title: string
  description: string
  duration: string
  difficulty: "beginner" | "intermediate" | "advanced"
  progress: number
  onStart: () => void
  onComplete: () => void
}

export function MicroLearningCard({
  title,
  description,
  duration,
  difficulty,
  progress,
  onStart,
  onComplete,
}: MicroLearningCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentProgress, setCurrentProgress] = useState(progress)
  const [showHint, setShowHint] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [interactions, setInteractions] = useState(0)

  const handlePlay = () => {
    setIsPlaying(!isPlaying)
    setInteractions((prev) => prev + 1)
    onStart()

    // Simulate progress update
    if (!isPlaying && currentProgress < 100) {
      const interval = setInterval(() => {
        setCurrentProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            onComplete()
            return 100
          }
          return prev + 2
        })
      }, 100)
    }
  }

  const handleHint = () => {
    setShowHint(!showHint)
    setInteractions((prev) => prev + 1)
  }

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case "beginner":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400"
      case "advanced":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary/20">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg group-hover:text-primary transition-colors">{title}</CardTitle>
            <CardDescription className="mt-1">{description}</CardDescription>
          </div>
          <Badge className={getDifficultyColor(difficulty)}>{difficulty}</Badge>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mt-2">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            {duration}
          </div>
          <div className="flex items-center gap-1">
            <Brain className="w-3 h-3" />
            {interactions} interactions
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{Math.round(currentProgress)}%</span>
          </div>
          <Progress value={currentProgress} className="h-2" />
        </div>

        {/* Interactive Controls */}
        <div className="flex items-center gap-2">
          <Button onClick={handlePlay} className="flex-1 gap-2" variant={isPlaying ? "secondary" : "default"}>
            {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            {isPlaying ? "Pause" : currentProgress > 0 ? "Continue" : "Start"}
          </Button>

          <Button variant="outline" size="sm" onClick={() => setCurrentProgress(0)}>
            <RotateCcw className="w-4 h-4" />
          </Button>

          <Button variant="outline" size="sm" onClick={handleHint}>
            <Lightbulb className={`w-4 h-4 ${showHint ? "text-yellow-500" : ""}`} />
          </Button>

          <Button variant="outline" size="sm" onClick={() => setIsMuted(!isMuted)}>
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </Button>
        </div>

        {/* Hint Section */}
        {showHint && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-3 animate-in slide-in-from-top-2">
            <div className="flex items-start gap-2">
              <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">Quick Tip</p>
                <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                  Focus on the key concepts first, then dive into the details. Take notes as you go!
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Completion Status */}
        {currentProgress === 100 && (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-3 animate-in slide-in-from-bottom-2">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-green-800 dark:text-green-200">Lesson Complete!</span>
              <Button size="sm" variant="ghost" className="ml-auto text-green-700 hover:text-green-800">
                Next Lesson <ArrowRight className="w-3 h-3 ml-1" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
