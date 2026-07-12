import { useState, useRef } from "react";
import ResponsiveModal from "../ui/ResponsiveModal";
import { Button } from "../ui/button";
import {
  Upload,
  FolderOpen,
  Loader2,
  CheckSquare,
  Square,
  AlertCircle,
  FileText,
} from "lucide-react";
import { useImportBookmarks } from "../../hooks/useBookmarks";

const parseBookmarksHTML = (htmlString) => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, "text/html");

  const walkDL = (dl) => {
    const folders = [];
    const looseBookmarks = [];

    for (const dt of dl.querySelectorAll(":scope > dt")) {
      const heading = dt.querySelector(":scope > h3");
      const anchor = dt.querySelector(":scope > a");
      const nestedDL = dt.querySelector(":scope > dl");

      if (heading && nestedDL) {
        const children = walkDL(nestedDL);
        const directBookmarks = children.looseBookmarks || [];

        folders.push({
          name: heading.textContent.trim(),
          bookmarks: directBookmarks,
        });

        (children.folders || []).forEach((f) => folders.push(f));
      } else if (anchor) {
        const href = anchor.getAttribute("href") || "";
        if (
          !href ||
          href.startsWith("javascript:") ||
          href.startsWith("place:")
        )
          continue;
        let hostname = "";
        try {
          hostname = new URL(href).hostname;
        } catch {
          /* skip invalid URLs */
        }
        looseBookmarks.push({
          name: anchor.textContent.trim() || hostname || href,
          link: href,
          logo: `https://www.google.com/s2/favicons?domain=${hostname}&sz=128`,
        });
      }
    }
    return { folders, looseBookmarks };
  };

  const topDL = doc.querySelector("dl");
  if (!topDL) return [];

  const { folders, looseBookmarks } = walkDL(topDL);

  if (looseBookmarks.length > 0) {
    folders.unshift({ name: "Imported Bookmarks", bookmarks: looseBookmarks });
  }

  return folders.filter((f) => f.bookmarks.length > 0);
};

const ImportBookmarksDialog = ({
  open,
  onClose,
  importMutation: importMutationProp,
}) => {
  const [folders, setFolders] = useState([]);
  const [selected, setSelected] = useState({});
  const [fileName, setFileName] = useState("");
  const [parseError, setParseError] = useState("");
  const fileInputRef = useRef(null);

  const internalMutation = useImportBookmarks();
  const importMutation = importMutationProp ?? internalMutation;

  const reset = () => {
    setFolders([]);
    setSelected({});
    setFileName("");
    setParseError("");
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setParseError("");
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const parsed = parseBookmarksHTML(ev.target.result);
        if (parsed.length === 0) {
          setParseError(
            "No bookmarks found in this file. Make sure you exported a bookmarks HTML file from Chrome or Firefox.",
          );
          setFolders([]);
          setSelected({});
          return;
        }
        setFolders(parsed);
        const initial = {};
        parsed.forEach((f) => {
          initial[f.name] = true;
        });
        setSelected(initial);
      } catch {
        setParseError(
          "Could not read this file. Please export your bookmarks as HTML from your browser.",
        );
      }
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const toggleAll = () => {
    const allSelected = folders.every((f) => selected[f.name]);
    const next = {};
    folders.forEach((f) => {
      next[f.name] = !allSelected;
    });
    setSelected(next);
  };

  const toggleFolder = (name) => {
    setSelected((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const selectedFolders = folders.filter((f) => selected[f.name]);
  const totalBookmarks = selectedFolders.reduce(
    (sum, f) => sum + f.bookmarks.length,
    0,
  );
  const allSelected =
    folders.length > 0 && folders.every((f) => selected[f.name]);

  const handleImport = async () => {
    if (selectedFolders.length === 0) return;
    await importMutation.mutateAsync(selectedFolders);
    handleClose();
  };

  return (
    <ResponsiveModal
      open={open}
      onClose={handleClose}
      size="lg"
      title={
        <span className="flex items-center gap-2">
          <Upload className="h-5 w-5 text-blue-500" />
          Import Browser Bookmarks
        </span>
      }
      bodyClassName="overflow-hidden flex flex-col"
      footer={
        <div className="flex w-full items-center justify-between gap-3">
          <span className="hidden text-xs text-gray-500 sm:inline">
            {totalBookmarks > 0
              ? `${totalBookmarks} bookmark${totalBookmarks !== 1 ? "s" : ""} will be imported`
              : ""}
          </span>
          <div className="flex w-full gap-2 sm:w-auto">
            <Button
              variant="outline"
              onClick={handleClose}
              size="sm"
              className="flex-1 sm:flex-none"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={totalBookmarks === 0 || importMutation.isPending}
              size="sm"
              className="flex-1 gap-2 bg-blue-500 hover:bg-blue-600 text-white sm:flex-none"
            >
              {importMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Importing…
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Import
                </>
              )}
            </Button>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        <div className="text-sm text-gray-600 bg-blue-50 border border-blue-100 rounded-lg p-3 space-y-1">
          <p className="font-medium text-blue-800">
            How to export your bookmarks:
          </p>
          <p>
            <span className="font-medium">Chrome:</span> Bookmarks menu →
            Bookmark manager → ⋮ → Export bookmarks
          </p>
          <p>
            <span className="font-medium">Firefox:</span> Bookmarks → Manage
            Bookmarks → Import and Backup → Export Bookmarks to HTML
          </p>
        </div>

        <div>
          <input
            type="file"
            accept=".html,.htm"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <Button
            variant="outline"
            className="w-full border-dashed border-2 h-16 flex flex-col gap-1 text-gray-500 hover:text-blue-600 hover:border-blue-400"
            onClick={() => fileInputRef.current?.click()}
          >
            <FileText className="h-5 w-5" />
            <span className="text-xs">
              {fileName ? fileName : "Click to select bookmarks.html"}
            </span>
          </Button>
        </div>

        {parseError && (
          <div className="flex items-start gap-2 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg p-3">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
            <span>{parseError}</span>
          </div>
        )}

        {folders.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-gray-700">
                Select folders to import ({selectedFolders.length} of{" "}
                {folders.length})
              </p>
              <button
                type="button"
                onClick={toggleAll}
                className="text-xs text-blue-600 hover:underline"
              >
                {allSelected ? "Deselect all" : "Select all"}
              </button>
            </div>

            <div className="overflow-y-auto max-h-52 space-y-1 pr-1">
              {folders.map((folder) => (
                <button
                  key={folder.name}
                  type="button"
                  onClick={() => toggleFolder(folder.name)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg border text-left transition-colors ${
                    selected[folder.name]
                      ? "border-blue-200 bg-blue-50"
                      : "border-gray-200 bg-white hover:bg-gray-50"
                  }`}
                >
                  {selected[folder.name] ? (
                    <CheckSquare className="h-4 w-4 text-blue-500 shrink-0" />
                  ) : (
                    <Square className="h-4 w-4 text-gray-400 shrink-0" />
                  )}
                  <FolderOpen className="h-4 w-4 text-amber-400 shrink-0" />
                  <span className="flex-1 text-sm font-medium text-gray-800 truncate">
                    {folder.name}
                  </span>
                  <span className="text-xs text-gray-500 shrink-0">
                    {folder.bookmarks.length} bookmark
                    {folder.bookmarks.length !== 1 ? "s" : ""}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </ResponsiveModal>
  );
};

export default ImportBookmarksDialog;
