import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ControlPanel from "./ControlPanel";
import EquityCurveChart from "./EquityCurveChart";
import PortfolioAnalytics from "./PortfolioAnalytics";

interface DashboardParams {
  asset: string;
  strategy: string;
  startDate: Date;
  endDate: Date;
}

const Home = () => {
  const [currentParams, setCurrentParams] = useState<DashboardParams>({
    asset: "SPY",
    strategy: "ML + Sentiment",
    startDate: new Date(2023, 0, 1),
    endDate: new Date(2023, 11, 31),
  });
  const [loading, setLoading] = useState(false);

  // Generate dynamic data based on current parameters
  const generatePerformanceMetrics = useCallback((params: DashboardParams) => {
    const baseMetrics = {
      "ML + Sentiment": {
        sharpe: 1.85,
        drawdown: -8.2,
        returns: 24.3,
        winRate: 68.5,
      },
      "Baseline ARIMA": {
        sharpe: 1.42,
        drawdown: -11.5,
        returns: 18.7,
        winRate: 61.2,
      },
      "Buy & Hold": {
        sharpe: 1.15,
        drawdown: -15.8,
        returns: 12.4,
        winRate: 55.8,
      },
      "Mean Reversion": {
        sharpe: 1.28,
        drawdown: -13.2,
        returns: 16.1,
        winRate: 58.9,
      },
      Momentum: { sharpe: 1.67, drawdown: -9.8, returns: 21.5, winRate: 64.3 },
    };

    const metrics =
      baseMetrics[params.strategy as keyof typeof baseMetrics] ||
      baseMetrics["ML + Sentiment"];

    return [
      {
        name: "Sharpe Ratio",
        value: metrics.sharpe.toFixed(2),
        change: (Math.random() - 0.5) * 0.2,
      },
      {
        name: "Max Drawdown",
        value: `${metrics.drawdown.toFixed(1)}%`,
        change: (Math.random() - 0.5) * 0.1,
      },
      {
        name: "Annualized Return",
        value: `${metrics.returns.toFixed(1)}%`,
        change: (Math.random() - 0.5) * 0.15,
      },
      {
        name: "Win Rate",
        value: `${metrics.winRate.toFixed(1)}%`,
        change: (Math.random() - 0.5) * 0.08,
      },
    ];
  }, []);

  const generatePortfolioWeights = useCallback((params: DashboardParams) => {
    const colors = [
      "#10B981",
      "#3B82F6",
      "#F59E0B",
      "#EF4444",
      "#8B5CF6",
      "#EC4899",
    ];

    if (params.asset === "SPY" || params.asset === "QQQ") {
      return [
        { asset: "AAPL", weight: 0.22, color: colors[0] },
        { asset: "MSFT", weight: 0.18, color: colors[1] },
        { asset: "AMZN", weight: 0.15, color: colors[2] },
        { asset: "GOOGL", weight: 0.13, color: colors[3] },
        { asset: "TSLA", weight: 0.12, color: colors[4] },
        { asset: "NVDA", weight: 0.2, color: colors[5] },
      ];
    } else {
      return [{ asset: params.asset, weight: 1.0, color: colors[0] }];
    }
  }, []);

  const generateSentimentData = useCallback((params: DashboardParams) => {
    const headlines = {
      AAPL: [
        {
          headline: "Apple reports strong iPhone 15 sales",
          source: "Financial Times",
          score: 0.82,
        },
        {
          headline: "Apple Vision Pro production ramps up",
          source: "Reuters",
          score: 0.65,
        },
        {
          headline: "Apple faces regulatory challenges in EU",
          source: "Bloomberg",
          score: -0.28,
        },
      ],
      MSFT: [
        {
          headline: "Microsoft Azure growth accelerates",
          source: "Wall Street Journal",
          score: 0.78,
        },
        {
          headline: "Microsoft Copilot adoption surges",
          source: "TechCrunch",
          score: 0.71,
        },
        {
          headline: "Microsoft faces antitrust scrutiny",
          source: "Reuters",
          score: -0.35,
        },
      ],
      TSLA: [
        {
          headline: "Tesla delivers record quarterly vehicles",
          source: "Bloomberg",
          score: 0.85,
        },
        {
          headline: "Tesla Cybertruck production begins",
          source: "CNBC",
          score: 0.69,
        },
        {
          headline: "Tesla recalls vehicles over safety concerns",
          source: "Reuters",
          score: -0.52,
        },
      ],
      default: [
        {
          headline: "Market shows strong momentum",
          source: "Financial Times",
          score: 0.65,
        },
        {
          headline: "Tech sector leads gains",
          source: "Bloomberg",
          score: 0.58,
        },
        {
          headline: "Economic indicators remain mixed",
          source: "Reuters",
          score: -0.15,
        },
      ],
    };

    const assetHeadlines =
      headlines[params.asset as keyof typeof headlines] || headlines.default;

    return assetHeadlines.map((item, index) => ({
      ...item,
      date: new Date(Date.now() - index * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
    }));
  }, []);

  const handleParamsChange = useCallback(async (params: DashboardParams) => {
    setLoading(true);
    setCurrentParams(params);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 800));

    setLoading(false);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto py-4">
          <h1 className="text-2xl font-bold">ML Portfolio Dashboard</h1>
        </div>
      </header>

      <main className="flex-1 container mx-auto py-6 space-y-6">
        <ControlPanel onParamsChange={handleParamsChange} />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EquityCurveChart
            asset={currentParams.asset}
            strategy={currentParams.strategy}
            startDate={currentParams.startDate.toISOString().split("T")[0]}
            endDate={currentParams.endDate.toISOString().split("T")[0]}
          />

          <PortfolioAnalytics
            metrics={generatePerformanceMetrics(currentParams)}
            portfolioWeights={generatePortfolioWeights(currentParams)}
            sentimentData={generateSentimentData(currentParams)}
          />
        </div>
      </main>
    </div>
  );
};

export default Home;
