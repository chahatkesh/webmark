import React, { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Bookmark,
  FolderOpen,
  TrendingUp,
  RefreshCw,
  Calendar,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreContext } from "../../context/StoreContext";
import { useStats } from "../../hooks/useStats";

const StatCard = ({ icon: Icon, value, label, type, growth, periodLabel }) => {
  const isPositive = parseFloat(growth) >= 0;

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="space-y-0 pb-2">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-blue-50 rounded-full">
            <Icon className="w-4 h-4 text-blue-600" />
          </div>
          <CardTitle className="text-sm font-medium">{label}</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {value?.toLocaleString() || "0"}
        </div>
        <div className="flex items-center space-x-2 mt-1">
          <span
            className={`flex items-center text-sm ${
              isPositive ? "text-green-500" : "text-red-500"
            }`}>
            {isPositive ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
            {Math.abs(growth)}%
          </span>
          <span className="text-xs text-gray-500">{periodLabel}</span>
        </div>
      </CardContent>
    </Card>
  );
};

const HistoricalChart = ({ type, period }) => {
  const { url } = React.useContext(StoreContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["historical-stats", type, period],
    queryFn: async () => {
      const response = await fetch(
        `${url}/api/stats/historical/${type}?period=${period}`
      );
      const data = await response.json();
      return data.data;
    },
  });

  if (isLoading)
    return (
      <div className="h-[300px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );

  if (isError)
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load historical data</AlertDescription>
      </Alert>
    );

  return (
    <div className="h-[300px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            formatter={(value) => [value.toLocaleString(), ""]}
          />
          <Legend />
          <Line type="monotone" dataKey="users" stroke="#3b82f6" name="Users" />
          <Line
            type="monotone"
            dataKey="bookmarks"
            stroke="#10b981"
            name="Bookmarks"
          />
          <Line
            type="monotone"
            dataKey="categories"
            stroke="#f59e0b"
            name="Categories"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatsSection = () => {
  const [timeRange, setTimeRange] = useState("month");
  const [chartType, setChartType] = useState("daily");
  const [chartPeriod, setChartPeriod] = useState(30);

  const { stats, isLoading, isError, error, refreshStats, calculateGrowth } =
    useStats();

  const periodLabel = useMemo(() => {
    switch (timeRange) {
      case "week":
        return "vs last week";
      case "month":
        return "vs last month";
      case "year":
        return "vs last year";
      default:
        return "overall";
    }
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="py-16">
        <div className="flex justify-center items-center space-x-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
          <span className="text-gray-600">Loading statistics...</span>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Alert variant="destructive">
          <AlertDescription>
            {error || "Failed to load statistics"}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <section className="space-y-6 p-6 bg-gray-50">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track and analyze your platform's growth
          </p>
        </div>

        <div className="flex items-center gap-4">
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Select range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Week</SelectItem>
              <SelectItem value="month">Month</SelectItem>
              <SelectItem value="year">Year</SelectItem>
              <SelectItem value="all">All time</SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="icon"
            onClick={refreshStats}
            className="h-10 w-10 hover:bg-blue-50">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <StatCard
          icon={Bookmark}
          value={stats?.totalBookmarks}
          type="bookmarks"
          label="Total Bookmarks"
          growth={calculateGrowth(stats?.totalBookmarks, "bookmarks")}
          periodLabel={periodLabel}
        />
        <StatCard
          icon={FolderOpen}
          value={stats?.totalCategories}
          type="categories"
          label="Total Categories"
          growth={calculateGrowth(stats?.totalCategories, "categories")}
          periodLabel={periodLabel}
        />
        <StatCard
          icon={Users}
          value={stats?.totalUsers}
          type="users"
          label="Active Users"
          growth={calculateGrowth(stats?.totalUsers, "users")}
          periodLabel={periodLabel}
        />
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <CardTitle>Growth Trends</CardTitle>
            <div className="flex gap-4">
              <Select value={chartType} onValueChange={setChartType}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>

              <Select value={chartPeriod} onValueChange={setChartPeriod}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={7}>7 days</SelectItem>
                  <SelectItem value={30}>30 days</SelectItem>
                  <SelectItem value={90}>90 days</SelectItem>
                  <SelectItem value={180}>180 days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <HistoricalChart type={chartType} period={chartPeriod} />
        </CardContent>
      </Card>
    </section>
  );
};

export default StatsSection;
