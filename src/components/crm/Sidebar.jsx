// import { useEffect } from "react";
// import { NavLink, useNavigate } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import {
//   User,
//   MessageSquare,
//   Calendar,
//   FileCheck,
//   BarChart2,
//   ChevronLeft,
//   ChevronRight,
//   Users,
//   LogOut
// } from "lucide-react";
// import { cn } from "../../lib/utils";
// import { Button } from "../ui/button";
// import { toggleSidebar } from "../../store/slices/crmSlice";
// import { logout } from "../../store/slices/auth/authSlice";
// import { toast } from "sonner";

// const Sidebar = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const { sidebarCollapsed } = useSelector((state) => state.crm);

//   const navItems = [
//     {
//       name: "Leads",
//       path: "/crm/leads",
//       icon: User,
//       shortcut: "Alt+L",
//     },
//     {
//       name: "Communication",
//       path: "/crm/communication",
//       icon: MessageSquare,
//       shortcut: "Alt+C",
//     },
//     {
//       name: "Tasks",
//       path: "/crm/tasks",
//       icon: Calendar,
//       shortcut: "Alt+T",
//     },
//     {
//       name: "Bookings",
//       path: "/crm/bookings",
//       icon: FileCheck,
//       shortcut: "Alt+B",
//     },
//     {
//       name: "Segments",
//       path: "/crm/segments",
//       icon: Users,
//       shortcut: "Alt+S",
//     },
//     {
//       name: "Insights",
//       path: "/crm/insights",
//       icon: BarChart2,
//       shortcut: "Alt+I",
//     },
//     {
//       name: "Priority Score Management",
//       path: "/crm/priority-score",
//       icon: BarChart2,
//       shortcut: "Alt+I",
//     },

//     {
//       name: "Sub Admin",
//       path: "/crm/role",
//       icon: Users,
//       shortcut: "Alt+I",
//     },
//   ];

//   // Listen for keyboard shortcuts
//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.altKey) {
//         switch (e.key.toLowerCase()) {
//           case "l":
//             window.location.href = "/crm/leads";
//             break;
//           case "c":
//             window.location.href = "/crm/communication";
//             break;
//           case "t":
//             window.location.href = "/crm/tasks";
//             break;
//           case "b":
//             window.location.href = "/crm/bookings";
//             break;
//           case "s":
//             window.location.href = "/crm/segments";
//             break;
//           case "i":
//             window.location.href = "/crm/insights";
//             break;
//           default:
//             break;
//         }
//       }
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, []);

//   const handleToggleSidebar = () => {
//     dispatch(toggleSidebar());
//   };

//   const handleLogout = () => {
//     dispatch(logout());
//     toast.success("Logged out successfully");
//     navigate("/login");
//   };

//   return (
//     <aside
//       className={cn(
//         "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-20 transition-all duration-200",
//         sidebarCollapsed ? "w-16" : "w-64"
//       )}
//     >
//       <div className="h-full flex flex-col justify-between p-2">
//         <div className="space-y-2">
//           {navItems.map((item) => (
//             <NavLink
//               key={item.name}
//               to={item.path}
//               className={({ isActive }) =>
//                 cn(
//                   "flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100",
//                   isActive
//                     ? "bg-[#9b87f5] bg-opacity-10 text-[#9b87f5] hover:bg-[#9b87f5] hover:bg-opacity-20"
//                     : "text-gray-700 hover:text-gray-900"
//                 )
//               }
//             >
//               {({ isActive }) => (
//                 <>
//                   <item.icon
//                     className={cn(
//                       "h-5 w-5 mr-2",
//                       isActive ? "text-[#9b87f5]" : "text-gray-500"
//                     )}
//                   />
//                   {!sidebarCollapsed && (
//                     <span className="flex-1">{item.name}</span>
//                   )}
//                   {!sidebarCollapsed && (
//                     <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100">
//                       {item.shortcut}
//                     </kbd>
//                   )}
//                 </>
//               )}
//             </NavLink>
//           ))}
//         </div>

//         <div className="space-y-2">
//           <Button
//             variant="ghost"
//             className={cn(
//               "w-full flex items-center justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
//               sidebarCollapsed ? "px-2" : ""
//             )}
//             onClick={handleLogout}
//           >
//             <LogOut className="h-5 w-5 mr-2" />
//             {!sidebarCollapsed && <span>Logout</span>}
//           </Button>

//           <Button
//             variant="ghost"
//             className="w-full justify-start"
//             onClick={handleToggleSidebar}
//           >
//             {sidebarCollapsed ? (
//               <ChevronRight className="h-5 w-5" />
//             ) : (
//               <>
//                 <ChevronLeft className="h-5 w-5 mr-2" />
//                 <span>Collapse</span>
//               </>
//             )}
//           </Button>
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default Sidebar;

import { useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  MessageSquare,
  Calendar,
  FileCheck,
  BarChart2,
  ChevronLeft,
  ChevronRight,
  Users,
  LogOut,
  Settings,
} from "lucide-react";
import { cn } from "../../lib/utils";
import { Button } from "../ui/button";
import { toggleSidebar } from "../../store/slices/crmSlice";
import { logout } from "../../store/slices/auth/authSlice";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode"; // ✅ named import

const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { sidebarCollapsed } = useSelector((state) => state.crm);

  // ✅ Decode user role from token
  let userRole = null;
  try {
    const token = localStorage.getItem("authToken");
    if (token) {
      const decoded = jwtDecode(token);
      userRole = decoded.role; // Adjust if your token uses a different key
    }
  } catch (error) {
    console.error("Failed to decode token", error);
  }

  // ✅ Conditionally include nav items
  const navItems = [
    {
      name: "Leads",
      path: "/crm/leads",
      icon: User,
      shortcut: "Alt+L",
    },
    // {
    //   name: "Communication",
    //   path: "/crm/communication",
    //   icon: MessageSquare,
    //   shortcut: "Alt+C",
    // },
    // {
    //   name: "Tasks",
    //   path: "/crm/tasks",
    //   icon: Calendar,
    //   shortcut: "Alt+T",
    // },
    {
      name: "Bookings",
      path: "/crm/bookings",
      icon: FileCheck,
      shortcut: "Alt+B",
    },
    // {
    //   name: "Segments",
    //   path: "/crm/segments",
    //   icon: Users,
    //   shortcut: "Alt+S",
    // },
    // {
    //   name: "Insights",
    //   path: "/crm/insights",
    //   icon: BarChart2,
    //   shortcut: "Alt+I",
    // },
    {
      name: "Priority Score Management",
      path: "/crm/priority-score",
      icon: BarChart2,
      shortcut: "Alt+I",
    },
    ...(userRole !== "SUB_ADMIN"
      ? [
          {
            name: "User Management",
            path: "/crm/role",
            icon: Users,
            shortcut: "Alt+I",
          },
          {
            name: "Whatsapp Settings",
            path: "/crm/whatsapp-settings",
            icon: Settings,
            shortcut: "Alt+I",
          },

          {
            name: "Chats",
            path: "/crm/communication-channel",
            icon: MessageSquare,
            shortcut: "Alt+I",
          },
        ]
      : []),
  ];

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.altKey) {
        switch (e.key.toLowerCase()) {
          case "l":
            window.location.href = "/crm/leads";
            break;
          case "c":
            window.location.href = "/crm/communication";
            break;
          case "t":
            window.location.href = "/crm/tasks";
            break;
          case "b":
            window.location.href = "/crm/bookings";
            break;
          case "s":
            window.location.href = "/crm/segments";
            break;
          case "i":
            window.location.href = "/crm/insights";
            break;
          default:
            break;
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleToggleSidebar = () => {
    dispatch(toggleSidebar());
  };

  const handleLogout = () => {
    dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/login");
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white border-r border-gray-200 z-20 transition-all duration-200",
        sidebarCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-full flex flex-col justify-between p-2">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                cn(
                  "flex items-center rounded-md px-2 py-1.5 text-sm font-medium transition-colors hover:bg-gray-100",
                  isActive
                    ? "bg-[#9b87f5] bg-opacity-10 text-[#9b87f5] hover:bg-[#9b87f5] hover:bg-opacity-20"
                    : "text-gray-700 hover:text-gray-900"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={cn(
                      "h-5 w-5 mr-2",
                      isActive ? "text-[#9b87f5]" : "text-gray-500"
                    )}
                  />
                  {!sidebarCollapsed && (
                    <span className="flex-1">{item.name}</span>
                  )}
                  {!sidebarCollapsed && (
                    <kbd className="hidden md:inline-flex h-5 select-none items-center gap-1 rounded border bg-gray-50 px-1.5 font-mono text-[10px] font-medium text-gray-600 opacity-100">
                      {item.shortcut}
                    </kbd>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>

        <div className="space-y-2">
          <Button
            variant="ghost"
            className={cn(
              "w-full flex items-center justify-start text-red-500 hover:text-red-700 hover:bg-red-50",
              sidebarCollapsed ? "px-2" : ""
            )}
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            {!sidebarCollapsed && <span>Logout</span>}
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleToggleSidebar}
          >
            {sidebarCollapsed ? (
              <ChevronRight className="h-5 w-5" />
            ) : (
              <>
                <ChevronLeft className="h-5 w-5 mr-2" />
                <span>Collapse</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
