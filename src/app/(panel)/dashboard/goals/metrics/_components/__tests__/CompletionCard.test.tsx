import { render, screen } from "@testing-library/react";
import { CompletionCard } from "../CompletionCard";

jest.mock("lucide-react", () => ({
  CheckCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="check-icon" {...props} />,
  XCircle: (props: React.SVGProps<SVGSVGElement>) => <svg data-testid="x-icon" {...props} />,
}));

describe("CompletionCard", () => {
  const mockWeeks = ["25/08", "01/09"];

  it("should render the title and weeks", () => {
    render(
      <CompletionCard
        title="Test Title"
        weeks={mockWeeks}
        type="completed"
      />
    );

    expect(screen.getByRole('heading', { name: /Test Title/i })).toBeInTheDocument();
    expect(screen.getByText("25/08")).toBeInTheDocument();
    expect(screen.getByText("01/09")).toBeInTheDocument();
  });

  it('should render with completed styles when type is "completed"', () => {
    render(
      <CompletionCard
        title="Completed Tasks"
        weeks={mockWeeks}
        type="completed"
      />
    );

    const icon = screen.getByTestId("check-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-green-500");
    expect(screen.queryByTestId("x-icon")).not.toBeInTheDocument();
  });

  it('should render with incompleted styles when type is "incompleted"', () => {
    render(
      <CompletionCard
        title="Incompleted Tasks"
        weeks={mockWeeks}
        type="incompleted"
      />
    );

    const icon = screen.getByTestId("x-icon");
    expect(icon).toBeInTheDocument();
    expect(icon).toHaveClass("text-red-500");
    expect(screen.queryByTestId("check-icon")).not.toBeInTheDocument();
  });
});