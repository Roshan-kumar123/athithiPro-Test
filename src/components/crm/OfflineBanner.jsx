import { WifiOff, RefreshCw } from "lucide-react";
import { useDispatch } from "react-redux";
import { Alert, AlertDescription } from "../ui/alert";
import { Button } from "../ui/button";
import { setOfflineStatus } from "../../store/slices/crmSlice";
import { toast } from "sonner";

const OfflineBanner = () => {
  const dispatch = useDispatch();

  const handleManualCheck = () => {
    const isOnline = navigator.onLine;
    dispatch(setOfflineStatus(!isOnline));

    if (isOnline) {
      // If we're actually online, show a message
      toast.success(
        "Connected - You are back online. Your data will sync automatically."
      );
    } else {
      toast.error(
        "Still Offline - You are still offline. Limited functionality available."
      );
    }
  };

  return (
    <Alert className="rounded-none border-t-0 border-l-0 border-r-0 border-b border-yellow-400 bg-yellow-50">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center">
          <WifiOff className="h-4 w-4 text-yellow-600 mr-2" />
          <AlertDescription className="text-yellow-700">
            You're currently offline. You can view data, but creating or
            modifying leads, tasks, bookings, and communications will be limited
            until you're back online.
          </AlertDescription>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="bg-yellow-100 border-yellow-200 text-yellow-800 hover:bg-yellow-200 hover:text-yellow-900 whitespace-nowrap"
          onClick={handleManualCheck}
        >
          <RefreshCw className="h-3 w-3 mr-2" />
          Check Connection
        </Button>
      </div>
    </Alert>
  );
};

export default OfflineBanner;
