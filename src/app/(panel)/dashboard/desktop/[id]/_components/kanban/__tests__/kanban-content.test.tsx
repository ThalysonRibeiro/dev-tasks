import { render, screen } from "@testing-library/react";
import { KanbanContent } from "../kanban-content";
import { GroupWithItems } from "../../main-board/group-content";
import { KanbanGrid } from "../kanban-grid";

// Mock the KanbanGrid component
jest.mock("../kanban-grid", () => ({
  KanbanGrid: jest.fn(({ groupsData }) => (
    <div data-testid="kanban-grid-mock">
      {JSON.stringify(groupsData)}
    </div>
  )),
}));

describe("KanbanContent Component", () => {
  const mockGroupsData: GroupWithItems[] = [
    {
      id: "group-1",
      title: "Test Group",
      textColor: "#fff",
      desktopId: "desktop-1",
      createdAt: new Date(),
      updatedAt: new Date(),
      item: [],
    },
  ];

  it("should render the KanbanGrid component", () => {
    render(<KanbanContent groupsData={mockGroupsData} />);
    expect(screen.getByTestId("kanban-grid-mock")).toBeInTheDocument();
  });

  it("should pass the correct groupsData prop to KanbanGrid", () => {
    render(<KanbanContent groupsData={mockGroupsData} />);

    expect(KanbanGrid).toHaveBeenCalledWith(
      {
        groupsData: mockGroupsData
      },
      undefined
    );
  });

  it("should pass an empty array to KanbanGrid when groupsData is null or undefined", () => {
    render(<KanbanContent groupsData={null as unknown as GroupWithItems[]} />);

    expect(KanbanGrid).toHaveBeenCalledWith(
      { groupsData: [] },
      undefined
    );
  });
});
