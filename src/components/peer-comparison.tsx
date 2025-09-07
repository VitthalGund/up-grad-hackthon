"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Trophy, TrendingUp, Target } from "lucide-react"

interface PeerData {
  metric: string
  yourScore: number
  peerAverage: number
  percentile: number
  trend: "up" | "down" | "stable"
}

interface PeerComparisonProps {
  data: PeerData[]
  overallRanking: number
  totalPeers: number
}

export function PeerComparison({ data, overallRanking, totalPeers }: PeerComparisonProps) {
  const getPercentileColor = (percentile: number) => {
    if (percentile >= 90) return "text-green-600"
    if (percentile >= 75) return "text-blue-600"
    if (percentile >= 50) return "text-yellow-600"
    return "text-red-600"
  }

  const getPercentileLevel = (percentile: number) => {
    if (percentile >= 90) return "Top Performer"
    if (percentile >= 75) return "Above Average"
    if (percentile >= 50) return "Average"
    return "Below Average"
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            Peer Comparison
          </CardTitle>
          <div className="text-center">
            <div className="flex items-center gap-1">
              <Trophy className="w-4 h-4 text-yellow-500" />
              <span className="font-bold">#{overallRanking}</span>
            </div>
            <p className="text-xs text-muted-foreground">of {totalPeers} learners</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {data.map((metric, index) => (
          <div key={index} className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">{metric.metric}</h3>
              <div className="flex items-center gap-2">
                <Badge
                  className={`${getPercentileColor(metric.percentile)} bg-transparent border-current`}
                  variant="outline"
                >
                  {metric.percentile}th percentile
                </Badge>
                <span className="text-sm text-muted-foreground">{getPercentileLevel(metric.percentile)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-primary">Your Score</span>
                <span className="font-bold">{metric.yourScore}%</span>
              </div>
              <Progress value={metric.yourScore} className="h-2" />

              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">Peer Average</span>
                <span className="text-sm">{metric.peerAverage}%</span>
              </div>
              <Progress value={metric.peerAverage} className="h-1 opacity-50" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-1">
                {metric.trend === "up" && <TrendingUp className="w-3 h-3 text-green-600" />}
                {metric.trend === "down" && <TrendingUp className="w-3 h-3 text-red-600 rotate-180" />}
                {metric.trend === "stable" && <Target className="w-3 h-3 text-gray-600" />}
                <span
                  className={
                    metric.trend === "up"
                      ? "text-green-600"
                      : metric.trend === "down"
                        ? "text-red-600"
                        : "text-gray-600"
                  }
                >
                  {metric.trend === "up" ? "Improving" : metric.trend === "down" ? "Declining" : "Stable"}
                </span>
              </div>
              <span className="text-muted-foreground">
                {metric.yourScore > metric.peerAverage ? "+" : ""}
                {(metric.yourScore - metric.peerAverage).toFixed(1)} vs peers
              </span>
            </div>
          </div>
        ))}

        {/* Overall Performance Summary */}
        <div className="bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg p-4 mt-6">
          <h3 className="font-semibold mb-2">Performance Summary</h3>
          <p className="text-sm text-muted-foreground">
            You're performing better than {Math.round((1 - overallRanking / totalPeers) * 100)}% of your peers.
            {overallRanking <= totalPeers * 0.1 && " You're in the top 10% - excellent work!"}
            {overallRanking > totalPeers * 0.1 &&
              overallRanking <= totalPeers * 0.25 &&
              " You're in the top 25% - keep it up!"}
            {overallRanking > totalPeers * 0.5 && " Focus on consistent practice to improve your ranking."}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
