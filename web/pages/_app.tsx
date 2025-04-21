import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Toaster } from "@/components/ui/sonner"

export default function App({ Component, pageProps }: AppProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <main>
        <SidebarTrigger className="m-3"/>
        <Component {...pageProps} />
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
