import { SupabaseClient } from "@supabase/supabase-js";
import { RecipeFormInput, Recipe } from "../models/recipes";
import { z } from "zod";

type Recipe = z.infer<typeof Recipe>;

export async function newRecipe(
  supabase: SupabaseClient,
  user_id: string,
  values: z.infer<typeof RecipeFormInput>
): Promise<{ data: Recipe | null; error: Error | null }> {
  // Allow data to be null
  console.log("Recipe Saved!");
  let photo = null;

  if (values.photo) {
    const filePath = `${Date.now()}_${values.name}`;

    const { data: photoData, error: photoError } = await supabase.storage
      .from("recipe-pictures")
      .upload(filePath, values.photo);

    if (photoError) {
      console.error("Upload failed:", photoError.message);
      return { data: null, error: photoError }; // Correct return for error
    }

    if (photoData) {
      const { data: photoUrl } = supabase.storage
        .from("recipe-pictures")
        .getPublicUrl(filePath);

      photo = photoUrl.publicUrl;
    }
  }

  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id,
      name: values.name,
      description: values.description,
      custom_text: values.custom_text,
      ingredients: values.ingredients.map((ing) => ing.name).join(", "),
      photo: photo,
    })
    .select("*")
    .single();

  if (error) {
    console.error(`Error creating recipe: ${error.message}`);
    return { data: null, error }; // Compatible return with function signature
  }

  console.log(`Successful insert! Recipe: ${data}`);
  return { data, error: null }; // Return the data and no error
}

export async function deleteRecipe(
  supabase: SupabaseClient,
  recipe_id: string
) {
  const { data, error } = await supabase
    .from("recipes")
    .delete()
    .eq("id", recipe_id);

  if (error) {
    console.log(`Could not delete recipe: ${error}`);
  }

  if (data) {
    console.log("Deleted!");
  }
}
