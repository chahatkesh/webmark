import { Sparkles, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QuotaRow = ({ label, remaining, total, icon: Icon, hint, unlimited }) => {
  const safeTotal = Math.max(total, 1);
  const used = Math.max(0, safeTotal - remaining);
  const depleted = !unlimited && remaining === 0;
  // Bar shows remaining capacity (full = plenty left)
  const pct = unlimited
    ? 100
    : Math.min(100, Math.round((remaining / safeTotal) * 100));

  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3",
        depleted
          ? "border-amber-100 bg-amber-50/60"
          : "border-gray-100 bg-slate-50/70",
      )}
    >
      <div className="mb-2 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
          <Icon
            className={cn(
              "h-4 w-4",
              depleted ? "text-amber-600" : "text-blue-500",
            )}
          />
          {label}
        </div>
        <span className="text-sm tabular-nums">
          {unlimited ? (
            <span className="font-semibold text-emerald-700">Plenty left</span>
          ) : depleted ? (
            <span className="font-semibold text-amber-700">None left</span>
          ) : (
            <span className="text-gray-700">
              <span className="font-semibold text-gray-900">{remaining}</span>
              <span className="text-gray-400"> remaining</span>
            </span>
          )}
        </span>
      </div>
      {!unlimited && (
        <div className="h-1.5 overflow-hidden rounded-full bg-white/80">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              depleted ? "bg-amber-400" : "bg-blue-500",
            )}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
      <p className="mt-2 text-xs text-gray-500">
        {depleted
          ? "You've used all of these for now"
          : unlimited
            ? hint
            : `${hint}${used > 0 ? ` · ${used} of ${safeTotal} used` : ` · ${safeTotal} included`}`}
      </p>
    </div>
  );
};

const AI_SORTS_DEFAULT = 5;
const IMPORTS_CAP = 2;
/** Treat very high balances as effectively unlimited for display */
const UNLIMITED_THRESHOLD = 100;

const CreditsCard = ({ profile, loading }) => {
  const aiSorts = profile?.aiSortsRemaining ?? 0;
  const importsLeft = profile?.importsRemainingThisMonth ?? 0;
  const aiUnlimited = aiSorts >= UNLIMITED_THRESHOLD;
  const aiTotal = Math.max(AI_SORTS_DEFAULT, aiSorts);
  const importTotal = IMPORTS_CAP;

  return (
    <Card className="border-gray-100 shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Credits</CardTitle>
        <CardDescription>What you can still use</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          <>
            <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
            <div className="h-16 animate-pulse rounded-xl bg-gray-100" />
          </>
        ) : (
          <>
            <QuotaRow
              label="AI sorts"
              remaining={aiSorts}
              total={aiTotal}
              icon={Sparkles}
              hint="One-click library organize"
              unlimited={aiUnlimited}
            />
            <QuotaRow
              label="Imports"
              remaining={importsLeft}
              total={importTotal}
              icon={Upload}
              hint="Browser export imports this month"
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default CreditsCard;
