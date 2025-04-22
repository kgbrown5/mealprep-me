import type { GetServerSidePropsContext } from 'next'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Ellipsis } from 'lucide-react';

// pagination or scroll? scroll may be easier

export default function Recipes({ user }: { user: User }) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full h-screen'>
        <SidebarTrigger className='my-[1.5rem] mx-[2.5rem]' />
          <div className='min-h-[89vh] grid grid-cols-3 grid-rows-2 gap-[2rem] mx-[3rem]'>
            <div className='col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-between'>
              <h1 className='text-3xl font-bold'>My Recipes</h1>
              <Button className='w-full'><Plus />Add New</Button>
            </div>
            <Card>
              <CardHeader className="flex justify-between">
                <CardTitle className='mt-[.5rem]'>Placeholder Card</CardTitle>
                <Button variant="ghost"><Ellipsis/></Button>
              </CardHeader>
              <CardContent>
                <p>Replace with fetched data from supabase</p>
              </CardContent>
            </Card>
          </div>
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