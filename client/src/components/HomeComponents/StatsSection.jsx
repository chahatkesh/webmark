import React, { useState, useMemo, useContext } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Users,
  Bookmark,
  FolderOpen,
  RefreshCw,
  ChevronUp,
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

const RecentUsers = ({ users = [] }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4 pb-4">
    {users?.map((user, index) => (
      <div
        key={index}
        className="flex items-center space-x-4 p-3 rounded-lg hover:cursor-pointer hover:bg-gray-50">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-lg shadow-md">
          {user.username?.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {user.username}
          </p>
          <p className="text-sm text-gray-500">
            Joined {formatDate(user.joinedAt)}
          </p>
        </div>
      </div>
    ))}
  </div>
);

const StatCard = ({ icon: Icon, value, label, type, growth, periodLabel }) => {
  const isPositive = parseFloat(growth) >= 0;

  return (
    <div className="flex flex-col items-center p-4 md:p-6 bg-none rounded-lg">
      <div className="p-3 bg-blue-50 rounded-full mb-4">
        <Icon className="w-6 h-6 text-blue-600" />
      </div>

      <h3 className="text-3xl font-bold text-gray-900 mb-2">
        {value?.toLocaleString() || "0"}
      </h3>

      <p className="text-sm text-gray-600">{label}</p>
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
    </div>
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
      <div className="h-[400px] flex items-center justify-center">
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
    <div className="h-[400px] mt-4">
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
    <section
      id="about-us"
      className="relative bg-gradient-to-b from-white to-blue-50 py-16 md:py-24">
      <div className="px-4 sm:px-6 max-w-[72rem] ml-auto mr-auto">
        <div className="py-12 md:py-16 flex flex-col gap-6">
          {/* header */}
          <div className="pb-12 text-center max-w-[48rem] ml-auto mr-auto">
            <h2 className="mb-4 md:leading-[1.2777] leading-[1.3333] text-[1.875rem] tracking-[-0.037em] md:text-[2.25rem] text-[#111827] font-[700]">
              Our Growing Community
            </h2>
            <p className="text-[#374151] leading-[1.5] text-[1.125rem] tracking-[-0.017em]">
              Join thousands of professionals who are organizing their digital
              resources with <span className="font-bold">Webmark</span>. Start
              your journey today!
            </p>
          </div>

          {/* stats card section */}
          <Card>
            <CardHeader>
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <CardTitle>Real time Analytics</CardTitle>
                <div className="flex gap-4">
                  <Select
                    value={timeRange}
                    onValueChange={setTimeRange}
                    className="w-28">
                    <SelectTrigger>
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
                    className="h-9 w-9 hover:bg-blue-50">
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
              <CardTitle>Recently Joined Members</CardTitle>
            </CardHeader>

            <RecentUsers users={stats?.recentUsers} />
          </Card>

          {/* chart section */}
          <div className="hidden">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                  <CardTitle>Growth Trends</CardTitle>
                  <div className="flex gap-4">
                    <Select
                      value={chartType}
                      onValueChange={setChartType}
                      className="w-28">
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="daily">Daily</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                      </SelectContent>
                    </Select>

                    <Select
                      value={chartPeriod}
                      onValueChange={setChartPeriod}
                      className="w-28">
                      <SelectTrigger>
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
              <CardContent className="p-6 md:p-8">
                <HistoricalChart type={chartType} period={chartPeriod} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
