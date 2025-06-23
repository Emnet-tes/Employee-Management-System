"use client";
import { SessionProvider } from "next-auth/react";
import { usePathname } from "next/navigation";
import Layout from "@/component/layout";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isAuthPage = pathname === "/login" || pathname === "/signup";

  // Wrap all client components that use useSession in SessionProvider
  return isAuthPage ? (
    children
  ) : (
    <SessionProvider>
      <Layout>{children}</Layout>
    </SessionProvider>
  );
}
