import React from "react";
import { Home, Calendar, User, FileText, LogOut, Briefcase, BarChart } from "lucide-react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-xl p-4 space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold text-blue-600">Employee Management System</h2>
        </div>
        <nav className="space-y-4">
          <NavItem icon={<Home size={20} />} label="Dashboard" href="/dashboard" />
          <NavItem icon={<Calendar size={20} />} label="Attendance" href="/attendance" />
          <NavItem icon={<Calendar size={20} />} label="Leave" href="/leave" />
          <NavItem icon={<FileText size={20} />} label="Schedule" href="/schedule" />
          <NavItem icon={<Briefcase size={20} />} label="Performance" href="/performance" />
          <NavItem icon={<User size={20} />} label="My Profile" href="/profile" />
        </nav>
        <div className="pt-6">
          <button className="flex items-center gap-2 text-red-500 hover:text-red-700">
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold">Good afternoon, Krishna</h1>
          <div className="text-gray-500 text-sm">Monday, 08/Nov/2023</div>
        </div>
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, href }: { icon: React.ReactNode; label: string; href: string }) => (
  <a
    href={href}
    className="flex items-center gap-3 text-gray-700 hover:text-blue-600 font-medium"
  >
    {icon}
    {label}
  </a>
);

export default Layout;
