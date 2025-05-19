import { useContext, useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { StoreContext } from "../context/StoreContext";
import {
  User,
  Menu,
  X,
  Bookmark,
  Search as SearchIcon,
  BookOpen,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Loader from "../components/Loader";
import { assets } from "../assets/assests";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(() => {
    // Initialize search term from sessionStorage if available
    return sessionStorage.getItem("bookmarkSearchTerm") || "";
  });
  const { user } = useContext(StoreContext);
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
    { path: "docs", label: "Docs", icon: BookOpen },
    { path: "profile", label: "Profile", icon: User },
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

  if (loading) return <Loader />;

  return (
    <header className="bg-white border-b border-gray-200 fixed top-0 left-0 right-0 z-50">
      <div className="max-w-[1600px] mx-auto">
        <div className="flex items-center justify-between h-16 px-8 md:px-16">
          {/* Logo and Welcome Message */}
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2">
              {/* Logo for small screens */}
              <img
                src={assets.logo_color}
                alt="Logo"
                className="h-10 w-auto block sm:hidden"
              />

              {/* Logo for medium and up screens */}
              <img
                src={assets.small_logo_color}
                alt="Logo"
                className="h-7 w-auto hidden sm:block"
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
          <div
            className={`relative hidden md:block flex-1 max-w-md ${
              location.pathname.includes("dashboard") ? "visible" : "invisible"
            }`}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search bookmarks by name or URL..."
              className="w-full h-10 pl-10 pr-10 rounded-md border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none bg-gray-50 hover:bg-white transition-colors"
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
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg">
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>
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
    </header>
  );
};

export default Header;
