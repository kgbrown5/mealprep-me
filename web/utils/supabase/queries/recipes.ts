import { SupabaseClient, User } from "@supabase/supabase-js";
import { Recipe } from "../models/recipes";
import { z } from "zod";

export async function newRecipe(
  supabase: SupabaseClient,
  user_id: string,
  values: z.infer<typeof Recipe>
) {
  console.log("Recipe Saved!");

  const { data, error } = await supabase
    .from("recipes")
    .insert({ user_id, ...values })
    .select();

  if (error) {
    throw new Error(`Error creating recipe: ${error.message}`);
  }

  if (data) {
    console.log(`Successful insert! Recipe: ${data}`);
  }
}
