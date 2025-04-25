import type { GetServerSidePropsContext } from 'next'
import type { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/clients/server-props'
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardDescription, CardTitle, CardContent } from "@/components/ui/card";
import { Plus, Ellipsis } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog'
import { RecipeFormInput, Recipe } from '@/utils/supabase/models/recipes'
import { newRecipe, deleteRecipe } from '@/utils/supabase/queries/recipes'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form"
import { createComponentClient } from '@/utils/supabase/clients/component'
import { useEffect, useState } from 'react'
import { AspectRatio } from "@/components/ui/aspect-ratio"


// const formSchema = Recipe

// pagination or scroll? scroll may be easier

export default function Recipes({ user }: { user: User }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const supabase = createComponentClient();
  type RecipeData = z.infer<typeof Recipe>;

  const [recipes, setRecipes] = useState<RecipeData[]>([])
  // const [loading, setLoading] = useState(true)

  const formSchema = RecipeFormInput

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {},
    })

    const recipeDatabase = supabase
      .channel('recipe-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        (payload) => console.log(payload)
      )
      .subscribe()

    useEffect(() => {
      let ignore = false
  
      const loadRecipes = async () => {
        // setLoading(true)
        const { data, error } = await supabase
          .from("recipes")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
  
        if (!ignore) {
          if (error) console.error(error)
          setRecipes(data ?? [])
          // setLoading(false)
        }
      }
  
      loadRecipes()
      return () => {
        ignore = true
      }
    }, [supabase, user.id, recipeDatabase])

    

    const saveRecipe = async (values: z.infer<typeof formSchema>) => {
      await newRecipe(supabase, user.id, values)
        .then(() => setDialogOpen(false))
    }

    const removeRecipe = async (recipe_id: string) => {
      await deleteRecipe(supabase, recipe_id)
    }

    return (
      <SidebarProvider>
        <AppSidebar />
        <main className='w-full h-screen'>
        <SidebarTrigger className='my-[1.5rem] mx-[2.5rem]' />
          <div className='min-h-[75vh] grid grid-cols-3 grid-rows-2 gap-[2rem] mx-[3rem]'>
            <div className='col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-between'>
              <h1 className='text-3xl font-bold'>My Recipes</h1>
              <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogTrigger asChild> 
                  <Button className='w-full'><Plus />Add New</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>New Recipe</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form id="new-recipe" onSubmit={form.handleSubmit(saveRecipe)} className="space-y-8">
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
                        render={() => (
                          <FormItem>
                            <FormLabel>Picture</FormLabel>
                            <FormControl>
                            <Input type="file" accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  form.setValue("photo", file); // manually set file
                                }
                              }}
                            />
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
                  <DialogFooter className='flex justify-between'>
                    <DialogClose asChild>
                      <Button variant="secondary">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" form="new-recipe">Save</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
            {recipes.map(recipe => (
              <Card key={recipe.name}>
                <CardHeader className="flex justify-between">
                  <div className='mt-[.5rem]'>
                  <CardTitle>{recipe.name}</CardTitle>
                  <CardDescription>{recipe.description}</CardDescription>
                  </div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost"><Ellipsis/></Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                      <DialogTitle>{recipe.name}</DialogTitle>
                      <DialogDescription>{recipe.description}</DialogDescription>
                      </DialogHeader>
                      <div>
                      {recipe.photo && (
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={recipe.photo}
                        alt={recipe.name}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  )}
                      <p className='mt-[1rem]'>{recipe.ingredients}</p>
                      <p className='mt-[1rem]'>{recipe.custom_text}</p>
                    </div>
                    <DialogFooter>
                      <Button variant="destructive" className='w-full' onClick={() => removeRecipe(recipe.id)}>Delete Recipe</Button>
                    </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  {/*<p className='my-[.5rem]'>{recipe.description}</p>*/}
                  
                  {recipe.photo && (
                    <AspectRatio ratio={4 / 3}>
                      <img
                        src={recipe.photo}
                        alt={recipe.name}
                        className="rounded-md object-cover w-full h-full"
                      />
                    </AspectRatio>
                  )}
                </CardContent>
              </Card>
            ))}
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