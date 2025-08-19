import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface EquityCurveChartProps {
  asset?: string;
  strategy?: string;
  startDate?: string;
  endDate?: string;
}

interface EquityDataPoint {
  date: string;
  equity: number;
  benchmark?: number;
}

const EquityCurveChart = ({
  asset = "SPY",
  strategy = "ML + Sentiment",
  startDate = "2023-01-01",
  endDate = "2023-12-31",
}: EquityCurveChartProps) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [equityData, setEquityData] = useState<EquityDataPoint[]>([]);

  useEffect(() => {
    // In a real implementation, this would fetch data from the backend API
    // based on the selected asset, strategy, and date range
    setLoading(true);

    // Simulate API call with timeout
    const fetchData = setTimeout(() => {
      // Mock data generation
      const mockData = generateMockEquityData(
        asset,
        strategy,
        startDate,
        endDate,
      );
      setEquityData(mockData);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(fetchData);
  }, [asset, strategy, startDate, endDate]);

  // Helper function to generate mock data
  const generateMockEquityData = (
    asset: string,
    strategy: string,
    start: string,
    end: string,
  ): EquityDataPoint[] => {
    const data: EquityDataPoint[] = [];
    const startTimestamp = new Date(start).getTime();
    const endTimestamp = new Date(end).getTime();
    const dayIncrement = 86400000; // milliseconds in a day

    let currentEquity = 100000; // Starting with $100,000
    let benchmarkEquity = 100000;

    // Generate daily data points
    for (
      let timestamp = startTimestamp;
      timestamp <= endTimestamp;
      timestamp += dayIncrement
    ) {
      const date = new Date(timestamp).toISOString().split("T")[0];

      // Simulate different performance based on strategy
      let dailyReturn = 0;
      if (strategy === "ML + Sentiment") {
        dailyReturn = Math.random() * 0.02 - 0.005; // -0.5% to 1.5% daily return
      } else if (strategy === "Baseline ARIMA") {
        dailyReturn = Math.random() * 0.015 - 0.005; // -0.5% to 1% daily return
      } else {
        dailyReturn = Math.random() * 0.01 - 0.003; // -0.3% to 0.7% daily return
      }

      // Apply the daily return
      currentEquity = currentEquity * (1 + dailyReturn);

      // Benchmark return (simpler model)
      const benchmarkReturn = Math.random() * 0.01 - 0.004; // -0.4% to 0.6%
      benchmarkEquity = benchmarkEquity * (1 + benchmarkReturn);

      // Only add weekday data points (skip weekends)
      const dayOfWeek = new Date(timestamp).getDay();
      if (dayOfWeek !== 0 && dayOfWeek !== 6) {
        data.push({
          date,
          equity: Math.round(currentEquity),
          benchmark: Math.round(benchmarkEquity),
        });
      }
    }

    return data;
  };

  const formatCurrency = (value: number) => {
    return `$${value.toLocaleString()}`;
  };

  return (
    <Card className="w-full bg-white">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Equity Curve</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="w-full h-[300px] flex items-center justify-center">
            <Skeleton className="w-full h-[300px]" />
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={equityData}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
              <XAxis
                dataKey="date"
                tickFormatter={(date) => {
                  const d = new Date(date);
                  return `${d.getMonth() + 1}/${d.getDate()}`;
                }}
                minTickGap={30}
              />
              <YAxis
                tickFormatter={formatCurrency}
                domain={["dataMin - 5000", "dataMax + 5000"]}
              />
              <Tooltip
                formatter={(value: number) => formatCurrency(value)}
                labelFormatter={(label) => {
                  const date = new Date(label);
                  return date.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="equity"
                name={`${strategy} (${asset})`}
                stroke="#8884d8"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
              <Line
                type="monotone"
                dataKey="benchmark"
                name="Benchmark (S&P 500)"
                stroke="#82ca9d"
                strokeWidth={2}
                dot={false}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
};

export default EquityCurveChart;
