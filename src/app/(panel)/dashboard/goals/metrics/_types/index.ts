export interface GoalMetrics {
  weeklyProgress: {
    week: string;
    completed: number;
    total: number;
  }[];
  monthlyProgress: {
    month: string;
    completed: number;
    total: number;
  }[];
  completedWeeks: string[];
  incompletedWeeks: string[];
}
