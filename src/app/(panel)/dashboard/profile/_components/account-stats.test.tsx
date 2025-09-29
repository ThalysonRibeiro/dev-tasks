import { render, screen } from "@testing-library/react";
import AccountStats from "./account-stats";
import { UserWithCounts } from "../types/profile-types";

// Store the real Date constructor
const RealDate = Date;

// Mock data created with the real Date
const mockDetailUser: UserWithCounts = {
  id: "user-123456789",
  createdAt: new RealDate("2024-01-01T12:00:00.000Z"),
  updatedAt: new RealDate("2024-01-14T12:00:00.000Z"),
  _count: {
    sessions: 42,
  },
  goals: [
    { goalCompletions: [{}, {}] },
    { goalCompletions: [{}] },
  ],
} as UserWithCounts;

describe("AccountStats Component", () => {
  beforeAll(() => {
    // Mock Date.now() for consistent date calculations inside the component
    const MOCK_DATE = new RealDate("2024-01-15T12:00:00.000Z"); // Use RealDate here
    jest.spyOn(global, "Date").mockImplementation((...args) => (args.length ? new RealDate(...args) : MOCK_DATE));
  });

  afterAll(() => {
    // Restore the original Date object
    jest.spyOn(global, "Date").mockRestore();
  });
  it("should render all statistics correctly", () => {
    render(<AccountStats detailUser={mockDetailUser} />);

    // Check main title
    expect(screen.getByText("Informações da conta")).toBeInTheDocument();

    // Check "Membro desde"
    expect(screen.getByText("Membro desde")).toBeInTheDocument();
    expect(screen.getByText("1 de janeiro de 2024")).toBeInTheDocument();
    expect(screen.getByText("14 dias atrás")).toBeInTheDocument();

    // Check "Última atualização"
    expect(screen.getByText("Última atualização")).toBeInTheDocument();
    expect(screen.getByText("14 de jan. de 2024")).toBeInTheDocument();
    expect(screen.getByText("1 dias atrás")).toBeInTheDocument();

    // Check "ID do usuário"
    expect(screen.getByText("ID do usuário")).toBeInTheDocument();
    expect(screen.getByText("user-...")).toBeInTheDocument();

    // Check quick stats
    expect(screen.getByText("Estatísticas rápidas")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument(); // 2 + 1 goal completions
    expect(screen.getByText("Metas concluídas")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument(); // session count
    expect(screen.getByText("Sessões")).toBeInTheDocument();
  });

  it("should show 'Hoje' for last update if it was today", () => {
    const todayUser = {
      ...mockDetailUser,
      updatedAt: new Date(), // Updated now
    } as UserWithCounts;

    render(<AccountStats detailUser={todayUser} />);

    expect(screen.getByText("Hoje")).toBeInTheDocument();
  });
});
