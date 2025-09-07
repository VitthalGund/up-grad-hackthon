"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AnalyticsChart } from "@/components/analytics-chart"
import { CompetenceMap } from "@/components/competence-map"
import { PeerComparison } from "@/components/peer-comparison"
import { LearningReport } from "@/components/learning-report"
import {
  ArrowLeft,
  BarChart3,
  Brain,
  Users,
  FileText,
  TrendingUp,
  Clock,
  Target,
  Sparkles,
  Calendar,
} from "lucide-react"

// Sample data
const performanceData = [
  { name: "Week 1", value: 65 },
  { name: "Week 2", value: 72 },
  { name: "Week 3", value: 78 },
  { name: "Week 4", value: 85 },
  { name: "Week 5", value: 87 },
  { name: "Week 6", value: 92 },
]

const topicDistribution = [
  { name: "Machine Learning", value: 35 },
  { name: "Data Science", value: 25 },
  { name: "Statistics", value: 20 },
  { name: "Programming", value: 15 },
  { name: "Mathematics", value: 5 },
]

const engagementData = [
  { name: "Mon", value: 85 },
  { name: "Tue", value: 78 },
  { name: "Wed", value: 92 },
  { name: "Thu", value: 88 },
  { name: "Fri", value: 95 },
  { name: "Sat", value: 72 },
  { name: "Sun", value: 68 },
]

const competenceData = [
  {
    topic: "Machine Learning Fundamentals",
    mastery: 85,
    confidence: 80,
    accuracy: 87,
    timeSpent: 240,
    trend: "up" as const,
    misconceptions: ["Overfitting vs Underfitting distinction", "Cross-validation timing"],
    strengths: ["Algorithm selection", "Feature engineering", "Model evaluation"],
  },
  {
    topic: "Data Preprocessing",
    mastery: 92,
    confidence: 95,
    accuracy: 90,
    timeSpent: 180,
    trend: "up" as const,
    misconceptions: [],
    strengths: ["Missing data handling", "Feature scaling", "Outlier detection"],
  },
  {
    topic: "Statistical Analysis",
    mastery: 68,
    confidence: 85,
    accuracy: 65,
    timeSpent: 320,
    trend: "stable" as const,
    misconceptions: ["Hypothesis testing interpretation", "P-value significance", "Correlation vs causation"],
    strengths: ["Descriptive statistics", "Data visualization"],
  },
]

const peerData = [
  { metric: "Quiz Accuracy", yourScore: 87, peerAverage: 78, percentile: 85, trend: "up" as const },
  { metric: "Learning Speed", yourScore: 92, peerAverage: 75, percentile: 92, trend: "up" as const },
  { metric: "Consistency", yourScore: 78, peerAverage: 82, percentile: 45, trend: "down" as const },
  { metric: "Engagement", yourScore: 95, peerAverage: 70, percentile: 98, trend: "up" as const },
]

const reportData = {
  period: "Last 30 Days",
  totalLearningTime: 1240,
  conceptsMastered: 24,
  quizzesCompleted: 18,
  averageAccuracy: 87,
  streakDays: 12,
  topStrengths: [
    "Excellent pattern recognition in machine learning algorithms",
    "Strong performance in data preprocessing techniques",
    "Consistent engagement with learning materials",
    "High accuracy in practical applications",
  ],
  areasForImprovement: [
    "Statistical hypothesis testing needs more practice",
    "Confidence calibration could be improved",
    "Time management during complex problems",
    "Peer collaboration and discussion participation",
  ],
  achievements: [
    "Completed Advanced ML Fundamentals module",
    "Achieved 90%+ accuracy streak for 5 days",
    "Mastered 3 new preprocessing techniques",
    "Ranked in top 15% of peer group",
  ],
  nextRecommendations: [
    "Focus on statistical inference concepts to strengthen foundation",
    "Practice timed problem-solving to improve efficiency",
    "Engage with peer discussions to enhance collaborative learning",
    "Consider advanced topics in deep learning as next progression",
  ],
}

export default function AnalyticsPage() {
  const [activeTab, setActiveTab] = useState("overview")

  const handleExportReport = async (format: "pdf" | "email" | "whatsapp") => {
    // Simulate export functionality
    console.log(`Exporting report as ${format}`)

    if (format === "email") {
      alert("Report will be sent to your registered email address within 5 minutes.")
    } else if (format === "whatsapp") {
      alert("Summary will be sent to your WhatsApp number shortly.")
    } else {
      alert("PDF report is being generated and will download automatically.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button asChild variant="outline" size="sm">
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
                <BarChart3 className="w-8 h-8 text-primary" />
                Learning Analytics
              </h1>
              <p className="text-muted-foreground">Comprehensive insights into your learning journey</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-primary/10 text-primary">
              <Sparkles className="w-3 h-3 mr-1" />
              AI-Powered Insights
            </Badge>
            <Badge variant="outline">
              <Calendar className="w-3 h-3 mr-1" />
              Last 30 Days
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center">
            <CardContent className="p-4">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 text-primary" />
              <p className="text-2xl font-bold">87%</p>
              <p className="text-sm text-muted-foreground">Overall Progress</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Clock className="w-8 h-8 mx-auto mb-2 text-secondary" />
              <p className="text-2xl font-bold">20.7h</p>
              <p className="text-sm text-muted-foreground">Learning Time</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Target className="w-8 h-8 mx-auto mb-2 text-accent" />
              <p className="text-2xl font-bold">24</p>
              <p className="text-sm text-muted-foreground">Concepts Mastered</p>
            </CardContent>
          </Card>
          <Card className="text-center">
            <CardContent className="p-4">
              <Users className="w-8 h-8 mx-auto mb-2 text-chart-4" />
              <p className="text-2xl font-bold">#15</p>
              <p className="text-sm text-muted-foreground">Peer Ranking</p>
            </CardContent>
          </Card>
        </div>

        {/* Analytics Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="competence" className="flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Competence
            </TabsTrigger>
            <TabsTrigger value="peers" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Peer Analysis
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Reports
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid lg:grid-cols-2 gap-6">
              <AnalyticsChart
                title="Learning Progress Over Time"
                type="line"
                data={performanceData}
                dataKey="value"
                nameKey="name"
                color="#8b5cf6"
              />
              <AnalyticsChart
                title="Topic Distribution"
                type="pie"
                data={topicDistribution}
                dataKey="value"
                nameKey="name"
              />
            </div>
            <AnalyticsChart
              title="Weekly Engagement Pattern"
              type="bar"
              data={engagementData}
              dataKey="value"
              nameKey="name"
              color="#06b6d4"
            />
          </TabsContent>

          <TabsContent value="competence" className="space-y-6">
            <CompetenceMap data={competenceData} />
          </TabsContent>

          <TabsContent value="peers" className="space-y-6">
            <PeerComparison data={peerData} overallRanking={15} totalPeers={100} />
          </TabsContent>

          <TabsContent value="reports" className="space-y-6">
            <LearningReport data={reportData} onExport={handleExportReport} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
