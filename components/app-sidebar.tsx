"use client"
import { Package, ArrowLeftRight, ImageIcon, LayoutGrid } from "lucide-react"
import { Sidebar, SidebarContent } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function AppSidebar() {
  const [activeUrl, setActiveUrl] = useState<string>("")
  const pathname = usePathname()

  const items = [
    {
      title: "Dashboard",
      url: "/",
      icon: LayoutGrid,
    },
    {
      title: "Professionals",
      url: "/professionals",
      icon: Package,
    },
    {
      title: "Referral Code",
      url: "/referralcode",
      icon: ArrowLeftRight,
    },
    // {
    //   title: "Livestream",
    //   url: "/livestream",
    //   icon: PlayCircle,
    // },
    {
      title: "Promotion banners",
      url: "/addBanners",
      icon: ImageIcon,
    },
    // {
    //   title: "Users",
    //   url: "/users",
    //   icon: Users,
    // },
    // {
    //   title: "Profile",
    //   url: "/profile",
    //   icon: UserCircle,
    // },
  ]

  useEffect(() => {
    setActiveUrl(pathname)
  }, [pathname])

  return (
    <Sidebar>
      <SidebarContent className="bg-[#1E1E1E] h-screen w-64 fixed left-0 top-0">
        <nav className="flex flex-col h-full">
          {items.map((item) => (
            <Link 
              key={item.title} 
              href={item.url}
              className={`flex items-center gap-3 px-6 py-4 text-[16px] hover:bg-[#98E165]/10 transition-colors
                ${activeUrl === item.url ? 'bg-[#98E165] text-black' : 'text-white'}
                ${item.title === 'Dashboard' && activeUrl === item.url ? 'bg-[#98E165] text-black' : ''}
              `}
            >
              <item.icon className={`h-6 w-6  
                ${activeUrl === item.url ? 'text-black' : 'text-white'}
                ${item.title === 'Dashboard' && activeUrl === item.url ? 'text-black' : ''}
              `} />
              <span className="font-medium">{item.title}</span>
            </Link>
          ))}
        </nav>
      </SidebarContent>
    </Sidebar>
  )
}
