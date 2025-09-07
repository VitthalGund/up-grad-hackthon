import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Brain, BookOpen, TrendingUp, Users, Zap, Target } from "lucide-react";
import "./globals.css";
// import "../styles/globals.css";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Brain className="w-4 h-4" />
            AI-Powered Learning Engine
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Personalized Micro-Learning
            <span className="text-primary block">That Adapts to You</span>
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Experience the future of education with our AI-driven platform that
            measures your progress, reduces learning fatigue, and delivers
            bite-sized content tailored to your needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/login">Get Started Free</Link>
            </Button>
            {/* <Button
              asChild
              variant="outline"
              size="lg"
              className="text-lg px-8 bg-transparent"
            >
              <Link href="/login">Sign In</Link>
            </Button> */}
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Adaptive Learning</CardTitle>
              <CardDescription>
                AI analyzes your performance and adjusts content difficulty in
                real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-secondary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-secondary/20 transition-colors">
                <Zap className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Micro-Learning</CardTitle>
              <CardDescription>
                Short, focused learning moments that fit into your busy schedule
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors">
                <TrendingUp className="w-6 h-6 text-accent" />
              </div>
              <CardTitle>Progress Analytics</CardTitle>
              <CardDescription>
                Detailed insights into your learning patterns and improvement
                areas
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-3/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-3/20 transition-colors">
                <BookOpen className="w-6 h-6 text-chart-3" />
              </div>
              <CardTitle>Smart Content</CardTitle>
              <CardDescription>
                Personalized learning paths based on your competence and
                engagement
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-4/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-4/20 transition-colors">
                <Users className="w-6 h-6 text-chart-4" />
              </div>
              <CardTitle>Peer Benchmarking</CardTitle>
              <CardDescription>
                Compare your progress with peers and get motivated to improve
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
            <CardHeader>
              <div className="w-12 h-12 bg-chart-5/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-chart-5/20 transition-colors">
                <Brain className="w-6 h-6 text-chart-5" />
              </div>
              <CardTitle>AI Reports</CardTitle>
              <CardDescription>
                Automated insights delivered to your email and WhatsApp
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="bg-gradient-to-r from-primary to-secondary text-primary-foreground">
          <CardContent className="p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">
              Ready to Transform Your Learning?
            </h2>
            <p className="text-lg mb-6 opacity-90">
              Join thousands of learners who have improved their outcomes with
              our AI-powered platform
            </p>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="text-lg px-8"
            >
              <Link href="/register">Start Learning Today</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
