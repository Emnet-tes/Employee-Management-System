"use client";

import React from "react";
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

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md p-6 space-y-8">
        <div className="flex items-center gap-2 mb-2">
          <h2 className="text-xl font-bold text-blue-600">Employee System</h2>
        </div>

        <nav className="space-y-2">
          <NavItem
            icon={<Home size={20} />}
            label="Dashboard"
            href="/dashboard"
          />
          <NavItem
            icon={<Calendar size={20} />}
            label="Attendance"
            href="/attendance"
          />
          <NavItem icon={<Calendar size={20} />} label="Leave" href="/leave" />
          <NavItem
            icon={<FileText size={20} />}
            label="Schedule"
            href="/schedule"
          />
          <NavItem
            icon={<Briefcase size={20} />}
            label="Performance"
            href="/performance"
          />
          <NavItem
            icon={<User size={20} />}
            label="My Profile"
            href="/profile"
          />
        </nav>

        <div className="pt-10 border-t">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700 transition">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-semibold text-gray-800">
            {getGreeting()}, Krishna
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
            <button className="relative p-2 rounded-full hover:bg-gray-200 transition">
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
              <span className="absolute top-1 right-1 inline-block w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <button className="p-1 rounded-full hover:bg-gray-200 transition">
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
      className={`flex items-center gap-3 px-4 py-2 rounded-md transition ${
        isActive
          ? "bg-blue-100 text-blue-700 font-semibold"
          : "text-gray-700 hover:bg-gray-100 hover:text-blue-600"
      }`}
    >
      {icon}
      <span>{label}</span>
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
