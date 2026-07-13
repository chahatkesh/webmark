import { useDeferredValue, useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import {
  Activity,
  Bookmark,
  Bot,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Database,
  FolderClosed,
  KeyRound,
  Laptop,
  LogOut,
  MonitorSmartphone,
  RefreshCw,
  Search,
  ShieldCheck,
  Smartphone,
  UserCheck,
  Users,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import smallLogoColor from "../assets/small_logo_color.svg";
import { apiRequest } from "../utils/apiClient";

const CHART_COLORS = ["#0f766e", "#2563eb", "#e59f0c", "#dc6b4d"];

const formatNumber = (value) =>
  new Intl.NumberFormat("en-US").format(value || 0);

const formatDuration = (seconds) => {
  const hours = Math.floor((seconds || 0) / 3600);
  const minutes = Math.floor(((seconds || 0) % 3600) / 60);
  return hours ? `${formatNumber(hours)}h ${minutes}m` : `${minutes}m`;
};

const formatDate = (value, withTime = false) => {
  if (!value) return "Never";
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(withTime ? { hour: "numeric", minute: "2-digit" } : {}),
  }).format(new Date(value));
};

const formatTrendDate = (value) =>
  new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" }).format(
    new Date(`${value}T00:00:00Z`),
  );

const formatRelativeTime = (value) => {
  if (!value) return "Never";

  const diffMs = Math.max(Date.now() - new Date(value).getTime(), 0);
  const minutes = Math.floor(diffMs / 60000);

  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;

  const months = Math.floor(days / 30);
  return `${months}mo ago`;
};

const adminRequest = (path, options = {}) =>
  apiRequest(path, {
    skipAuthRefresh: true,
    retryOnAuth: false,
    ...options,
  });

const ChartTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-md border border-gray-200 bg-white px-3 py-2 shadow-lg">
      <p className="mb-1 text-xs font-medium text-gray-500">
        {label?.includes("-") ? formatTrendDate(label) : label}
      </p>
      {payload.map((item) => (
        <div
          key={item.dataKey || item.name}
          className="flex items-center justify-between gap-5 text-xs"
        >
          <span style={{ color: item.color }}>{item.name}</span>
          <span className="font-semibold text-gray-900">
            {formatNumber(item.value)}
          </span>
        </div>
      ))}
    </div>
  );
};

