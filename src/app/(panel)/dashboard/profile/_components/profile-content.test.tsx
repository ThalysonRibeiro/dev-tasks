import { render, screen } from "@testing-library/react";
import { ProfileContent } from "./profile-content";
import { UserWithCounts } from "../types/profile-types";
import { User } from "next-auth";

// Mock child components
// eslint-disable-next-line react/display-name
jest.mock("./avatar", () => () => <div data-testid="avatar-mock" />);
jest.mock("./name-form", () => ({
  NameForme: () => <div data-testid="name-form-mock" />,
}));
// eslint-disable-next-line react/display-name
jest.mock("./account-security", () => () => <div data-testid="account-security-mock" />);
// eslint-disable-next-line react/display-name
jest.mock("./account-stats", () => () => <div data-testid="account-stats-mock" />);

// Mock data
const mockSessionUser: User = {
  id: "user-123",
  name: "Test User",
  email: "test@example.com",
  image: "/",
};

const mockDetailUser = {
  id: "user-123",
  // ... other properties
} as UserWithCounts;

describe("ProfileContent Component", () => {
  it("should render all child components correctly", () => {
    render(<ProfileContent sessionUser={mockSessionUser} detailUser={mockDetailUser} />);

    // Check for titles and descriptions
    expect(screen.getByText("Perfil")).toBeInTheDocument();
    expect(screen.getByText("Gerencie suas informações de perfil")).toBeInTheDocument();
    expect(screen.getByText("Segurança da conta")).toBeInTheDocument();

    // Check that all mocked children are rendered
    expect(screen.getByTestId("avatar-mock")).toBeInTheDocument();
    expect(screen.getByTestId("name-form-mock")).toBeInTheDocument();
    expect(screen.getByTestId("account-security-mock")).toBeInTheDocument();
    expect(screen.getByTestId("account-stats-mock")).toBeInTheDocument();

    // Check for static text elements
    expect(screen.getByText("E-mail:")).toBeInTheDocument();
    expect(screen.getByText("test@example.com")).toBeInTheDocument();
  });
});
