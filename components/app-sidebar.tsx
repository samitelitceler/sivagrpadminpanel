"use client"
import { Package, ArrowLeftRight, ImageIcon ,  LayoutGrid , Notebook , BrickWall ,  Users , UsersRound ,  NotebookText} from "lucide-react"
import { Sidebar, SidebarContent ,  SidebarGroup, useSidebar  } from "@/components/ui/sidebar"
import { useState, useEffect } from "react"
import { usePathname } from 'next/navigation'
import Link from 'next/link'

export function AppSidebar() {
  const [activeUrl, setActiveUrl] = useState<string>("")
  const pathname = usePathname()
  const { state } = useSidebar()

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
      title: "Vendors",
      url: "/vendors",
      icon: UsersRound,
    },
    {
      title: "Referral Code",
      url: "/referralcode",
      icon: ArrowLeftRight,
    },
    {
      title: "Professional Bookings",
      url: "/professionalbookings",
      icon: Notebook,
    },
    {
      title: "Raw Material Bookings",
      url: "/rawmaterialbookings",
      icon: NotebookText,
    },
    {
      title: "Raw Materials",
      url: "/rawmaterials",
      icon: BrickWall,
    },
    {
      title: "Users",
      url: "/users",
      icon: Users,
    },
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
      <SidebarContent className={`bg-[#1E1E1E] h-screen sticky top-0 transition-all duration-300 ${
         state === "expanded" ? 'w-64 opacity-100' : 'w-0 opacity-0 overflow-hidden'
       }`}>
        <SidebarGroup>
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
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