const MetricCard = ({ icon: Icon, label, value, detail, accent }) => (
  <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-gray-500">{label}</p>
        <p className="mt-2 text-2xl font-semibold text-gray-950">{value}</p>
        <p className="mt-1 text-xs text-gray-500">{detail}</p>
      </div>
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${accent}`}
      >
        <Icon className="h-4 w-4" aria-hidden="true" />
      </span>
    </div>
  </div>
);

const AdminLogin = ({ onAuthenticated }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const response = await adminRequest("/api/admin/login", {
        method: "POST",
        body: { email, password },
      });
      setPassword("");
      onAuthenticated(response.admin);
    } catch (requestError) {
      setError(requestError.message || "Unable to sign in");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main
      className="flex h-screen min-h-[560px] items-center justify-center overflow-y-auto bg-[#f5f7f6] px-4 py-10"
      style={{
        backgroundImage:
          "linear-gradient(rgba(15,118,110,0.055) 1px, transparent 1px), linear-gradient(90deg, rgba(15,118,110,0.055) 1px, transparent 1px)",
        backgroundSize: "32px 32px",
      }}
    >
      <section className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-7 shadow-xl shadow-gray-900/5">
        <div className="mb-7 flex items-center gap-3">
          <img
            src={smallLogoColor}
            alt="Webmark"
            className="h-10 w-10 rounded-lg"
          />
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">
              Webmark
            </p>
            <h1 className="text-xl font-semibold text-gray-950">
              Admin console
            </h1>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-medium text-gray-700"
            >
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="username"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-medium text-gray-700"
            >
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-950 outline-none transition focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
            />
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-md border border-red-100 bg-red-50 px-3 py-2 text-xs text-red-700"
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-gray-950 px-4 text-sm font-medium text-white transition hover:bg-teal-800 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <KeyRound className="h-4 w-4" aria-hidden="true" />
            {submitting ? "Signing in..." : "Sign in"}
          </button>
        </form>
      </section>
    </main>
  );
};

const AdminDashboard = ({ admin, onSignedOut }) => {
  const [data, setData] = useState(null);
  const [range, setRange] = useState(30);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const deferredSearch = useDeferredValue(search);

  useEffect(() => {
    const controller = new AbortController();

    const loadDashboard = async () => {
      setLoading(true);
      setError("");

      try {
        const query = new URLSearchParams({
          range: String(range),
          page: String(page),
          limit: "20",
        });
        if (deferredSearch.trim()) query.set("search", deferredSearch.trim());

        const response = await adminRequest(`/api/admin/dashboard?${query}`, {
          signal: controller.signal,
        });
        setData(response);
      } catch (requestError) {
        if (requestError.name === "AbortError") return;
        if (requestError.status === 401) {
          onSignedOut();
          return;
        }
        setError(requestError.message || "Unable to load analytics");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    loadDashboard();
    return () => controller.abort();
  }, [deferredSearch, onSignedOut, page, range, refreshKey]);

  const handleLogout = async () => {
    try {
      await adminRequest("/api/admin/logout", { method: "POST" });
    } finally {
      onSignedOut();
    }
  };

  const overview = data?.overview || {};
  const accounts = data?.accounts || { rows: [], page: 1, pages: 1, total: 0 };
  const onboardingRate = overview.totalUsers
    ? Math.round((overview.completedOnboarding / overview.totalUsers) * 100)
    : 0;
  const averageBookmarks = overview.totalUsers
    ? (overview.totalBookmarks / overview.totalUsers).toFixed(1)
    : "0";
  const engagementData = [
    { name: "24 hours", users: overview.usersActive24h || 0 },
    { name: "7 days", users: overview.usersActive7d || 0 },
    { name: "30 days", users: overview.usersActive30d || 0 },
  ];
  const accountStatusData = [
    { name: "Onboarded", value: overview.completedOnboarding || 0 },
    {
      name: "Pending",
      value: Math.max(
        (overview.totalUsers || 0) - (overview.completedOnboarding || 0),
        0,
      ),
    },
  ];
  const cronJobs = data?.database?.cronJobs || [];

  const metrics = [
    {
      icon: Users,
      label: "Total users",
      value: formatNumber(overview.totalUsers),
      detail: `${formatNumber(overview.usersActive30d)} active in 30 days`,
      accent: "bg-teal-50 text-teal-700",
    },
    {
      icon: Bookmark,
      label: "Bookmarks",
      value: formatNumber(overview.totalBookmarks),
      detail: `${averageBookmarks} average per user`,
      accent: "bg-blue-50 text-blue-700",
    },
    {
      icon: FolderClosed,
      label: "Categories",
      value: formatNumber(overview.totalCategories),
      detail: "Content fields excluded",
      accent: "bg-amber-50 text-amber-700",
    },
    {
      icon: Activity,
      label: "Recorded clicks",
      value: formatNumber(overview.totalClicks),
      detail: `${formatDuration(overview.totalTimeSavedSeconds)} saved`,
      accent: "bg-rose-50 text-rose-700",
    },
    {
      icon: UserCheck,
      label: "Onboarding",
      value: `${onboardingRate}%`,
      detail: `${formatNumber(overview.completedOnboarding)} completed`,
      accent: "bg-emerald-50 text-emerald-700",
    },
    {
      icon: MonitorSmartphone,
      label: "Active sessions",
      value: formatNumber(overview.activeDeviceSessions),
      detail: `${formatNumber(overview.googleAccounts)} Google accounts`,
      accent: "bg-indigo-50 text-indigo-700",
    },
    {
      icon: Bot,
      label: "AI sorts available",
      value: formatNumber(data?.aiUsage?.aiSortsRemaining),
      detail: `${formatNumber(data?.aiUsage?.usersWithoutAiSorts)} users at zero`,
      accent: "bg-cyan-50 text-cyan-700",
    },
    {
      icon: Clock3,
      label: "Time saved",
      value: formatDuration(overview.totalTimeSavedSeconds),
      detail: "Across all user activity",
      accent: "bg-orange-50 text-orange-700",
    },
  ];

  return (
    <main className="h-screen overflow-y-auto bg-[#f5f7f6] text-gray-950">
      <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <img
              src={smallLogoColor}
              alt="Webmark"
              className="h-8 w-8 rounded-md"
            />
            <div>
              <h1 className="text-sm font-semibold text-gray-950">
                Webmark Admin
              </h1>
              <p className="hidden text-xs text-gray-500 sm:block">
                Operational analytics
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-gray-500 md:inline">
              {admin.email}
            </span>
            <button
              type="button"
              onClick={() => setRefreshKey((value) => value + 1)}
              title="Refresh analytics"
              aria-label="Refresh analytics"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-950"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              type="button"
              onClick={handleLogout}
              title="Sign out"
              aria-label="Sign out"
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-600 hover:border-red-200 hover:bg-red-50 hover:text-red-700"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] space-y-5 px-4 py-5 sm:px-6 lg:px-8">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-semibold uppercase text-teal-700">
              System overview
            </p>
            <h2 className="mt-1 text-2xl font-semibold">Database activity</h2>
            <p className="mt-1 text-xs text-gray-500">
              Updated{" "}
              {data?.generatedAt
                ? formatDate(data.generatedAt, true)
                : "on refresh"}
            </p>
          </div>
          <div
            className="flex w-fit rounded-md border border-gray-200 bg-white p-1"
            aria-label="Analytics date range"
          >
            {[30, 90, 365].map((days) => (
              <button
                key={days}
                type="button"
                onClick={() => {
                  setRange(days);
                  setPage(1);
                }}
                className={`h-7 rounded px-3 text-xs font-medium transition ${
                  range === days
                    ? "bg-gray-950 text-white"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {days === 365 ? "1 year" : `${days} days`}
              </button>
            ))}
          </div>
        </div>

        {error && (
          <div className="flex items-center justify-between rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button
              type="button"
              className="font-medium"
              onClick={() => setRefreshKey((value) => value + 1)}
            >
              Retry
            </button>
          </div>
        )}

        <section
          className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4"
          aria-label="Key metrics"
        >
          {metrics.map((metric) => (
            <MetricCard key={metric.label} {...metric} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm xl:col-span-2">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">New records over time</h3>
              <p className="mt-1 text-xs text-gray-500">
                Daily creation counts, content excluded
              </p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={data?.trends || []}
                  margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="usersFill" x1="0" y1="0" x2="0" y2="1">
                      <stop
                        offset="0%"
                        stopColor="#0f766e"
                        stopOpacity={0.28}
                      />
                      <stop
                        offset="100%"
                        stopColor="#0f766e"
                        stopOpacity={0.02}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#eef0f2" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickFormatter={formatTrendDate}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    minTickGap={32}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Legend
                    iconType="circle"
                    wrapperStyle={{ fontSize: 11, paddingTop: 12 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="Users"
                    stroke="#0f766e"
                    fill="url(#usersFill)"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="bookmarks"
                    name="Bookmarks"
                    stroke="#2563eb"
                    fill="transparent"
                    strokeWidth={2}
                  />
                  <Area
                    type="monotone"
                    dataKey="categories"
                    name="Categories"
                    stroke="#e59f0c"
                    fill="transparent"
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-4">
              <h3 className="text-sm font-semibold">Active users</h3>
              <p className="mt-1 text-xs text-gray-500">Last login recency</p>
            </div>
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={engagementData}
                  layout="vertical"
                  margin={{ top: 10, right: 12, left: 4, bottom: 0 }}
                >
                  <CartesianGrid stroke="#eef0f2" horizontal={false} />
                  <XAxis
                    type="number"
                    allowDecimals={false}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <YAxis
                    type="category"
                    dataKey="name"
                    width={60}
                    tick={{ fontSize: 10, fill: "#6b7280" }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<ChartTooltip />} />
                  <Bar
                    dataKey="users"
                    name="Users"
                    fill="#0f766e"
                    radius={[0, 3, 3, 0]}
                    barSize={22}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Device sessions</h3>
            <p className="mt-1 text-xs text-gray-500">
              Active device types only
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.deviceBreakdown || []}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={3}
                  >
                    {(data?.deviceBreakdown || []).map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={CHART_COLORS[index % CHART_COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <h3 className="text-sm font-semibold">Onboarding status</h3>
            <p className="mt-1 text-xs text-gray-500">
              Account setup completion
            </p>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={accountStatusData}
                    dataKey="value"
                    nameKey="name"
                    innerRadius={48}
                    outerRadius={76}
                    paddingAngle={3}
                  >
                    <Cell fill="#2563eb" />
                    <Cell fill="#d1d5db" />
                  </Pie>
                  <Tooltip content={<ChartTooltip />} />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="rounded-lg border border-teal-200 bg-teal-50/60 p-4 shadow-sm">
            <div className="flex items-center gap-2 text-teal-800">
              <ShieldCheck className="h-4 w-4" />
              <h3 className="text-sm font-semibold">Privacy boundary</h3>
            </div>
            <p className="mt-2 text-xs leading-5 text-teal-900/70">
              Bookmark and category collections are queried only for document
              counts and creation-date buckets.
            </p>
            <ul className="mt-4 space-y-2">
              {(data?.privacy?.excludedFields || []).map((field) => (
                <li
                  key={field}
                  className="flex items-start gap-2 text-xs text-teal-950"
                >
                  <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-teal-700" />
                  <span>{field}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <div className="flex items-center gap-2">
                <Database className="h-4 w-4 text-gray-500" />
                <h3 className="text-sm font-semibold">Collection inventory</h3>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Collection</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Documents
                    </th>
                    <th className="px-4 py-2.5 font-medium">
                      Dashboard access
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.database?.collections || []).map((collection) => (
                    <tr key={collection.name}>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {collection.name}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {formatNumber(collection.documents)}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {collection.access}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold">Cron job health</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                Based on latest stats snapshots in database
              </p>
            </div>
            <div className="space-y-3 p-4">
              {cronJobs.map((job) => {
                const statusClass =
                  job.status === "healthy"
                    ? "bg-emerald-50 text-emerald-700"
                    : job.status === "stale"
                      ? "bg-amber-50 text-amber-700"
                      : "bg-rose-50 text-rose-700";

                return (
                  <div
                    key={job.type}
                    className="rounded-md border border-gray-100 bg-gray-50/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold uppercase tracking-wide text-gray-800">
                        {job.type}
                      </p>
                      <span
                        className={`inline-flex rounded px-2 py-1 text-[11px] font-semibold capitalize ${statusClass}`}
                      >
                        {job.status}
                      </span>
                    </div>
                    <p className="mt-2 text-xs text-gray-600">
                      Last run: {formatDate(job.lastUpdatedAt, true)} (
                      {formatRelativeTime(job.lastUpdatedAt)})
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Schedule: {job.schedule}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Snapshots: {formatNumber(job.count)}
                    </p>
                  </div>
                );
              })}

              {!cronJobs.length && (
                <p className="rounded-md border border-amber-100 bg-amber-50 px-3 py-2 text-xs text-amber-700">
                  No cron snapshots found yet.
                </p>
              )}
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm xl:col-span-2">
            <div className="border-b border-gray-100 px-4 py-3">
              <h3 className="text-sm font-semibold">
                Latest aggregate snapshots
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 text-gray-500">
                  <tr>
                    <th className="px-4 py-2.5 font-medium">Date</th>
                    <th className="px-4 py-2.5 font-medium">Type</th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Users
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Bookmarks
                    </th>
                    <th className="px-4 py-2.5 text-right font-medium">
                      Categories
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {(data?.database?.latestSnapshots || []).map(
                    (snapshot, index) => (
                      <tr key={`${snapshot.date}-${snapshot.type}-${index}`}>
                        <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                          {formatDate(snapshot.date)}
                        </td>
                        <td className="px-4 py-3 font-medium capitalize text-gray-900">
                          {snapshot.type}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatNumber(snapshot.users)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatNumber(snapshot.bookmarks)}
                        </td>
                        <td className="px-4 py-3 text-right">
                          {formatNumber(snapshot.categories)}
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex flex-col justify-between gap-3 border-b border-gray-100 px-4 py-3 sm:flex-row sm:items-center">
            <div>
              <h3 className="text-sm font-semibold">Accounts</h3>
              <p className="mt-0.5 text-xs text-gray-500">
                {formatNumber(accounts.total)} matching accounts
              </p>
            </div>
            <label className="relative block w-full sm:w-72">
              <span className="sr-only">Search accounts</span>
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search name, username, or email"
                className="h-9 w-full rounded-md border border-gray-300 pl-9 pr-3 text-xs outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-100"
              />
            </label>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] text-left text-xs">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-4 py-2.5 font-medium">Account</th>
                  <th className="px-4 py-2.5 font-medium">Joined</th>
                  <th className="px-4 py-2.5 font-medium">Last active</th>
                  <th className="px-4 py-2.5 text-right font-medium">Clicks</th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    Time saved
                  </th>
                  <th className="px-4 py-2.5 text-right font-medium">
                    AI sorts
                  </th>
                  <th className="px-4 py-2.5 font-medium">Devices</th>
                  <th className="px-4 py-2.5 font-medium">Onboarding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {accounts.rows.map((account) => (
                  <tr key={account.id} className="hover:bg-gray-50/70">
                    <td className="px-4 py-3">
                      <p className="font-medium text-gray-950">
                        {account.name || account.username}
                      </p>
                      <p className="mt-0.5 text-gray-500">{account.email}</p>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {formatDate(account.joinedAt)}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-gray-600">
                      {formatDate(account.lastLogin, true)}
                    </td>
                    <td className="px-4 py-3 text-right font-medium">
                      {formatNumber(account.totalClicks)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatDuration(account.timeSavedSeconds)}
                    </td>
                    <td className="px-4 py-3 text-right text-gray-600">
                      {formatNumber(account.aiSortsRemaining)}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex items-center gap-1.5 text-gray-600">
                        {account.activeDeviceTypes.includes("mobile") ? (
                          <Smartphone className="h-3.5 w-3.5" />
                        ) : (
                          <Laptop className="h-3.5 w-3.5" />
                        )}
                        {formatNumber(account.activeDeviceCount)}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded px-2 py-1 font-medium ${account.hasCompletedOnboarding ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}
                      >
                        {account.hasCompletedOnboarding
                          ? "Complete"
                          : "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
                {!accounts.rows.length && !loading && (
                  <tr>
                    <td
                      colSpan="8"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      No accounts found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t border-gray-100 px-4 py-3 text-xs text-gray-500">
            <span>
              Page {accounts.page} of {accounts.pages}
            </span>
            <div className="flex gap-1">
              <button
                type="button"
                disabled={accounts.page <= 1 || loading}
                onClick={() => setPage((value) => Math.max(value - 1, 1))}
                title="Previous page"
                aria-label="Previous page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                disabled={accounts.page >= accounts.pages || loading}
                onClick={() =>
                  setPage((value) => Math.min(value + 1, accounts.pages))
                }
                title="Next page"
                aria-label="Next page"
                className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

const Admin = () => {
  const [state, setState] = useState({ status: "checking", admin: null });

  useEffect(() => {
    let active = true;

    adminRequest("/api/admin/session")
      .then((response) => {
        if (active)
          setState({ status: "authenticated", admin: response.admin });
      })
      .catch(() => {
        if (active) setState({ status: "anonymous", admin: null });
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Helmet>
        <title>Admin Console - Webmark</title>
        <meta name="robots" content="noindex, nofollow, noarchive" />
      </Helmet>
      {state.status === "checking" && (
        <main className="flex h-screen items-center justify-center bg-[#f5f7f6]">
          <RefreshCw
            className="h-5 w-5 animate-spin text-teal-700"
            aria-label="Checking admin session"
          />
        </main>
      )}
      {state.status === "anonymous" && (
        <AdminLogin
          onAuthenticated={(admin) =>
            setState({ status: "authenticated", admin })
          }
        />
      )}
      {state.status === "authenticated" && (
        <AdminDashboard
          admin={state.admin}
          onSignedOut={() => setState({ status: "anonymous", admin: null })}
        />
      )}
    </>
  );
};

export default Admin;
