"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, TrendingDown, Target, AlertCircle, CheckCircle } from "lucide-react"

interface CompetenceData {
  topic: string
  mastery: number
  confidence: number
  accuracy: number
  timeSpent: number
  trend: "up" | "down" | "stable"
  misconceptions: string[]
  strengths: string[]
}

interface CompetenceMapProps {
  data: CompetenceData[]
}

export function CompetenceMap({ data }: CompetenceMapProps) {
  const getMasteryLevel = (mastery: number) => {
    if (mastery >= 90)
      return { level: "Expert", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" }
    if (mastery >= 75)
      return { level: "Proficient", color: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400" }
    if (mastery >= 60)
      return { level: "Developing", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" }
    return { level: "Beginner", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  }

  const getConfidenceCalibration = (confidence: number, accuracy: number) => {
    const diff = Math.abs(confidence - accuracy)
    if (diff <= 10) return { status: "Well Calibrated", color: "text-green-600", icon: CheckCircle }
    if (diff <= 20) return { status: "Slightly Off", color: "text-yellow-600", icon: AlertCircle }
    return { status: "Poorly Calibrated", color: "text-red-600", icon: AlertCircle }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Competence Map
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((topic, index) => {
          const masteryLevel = getMasteryLevel(topic.mastery)
          const calibration = getConfidenceCalibration(topic.confidence, topic.accuracy)
          const CalibrationIcon = calibration.icon

          return (
            <div key={index} className="border rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <h3 className="font-semibold text-lg">{topic.topic}</h3>
                  <Badge className={masteryLevel.color}>{masteryLevel.level}</Badge>
                  {topic.trend === "up" && <TrendingUp className="w-4 h-4 text-green-600" />}
                  {topic.trend === "down" && <TrendingDown className="w-4 h-4 text-red-600" />}
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{topic.mastery}%</p>
                  <p className="text-sm text-muted-foreground">Mastery</p>
                </div>
              </div>

              {/* Progress Bars */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Mastery</span>
                    <span>{topic.mastery}%</span>
                  </div>
                  <Progress value={topic.mastery} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Confidence</span>
                    <span>{topic.confidence}%</span>
                  </div>
                  <Progress value={topic.confidence} className="h-2" />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Accuracy</span>
                    <span>{topic.accuracy}%</span>
                  </div>
                  <Progress value={topic.accuracy} className="h-2" />
                </div>
              </div>

              {/* Confidence Calibration */}
              <div className="bg-muted/50 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <CalibrationIcon className={`w-4 h-4 ${calibration.color}`} />
                  <span className={`text-sm font-medium ${calibration.color}`}>
                    Confidence Calibration: {calibration.status}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {calibration.status === "Well Calibrated"
                    ? "Your confidence aligns well with your actual performance."
                    : calibration.status === "Slightly Off"
                      ? "Minor mismatch between confidence and performance. Consider reviewing self-assessment."
                      : "Significant confidence-accuracy gap detected. Focus on metacognitive skills."}
                </p>
              </div>

              {/* Strengths and Misconceptions */}
              <div className="grid md:grid-cols-2 gap-4">
                {topic.strengths.length > 0 && (
                  <div>
                    <h4 className="font-medium text-green-700 dark:text-green-400 mb-2">Strengths</h4>
                    <ul className="space-y-1">
                      {topic.strengths.map((strength, idx) => (
                        <li key={idx} className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          {strength}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {topic.misconceptions.length > 0 && (
                  <div>
                    <h4 className="font-medium text-red-700 dark:text-red-400 mb-2">Areas for Improvement</h4>
                    <ul className="space-y-1">
                      {topic.misconceptions.map((misconception, idx) => (
                        <li key={idx} className="text-sm text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          {misconception}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Time Investment */}
              <div className="text-center bg-primary/5 rounded-lg p-2">
                <p className="text-sm text-muted-foreground">
                  Time invested:{" "}
                  <span className="font-medium">
                    {Math.floor(topic.timeSpent / 60)}h {topic.timeSpent % 60}m
                  </span>
                </p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}
