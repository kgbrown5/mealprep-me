import type { GetServerSidePropsContext } from 'next'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Ellipsis } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose } from '@radix-ui/react-dialog'
import { Recipe } from '@/utils/supabase/models/recipes'
import { newRecipe } from '@/utils/supabase/queries/recipes'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { createComponentClient } from '@/utils/supabase/clients/component'

const formSchema = Recipe

// pagination or scroll? scroll may be easier

export default function Recipes({ user }: { user: User }) {
  const supabase = createComponentClient();
    const formSchema = Recipe

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    }
    )

    const saveRecipe = async (values: z.infer<typeof formSchema>) => {
      console.log("Recipe Saved!")
      await newRecipe(supabase, user.id, values)
    }

    return (
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full h-screen'>
        <SidebarTrigger className='my-[1.5rem] mx-[2.5rem]' />
          <div className='min-h-[75vh] grid grid-cols-3 grid-rows-2 gap-[2rem] mx-[3rem]'>
            <div className='col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-between'>
              <h1 className='text-3xl font-bold'>My Recipes</h1>
              <Dialog>
                <DialogTrigger className='w-full'><Plus />Add New</DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Recipe</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(saveRecipe)} className="space-y-8">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                            <Input placeholder='Recipe Name' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                              <Input placeholder='Recipe Description' {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="photo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Picture</FormLabel>
                            <FormControl>
                            <Input type="file" {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ingredients"
                        render={({ field }) => (
                          <FormItem>
                            {/* Ingredients input here */}
                            <FormLabel>Ingredients</FormLabel>
                            <FormControl>
                            <Input placeholder="Ingredients..." {...field}/>
                            {/* ^^ if just a text input */}
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="custom_text"
                        render={({ field }) => (
                          <FormItem>
                                  <FormLabel>Details</FormLabel>
                                  <FormControl>
                                  <Textarea placeholder='Details about your recipe...' {...field}/>
                                  </FormControl>
                                </FormItem>
                        )}
                      />
                    </form>
                  
                  </Form>
                  <DialogFooter>
                    <DialogClose asChild className='flex justify-between'>
                      <Button form="new-recipe" type="submit">Save</Button>
                    </DialogClose>
                    <DialogClose asChild className='flex justify-between'>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
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