"use client";

import { usePathname } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useState, useEffect } from "react";
import { useSidebar } from "@/components/ui/sidebar";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isClient, setIsClient] = useState(false);
  const { state } = useSidebar();

  useEffect(() => {
    setIsClient(true);
  }, []);

  const hideSidebar = pathname === "/login" || pathname === '/login/otp' || pathname === '/register';

  if (!isClient) {
    return null; // Prevent hydration mismatch
  }

  return (
    <div className="flex min-h-screen w-full">
       {!hideSidebar && (
         <div className={`transition-all duration-300 ${state === 'expanded' ? 'w-64' : 'w-0'} flex-shrink-0`}>
           <AppSidebar />
         </div>
       )}
      {!hideSidebar && <SidebarTrigger />}
      <main className={`flex-1 overflow-x-hidden transition-all duration-300 ${state === 'expanded' ? 'ml-0' : 'ml-0'}`}>
         {children}
       </main>
    </div>
  );
}
