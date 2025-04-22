import { z } from "zod";

export const recipe = z.object({
  id: z.string(),
  user_id: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  custom_text: z.string().nullable(),
  photo: z.string().nullable(),
});

export const recipe_ingredient = z.object({
  id: z.string(),
  recipe_id: z.string(),
  ingredient_id: z.string().nullable(),
  quantity: z.number().nullable(),
  unit: z.string().nullable(),
});

export const ingredient = z.object({
  id: z.string(),
  name: z.string(),
});

export const unit = z.object({
  id: z.string(),
  unit: z.string(),
});

export const profile = z.object({
  id: z.string(),
  name: z.string().nullable(),
});
