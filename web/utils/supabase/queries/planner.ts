import { SupabaseClient } from "@supabase/supabase-js";
import { DayForm, Day } from "../models/planner";
import { z } from "zod";

export async function planDay(
  supabase: SupabaseClient,
  user_id: string,
  day: string,
  values: z.infer<typeof DayForm>
) {
  const { data: plannerData, error: plannerError } = await supabase
    .from("planner")
    .select(day)
    .eq("user_id", user_id)
    .single();

  console.log(plannerData);

  if (plannerData) {
    const { data, error } = await supabase
      .from("day")
      .upsert({
        id: plannerData.day,
        breakfast: values.breakfast,
        lunch: values.lunch,
        dinner: values.dinner,
      })
      .select();
  }
}

export async function loadRecipes(supabase: SupabaseClient, user_id: string) {
  const { data, error } = await supabase
    .from("recipes")
    .select("id, name")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(`Error loading data: ${error}`);
    return [];
  } else {
    return data;
  }
}

export async function loadPlanner(supabase: SupabaseClient, user_id: string) {
  const { data: fullPlanner, error } = await supabase
    .from("planner")
    .select(
      `
        monday:day!planner_monday_fkey(*),
        tuesday:day!planner_tuesday_fkey(*),
        wednesday:day!planner_wednesday_fkey(*),
        thursday:day!planner_thursday_fkey(*),
        friday:day!planner_friday_fkey(*),
        saturday:day!planner_saturday_fkey(*),
        sunday:day!planner_sunday_fkey(*)
  `
    )
    .eq("user_id", user_id)
    .single();

  error && console.log(error);

  console.log(`fetching existing planner: ${fullPlanner}`);

  if (!fullPlanner) {
    // making a new planner

    const dayNames = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];

    const days: Day[] = dayNames.map((name) => ({
      breakfast: null,
      lunch: null,
      dinner: null,
      name,
    }));

    const { data: newDays, error: newDaysError } = await supabase
      .from("day")
      .insert(days)
      .select();

    console.log(`making new days: ${newDays}`);

    if (newDays && !newDaysError) {
      const { data: newPlanner, error: newPlannerError } = await supabase
        .from("planner")
        .insert({
          user_id: user_id,
          monday: newDays[0].id,
          tuesday: newDays[1].id,
          wednesday: newDays[2].id,
          thursday: newDays[3].id,
          friday: newDays[4].id,
          saturday: newDays[5].id,
          sunday: newDays[6].id,
        })
        .select()
        .single();

      newPlannerError && console.log(newPlannerError);
      console.log(`had to make new planner: ${newPlanner}`);

      const plannerDays: Day[] = [
        newPlanner.monday,
        newPlanner.tuesday,
        newPlanner.wednesday,
        newPlanner.thursday,
        newPlanner.friday,
        newPlanner.saturday,
        newPlanner.sunday,
      ].map((day: any) => ({
        name: day.name,
        breakfast: day.breakfast,
        lunch: day.lunch,
        dinner: day.dinner,
      }));

      return plannerDays;
    }
  } else {
    const plannerDays: Day[] = [
      fullPlanner.monday,
      fullPlanner.tuesday,
      fullPlanner.wednesday,
      fullPlanner.thursday,
      fullPlanner.friday,
      fullPlanner.saturday,
      fullPlanner.sunday,
    ]
      .filter((day): day is Day => day !== null)
      .map((day: any) => ({
        name: day.name,
        breakfast: day.breakfast,
        lunch: day.lunch,
        dinner: day.dinner,
      }));

    return plannerDays;
  }
}
