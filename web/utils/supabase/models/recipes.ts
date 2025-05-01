import { z } from "zod";

export const Recipe = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  custom_text: z.string().optional(),
  photo: z.instanceof(File).optional(),
  ingredients: z.string(),
});

export const RecipeIngredient = z.object({
  id: z.string(),
  recipe_id: z.string(),
  ingredient_id: z.string().nullable(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
});

export const Ingredient = z.object({
  id: z.string(),
  name: z.string(),
});

export const RecipeFormInput = z.object({
  name: z.string(),
  description: z.string().optional(),
  custom_text: z.string().optional(),
  photo: z.instanceof(File).optional(),
  ingredients: z.array(Ingredient),
});

export const Unit = z.object({
  id: z.string(),
  unit: z.string(),
});

export const Profile = z.object({
  id: z.string(),
  name: z.string().nullable(),
});
