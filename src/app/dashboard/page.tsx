"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { MicroLearningCard } from "@/components/micro-learning-card"
import { EngagementTracker } from "@/components/engagement-tracker"
import Link from "next/link"
import {
  Brain,
  BookOpen,
  TrendingUp,
  Clock,
  Target,
  Award,
  ChevronRight,
  Sparkles,
  Users,
  BarChart3,
  Settings,
} from "lucide-react"

export default function DashboardPage() {
  const [currentLesson, setCurrentLesson] = useState(0)
  const [completedLessons, setCompletedLessons] = useState(1)
  const [totalEngagementTime, setTotalEngagementTime] = useState(0)

  const lessons = [
    {
      title: "Introduction to Machine Learning",
      description: "Understand the fundamentals of ML and its applications",
      duration: "5 min",
      difficulty: "beginner" as const,
      progress: 100,
      status: "completed",
    },
    {
      title: "Data Preprocessing Techniques",
      description: "Learn to clean and prepare data for analysis",
      duration: "8 min",
      difficulty: "intermediate" as const,
      progress: 75,
      status: "in-progress",
    },
    {
      title: "Linear Regression Fundamentals",
      description: "Master the basics of linear regression modeling",
      duration: "6 min",
      difficulty: "intermediate" as const,
      progress: 0,
      status: "upcoming",
    },
    {
      title: "Classification Algorithms",
      description: "Explore different classification techniques",
      duration: "10 min",
      difficulty: "advanced" as const,
      progress: 0,
      status: "upcoming",
    },
  ]

  const stats = [
    { label: "Learning Streak", value: "12 days", icon: Target, color: "text-chart-1", trend: "+2" },
    { label: "Concepts Mastered", value: completedLessons * 12, icon: Award, color: "text-chart-2", trend: "+5" },
    { label: "Time Saved", value: "3.2 hrs", icon: Clock, color: "text-chart-3", trend: "+0.5" },
    { label: "Accuracy Rate", value: "87%", icon: TrendingUp, color: "text-chart-4", trend: "+3%" },
  ]

  const handleLessonStart = () => {
    setTotalEngagementTime((prev) => prev + 1)
  }

  const handleLessonComplete = () => {
    setCompletedLessons((prev) => prev + 1)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary" />
              Welcome back, Alex!
            </h1>
            <p className="text-muted-foreground">Your AI is ready to adapt to your learning style</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary animate-pulse">
              <Brain className="w-3 h-3 mr-1" />
              AI Adaptive Mode
            </Badge>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Enhanced Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="hover:shadow-md transition-all duration-300 hover:-translate-y-1 cursor-pointer group"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold group-hover:text-primary transition-colors">{stat.value}</p>
                    <p className="text-xs text-green-600 font-medium">↗ {stat.trend}</p>
                  </div>
                  <div className="relative">
                    <stat.icon className={`w-8 h-8 ${stat.color} group-hover:scale-110 transition-transform`} />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-ping opacity-75" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Enhanced Learning Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Micro-Learning Session */}
            <MicroLearningCard
              title="Data Preprocessing Techniques"
              description="Master the art of cleaning and preparing data for machine learning models"
              duration="8 min"
              difficulty="intermediate"
              progress={75}
              onStart={handleLessonStart}
              onComplete={handleLessonComplete}
            />

            {/* Learning Path */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5 text-primary" />
                      Your Adaptive Learning Path
                    </CardTitle>
                    <CardDescription>AI-curated sequence based on your progress and learning style</CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Analytics
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {lessons.map((lesson, index) => (
                    <div
                      key={index}
                      className={`flex items-center gap-3 p-4 rounded-lg border-2 transition-all duration-300 cursor-pointer hover:shadow-md hover:-translate-y-0.5 ${
                        index === currentLesson
                          ? "bg-primary/5 border-primary/30 shadow-sm"
                          : "hover:bg-muted/50 hover:border-primary/20"
                      }`}
                      onClick={() => setCurrentLesson(index)}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                          lesson.status === "completed"
                            ? "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                            : lesson.status === "in-progress"
                              ? "bg-primary/10 text-primary animate-pulse"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {lesson.status === "completed" ? "✓" : index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{lesson.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {lesson.difficulty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{lesson.description}</p>
                        <div className="flex items-center gap-3">
                          <Progress value={lesson.progress} className="h-1.5 flex-1" />
                          <span className="text-xs text-muted-foreground font-medium">{lesson.progress}%</span>
                          <span className="text-xs text-muted-foreground">{lesson.duration}</span>
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Enhanced Sidebar */}
          <div className="space-y-6">
            {/* Live Engagement Tracker */}
            <EngagementTracker />

            {/* AI Insights */}
            <Card className="border-2 border-dashed border-primary/20 hover:border-solid transition-all duration-300">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-primary animate-pulse" />
                  AI Insights
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-950/20 dark:to-cyan-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                  <div className="flex items-start gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900 dark:text-blue-100">Performance Boost Detected</p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        Your pattern recognition skills improved 23% this week. Ready for advanced algorithms?
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-4 rounded-lg border border-amber-200 dark:border-amber-800">
                  <div className="flex items-start gap-2">
                    <Target className="w-4 h-4 text-amber-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                        Personalized Recommendation
                      </p>
                      <p className="text-xs text-amber-700 dark:text-amber-300 mt-1">
                        Based on your learning style, try visual diagrams for the next statistics module
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-primary/5 hover:text-primary transition-all"
                >
                  <Link href="/analytics">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    View Detailed Analytics
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-secondary/5 hover:text-secondary transition-all"
                >
                  <Link href="/quiz">
                    <Target className="w-4 h-4 mr-2" />
                    Take Adaptive Quiz
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-accent/5 hover:text-accent transition-all"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Compare with Peers
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start bg-transparent hover:bg-chart-3/5 hover:text-chart-3 transition-all"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Browse Content Library
                </Button>
              </CardContent>
            </Card>

            {/* Enhanced Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-full flex items-center justify-center">
                    <Award className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Speed Learner</p>
                    <p className="text-xs text-muted-foreground">Completed 3 micro-lessons in 15 minutes</p>
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    New!
                  </Badge>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/20 dark:to-green-800/20 rounded-full flex items-center justify-center">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Accuracy Master</p>
                    <p className="text-xs text-muted-foreground">Maintained 90%+ quiz accuracy for 5 days</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-100 to-purple-200 dark:from-purple-900/20 dark:to-purple-800/20 rounded-full flex items-center justify-center">
                    <Brain className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">AI Collaborator</p>
                    <p className="text-xs text-muted-foreground">Used AI hints effectively 10 times</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
