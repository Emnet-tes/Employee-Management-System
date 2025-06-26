"use client";

import React, { useState, useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  Home,
  Calendar,
  User,
  FileText,
  LogOut,
  Briefcase,
  BarChart,
} from "lucide-react";

import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { data: session } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications when bell is clicked
  const fetchNotifications = async () => {
    if (!session?.user?.employeeId) return;
    setLoadingNotif(true);
    try {
      const res = await fetch(
        `/api/notification?userId=${session.user?.employeeId}`
      );
      const data = await res.json();
      setNotifications(data || []);
    } catch {
      setNotifications([]);
    }
    setLoadingNotif(false);
  };

  // Mark all unread as read when closing popup
  const markAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    for (const n of unread) {
      await fetch("/api/notification", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: n._id }),
      });
    }
    // Optionally update UI
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  // Handle outside click to close popup
  useEffect(() => {
    if (!showNotifications) return;
    function handleClick(e: MouseEvent) {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
        markAllAsRead();
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
    // eslint-disable-next-line
  }, [showNotifications, notifications]);

  // Fetch notifications on mount so the badge is always up-to-date
  useEffect(() => {
    if (!session?.user?.employeeId) return;
    fetchNotifications();
    // eslint-disable-next-line
  }, [session?.user?.employeeId]);

  // Refetch notifications after closing the popup
  useEffect(() => {
    if (!showNotifications && session?.user?.employeeId) {
      fetchNotifications();
    }
    // eslint-disable-next-line
  }, [showNotifications, session?.user?.employeeId]);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-80 bg-white shadow-md p-6 space-y-8">
        <div className="flex items-center gap-2 mb-12">
          <h2 className="text-3xl font-bold text-blue-900">Employee System</h2>
        </div>

        <nav className="space-y-2">
          <NavItem
            icon={<Home size={24} />}
            label="Dashboard"
            href="/dashboard"
          />
          {session?.user?.role !== "employee" && (
            <NavItem
              icon={<BarChart size={24} />}
              label="Employee"
              href="/employees"
            />
          )}
          <NavItem
            icon={<Calendar size={24} />}
            label="Attendance"
            href="/attendance"
          />
          <NavItem icon={<Calendar size={24} />} label="Leave" href="/leave" />
          <NavItem
            icon={<FileText size={24} />}
            label="Schedule"
            href="/schedule"
          />
          <NavItem
            icon={<Briefcase size={24} />}
            label="Performance"
            href="/performance"
          />
          <NavItem
            icon={<User size={24} />}
            label="My Profile"
            href="/profile"
          />
        </nav>

        <div className="pt-10 border-t">
          <button
            onClick={async () => {
              setIsLoggingOut(true);
              await signOut({ callbackUrl: "/login" });
              setIsLoggingOut(false);
            }}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed text-xl"
            disabled={isLoggingOut}
          >
            <LogOut size={24} /> {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {getGreeting()}, {session?.user?.name || "User"}
          </h1>

          <div className="flex items-center gap-6">
            <div className="text-gray-500 text-sm">
              {new Date().toLocaleDateString("en-US", {
                weekday: "long",
                day: "2-digit",
                month: "short",
                year: "numeric",
              })}
            </div>
            {/* Notification Bell */}
            <div className="relative">
              <button
                className="relative p-2 rounded-full hover:bg-gray-200 transition cursor-pointer"
                onClick={async () => {
                  setShowNotifications((prev) => !prev);
                  if (!showNotifications) await fetchNotifications();
                }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-gray-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                  />
                </svg>
                {/* Unread badge with count */}
                {notifications.filter((n) => !n.read).length > 0 && (
                  <span className="absolute top-1 right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs rounded-full">
                    {notifications.filter((n) => !n.read).length}
                  </span>
                )}
              </button>
              {/* Notification Popup */}
              {showNotifications && (
                <div
                  ref={notifRef}
                  className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="p-4 border-b font-semibold text-gray-700 flex justify-between items-center">
                    Notifications
                    <button
                      className="text-xs text-blue-600 hover:underline"
                      onClick={() => {
                        setShowNotifications(false);
                        markAllAsRead();
                      }}
                    >
                      Mark all as read
                    </button>
                  </div>
                  <div className="max-h-72 overflow-y-auto">
                    {loadingNotif ? (
                      <div className="p-4 text-gray-400 text-center">
                        Loading...
                      </div>
                    ) : notifications.filter((n) => !n.read).length === 0 ? (
                      <div className="p-4 text-gray-400 text-center">
                        No new notification
                      </div>
                    ) : (
                      notifications
                        .filter((n) => !n.read)
                        .map((n) => (
                          <div
                            key={n._id}
                            className="px-4 py-3 border-b last:border-b-0 bg-blue-50 text-black"
                          >
                            <div className="font-medium">
                              {n.title || "Notification"}
                            </div>
                            <div className="text-sm">{n.message}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {n.createdAt
                                ? new Date(n.createdAt).toLocaleString()
                                : ""}
                            </div>
                          </div>
                        ))
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Profile Button */}
            <button
              className="p-1 rounded-full hover:bg-gray-200 transition cursor-pointer"
              onClick={() => (window.location.href = "/profile")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 14c-4 0-7 2-7 4v1h14v-1c0-2-3-4-7-4z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 12a4 4 0 100-8 4 4 0 000 8z"
                />
              </svg>
            </button>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
};

const NavItem = ({
  icon,
  label,
  href,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <a
      href={href}
      className={`flex items-center gap-4 px-4 py-2 rounded-md transition text-base ${
        isActive
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      }`}
      style={{ fontSize: "1.4rem" }}
    >
      <span className="flex items-center justify-center w-6 h-6">{icon}</span>
      <span className="ml-2">{label}</span>
    </a>
  );
};

export default Layout;
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
};
