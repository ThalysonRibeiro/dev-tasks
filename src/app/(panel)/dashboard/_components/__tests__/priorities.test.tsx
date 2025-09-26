import { render, screen } from "@testing-library/react";
import { getPriorities, PrioritiesCount } from "../../desktop/[id]/_data-access/get-priorities";
import { Priorities } from "../priorities";

jest.mock("../../desktop/[id]/_data-access/get-priorities");

jest.mock("../../desktop/[id]/_components/priorities-bar", () => ({
  PrioritiesBar: ({ priorities, label }: { priorities: PrioritiesCount[]; label: boolean }) => (
    <div data-testid="priorities-bar" />
  ),
}));


const mockGetPriorities = getPriorities as jest.MockedFunction<typeof getPriorities>;

const mockPriorities = [
  { priority: "CRITICAL", count: 1, },
  { priority: "HIGH", count: 2, },
];


describe("Priorities component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render priorities with correct props when data is fetched successfully", async () => {
    mockGetPriorities.mockResolvedValue(mockPriorities as unknown as PrioritiesCount[]);
    const Component = await Priorities({ desktopId: "desktop-01" });
    render(Component as React.ReactElement);

    expect(await screen.getByTestId("priorities-bar")).toBeInTheDocument();
    expect(mockGetPriorities).toHaveBeenCalledWith("desktop-01");
  });

  it("empty array", async () => {
    mockGetPriorities.mockResolvedValue([] as unknown as PrioritiesCount[]);
    const Component = await Priorities({ desktopId: "desktop-01" });
    render(Component);
    expect(await screen.getByTestId("priorities-bar")).toBeInTheDocument();
    expect(mockGetPriorities).toHaveBeenCalledWith("desktop-01");
  });

});