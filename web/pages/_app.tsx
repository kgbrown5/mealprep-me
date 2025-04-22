import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Toaster } from "@/components/ui/sonner"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();


export default function App({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <main>
        <Component {...pageProps} />
      </main>
      <Toaster />
    </QueryClientProvider>
  );
}
