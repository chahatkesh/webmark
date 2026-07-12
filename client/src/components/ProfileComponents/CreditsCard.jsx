import { Sparkles, Upload } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const QuotaRow = ({ label, remaining, total, icon: Icon, hint }) => {
  const safeRemaining = Math.max(0, Number(remaining) || 0);
  const safeTotal = Math.max(total, 1);
  const depleted = safeRemaining === 0;
  const used = Math.max(0, safeTotal - safeRemaining);
  const showUsage = used > 0 && safeRemaining <= safeTotal;

  return (
    <div
      className={cn(
        "rounded-xl border px-3.5 py-3",
        depleted
          ? "border-amber-100 bg-amber-50/60"
          : "border-gray-100 bg-slate-50/70",
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 text-sm font-medium text-gray-800">
            <Icon
              className={cn(
                "h-4 w-4 shrink-0",
                depleted ? "text-amber-600" : "text-blue-500",
              )}
            />
            <span className="truncate">{label}</span>
          </div>
          <p className="mt-1.5 text-xs leading-snug text-gray-500 sm:mt-2">
            {depleted
              ? "You've used all of these for now"
              : showUsage
                ? `${hint} · ${used} of ${safeTotal} used`
                : hint}
          </p>
        </div>
        <div className="shrink-0 pt-0.5 text-right">
          <p
            className={cn(
              "text-lg font-semibold tabular-nums leading-none sm:text-xl",
              depleted ? "text-amber-700" : "text-gray-900",
            )}
          >
            {safeRemaining}
          </p>
          <p className="mt-0.5 text-[11px] text-gray-400">left</p>
        </div>
      </div>
    </div>
  );
};

const AI_SORTS_DEFAULT = 5;
const IMPORTS_CAP = 2;

const CreditsCard = ({ profile, loading }) => {
  const aiSorts = profile?.aiSortsRemaining ?? 0;
  const importsLeft = profile?.importsRemainingThisMonth ?? 0;

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
              total={AI_SORTS_DEFAULT}
              icon={Sparkles}
              hint="One-click library organize"
            />
            <QuotaRow
              label="Imports"
              remaining={importsLeft}
              total={IMPORTS_CAP}
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
