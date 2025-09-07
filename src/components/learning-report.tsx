"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  FileText,
  Download,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  Target,
  TrendingUp,
  Brain,
  Award,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

interface ReportData {
  period: string
  totalLearningTime: number
  conceptsMastered: number
  quizzesCompleted: number
  averageAccuracy: number
  streakDays: number
  topStrengths: string[]
  areasForImprovement: string[]
  achievements: string[]
  nextRecommendations: string[]
}

interface LearningReportProps {
  data: ReportData
  onExport: (format: "pdf" | "email" | "whatsapp") => void
}

export function LearningReport({ data, onExport }: LearningReportProps) {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (format: "pdf" | "email" | "whatsapp") => {
    setIsExporting(true)
    await onExport(format)
    setTimeout(() => setIsExporting(false), 2000)
  }

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    return `${hours}h ${mins}m`
  }

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="w-6 h-6 text-primary" />
              Learning Progress Report
            </CardTitle>
            <p className="text-muted-foreground mt-1">Comprehensive analysis for {data.period}</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Calendar className="w-3 h-3 mr-1" />
              {data.period}
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-8">
        {/* Key Metrics Overview */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Key Performance Metrics
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Clock className="w-6 h-6 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">{formatTime(data.totalLearningTime)}</p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Brain className="w-6 h-6 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">{data.conceptsMastered}</p>
              <p className="text-sm text-muted-foreground">Concepts Mastered</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Target className="w-6 h-6 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">{data.quizzesCompleted}</p>
              <p className="text-sm text-muted-foreground">Quizzes Completed</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="w-6 h-6 mx-auto mb-2 text-chart-3" />
              <p className="text-2xl font-bold">{data.averageAccuracy}%</p>
              <p className="text-sm text-muted-foreground">Avg. Accuracy</p>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Award className="w-6 h-6 mx-auto mb-2 text-chart-4" />
              <p className="text-2xl font-bold">{data.streakDays}</p>
              <p className="text-sm text-muted-foreground">Day Streak</p>
            </div>
          </div>
        </div>

        <Separator />

        {/* Strengths and Areas for Improvement */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-green-700 dark:text-green-400">
              <CheckCircle className="w-5 h-5" />
              Top Strengths
            </h3>
            <div className="space-y-3">
              {data.topStrengths.map((strength, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-green-50 dark:bg-green-950/20 rounded-lg">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <span className="text-sm">{strength}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <AlertCircle className="w-5 h-5" />
              Areas for Improvement
            </h3>
            <div className="space-y-3">
              {data.areasForImprovement.map((area, index) => (
                <div key={index} className="flex items-center gap-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-orange-600" />
                  <span className="text-sm">{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <Separator />

        {/* Recent Achievements */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-yellow-500" />
            Recent Achievements
          </h3>
          <div className="grid md:grid-cols-2 gap-3">
            {data.achievements.map((achievement, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-yellow-50 dark:bg-yellow-950/20 rounded-lg">
                <Award className="w-5 h-5 text-yellow-600" />
                <span className="text-sm font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* AI Recommendations */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI-Powered Recommendations
          </h3>
          <div className="space-y-3">
            {data.nextRecommendations.map((recommendation, index) => (
              <div key={index} className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg">
                <Brain className="w-5 h-5 text-primary mt-0.5" />
                <div>
                  <p className="text-sm">{recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Export Options */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Share Your Progress</h3>
          <div className="flex flex-wrap gap-3">
            <Button onClick={() => handleExport("pdf")} disabled={isExporting} className="gap-2">
              <Download className="w-4 h-4" />
              {isExporting ? "Generating..." : "Download PDF"}
            </Button>
            <Button
              onClick={() => handleExport("email")}
              disabled={isExporting}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <Mail className="w-4 h-4" />
              Email Report
            </Button>
            <Button
              onClick={() => handleExport("whatsapp")}
              disabled={isExporting}
              variant="outline"
              className="gap-2 bg-transparent"
            >
              <MessageSquare className="w-4 h-4" />
              WhatsApp Summary
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Reports are automatically sent to your registered email and phone number
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
