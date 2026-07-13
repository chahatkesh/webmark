import { useEffect, useRef, useState } from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  BookOpen,
  Layers,
  Tag,
  HardDrive,
  Undo2,
  FolderOpen,
  Inbox,
} from "lucide-react";

const STAGES = [
  { label: "Collecting your bookmarks", icon: BookOpen, pct: 12 },
  { label: "Building a smart taxonomy", icon: Layers, pct: 38 },
  { label: "Assigning bookmarks to categories", icon: Tag, pct: 72 },
  { label: "Saving changes to your library", icon: HardDrive, pct: 92 },
];

const STAGE_DELAYS_MS = [0, 4000, 10000, 22000];

const AISortDialog = ({
  open,
  onClose,
  onConfirm,
  uncategorizedCount = 0,
  isSorting,
  results,
  sortError,
  onReset,
  onRevert,
  isReverting,
}) => {
  const [stageIdx, setStageIdx] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [sortMode, setSortMode] = useState("all");
  const timersRef = useRef([]);

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

  useEffect(() => {
    if (results) {
      timersRef.current.forEach(clearTimeout);
      setProgress(100);
      setStageIdx(STAGES.length);
    }
  }, [results]);

  const handleClose = () => {
    if (isSorting) return;
    setStageIdx(-1);
    setProgress(0);
    setSortMode("all");
    onReset();
    onClose();
  };

  const handleConfirm = () => {
    setStageIdx(0);
    setProgress(STAGES[0].pct);
    onConfirm(sortMode);
  };

  const isProgressPhase = isSorting || stageIdx >= 0;

  if (results) {
    return (
      <ResponsiveModal
        open={open}
        onClose={handleClose}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-green-600">
            <CheckCircle2 className="h-5 w-5" />
            Sort complete
          </span>
        }
        footer={
          <div className="flex w-full items-center justify-between gap-2">
            {results.canRevert && (
              <Button
                variant="outline"
                onClick={() => {
                  onRevert();
                  handleClose();
                }}
                disabled={isReverting}
                className="gap-2 text-amber-600 border-amber-200 hover:bg-amber-50"
              >
                <Undo2 className="h-4 w-4" />
                {isReverting ? "Reverting…" : "Undo Sort"}
              </Button>
            )}
            <Button onClick={handleClose} className="ml-auto">
              Done
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 text-center">
            <Stat label="Bookmarks" value={results.totalBookmarks} />
            <Stat label="Categories" value={results.taxonomy?.length ?? "—"} />
            <Stat label="Moved" value={results.bookmarksMoved} />
          </div>
          <p className="text-sm text-gray-500 text-center">
            {results.sortMode === "uncategorized"
              ? "Uncategorized bookmarks have been placed into matching categories."
              : "Your library has been reorganized by AI."}
          </p>
        </div>
      </ResponsiveModal>
    );
  }

  if (sortError) {
    return (
      <ResponsiveModal
        open={open}
        onClose={handleClose}
        size="sm"
        title={
          <span className="flex items-center gap-2 text-red-600">
            <AlertCircle className="h-5 w-5" />
            Sort failed
          </span>
        }
        description={sortError.message || "An unexpected error occurred."}
        footer={
          <>
            <Button variant="outline" onClick={handleClose}>
              Close
            </Button>
            <Button
              onClick={() => {
                onReset();
                setStageIdx(-1);
                setProgress(0);
                handleConfirm();
              }}
            >
              Retry
            </Button>
          </>
        }
      />
    );
  }

  if (isProgressPhase) {
    return (
      <ResponsiveModal
        open={open}
        onClose={handleClose}
        size="sm"
        preventClose
        hideClose
        title={
          <span className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-blue-500 animate-pulse" />
            AI sorting in progress
          </span>
        }
        description="Please don't close this tab — this may take 20–40 seconds."
        onInteractOutside={(e) => e.preventDefault()}
      >
        <div className="space-y-5">
          <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-1.5 bg-blue-500 rounded-full transition-all duration-1000 ease-in-out"
              style={{ width: `${progress}%` }}
            />
          </div>

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
                  }`}
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border ${
                      done
                        ? "border-green-200 bg-green-50 text-green-600"
                        : active
                          ? "border-blue-200 bg-blue-50 text-blue-600"
                          : "border-gray-200 bg-gray-50 text-gray-400"
                    }`}
                  >
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
                    }
                  >
                    {stage.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </ResponsiveModal>
    );
  }

  const sortOptions = [
    {
      id: "all",
      title: "Sort all",
      description:
        "Reorganize your entire library — builds new categories and moves every bookmark.",
      icon: FolderOpen,
      disabled: false,
    },
    {
      id: "uncategorized",
      title: "Sort Uncategorized",
      description:
        uncategorizedCount > 0
          ? `Place ${uncategorizedCount} bookmark${uncategorizedCount !== 1 ? "s" : ""} from Uncategorized into matching categories.`
          : "No bookmarks in Uncategorized right now.",
      icon: Inbox,
      disabled: uncategorizedCount === 0,
    },
  ];

  return (
    <ResponsiveModal
      open={open}
      onClose={handleClose}
      size="sm"
      title={
        <span className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-500" />
          AI Smart Sort
        </span>
      }
      description="Choose how you want AI to organize your bookmarks."
      footer={
        <div className="flex w-full flex-row items-center justify-between gap-2">
          <div>
            {localStorage.getItem("canRevertAISort") === "true" && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onRevert();
                  handleClose();
                }}
                disabled={isReverting}
                className="gap-1.5 text-amber-600 hover:text-amber-700 hover:bg-amber-50"
              >
                <Undo2 className="h-3.5 w-3.5" />
                {isReverting ? "Reverting…" : "Undo last sort"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              onClick={handleConfirm}
              disabled={
                sortMode === "uncategorized" && uncategorizedCount === 0
              }
              className="gap-2"
            >
              <Sparkles className="h-4 w-4" />
              Start sorting
            </Button>
          </div>
        </div>
      }
    >
      <div className="space-y-3">
        {sortOptions.map((option) => {
          const Icon = option.icon;
          const selected = sortMode === option.id;

          return (
            <button
              key={option.id}
              type="button"
              disabled={option.disabled}
              onClick={() => setSortMode(option.id)}
              className={`w-full rounded-xl border p-4 text-left transition-all ${
                option.disabled
                  ? "cursor-not-allowed border-gray-100 bg-gray-50 opacity-60"
                  : selected
                    ? "border-blue-300 bg-blue-50 ring-2 ring-blue-200"
                    : "border-gray-200 bg-white hover:border-blue-200 hover:bg-blue-50/40"
              }`}
            >
              <div className="flex items-start gap-3">
                <span
                  className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                    selected
                      ? "bg-blue-100 text-blue-600"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                </span>
                <div className="min-w-0">
                  <p className="font-medium text-gray-900">{option.title}</p>
                  <p className="mt-1 text-sm text-gray-500">
                    {option.description}
                  </p>
                </div>
              </div>
            </button>
          );
        })}

        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-md px-3 py-2">
          {sortMode === "uncategorized"
            ? "Only Uncategorized bookmarks will be moved. Existing categories stay as they are."
            : "This will reorganize your entire library. The process takes 20–40 seconds."}
        </p>
      </div>
    </ResponsiveModal>
  );
};

const Stat = ({ label, value }) => (
  <div className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-3">
    <p className="text-2xl font-bold text-gray-900">{value}</p>
    <p className="text-xs text-gray-500 mt-0.5">{label}</p>
  </div>
);

export default AISortDialog;
