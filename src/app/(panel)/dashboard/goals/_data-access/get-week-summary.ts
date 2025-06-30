"use server"
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { format, startOfWeek, endOfWeek } from "date-fns";
import { Prisma } from "@/generated/prisma";

export type GoalCompletionsWihtGoal = Prisma.GoalCompletionsGetPayload<{
  include: {
    goal: true;
  }
}>;

export type GoalsCompletedByWeekDayType = {
  id: string;
  title: string
  completedAt: Date;
}

export async function GetWeekSummary() {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      error: "Nenhum meta completa"
    };
  }

  try {
    const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
    const weekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });

    const allGoals = await prisma.goals.findMany({
      where: { userId: session.user.id },
      include: {
        goalCompletions: {
          where: {
            createdAt: {
              gte: weekStart,
              lte: weekEnd,
            }
          },
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            goal: true
          }
        }
      }
    });

    const goalsCompletedByWeekDay: Record<string, GoalsCompletedByWeekDayType[]> = {};
    let totalCompleted: number = 0;

    const allCompletions: GoalCompletionsWihtGoal[] = [];
    allGoals.forEach((comp) => {
      if (Array.isArray(comp.goalCompletions)) {
        allCompletions.push(...comp.goalCompletions);
      }
    });

    allCompletions.forEach((completion) => {
      const completedAtDate = completion.createdAt ? format(completion.createdAt, "yyyy-MM-dd") : null;
      if (completedAtDate) {
        if (!goalsCompletedByWeekDay[completedAtDate]) {
          goalsCompletedByWeekDay[completedAtDate] = [];
        }
        goalsCompletedByWeekDay[completedAtDate].push({
          id: completion.id,
          title: completion.goal.title,
          completedAt: completion.createdAt
        });
        totalCompleted++;
      }
    });

    const totalDesiredFrequency = allGoals.reduce(
      (sum, goal) => sum + goal.desiredWeeklyFrequency, 0
    );

    return {
      summary: {
        completed: totalCompleted,
        total: totalDesiredFrequency,
        goalsPerDay: goalsCompletedByWeekDay,
      }
    }

  } catch (error) {
    console.log(error);
    return {
      error: "Nenhum meta completa"
    };
  }
}