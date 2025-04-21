"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hideSidebar = pathname === "/login" || pathname === '/login/otp' || pathname === '/register';

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex w-[100vw]">
      {!hideSidebar && <AppSidebar />}
      {!hideSidebar && <SidebarTrigger />}
      <main className="flex-1">{children}</main>
    </div>
  );
}
