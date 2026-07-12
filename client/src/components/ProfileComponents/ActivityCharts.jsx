import { useMemo } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { format, parseISO } from "date-fns";
import { Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const chartTooltipStyle = {
  borderRadius: "8px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
  fontSize: "12px",
};

const formatTick = (dateStr, range) => {
  try {
    const date = parseISO(dateStr);
    return range === "7d" ? format(date, "EEE") : format(date, "MMM d");
  } catch {
    return dateStr;
  }
};

/** Even, readable Y-axis ticks — avoids odd domains like 0/4/8/9 */
const buildYAxis = (values) => {
  const dataMax = Math.max(0, ...values);
  if (dataMax <= 0) return { domainMax: 4, ticks: [0, 1, 2, 3, 4] };

  const roughStep = dataMax / 4;
  const niceSteps = [1, 2, 5, 10, 15, 20, 25, 50, 75, 100, 150, 200, 250, 500];
  const step =
    niceSteps.find((n) => n >= roughStep) || Math.ceil(roughStep / 100) * 100;

  const domainMax = step * 4;
  return {
    domainMax,
    ticks: [0, step, step * 2, step * 3, domainMax],
  };
};

const ChartEmpty = ({ message }) => (
  <div className="flex h-[200px] flex-col items-center justify-center rounded-lg border border-dashed border-gray-200 bg-slate-50/50 px-4 text-center">
    <Activity className="mb-2 h-5 w-5 text-gray-400" />
    <p className="max-w-xs text-sm text-gray-500">{message}</p>
  </div>
);

const ChartSkeleton = () => (
  <div className="flex h-[200px] items-end gap-2 rounded-lg bg-slate-50 px-4 pb-4 pt-8">
    {Array.from({ length: 8 }).map((_, i) => (
      <div
        key={i}
        className="flex-1 animate-pulse rounded-t bg-gray-200"
        style={{ height: `${30 + ((i * 17) % 60)}%` }}
      />
    ))}
  </div>
);

const formatCount = (n) => (Number(n) || 0).toLocaleString();

const ActivityCharts = ({ range, onRangeChange, clicksOverTime, loading }) => {
  const totalClicksInRange = useMemo(
    () => clicksOverTime.reduce((sum, day) => sum + (day.clicks || 0), 0),
    [clicksOverTime],
  );

  const { domainMax, ticks } = useMemo(
    () => buildYAxis(clicksOverTime.map((d) => d.clicks || 0)),
    [clicksOverTime],
  );

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="min-w-0 pr-2">
          <CardTitle className="text-base font-semibold">
            Click activity
          </CardTitle>
          <CardDescription className="mt-1">
            {loading
              ? "Loading…"
              : totalClicksInRange === 0
                ? `No opens in the last ${range === "7d" ? "7" : "30"} days`
                : `${formatCount(totalClicksInRange)} open${totalClicksInRange === 1 ? "" : "s"} · last ${range === "7d" ? "7" : "30"} days`}
          </CardDescription>
        </div>
        <div className="flex shrink-0 rounded-lg border border-gray-200 bg-white p-0.5">
          {["7d", "30d"].map((value) => (
            <Button
              key={value}
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onRangeChange(value)}
              className={`h-7 px-2.5 text-xs ${
                range === value
                  ? "bg-blue-50 font-medium text-blue-700 hover:bg-blue-50 hover:text-blue-700"
                  : "text-gray-500"
              }`}
            >
              {value}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <ChartSkeleton />
        ) : totalClicksInRange === 0 ? (
          <ChartEmpty message="Open bookmarks from your dashboard and your rhythm will show up here." />
        ) : (
          <div className="h-[200px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={clicksOverTime}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="clicksFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#f1f5f9"
                />
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatTick(v, range)}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  interval={range === "7d" ? 0 : "preserveStartEnd"}
                  minTickGap={28}
                />
                <YAxis
                  allowDecimals={false}
                  domain={[0, domainMax]}
                  ticks={ticks}
                  tick={{ fontSize: 11, fill: "#94a3b8" }}
                  axisLine={false}
                  tickLine={false}
                  width={28}
                />
                <Tooltip
                  contentStyle={chartTooltipStyle}
                  labelFormatter={(label) => {
                    try {
                      return format(parseISO(label), "MMM d, yyyy");
                    } catch {
                      return label;
                    }
                  }}
                  formatter={(value) => [
                    `${formatCount(value)} opens`,
                    "Clicks",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="clicks"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#clicksFill)"
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ActivityCharts;
