import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import Sidebar from "./Sidebar";
import Header from "./Header";
import { Toaster } from "../ui/toaster";
import { toast } from "sonner";
import OfflineBanner from "./OfflineBanner";
import { setOfflineStatus } from "../../store/slices/crmSlice";

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  const { sidebarCollapsed, isOffline } = useSelector((state) => state.crm);

  // Add event listeners for online/offline events
  useEffect(() => {
    const handleOnline = () => {
      dispatch(setOfflineStatus(false));
      toast.success(
        "Connected - You're back online. Your data will sync automatically."
      );
    };

    const handleOffline = () => {
      dispatch(setOfflineStatus(true));
      toast.error("Disconnected - You're offline. Limited features available.");
    };

    // Check initial status
    dispatch(setOfflineStatus(!navigator.onLine));

    // Add event listeners
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      {isOffline && <OfflineBanner />}

      <div className="flex flex-1 w-full">
        <Sidebar />

        <main
          className={`flex-1 transition-all duration-200 ${
            sidebarCollapsed ? "ml-16" : "ml-64"
          } overflow-y-auto max-h-[calc(100vh-65px)]`}
        >
          <div className="p-6 max-w-7xl mx-auto">{children}</div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};

export default Layout;
