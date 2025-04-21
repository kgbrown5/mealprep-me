import Image from "next/image";
import { Geist, Geist_Mono } from "next/font/google";
import type { User } from '@supabase/supabase-js'
import type { GetServerSidePropsContext } from 'next'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function Home({ user }: { user: User }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="m-[1rem]"/>
        <h1>Not yet implemented, check back after Sprint 2!</h1>
      </main>
    </SidebarProvider>
  );
}


export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context)
  const { data, error } = await supabase.auth.getUser()
  if (error || !data) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }
  return {
    props: {
      user: data.user,
    },
  }
}