"use client"

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


import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Label } from "./ui/label";

export function ModeToggle() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

   
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
      title: "Grocery List",
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
        <SidebarFooter className="flex flex-col gap-y-1">
          <SidebarMenu>
            <div className="flex items-center gap-x-3 w-full px-4 justify-center">
          < ModeToggle />
          <Label className="text-lg">Adjust visibility</Label>
          </div>
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