import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import { useAuth } from "../hooks/useAuth";
import {
  Wrench,
  HelpCircle,
  Settings,
  LogOut,
  User,
  Keyboard,
  FileDown,
  UserPlus,
  Menu,
  X,
  ChevronDown,
  Lock,
  Bookmark,
  Search as SearchIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Loader from "../components/Loader";
import { assets } from "../assets/assests";
import ShareModal from "./DashboardComponents/ShareModel";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(() => {
    // Initialize search term from sessionStorage if available
    return sessionStorage.getItem("bookmarkSearchTerm") || "";
  });
  const { user } = useContext(StoreContext);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Loading state
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  const isActive = (route) => location.pathname.includes(route);

  const navigationItems = [
    { path: "dashboard", label: "My Bookmarks", icon: Bookmark },
    { path: "more-tools", label: "Tools", icon: Wrench },
    { path: "how-to-use", label: "Help", icon: HelpCircle },
  ];

  // Forward search term to dashboard when on bookmark page
  useEffect(() => {
    if (location.pathname.includes("dashboard")) {
      // Store in sessionStorage for the BookmarkList component to access
      sessionStorage.setItem("bookmarkSearchTerm", searchTerm);

      // Dispatch a custom event to notify BookmarkList component
      const searchEvent = new CustomEvent("searchTermChanged", {
        detail: { searchTerm },
      });
      window.dispatchEvent(searchEvent);
    }
  }, [searchTerm, location.pathname]);

  const userMenuItems = [
    {
      label: "My Profile",
      icon: User,
      onClick: () => navigate("/user/profile"),
    },
    {
      label: "Add Bookmark",
      icon: Bookmark,
      onClick: () => navigate("/user/dashboard"),
    },
    null, // Separator
    {
      label: "Settings",
      icon: Settings,
      comingSoon: true,
      onClick: () => {}, // Placeholder for future functionality
    },
    {
      label: "Shortcuts",
      icon: Keyboard,
      shortcut: "⌘K",
      comingSoon: true,
      onClick: () => {}, // Placeholder for future functionality
    },
    null, // Separator
    {
      label: "Export PDF",
      icon: FileDown,
      comingSoon: true,
      onClick: () => {}, // Placeholder for future functionality
    },
    {
      label: "Invite Friend",
      icon: UserPlus,
      onClick: () => setIsShareModalOpen(true),
    },
    null, // Separator
    {
      label: "Logout",
      icon: LogOut,
      onClick: logout,
      danger: true,
    },
  ];

  if (loading) return <Loader />;

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-16 px-4 md:px-6">
          {/* Logo and Welcome Message */}
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>

            <a href="/" className="flex items-center gap-2">
              <img
                src={assets.small_logo_color}
                alt="Logo"
                className="h-7 w-auto"
              />
            </a>

            <div className="hidden md:block">
              <p className="text-sm text-gray-600">
                Welcome back,{" "}
                <span className="font-medium text-gray-900">
                  {user?.username || user?.email || "User"}
                </span>
              </p>
            </div>
          </div>

          {/* Search Bar - Enhanced */}
          {location.pathname.includes("dashboard") && (
            <div className="relative hidden md:block flex-1 max-w-md">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search bookmarks by name or URL..."
                className="w-full h-10 pl-10 pr-10 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 hover:bg-white transition-colors"
                aria-label="Search bookmarks"
              />
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          )}

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant={isActive(item.path) ? "secondary" : "ghost"}
                  className={cn(
                    "gap-2",
                    isActive(item.path) && "bg-gray-100 text-gray-900"
                  )}
                  onClick={() => navigate(`/user/${item.path}`)}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>

          {/* User Menu */}
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="gap-2 font-normal">
                  <div className="relative h-8 w-8 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex items-center gap-3 p-3">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-medium text-lg">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="flex flex-col min-w-0">
                    <span className="font-medium truncate">
                      {user?.username}
                    </span>
                    <span className="text-xs text-gray-500 truncate">
                      {user?.email}
                    </span>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {userMenuItems.map((item, index) =>
                  item ? (
                    <DropdownMenuItem
                      key={index}
                      onClick={item.onClick}
                      disabled={item.comingSoon}
                      className={cn(
                        "flex items-center gap-2 cursor-pointer p-2 relative group",
                        item.danger && "text-red-600",
                        item.comingSoon && "opacity-60 hover:opacity-70"
                      )}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.label}</span>
                      {item.shortcut && (
                        <span className="ml-auto text-xs text-gray-400">
                          {item.shortcut}
                        </span>
                      )}
                      {item.comingSoon && (
                        <span className="ml-auto text-[10px] font-medium text-blue-500 bg-blue-50 px-1.5 py-0.5 rounded-full flex items-center gap-1">
                          <Lock className="h-3 w-3" />
                          Soon
                        </span>
                      )}
                    </DropdownMenuItem>
                  ) : (
                    <DropdownMenuSeparator key={index} />
                  )
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <nav className="md:hidden border-t border-gray-200 bg-white">
            {/* Mobile Search Bar */}
            {location.pathname.includes("dashboard") && (
              <div className="p-3 border-b border-gray-200">
                <div className="relative">
                  <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search bookmarks..."
                    className="w-full h-10 pl-10 pr-4 rounded-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {searchTerm && (
                    <button
                      onClick={() => setSearchTerm("")}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            )}

            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <Button
                  key={item.path}
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-2 rounded-none",
                    isActive(item.path) && "bg-gray-100 text-gray-900"
                  )}
                  onClick={() => {
                    navigate(`/user/${item.path}`);
                    setIsMobileMenuOpen(false);
                  }}>
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Button>
              );
            })}
          </nav>
        )}
      </div>
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </header>
  );
};

export default Header;
