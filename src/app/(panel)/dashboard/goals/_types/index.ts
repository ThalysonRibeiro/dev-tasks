"use server"
import { Prisma } from "@/generated/prisma";

// Type for a single goal completion, including the goal details
export type GoalCompletionWithGoal = Prisma.GoalCompletionsGetPayload<{
  include: {
    goal: true;
  }
}>;

// Type for a goal completion item displayed in the summary list
export type GoalCompletionItem = {
  id: string;
  title: string;
  completedAt: Date;
};

// Type for the goals grouped by a specific day of the week
export type GoalsPerDay = {
  date: string;
  dayOfWeek: string;
  goals: GoalCompletionItem[];
};

// Type for the weekly summary data structure
export type WeekSummary = {
  completed: number;
  total: number;
  goalsPerDay: GoalsPerDay[];
};

// Discriminated union for the GetWeekSummary API response
export type WeekSummaryResponse = {
  summary: WeekSummary;
  error?: never;
} | {
  summary?: never;
  error: string;
};

// Type for a pending goal, including its completion count for the week
export type PendingGoal = {
  id: string;
  title: string;
  desiredWeeklyFrequency: number;
  completionCount: number;
};
