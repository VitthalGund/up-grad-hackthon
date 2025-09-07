"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Eye, MousePointer, Clock, Zap, TrendingUp, TrendingDown, Activity } from "lucide-react"

interface EngagementData {
  focusTime: number
  clickCount: number
  scrollDepth: number
  pauseCount: number
  engagementScore: number
}

export function EngagementTracker() {
  const [engagement, setEngagement] = useState<EngagementData>({
    focusTime: 0,
    clickCount: 0,
    scrollDepth: 0,
    pauseCount: 0,
    engagementScore: 85,
  })

  const [isTracking, setIsTracking] = useState(true)

  useEffect(() => {
    if (!isTracking) return

    const interval = setInterval(() => {
      setEngagement((prev) => ({
        ...prev,
        focusTime: prev.focusTime + 1,
        engagementScore: Math.min(100, prev.engagementScore + Math.random() * 2 - 1),
      }))
    }, 1000)

    // Track clicks
    const handleClick = () => {
      setEngagement((prev) => ({ ...prev, clickCount: prev.clickCount + 1 }))
    }

    // Track scroll
    const handleScroll = () => {
      const scrollPercent = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      setEngagement((prev) => ({ ...prev, scrollDepth: Math.max(prev.scrollDepth, scrollPercent) }))
    }

    document.addEventListener("click", handleClick)
    window.addEventListener("scroll", handleScroll)

    return () => {
      clearInterval(interval)
      document.removeEventListener("click", handleClick)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [isTracking])

  const getEngagementLevel = (score: number) => {
    if (score >= 80)
      return { level: "High", color: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400" }
    if (score >= 60)
      return { level: "Medium", color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400" }
    return { level: "Low", color: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400" }
  }

  const engagementLevel = getEngagementLevel(engagement.engagementScore)

  return (
    <Card className="border-dashed border-2 hover:border-solid transition-all duration-300">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Live Engagement
          </CardTitle>
          <Badge className={engagementLevel.color}>{engagementLevel.level}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Engagement Score */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Engagement Score</span>
            <span className="font-medium">{Math.round(engagement.engagementScore)}%</span>
          </div>
          <Progress value={engagement.engagementScore} className="h-2" />
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-primary mb-1">
              <Clock className="w-3 h-3" />
              <span className="text-xs font-medium">Focus Time</span>
            </div>
            <p className="text-lg font-bold">
              {Math.floor(engagement.focusTime / 60)}:{(engagement.focusTime % 60).toString().padStart(2, "0")}
            </p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-secondary mb-1">
              <MousePointer className="w-3 h-3" />
              <span className="text-xs font-medium">Interactions</span>
            </div>
            <p className="text-lg font-bold">{engagement.clickCount}</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-accent mb-1">
              <Eye className="w-3 h-3" />
              <span className="text-xs font-medium">Scroll Depth</span>
            </div>
            <p className="text-lg font-bold">{Math.round(engagement.scrollDepth)}%</p>
          </div>

          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="flex items-center justify-center gap-1 text-chart-4 mb-1">
              <Zap className="w-3 h-3" />
              <span className="text-xs font-medium">AI Boost</span>
            </div>
            <p className="text-lg font-bold">+{Math.round(engagement.engagementScore / 10)}</p>
          </div>
        </div>

        {/* Trend Indicator */}
        <div className="flex items-center justify-center gap-2 text-sm">
          {engagement.engagementScore > 75 ? (
            <>
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-green-600 font-medium">Engagement Rising</span>
            </>
          ) : (
            <>
              <TrendingDown className="w-4 h-4 text-orange-600" />
              <span className="text-orange-600 font-medium">Need More Focus</span>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
