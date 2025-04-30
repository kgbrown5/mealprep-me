import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner"
import { Analytics } from '@vercel/analytics/next';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ui/theme-provider"

const queryClient = new QueryClient();


export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
      <main>
        <Component {...pageProps} />
      </main>
      <Toaster />
      <Analytics />
      </ThemeProvider>
    </QueryClientProvider>
  );
}
