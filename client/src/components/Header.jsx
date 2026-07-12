import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { useAuth } from "../context/AuthContext";
import {
  User,
  X,
  Search as SearchIcon,
  Zap,
  Plus,
  Wand2,
  Upload,
  LogOut,
  FolderOpen,
  Bookmark,
  ArrowLeft,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { assets } from "../assets/assests";
import { toast } from "react-toastify";
import ConfirmLogoutDialog from "./DashboardComponents/ConfirmLogoutDialog";

const dispatchDashboardAction = (action) => {
  window.dispatchEvent(
    new CustomEvent("dashboardAction", { detail: { action } }),
  );
};

const isTypingTarget = (target) => {
  if (!(target instanceof HTMLElement)) return false;
  const tag = target.tagName;
  return (
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT" ||
    target.isContentEditable
  );
};

const useIsDesktop = () => {
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== "undefined"
      ? window.matchMedia("(min-width: 768px)").matches
      : true,
  );

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return isDesktop;
};

const formatCreditCount = (count) => (count > 99 ? "99+" : String(count));

const creditTone = (count) => {
  if (count <= 0) return "text-red-500";
  if (count <= 2) return "text-amber-600";
  return "text-gray-400";
};

const creditBadgeTone = (count) => {
  if (count <= 0) return "bg-red-100 text-red-600";
  if (count <= 2) return "bg-amber-100 text-amber-700";
  return "bg-gray-100 text-gray-600";
};

