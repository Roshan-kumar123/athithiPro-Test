import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "../ui/button";
import { Menu, Search, Wifi, WifiOff, Bell } from "lucide-react";
import { Input } from "../ui/input";
import { toggleSidebar, setOfflineStatus } from "../../store/slices/crmSlice";
import CurrencySelector from "./CurrencySelector";
import LanguageSelector from "./LanguageSelector";

const Header = () => {
  const dispatch = useDispatch();
  const { isOffline } = useSelector((state) => state.crm);

  // Check for internet connection changes
  useEffect(() => {
    const handleOffline = () => dispatch(setOfflineStatus(true));
    const handleOnline = () => dispatch(setOfflineStatus(false));

    window.addEventListener("offline", handleOffline);
    window.addEventListener("online", handleOnline);

    // Initial check
    dispatch(setOfflineStatus(!navigator.onLine));

    return () => {
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("online", handleOnline);
    };
  }, [dispatch]);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleSearchKeyDown = (e) => {
    // Add keyboard shortcuts
    if (e.key === "/" && e.ctrlKey) {
      e.preventDefault();
      e.target.focus();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white border-b border-gray-200 shadow-sm flex h-16 items-center">
      <div className="container flex max-w-full px-4 items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={handleToggleSidebar}
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5" />
          </Button>
          <div className="hidden md:block">
            <Link to="/crm" className="text-xl font-semibold text-[#9b87f5]">
              AthitiPRO CRM
            </Link>
          </div>
        </div>

        <div className="flex-1 mx-4 max-w-md hidden md:block">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search leads, tasks, bookings..."
              className="w-full pl-9 bg-gray-50"
              onKeyDown={handleSearchKeyDown}
            />
          </div>
        </div>

        <div className="flex items-center space-x-1">
          <CurrencySelector />
          <LanguageSelector />

          <Button variant="ghost" size="icon" aria-label="Notifications">
            <Bell className="h-5 w-5" />
          </Button>

          <Button variant="ghost" size="icon" aria-label="Connection status">
            {isOffline ? (
              <WifiOff className="h-5 w-5 text-red-500" />
            ) : (
              <Wifi className="h-5 w-5 text-green-500" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
