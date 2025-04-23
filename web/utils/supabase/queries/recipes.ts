import { SupabaseClient, User } from "@supabase/supabase-js";
import { Recipe } from "../models/recipes";
import { z } from "zod";

export async function newRecipe(
  supabase: SupabaseClient,
  user_id: string,
  values: z.infer<typeof Recipe>
) {
  console.log("Recipe Saved!");
  let photo = null;

  if (values.photo) {
    const filePath = `${Date.now()}_${values.photo.name}`;

    const { data: photoData, error: photoError } = await supabase.storage
      .from("recipe-pictures")
      .upload(filePath, values.photo);

    if (photoError) {
      console.error("Upload failed:", photoError.message);
      return;
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
      ingredients: values.ingredients,
      photo: photo,
    })
    .select();

  if (error) {
    throw new Error(`Error creating recipe: ${error.message}`);
  }

  if (data) {
    console.log(`Successful insert! Recipe: ${data}`);
  }
}