const Header = () => {
  const isDesktop = useIsDesktop();
  const [searchTerm, setSearchTerm] = useState(
    () => sessionStorage.getItem("bookmarkSearchTerm") || "",
  );
  const [resultCount, setResultCount] = useState(null);
  const [categoryMatches, setCategoryMatches] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [sortsLeft, setSortsLeft] = useState(() =>
    parseInt(localStorage.getItem("aiSortsRemaining") ?? "5", 10),
  );
  const [importsLeft, setImportsLeft] = useState(() =>
    parseInt(localStorage.getItem("importsRemainingThisMonth") ?? "2", 10),
  );
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const searchRef = useRef(null);
  const suggestionsRef = useRef(null);
  const { user } = useContext(StoreContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isDashboard = location.pathname.includes("dashboard");
  const isProfile = location.pathname.includes("profile");
  const isBookmarklet = location.pathname.includes("bookmarklet");

  const pageLabel = isProfile
    ? "Profile"
    : isBookmarklet
      ? "Bookmarklet"
      : null;

  const displayName = user?.username || user?.name || user?.email || "User";
  const initials = displayName
    .split(/[\s@._-]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");

  const focusSearch = () => {
    searchRef.current?.focus();
    searchRef.current?.select?.();
  };

  const clearSearch = () => {
    setSearchTerm("");
    setShowSuggestions(false);
  };

  useEffect(() => {
    if (!isDashboard) {
      setResultCount(null);
      setCategoryMatches([]);
      return;
    }

    sessionStorage.setItem("bookmarkSearchTerm", searchTerm);
    window.dispatchEvent(
      new CustomEvent("searchTermChanged", {
        detail: { searchTerm },
      }),
    );
  }, [searchTerm, isDashboard]);

  useEffect(() => {
    const onResults = (event) => {
      setResultCount(event.detail?.count ?? null);
      setCategoryMatches(event.detail?.matchingCategories ?? []);
    };
    const onFocusSearch = () => focusSearch();
    const onClearSearch = () => clearSearch();

    window.addEventListener("searchResultsUpdated", onResults);
    window.addEventListener("focusBookmarkSearch", onFocusSearch);
    window.addEventListener("clearBookmarkSearch", onClearSearch);
    return () => {
      window.removeEventListener("searchResultsUpdated", onResults);
      window.removeEventListener("focusBookmarkSearch", onFocusSearch);
      window.removeEventListener("clearBookmarkSearch", onClearSearch);
    };
  }, []);

  useEffect(() => {
    const syncLimits = () => {
      setSortsLeft(
        parseInt(localStorage.getItem("aiSortsRemaining") ?? "5", 10),
      );
      setImportsLeft(
        parseInt(localStorage.getItem("importsRemainingThisMonth") ?? "2", 10),
      );
    };

    window.addEventListener("storage", syncLimits);
    window.addEventListener("limitsUpdated", syncLimits);
    return () => {
      window.removeEventListener("storage", syncLimits);
      window.removeEventListener("limitsUpdated", syncLimits);
    };
  }, []);

  useEffect(() => {
    const onKeyDown = (event) => {
      const meta = event.metaKey || event.ctrlKey;
      const typing = isTypingTarget(event.target);

      if (meta && event.key.toLowerCase() === "k") {
        if (!isDashboard) return;
        event.preventDefault();
        focusSearch();
        return;
      }

      if (event.key === "Escape") {
        if (showSuggestions) {
          setShowSuggestions(false);
          return;
        }
        if (document.activeElement === searchRef.current) {
          if (searchTerm) clearSearch();
          else searchRef.current?.blur();
        }
        return;
      }

      if (typing) return;

      if (event.key === "/" && isDashboard) {
        event.preventDefault();
        focusSearch();
        return;
      }

      if (event.key.toLowerCase() === "n" && isDashboard && !event.shiftKey) {
        event.preventDefault();
        dispatchDashboardAction("addCategory");
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isDashboard, searchTerm, showSuggestions]);

  useEffect(() => {
    const onPointerDown = (event) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(event.target) &&
        event.target !== searchRef.current
      ) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
    } catch {
      toast.error("Error logging out");
    }
  };

  const jumpToCategory = (categoryId) => {
    setShowSuggestions(false);
    const el = document.getElementById(`category-${categoryId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
      el.classList.add("ring-2", "ring-blue-400", "ring-offset-2");
      window.setTimeout(() => {
        el.classList.remove("ring-2", "ring-blue-400", "ring-offset-2");
      }, 1200);
    }
  };

  const showCount = isDashboard && searchTerm.trim() && resultCount !== null;
  const countLabel = resultCount === 0 ? "No results" : `${resultCount} found`;

  const avatarButton = (
    <button
      type="button"
      className={
        isDesktop
          ? "ml-1 h-8 w-8 overflow-hidden rounded-full border border-gray-200 bg-gray-100 transition hover:ring-2 hover:ring-blue-500/25 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40"
          : "ml-0.5 h-8 w-8 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100"
      }
      aria-label="Account menu"
    >
      {user?.profilePicture ? (
        <img
          src={user.profilePicture}
          alt=""
          referrerPolicy="no-referrer"
          className="h-full w-full object-cover"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.removeAttribute("src");
            e.currentTarget.style.display = "none";
            const fallback = e.currentTarget.nextElementSibling;
            if (fallback) fallback.hidden = false;
          }}
        />
      ) : null}
      <span
        hidden={!!user?.profilePicture}
        className="flex h-full w-full items-center justify-center text-[11px] font-semibold text-gray-600"
      >
        {initials || "U"}
      </span>
    </button>
  );

  const accountMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{avatarButton}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium text-gray-900">
              {displayName}
            </span>
            {user?.email && user?.username && (
              <span className="text-xs text-gray-500">{user.email}</span>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onSelect={() => navigate("/user/profile")}
        >
          <User className="h-4 w-4" />
          Profile
        </DropdownMenuItem>
        <DropdownMenuItem
          className="cursor-pointer gap-2"
          onSelect={() => navigate("/user/bookmarklet")}
        >
          <Zap className="h-4 w-4" />
          Bookmarklet
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer gap-2 text-red-600 focus:text-red-600"
          onSelect={(event) => {
            event.preventDefault();
            setIsLogoutDialogOpen(true);
          }}
        >
          <LogOut className="h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const searchField = (
    <div
      className={`relative ${isDesktop ? "" : "min-w-0 flex-1"}`}
      ref={suggestionsRef}
    >
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <input
        ref={searchRef}
        type="text"
        value={searchTerm}
        onChange={(e) => {
          setSearchTerm(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
        placeholder="Search bookmarks…"
        className="h-9 w-full rounded-lg border border-gray-200 bg-gray-50/80 pl-9 pr-[4.75rem] text-sm text-gray-900 outline-none transition-colors placeholder:text-gray-400 hover:border-gray-300 hover:bg-white focus:border-blue-500 focus:bg-white focus:ring-0"
        aria-label="Search bookmarks"
        aria-keyshortcuts="Meta+K Control+K"
      />
      <div className="absolute right-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
        {showCount && (
          <span
            className={`text-[11px] font-medium text-gray-400 ${
              isDesktop ? "" : "max-[380px]:hidden"
            }`}
          >
            {countLabel}
          </span>
        )}
        {searchTerm ? (
          <button
            type="button"
            onClick={clearSearch}
            className="rounded p-0.5 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        ) : isDesktop ? (
          <kbd className="rounded border border-gray-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-gray-400">
            ⌘K
          </kbd>
        ) : null}
      </div>

      {showSuggestions && searchTerm.trim() && categoryMatches.length > 0 && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-xl border border-gray-200 bg-white py-1 shadow-lg">
          <p className="px-3 py-1.5 text-[11px] font-medium uppercase tracking-wide text-gray-400">
            Jump to category
          </p>
          {categoryMatches.slice(0, 5).map((match) => (
            <button
              key={match.id}
              type="button"
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-gray-700 hover:bg-gray-50"
              onClick={() => jumpToCategory(match.id)}
            >
              <FolderOpen className="h-4 w-4 shrink-0 text-gray-400" />
              <span className="truncate">
                {match.emoji ? `${match.emoji} ` : ""}
                {match.name}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );

  const showSortCreditHint = sortsLeft <= 3;
  const sortCreditLabel = formatCreditCount(sortsLeft);

  const desktopToolButtons = (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={sortsLeft <= 0}
        title={
          sortsLeft <= 0
            ? "No AI Sort credits left. Import bookmarks to earn more."
            : `AI Sort · ${sortsLeft} credit${sortsLeft !== 1 ? "s" : ""} left`
        }
        onClick={() => dispatchDashboardAction("aiSort")}
        className="h-8 gap-1.5 px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label={`AI Sort, ${sortsLeft} credit${sortsLeft !== 1 ? "s" : ""} left`}
      >
        <Wand2 className="h-3.5 w-3.5" />
        <span className="text-[13px] font-medium">AI Sort</span>
        {showSortCreditHint && (
          <span
            className={`text-[11px] font-semibold tabular-nums ${creditTone(sortsLeft)}`}
          >
            {sortCreditLabel}
          </span>
        )}
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        disabled={importsLeft <= 0}
        title={
          importsLeft <= 0
            ? "Import limit reached for this month."
            : `Import · ${importsLeft} left this month`
        }
        onClick={() => dispatchDashboardAction("import")}
        className="h-8 gap-1.5 px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        aria-label="Import"
      >
        <Upload className="h-3.5 w-3.5" />
        <span className="text-[13px] font-medium">Import</span>
      </Button>
    </>
  );

  const mobileToolsMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="relative h-8 w-8 shrink-0 px-0 text-gray-600"
          aria-label="Tools"
          title="Tools"
        >
          <MoreHorizontal className="h-4 w-4" />
          {showSortCreditHint && (
            <span
              className={`absolute -right-0.5 -top-0.5 flex h-3.5 min-w-3.5 items-center justify-center rounded-full px-0.5 text-[9px] font-semibold leading-none ${creditBadgeTone(sortsLeft)}`}
            >
              {sortCreditLabel}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs font-medium text-gray-500">
          Tools
        </DropdownMenuLabel>
        <DropdownMenuItem
          disabled={sortsLeft <= 0}
          className="cursor-pointer gap-2"
          onSelect={() => dispatchDashboardAction("aiSort")}
        >
          <Wand2 className="h-4 w-4" />
          <span className="flex-1">AI Sort</span>
          <span className={`text-xs tabular-nums ${creditTone(sortsLeft)}`}>
            {sortCreditLabel}
          </span>
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={importsLeft <= 0}
          className="cursor-pointer gap-2"
          onSelect={() => dispatchDashboardAction("import")}
        >
          <Upload className="h-4 w-4" />
          <span className="flex-1">Import</span>
          <span className="text-xs tabular-nums text-gray-400">
            {formatCreditCount(importsLeft)}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const addCategoryButton = (
    <Button
      type="button"
      size="sm"
      onClick={() => dispatchDashboardAction("addCategory")}
      className={
        !isDesktop
          ? "h-8 shrink-0 gap-1 rounded-lg border border-blue-200 bg-blue-50 px-2 text-blue-600 shadow-none hover:bg-blue-100 hover:text-blue-700"
          : "h-8 gap-1 rounded-lg bg-blue-500 px-2.5 text-[13px] font-medium text-white shadow-none hover:bg-blue-600"
      }
      aria-label="Add category"
      title="Add category (N)"
    >
      <Plus className="h-3.5 w-3.5" strokeWidth={2.25} />
      <span className="text-[12px] font-medium sm:text-[13px]">Category</span>
    </Button>
  );

  if (!isDesktop) {
    return (
      <>
        <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
          <div className="flex h-14 items-center gap-1.5 px-3">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="flex shrink-0 items-center"
              aria-label="Webmark home"
            >
              <img
                src={assets.small_logo_color}
                alt=""
                className="h-7 w-auto"
              />
            </button>

            {isDashboard ? (
              searchField
            ) : (
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <button
                  type="button"
                  onClick={() => navigate("/user/dashboard")}
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-900"
                  aria-label="Back to bookmarks"
                >
                  <ArrowLeft className="h-4 w-4" />
                </button>
                {pageLabel && (
                  <span className="truncate text-sm font-semibold text-gray-900">
                    {pageLabel}
                  </span>
                )}
              </div>
            )}

            {isDashboard && (
              <>
                {mobileToolsMenu}
                {addCategoryButton}
              </>
            )}

            {accountMenu}
          </div>
        </header>
        <ConfirmLogoutDialog
          open={isLogoutDialogOpen}
          onClose={() => setIsLogoutDialogOpen(false)}
          onConfirm={handleLogout}
        />
      </>
    );
  }

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 border-b border-gray-200/80 bg-white/95 backdrop-blur-md">
        <div className="grid h-14 grid-cols-[1fr_auto_1fr] items-center gap-3 px-4 sm:px-6 lg:px-8">
          <div className="justify-self-start">
            <button
              type="button"
              onClick={() => navigate("/user/dashboard")}
              className="flex items-center gap-2.5"
              aria-label="Webmark home"
            >
              <img
                src={assets.small_logo_color}
                alt=""
                className="h-7 w-auto"
              />
              <span className="text-[15px] font-semibold tracking-tight text-gray-900">
                Webmark
              </span>
            </button>
          </div>

          <div className="flex w-[28rem] max-w-[calc(100vw-28rem)] items-center justify-center">
            {isDashboard ? (
              searchField
            ) : pageLabel ? (
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-900">
                  {pageLabel}
                </p>
                <p className="text-xs text-gray-400">
                  {isProfile
                    ? "Your library at a glance"
                    : "One-click save from any page"}
                </p>
              </div>
            ) : null}
          </div>

          <div className="justify-self-end">
            <div className="flex items-center gap-1">
              {isDashboard ? (
                <>
                  {desktopToolButtons}
                  <div className="mx-1 h-4 w-px bg-gray-200" />
                  {addCategoryButton}
                </>
              ) : (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate("/user/dashboard")}
                  className="h-8 gap-1.5 px-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                >
                  <Bookmark className="h-3.5 w-3.5" />
                  <span className="text-[13px] font-medium">My Bookmarks</span>
                </Button>
              )}
              {accountMenu}
            </div>
          </div>
        </div>
      </header>
      <ConfirmLogoutDialog
        open={isLogoutDialogOpen}
        onClose={() => setIsLogoutDialogOpen(false)}
        onConfirm={handleLogout}
      />
    </>
  );
};

export default Header;
