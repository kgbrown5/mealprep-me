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
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/clients/server-props'
   
export function AppSidebar() {
  // const supabase = createClient(context)
  const router = useRouter()

  const logOut = () => {
    // TODO: doesn't actually sign out, need to figure out
    // supabase.auth.signOut()
    router.push("/login")
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
        <SidebarHeader className="m-3">MealPrep Me</SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="m-3">
            {items.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url}>
                    <item.icon />
                      <span>{item.title}</span>
                  </a>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <Button variant="destructive" className="w-full m-3" onClick={logOut}>
                Log Out
              </Button>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    )
}