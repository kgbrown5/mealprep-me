"use client";

import type { GetServerSidePropsContext } from "next";
import { createClient } from "@/utils/supabase/clients/server-props";
import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Day, DayForm, Recipe } from "@/utils/supabase/models/planner";
import {
  planDay,
  loadRecipes,
  loadPlanner,
} from "@/utils/supabase/queries/planner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { createComponentClient } from "@/utils/supabase/clients/component";
import type { SupabaseClient, User } from "@supabase/supabase-js";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

function DayCard(props: {
  day: Day;
  user: User;
  recipes: Recipe[];
  supabase: SupabaseClient;
}) {
  const form = useForm<z.infer<typeof DayForm>>({
    resolver: zodResolver(DayForm),
    defaultValues: {},
  });

  /* useEffect(() => {
    if (props.day) {
      props.day.breakfast && form.setValue("breakfast", props.day.breakfast);
      props.day.lunch && form.setValue("lunch", props.day.lunch);
      props.day.dinner && form.setValue("dinner", props.day.dinner);
    }
  }, [props.day, form]); */

  const saveDay = async (values: z.infer<typeof DayForm>) => {
    await planDay(
      props.supabase,
      props.user.id,
      props.day.name.toLowerCase(),
      values
    ).then(() => console.log("saved week!"));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.day.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            id={props.day.name.toLowerCase()}
            onSubmit={form.handleSubmit(saveDay)}
            className="space-y-8"
          >
            <FormField
              control={form.control}
              name="breakfast"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Breakfast</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={
                            props.day.breakfast
                              ? "w-[200px] justify-between"
                              : "text-muted-foreground"
                          }
                        >
                          {field.value
                            ? props.recipes.find(
                                (recipe) => recipe.id === field.value
                              )?.name
                            : "Choose a meal..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Choose a meal..." />
                        <CommandList>
                          <CommandEmpty>
                            No recipe matches that name.
                          </CommandEmpty>
                          <CommandGroup>
                            {props.recipes.map((recipe) => (
                              <CommandItem
                                key={recipe.id}
                                value={recipe.name}
                                onSelect={() => {
                                  form.setValue("breakfast", recipe.id);
                                }}
                              >
                                {" "}
                                <Check
                                  className={
                                    recipe.id === field.value
                                      ? "ml-auto opacity-100"
                                      : "ml-auto opacity-0"
                                  }
                                />
                                {recipe.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lunch"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lunch</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={
                            props.day.breakfast
                              ? "w-[200px] justify-between"
                              : "text-muted-foreground"
                          }
                        >
                          {field.value
                            ? props.recipes.find(
                                (recipe) => recipe.id === field.value
                              )?.name
                            : "Choose a meal..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Choose a meal..." />
                        <CommandList>
                          <CommandEmpty>
                            No recipe matches that name.
                          </CommandEmpty>
                          <CommandGroup>
                            {props.recipes.map((recipe) => (
                              <CommandItem
                                key={recipe.id}
                                value={recipe.name}
                                onSelect={() => {
                                  form.setValue("lunch", recipe.id);
                                }}
                              >
                                {" "}
                                <Check
                                  className={
                                    recipe.id === field.value
                                      ? "ml-auto opacity-100"
                                      : "ml-auto opacity-0"
                                  }
                                />
                                {recipe.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dinner"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dinner</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={
                            props.day.breakfast
                              ? "w-[200px] justify-between"
                              : "text-muted-foreground"
                          }
                        >
                          {field.value
                            ? props.recipes.find(
                                (recipe) => recipe.id === field.value
                              )?.name
                            : "Choose a meal..."}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Choose a meal..." />
                        <CommandList>
                          <CommandEmpty>
                            No recipe matches that name.
                          </CommandEmpty>
                          <CommandGroup>
                            {props.recipes.map((recipe) => (
                              <CommandItem
                                key={recipe.id}
                                value={recipe.name}
                                onSelect={() => {
                                  form.setValue("dinner", recipe.id);
                                }}
                              >
                                {" "}
                                <Check
                                  className={
                                    recipe.id === field.value
                                      ? "ml-auto opacity-100"
                                      : "ml-auto opacity-0"
                                  }
                                />
                                {recipe.name}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function Home({ user }: { user: User }) {
  const supabase = createComponentClient();
  const [planner, setPlanner] = useState<Day[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadPlanner(supabase, user.id).then((planner) => {
      if (planner) {
        setPlanner(planner);
      }
    });
    loadRecipes(supabase, user.id).then((recipes) => setRecipes(recipes));
  }, [supabase, user.id]);

  const dayProps = planner.map((day) => ({ day, user, recipes, supabase }));

  // const resetData = () => {};

  const saveWeek = () => {
    const forms = [
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday",
      "sunday",
    ];

    forms.map((day) => {
      const form = document.getElementById(day) as HTMLFormElement | null;
      if (form) form.requestSubmit();
    });
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <main className="w-full h-screen">
        <SidebarTrigger className="my-[1.5rem] mx-[2.5rem]" />
        <div className="min-h-[75vh] grid grid-cols-4 grid-rows-2 gap-[2rem] mx-[3rem]">
          <div className="col-start-1 col-end-2 row-start-1 row-end-2 flex flex-col justify-between">
            <h1 className="text-5xl font-bold">
              What will you make this week?
            </h1>
            <div className="flex justify-between">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="secondary">Reset</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      This action cannot be undone. This will clear all of your
                      planning entries and remove your data from our servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="destructive">Continue</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
              <Button onClick={saveWeek}>Save Week</Button>
            </div>
          </div>
          {dayProps.map((props) => (
            <DayCard key={props.day.name} {...props} />
          ))}
        </div>
      </main>
    </SidebarProvider>
  );
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const supabase = createClient(context);
  const { data, error } = await supabase.auth.getUser();

  if (error || !data) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }
  return {
    props: {
      user: data.user,
    },
  };
}
