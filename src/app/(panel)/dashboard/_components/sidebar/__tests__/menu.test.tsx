
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Menu } from "../menu";
import { Session } from "next-auth";

jest.mock("next-auth/react");
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

const mockUseSession = useSession as jest.Mock;
const mockUseRouter = useRouter as jest.Mock;
const mockSignOut = signOut as jest.Mock;

const mockUserData: Session = {
  user: {
    id: "user-123",
    name: "John Doe",
    email: "john.doe@example.com",
    image: "https://i.pravatar.cc/150",
  },
  expires: "some-future-date",
};

describe("Menu component", () => {
  let mockRouterReplace: jest.Mock;
  let mockSessionUpdate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockRouterReplace = jest.fn();
    mockSessionUpdate = jest.fn();
    mockUseRouter.mockReturnValue({ replace: mockRouterReplace });
    mockUseSession.mockReturnValue({
      data: mockUserData,
      status: "authenticated",
      update: mockSessionUpdate,
    });
  });

  it("should render user information correctly", () => {
    render(<Menu userData={mockUserData} />);

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john.doe@example.com")).toBeInTheDocument();
  });

  it("should open dropdown and show menu items on trigger click", async () => {
    const user = userEvent.setup();
    render(<Menu userData={mockUserData} />);

    const trigger = screen.getByRole("button", { name: /John Doe/i });
    await user.click(trigger);

    await waitFor(() => {
      expect(screen.getByRole("menuitem", { name: /Perfil/i })).toBeInTheDocument();
    });
    expect(screen.getByRole("menuitem", { name: /Sair/i })).toBeInTheDocument();
  });

  it("should call signOut and redirect on logout button click", async () => {
    const user = userEvent.setup();
    mockSignOut.mockResolvedValue({});
    render(<Menu userData={mockUserData} />);

    const trigger = screen.getByRole("button", { name: /John Doe/i });
    await user.click(trigger);

    const logoutButton = await screen.findByRole("menuitem", { name: /Sair/i });
    await user.click(logoutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalledWith({ redirect: false });
    });
    await waitFor(() => {
      expect(mockSessionUpdate).toHaveBeenCalled();
    });
    await waitFor(() => {
      expect(mockRouterReplace).toHaveBeenCalledWith("/");
    });
  });

  it("should render correct fallback initials", () => {
    const userWithoutName: Session = {
      ...mockUserData,
      user: { ...mockUserData.user, name: "", image: null },
    };
    render(<Menu userData={userWithoutName} />);
    expect(screen.getByText("U")).toBeInTheDocument();

    const userWithTwoNames: Session = {
      ...mockUserData,
      user: { ...mockUserData.user, name: "Jane Doe", image: null },
    };
    render(<Menu userData={userWithTwoNames} />);
    expect(screen.getByText("JD")).toBeInTheDocument();
  });
});
