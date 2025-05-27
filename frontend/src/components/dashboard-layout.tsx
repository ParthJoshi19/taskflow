import type React from "react";
import { useTheme } from "../components/theme-provider";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  LayoutDashboard,
  CheckSquare,
  Users,
  Settings,
  LogOut,
  Bell,
  Menu,
  X,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [user, setUser] = useState<any>(null);
  const [organization, setOrganization] = useState<any>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const {theme}=useTheme() as any;
  const navigate=useNavigate();
  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchOrganization();
      fetchNotifications();
    } else {
      navigate("/login");
    }
  }, [window.location.href]);

  const fetchOrganization = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/organization/getName`,
        { params: { token: token } }
      );

      if (response.status) {
        const data = await response.data;
        setOrganization(data);
      }
    } catch (error) {
      console.error("Failed to fetch organization:", error);
    }
  };

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/organization/getNotifications`,
        { params: { token: token } }
      );

      if (response.status) {
        const data = await response.data;
        setNotifications(data);
      }
    } catch (error) {
      console.error("Failed to fetch notifications:", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navigation = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Tasks", href: "/dashboard/tasks", icon: CheckSquare },
    { name: "Members", href: "/dashboard/members", icon: Users },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const getRoleColor = (role: string) => {
    switch (role) {
      case "Admin":
        return "bg-red-100 text-red-800";
      case "Manager":
        return "bg-blue-100 text-blue-800";
      case "Member":
        return "bg-blue-50 text-blue-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin "/>
      </div>
    );
  }

  return (
    <div className={`min-h-screen flex ${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-blue-50/30'}`}> 
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="fixed inset-0 bg-gray-600 bg-opacity-75"
            onClick={() => setSidebarOpen(false)}
          />
        </div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed  left-0 z-50 w-64 ${theme ==='light'?"bg-white ":"bg-slate-700 text-white"} shadow-lg transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold">TaskFlow</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <h3 className={`text-sm font-medium ${theme==='light'?"text-gray-600":""} uppercase tracking-wider`}>
              Organization
            </h3>
            {organization?<p className="mt-1 text-lg font-medium">{organization?.name}</p>:<p className="p-3"></p>}
          </div>

          <nav className="space-y-2">
            {navigation.map((item) => {
              const isActive = window.location.href === item.href;
              return (
                <Link
                  key={item.name}
                  to={`${item.href}`}
                  className={`flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-800"
                      : `${theme==='light'?"text-gray-600":""} hover:bg-blue-50 hover:text-blue-800`
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="w-full h-screen overflow-y-scroll">
        <div className="">
          {/* Top navigation */}
          <div className={`sticky top-0 z-40 ${theme === 'dark' ? 'bg-slate-800 text-white' : 'bg-white'} shadow-sm border-b`}>
            <div className="flex items-center justify-between h-16 px-6">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>

              <div className="flex items-center space-x-4">
                {/* Notifications */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="relative">
                      <Bell className="h-5 w-5" />
                      {notifications.length > 0 && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-600 text-white text-xs rounded-full flex items-center justify-center">
                          {notifications.length}
                        </span>
                      )}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-80">
                    <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {notifications.length > 0 ? (
                      notifications.map((notification, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="flex flex-col items-start p-3"
                        >
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-gray-600">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {notification.time}
                          </p>
                        </DropdownMenuItem>
                      ))
                    ) : (
                      <DropdownMenuItem>
                        <p className="text-gray-600">No new notifications</p>
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>

                {/* User menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="flex items-center space-x-3 px-3 py-2"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {user.name
                            .split(" ")
                            .map((n: string) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="text-left">
                        <p className="text-sm font-medium">{user.name}</p>
                        <Badge className={`text-xs ${getRoleColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <a
                        href="/dashboard/settings"
                        className="flex items-center space-x-2"
                      >
                        <Settings className="h-4 w-4" />
                        <span>Settings</span>
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="h-4 w-4 mr-2" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          
          {/* Page content */}
          <main className={`${theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100'} p-6`}>{children}</main>
        </div>
      </div>
    </div>
  );
}
