import { string, z } from "zod";

export const DayForm = z.object({
  breakfast: z.string().optional(),
  lunch: z.string().optional(),
  dinner: z.string().optional(),
});

export interface Day {
  name: string;
  breakfast: string | null;
  lunch: string | null;
  dinner: string | null;
}

export interface Recipe {
  id: string;
  name: string;
}
