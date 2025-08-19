import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  BarChart3Icon,
  PieChartIcon,
  NewspaperIcon,
} from "lucide-react";

interface PerformanceMetric {
  name: string;
  value: string | number;
  change?: number;
}

interface PortfolioWeight {
  asset: string;
  weight: number;
  color: string;
}

interface SentimentItem {
  headline: string;
  source: string;
  date: string;
  score: number;
}

interface PortfolioAnalyticsProps {
  metrics?: PerformanceMetric[];
  portfolioWeights?: PortfolioWeight[];
  sentimentData?: SentimentItem[];
}

const PortfolioAnalytics = ({
  metrics = [
    { name: "Sharpe Ratio", value: "1.85", change: 0.12 },
    { name: "Max Drawdown", value: "-12.4%", change: -0.03 },
    { name: "Annualized Return", value: "18.7%", change: 0.05 },
    { name: "Win Rate", value: "62.3%", change: 0.02 },
  ],
  portfolioWeights = [
    { asset: "AAPL", weight: 0.25, color: "#10B981" },
    { asset: "MSFT", weight: 0.2, color: "#3B82F6" },
    { asset: "AMZN", weight: 0.15, color: "#F59E0B" },
    { asset: "GOOGL", weight: 0.15, color: "#EF4444" },
    { asset: "TSLA", weight: 0.1, color: "#8B5CF6" },
    { asset: "NVDA", weight: 0.15, color: "#EC4899" },
  ],
  sentimentData = [
    {
      headline: "Apple reports record quarterly earnings",
      source: "Financial Times",
      date: "2023-07-28",
      score: 0.85,
    },
    {
      headline: "Microsoft cloud business growth slows",
      source: "Reuters",
      date: "2023-07-27",
      score: -0.32,
    },
    {
      headline: "Amazon exceeds analyst expectations",
      source: "Bloomberg",
      date: "2023-07-26",
      score: 0.76,
    },
    {
      headline: "Google announces new AI initiatives",
      source: "TechCrunch",
      date: "2023-07-25",
      score: 0.64,
    },
    {
      headline: "Tesla production issues in China factory",
      source: "Wall Street Journal",
      date: "2023-07-24",
      score: -0.58,
    },
  ],
}: PortfolioAnalyticsProps) => {
  return (
    <div className="w-full space-y-6 bg-background">
      {/* Performance Metrics */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3Icon className="h-5 w-5" />
            Performance Metrics
          </CardTitle>
          <CardDescription>
            Key performance indicators for the selected strategy
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {metrics.map((metric, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6 relative">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      {metric.name}
                    </p>
                  </div>
                  <p className="mt-2 text-2xl font-bold tracking-tight">
                    {metric.value}
                  </p>
                  {metric.change !== undefined && (
                    <Badge
                      variant={metric.change >= 0 ? "default" : "destructive"}
                      className="absolute bottom-3 right-3 flex items-center gap-1 text-xs"
                    >
                      {metric.change >= 0 ? (
                        <ArrowUpIcon className="h-3 w-3" />
                      ) : (
                        <ArrowDownIcon className="h-3 w-3" />
                      )}
                      {Math.abs(metric.change * 100).toFixed(1)}%
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Weights and Sentiment Analysis Tabs */}
      <Tabs defaultValue="portfolio" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="portfolio" className="flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Portfolio Weights
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="flex items-center gap-2">
            <NewspaperIcon className="h-4 w-4" />
            Sentiment Analysis
          </TabsTrigger>
        </TabsList>

        {/* Portfolio Weights Tab */}
        <TabsContent value="portfolio">
          <Card>
            <CardHeader>
              <CardTitle>Optimized Portfolio Allocation</CardTitle>
              <CardDescription>
                Asset weights based on the selected strategy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Portfolio Weights Visualization */}
                <div className="h-64 w-full">
                  <div className="flex h-full items-end gap-3 px-4">
                    {portfolioWeights.map((item, index) => (
                      <div
                        key={index}
                        className="relative flex flex-1 flex-col items-center max-w-20"
                      >
                        <div
                          className="w-full rounded-t-lg shadow-sm transition-all hover:shadow-md"
                          style={{
                            height: `${Math.max(item.weight * 200, 20)}px`,
                            backgroundColor: item.color,
                          }}
                        />
                        <div className="mt-3 text-sm font-semibold text-center">
                          {item.asset}
                        </div>
                        <div className="text-xs text-muted-foreground font-medium">
                          {(item.weight * 100).toFixed(1)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Portfolio Weights Table */}
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Asset</TableHead>
                      <TableHead className="text-right">Weight</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolioWeights.map((item, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            {item.asset}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {(item.weight * 100).toFixed(1)}%
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sentiment Analysis Tab */}
        <TabsContent value="sentiment">
          <Card>
            <CardHeader>
              <CardTitle>News Sentiment Analysis</CardTitle>
              <CardDescription>
                Recent news headlines with sentiment scores for selected assets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Headline</TableHead>
                    <TableHead>Source</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead className="text-right">Sentiment</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sentimentData.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.headline}
                      </TableCell>
                      <TableCell>{item.source}</TableCell>
                      <TableCell>{item.date}</TableCell>
                      <TableCell className="text-right">
                        <Badge
                          variant={item.score > 0 ? "default" : "destructive"}
                          className="inline-flex items-center gap-1"
                        >
                          {item.score > 0 ? (
                            <ArrowUpIcon className="h-3 w-3" />
                          ) : (
                            <ArrowDownIcon className="h-3 w-3" />
                          )}
                          {item.score.toFixed(2)}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default PortfolioAnalytics;
