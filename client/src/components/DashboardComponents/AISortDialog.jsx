import { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "../ui/dialog";
import { Button } from "../ui/button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Tag,
  HardDrive,
} from "lucide-react";

const STAGES = [
  { label: "Collecting your bookmarks",       icon: BookOpen,   pct: 12 },
  { label: "Building a smart taxonomy",        icon: Layers,     pct: 38 },
  { label: "Assigning bookmarks to categories",icon: Tag,        pct: 72 },
  { label: "Saving changes to your library",   icon: HardDrive,  pct: 92 },
];

// Approximate real delays matching server work (Pass 1 ~ 5s, Pass 2 batches ~ 10s+)
const STAGE_DELAYS_MS = [0, 4000, 10000, 22000];

/**
 * AISortDialog
 * Props:
 *   open        – boolean
 *   onClose()   – called to dismiss
 *   onConfirm() – calls the mutation
 *   isSorting   – boolean from mutation isPending
 *   results     – { totalBookmarks, taxonomy, bookmarksMoved } | null
 *   sortError   – Error | null
 *   onReset()   – resets mutation state
 */
const AISortDialog = ({
  open,
  onClose,
  onConfirm,
  isSorting,
  results,
  sortError,
  onReset,
}) => {
  const [stageIdx, setStageIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const timersRef = useRef([]);

  // Start stage animation when sorting begins
  useEffect(() => {
    if (isSorting) {
      setStageIdx(0);
      setProgress(STAGES[0].pct);

      STAGE_DELAYS_MS.slice(1).forEach((delay, i) => {
        const id = setTimeout(() => {
          setStageIdx(i + 1);
          setProgress(STAGES[i + 1].pct);
        }, delay);
        timersRef.current.push(id);
      });

      return () => {
        timersRef.current.forEach(clearTimeout);
        timersRef.current = [];
      };
    }
  }, [isSorting]);

  // Jump to 100% on success
  useEffect(() => {
    if (results) {
      timersRef.current.forEach(clearTimeout);
      setProgress(100);
      setStageIdx(STAGES.length);
    }
  }, [results]);

  const handleClose = () => {
    if (isSorting) return; // block dismiss while running
    setStageIdx(-1);
    setProgress(0);
    onReset();
    onClose();
  };

  const handleConfirm = () => {
    setStageIdx(0);
    setProgress(STAGES[0].pct);
    onConfirm();
  };

  // ─── Phase: done ────────────────────────────────────────────────────────────
  if (results) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle2 className="h-5 w-5" />
              Sort complete
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-3 gap-3 text-center">
              <Stat label="Bookmarks" value={results.totalBookmarks} />
              <Stat label="Categories" value={results.taxonomy?.length ?? "—"} />
              <Stat label="Moved" value={results.bookmarksMoved} />
            </div>
            <p className="text-sm text-gray-500 text-center">
              Your library has been reorganized by AI.
            </p>
          </div>
          <div className="flex justify-end">
            <Button onClick={handleClose}>Done</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Phase: error ────────────────────────────────────────────────────────────
  if (sortError) {
    return (
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-5 w-5" />
              Sort failed
            </DialogTitle>
            <DialogDescription>
              {sortError.message || "An unexpected error occurred."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                onReset();
                setStageIdx(-1);
                setProgress(0);
                handleConfirm();
              }}>
              Retry
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Phase: sorting ──────────────────────────────────────────────────────────
  if (isSorting || stageIdx >= 0) {
    const currentStage = STAGES[Math.min(stageIdx, STAGES.length - 1)];
    const CurrentIcon = currentStage?.icon ?? Sparkles;

    return (
      <Dialog open={open} onOpenChange={() => {}}>
        <DialogContent
          className="sm:max-w-md [&>button]:hidden"
          onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
              AI sorting in progress
            </DialogTitle>
            <DialogDescription>
              Please don&apos;t close this tab — this may take 20–40 seconds.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Progress bar */}
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-1.5 bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
                style={{ width: `${progress}%` }}
              />
            </div>

            {/* Stage list */}
            <ul className="space-y-2.5">
              {STAGES.map((stage, i) => {
                const Icon = stage.icon;
                const done = i < stageIdx;
                const active = i === stageIdx;
                const future = i > stageIdx;

                return (
                  <li
                    key={stage.label}
                    className={`flex items-center gap-3 text-sm transition-opacity duration-300 ${
                      future ? "opacity-30" : "opacity-100"
                    }`}>
                    <span
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                        done
                          ? "border-green-200 bg-green-50 text-green-600"
                          : active
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                      }`}>
                      {done ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : (
                        <Icon
                          className={`h-4 w-4 ${active ? "animate-pulse" : ""}`}
                        />
                      )}
                    </span>
                    <span
                      className={
                        done
                          ? "text-gray-400 line-through"
                          : active
                          ? "font-medium text-gray-900"
                          : "text-gray-400"
                      }>
                      {stage.label}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // ─── Phase: confirm ──────────────────────────────────────────────────────────
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500" />
            AI Smart Sort
          </DialogTitle>
          <DialogDescription>
            Reorganize all your bookmarks into smart categories using AI.
          </DialogDescription>
        </DialogHeader>

        <ul className="space-y-1.5 text-sm text-gray-600 py-1">
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-500">•</span>
            Analyzes titles to build a coherent category set
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-500">•</span>
            Creates, merges, or renames categories as needed
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-0.5 text-blue-500">•</span>
            Empty categories are removed automatically
          </li>
        </ul>

        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
          This will reorganize your entire library. The process takes 20–40 seconds.
        </p>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleConfirm} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Start sorting
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

export default AISortDialog;
