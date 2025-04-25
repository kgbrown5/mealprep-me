import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Notebook, Calendar, ListCheck } from 'lucide-react';
import { useRouter } from "next/navigation"
import { createComponentClient } from '@/utils/supabase/clients/component'
   
export function AppSidebar() {
  const supabase = createComponentClient()
  const router = useRouter()

  const logOut = async () => {
    await supabase.auth.signOut().then(() => router.push("/login"))
  }

  const items = [
    {
      title: "Planner",
      url: "/",
      icon: Calendar,
    },
    {
      title: "Recipes",
      url: "/recipes",
      icon: Notebook,
    },
    {
      title: "My List",
      url: "/list",
      icon: ListCheck,
    }
  ]

  return (
      <Sidebar>
        <SidebarHeader className="m-[1rem] text-xl font-bold">MealPrep Me</SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="w-[14rem] ml-[1rem]">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon className="w-6 h-6" />
                      <span className="text-lg">{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant="destructive" className="w-[12rem] m-[1.5rem] text-lg" onClick={logOut}>
                Log Out
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
}