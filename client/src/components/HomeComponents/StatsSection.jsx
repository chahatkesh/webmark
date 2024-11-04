import React, { useMemo, useContext, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Bookmark,
  FolderOpen,
  RefreshCw,
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StoreContext } from "../../context/StoreContext";
import { useStats } from "../../hooks/useStats";

const formatDate = (dateString) => {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "N/A";

    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 7) {
      return `${diffDays} ${diffDays === 1 ? "day" : "days"} ago`;
    } else {
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    }
  } catch (error) {
    console.error("Date formatting error:", error);
    return "N/A";
  }
};

const RecentUsers = ({ users = [], timeRange }) => (
  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 px-4 pb-4">
    {users?.map((user, index) => (
      <div
        key={`${timeRange}-${user.username}-${index}`}
        className="group flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 hover:bg-blue-50 hover:shadow-md">
        <div className="relative">
          <div className="w-10 md:w-12 h-10 md:h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-base md:text-lg shadow-md transform transition-transform group-hover:scale-110">
            {user.username?.charAt(0).toUpperCase()}
          </div>
          <div className="absolute -bottom-1 -right-1 w-3 md:w-4 h-3 md:h-4 bg-green-400 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate group-hover:text-blue-600">
            {user.username}
          </p>
          <p className="hidden md:block text-sm text-gray-500">
            Joined {formatDate(user.joinedAt)}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const StatCard = ({ icon: Icon, value, label, type, growth, periodLabel }) => {
  const isPositive = parseFloat(growth) >= 0;
  const displayValue = value?.toLocaleString() || "0";
  const displayGrowth = Math.abs(growth);

  return (
    <div className="group flex flex-col items-center p-4 md:p-6 bg-none rounded-lg transition-all duration-300 hover:bg-blue-50/50">
      <div className="p-3 bg-blue-50/50 rounded-full mb-4 transform transition-all duration-300 group-hover:scale-105 group-hover:bg-blue-100/50">
        <Icon className="w-6 h-6 text-blue-500" />
      </div>

      <h3 className="text-3xl font-bold text-gray-800 mb-2 transition-colors group-hover:text-blue-600">
        {displayValue}
      </h3>

      <p className="text-sm text-gray-500">{label}</p>
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
          {displayGrowth}%
        </span>
        <span className="text-xs text-gray-400">{periodLabel}</span>
      </div>
    </div>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="text-sm font-medium text-gray-900 mb-2">
          {new Date(label).toLocaleDateString()}
        </p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center space-x-2 mb-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-sm text-gray-600">
              {entry.name}: {entry.value.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const HistoricalChart = ({ type, period }) => {
  const { url } = useContext(StoreContext);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["historical-stats", type, period],
    queryFn: async () => {
      const response = await fetch(
        `${url}/api/stats/historical/${type}?period=${period}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch historical data");
      }
      const data = await response.json();
      return data.data;
    },
    refetchInterval: 30000,
    staleTime: 25000,
    retry: 2,
  });

  if (isLoading) {
    return (
      <div className="h-[400px] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertDescription>Failed to load historical data</AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="h-[400px] mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="date"
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            stroke="#6B7280"
            tick={{ fontSize: 12 }}
          />
          <YAxis stroke="#6B7280" tick={{ fontSize: 12 }} />
          <Tooltip content={<CustomTooltip />} />
          <Legend
            wrapperStyle={{
              paddingTop: "20px",
              fontSize: "14px",
            }}
          />
          <Line
            type="monotone"
            dataKey="users"
            stroke="#3b82f6"
            name="Users"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="bookmarks"
            stroke="#10b981"
            name="Bookmarks"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
          <Line
            type="monotone"
            dataKey="categories"
            stroke="#f59e0b"
            name="Categories"
            strokeWidth={3}
            dot={{ r: 4, strokeWidth: 2 }}
            activeDot={{ r: 6, strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

const StatsSection = () => {
  const [chartType, setChartType] = useState("daily");
  const [chartPeriod, setChartPeriod] = useState(30);
  const {
    stats,
    isLoading,
    isError,
    error,
    timeRange,
    setTimeRange,
    refreshStats,
    calculateGrowth,
  } = useStats();

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
    <section
      id="about-us"
      className="relative bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div className="px-4 sm:px-6 max-w-[72rem] ml-auto mr-auto">
        <div className="py-12 md:py-16 flex flex-col gap-6">
          {/* Header */}
          <div className="pb-12 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              Our Growing Community
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              Join thousands of professionals who are organizing their digital
              resources with{" "}
              <span className="font-bold text-blue-500">Webmark</span>. Start
              your journey today!
            </p>
          </div>

          {/* Stats card section */}
          <Card className="shadow-sm hover:shadow-md transition-shadow duration-300 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <CardTitle className="text-xl text-gray-800">
                  Real time Analytics
                </CardTitle>
                <div className="flex gap-4">
                  <Select value={timeRange} onValueChange={setTimeRange}>
                    <SelectTrigger className="w-28 border-gray-200 hover:border-blue-300 transition-colors">
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
                    className="h-9 w-9 hover:bg-blue-50/50 hover:text-blue-500 transition-colors">
                    <RefreshCw className="h-4 w-4 mx-2" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <div className="grid lg:grid-cols-3 overflow-hidden border-in-header">
              <article className="relative p-6 md:p-10">
                <StatCard
                  icon={Bookmark}
                  value={stats?.totalBookmarks}
                  type="bookmarks"
                  label="Bookmarks Added"
                  growth={calculateGrowth(stats?.totalBookmarks, "bookmarks")}
                  periodLabel={periodLabel}
                />
              </article>
              <article className="relative p-6 md:p-10 lg-border-in-header-2">
                <StatCard
                  icon={FolderOpen}
                  value={stats?.totalCategories}
                  type="categories"
                  label="Categories Created"
                  growth={calculateGrowth(stats?.totalCategories, "categories")}
                  periodLabel={periodLabel}
                />
              </article>
              <article className="relative p-6 md:p-10">
                <StatCard
                  icon={Users}
                  value={stats?.totalUsers}
                  type="users"
                  label="Active Users"
                  growth={calculateGrowth(stats?.totalUsers, "users")}
                  periodLabel={periodLabel}
                />
              </article>
            </div>
            <CardHeader>
              <CardTitle className="text-xl text-gray-900">
                Recently Joined Members
              </CardTitle>
            </CardHeader>

            <RecentUsers users={stats?.recentUsers} timeRange={timeRange} />
            <div className="hidden lg:block">
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <CardTitle className="text-xl text-gray-900">
                    Growth Trends
                  </CardTitle>
                  <div className="flex gap-4">
                    <Select value={chartType} onValueChange={setChartType}>
                      <SelectTrigger className="w-28 border-gray-200 hover:border-blue-400 transition-colors">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={chartPeriod.toString()}
                      onValueChange={(value) => setChartPeriod(Number(value))}>
                      <SelectTrigger className="w-28 border-gray-200 hover:border-blue-400 transition-colors">
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">7 days</SelectItem>
                        <SelectItem value="30">30 days</SelectItem>
                        <SelectItem value="90">90 days</SelectItem>
                        <SelectItem value="180">180 days</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <HistoricalChart type={chartType} period={chartPeriod} />
                </div>
              </CardContent>
            </div>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
