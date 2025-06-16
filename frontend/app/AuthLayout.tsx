"use client";
import { usePathname } from "next/navigation";
import Layout from "@/component/layout";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  return isAuthPage ? children : <Layout>{children}</Layout>;
}
