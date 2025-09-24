import { render, screen, within } from "@testing-library/react";
import { WeeklyProgressChart } from "../weekly-progress-chart";

jest.mock('recharts', () => {
  const OriginalModule = jest.requireActual('recharts');
  return {
    ...OriginalModule,
    ResponsiveContainer: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="responsive-container">{children}</div>
    ),
    BarChart: ({ children, data }: { children: React.ReactNode, data: { name: string; dataKey: string }[] }) => <div data-testid="bar-chart" data-props={JSON.stringify(data)}>{children}</div>,
    Bar: (props: { name: string; dataKey: string }) => <div data-testid="bar" data-name={props.name} data-key={props.dataKey}></div>,
    XAxis: (props: { dataKey: string }) => <div data-testid="x-axis" data-datakey={props.dataKey}></div>,
    YAxis: () => <div data-testid="y-axis"></div>,
    Tooltip: () => <div data-testid="tooltip"></div>,
  };
});

describe("WeeklyProgressChart", () => {
  const mockData = [
    { week: "25/08", completed: 5, total: 10 },
    { week: "01/09", completed: 8, total: 10 },
  ];

  it("should render the chart with the correct components", () => {
    render(<WeeklyProgressChart data={mockData} />);

    expect(screen.getByTestId("responsive-container")).toBeInTheDocument();
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toBeInTheDocument();

    const xAxis = within(barChart).getByTestId("x-axis");
    expect(xAxis).toBeInTheDocument();
    expect(xAxis).toHaveAttribute("data-datakey", "week");

    expect(within(barChart).getByTestId("y-axis")).toBeInTheDocument();
    expect(within(barChart).getByTestId("tooltip")).toBeInTheDocument();

    const bars = within(barChart).getAllByTestId("bar");
    expect(bars).toHaveLength(2);
    expect(bars[0]).toHaveAttribute("data-name", "Completas");
    expect(bars[0]).toHaveAttribute("data-key", "completed");
    expect(bars[1]).toHaveAttribute("data-name", "Total");
    expect(bars[1]).toHaveAttribute("data-key", "total");
  });

  it("should pass the correct data to BarChart", () => {
    render(<WeeklyProgressChart data={mockData} />);
    const barChart = screen.getByTestId("bar-chart");
    expect(barChart).toHaveAttribute('data-props', JSON.stringify(mockData));
  });
});