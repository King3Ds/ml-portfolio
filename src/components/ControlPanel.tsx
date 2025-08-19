import React, { useState } from "react";
import { Card, CardContent } from "./ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ControlPanelProps {
  onParamsChange?: (params: {
    asset: string;
    strategy: string;
    startDate: Date;
    endDate: Date;
  }) => void;
}

const ControlPanel = ({ onParamsChange = () => {} }: ControlPanelProps) => {
  const [asset, setAsset] = useState<string>("SPY");
  const [strategy, setStrategy] = useState<string>("ML + Sentiment");
  const [startDate, setStartDate] = useState<Date>(new Date(2023, 0, 1)); // Jan 1, 2023
  const [endDate, setEndDate] = useState<Date>(new Date(2023, 11, 31)); // Dec 31, 2023

  const handleApply = () => {
    onParamsChange({
      asset,
      strategy,
      startDate,
      endDate,
    });
  };

  return (
    <Card className="w-full bg-background">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">Asset</label>
            <Select value={asset} onValueChange={setAsset}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SPY">SPY (S&P 500 ETF)</SelectItem>
                <SelectItem value="QQQ">QQQ (Nasdaq ETF)</SelectItem>
                <SelectItem value="AAPL">AAPL (Apple)</SelectItem>
                <SelectItem value="MSFT">MSFT (Microsoft)</SelectItem>
                <SelectItem value="TSLA">TSLA (Tesla)</SelectItem>
                <SelectItem value="GOOG">GOOG (Google)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">Strategy</label>
            <Select value={strategy} onValueChange={setStrategy}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select strategy" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ML + Sentiment">ML + Sentiment</SelectItem>
                <SelectItem value="Baseline ARIMA">Baseline ARIMA</SelectItem>
                <SelectItem value="Buy & Hold">Buy & Hold</SelectItem>
                <SelectItem value="Mean Reversion">Mean Reversion</SelectItem>
                <SelectItem value="Momentum">Momentum</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">Start Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? (
                    format(startDate, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => date && setStartDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date() || date > endDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full md:w-1/4">
            <label className="block text-sm font-medium mb-1">End Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground",
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => date && setEndDate(date)}
                  initialFocus
                  disabled={(date) => date > new Date() || date < startDate}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="w-full md:w-auto">
            <Button onClick={handleApply}>Apply</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ControlPanel;
