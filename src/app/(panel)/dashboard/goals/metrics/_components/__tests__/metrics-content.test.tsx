import { render, screen } from "@testing-library/react";
import { MetricsContent } from "../metrics-content";
import { GoalMetrics } from "../../_types";
import { CompletionCard } from "../CompletionCard";
import { WeeklyProgressChart } from "../charts/weekly-progress-chart";
import { MonthlyProgressChart } from "../charts/monthly-progress-chart";

jest.mock("../charts/weekly-progress-chart", () => ({
  WeeklyProgressChart: jest.fn((props) => <div data-testid="weekly-chart" data-props={JSON.stringify(props.data)} />),
}));

jest.mock("../charts/monthly-progress-chart", () => ({
  MonthlyProgressChart: jest.fn((props) => <div data-testid="monthly-chart" data-props={JSON.stringify(props.data)} />),
}));

jest.mock("../CompletionCard", () => ({
  CompletionCard: jest.fn(({ title, weeks, type }) => (
    <div data-testid={`completion-card-${type}`} data-title={title} data-weeks={JSON.stringify(weeks)}>
      {title}
    </div>
  )),
}));

describe("MetricsContent", () => {
    beforeEach(() => {
        (WeeklyProgressChart as jest.Mock).mockClear();
        (MonthlyProgressChart as jest.Mock).mockClear();
        (CompletionCard as jest.Mock).mockClear();
    });

  it('should render "no data" message when data is null', () => {
    render(<MetricsContent data={null} />);
    expect(screen.getByText("Não há dados para exibir")).toBeInTheDocument();
  });

  it("should render all metric components with correct props when data is provided", () => {
    const mockData: GoalMetrics = {
      weeklyProgress: [{ week: "W1", completed: 1, total: 2 }],
      monthlyProgress: [{ month: "M1", completed: 1, total: 2 }],
      completedWeeks: ["W1-completed"],
      incompletedWeeks: ["W2-incompleted"],
    };

    render(<MetricsContent data={mockData} />);

    expect(screen.getByRole('heading', { name: /Métricas de Metas/i })).toBeInTheDocument();
    
    expect(screen.getByTestId("weekly-chart")).toBeInTheDocument();
    expect(WeeklyProgressChart).toHaveBeenCalled();
    expect((WeeklyProgressChart as jest.Mock).mock.calls[0][0]).toEqual({ data: mockData.weeklyProgress });

    expect(screen.getByTestId("monthly-chart")).toBeInTheDocument();
    expect(MonthlyProgressChart).toHaveBeenCalled();
    expect((MonthlyProgressChart as jest.Mock).mock.calls[0][0]).toEqual({ data: mockData.monthlyProgress });

    expect(screen.getByTestId("completion-card-completed")).toBeInTheDocument();
    expect(CompletionCard).toHaveBeenCalled();
    expect((CompletionCard as jest.Mock).mock.calls[0][0]).toEqual({
        title: "Semanas de Conclusão Total",
        weeks: mockData.completedWeeks,
        type: "completed"
    });
    expect((CompletionCard as jest.Mock).mock.calls[1][0]).toEqual({
        title: "Semanas sem Conclusão",
        weeks: mockData.incompletedWeeks,
        type: "incompleted"
    });
  });
});
