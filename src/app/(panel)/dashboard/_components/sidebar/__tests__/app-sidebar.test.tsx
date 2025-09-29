
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AppSidebar } from "../app-sidebar";
import { deleteDesktop } from "../../../_actions/delete-desktop";
import { toast } from "react-toastify";
import { Session } from "next-auth";
import { Desktop } from "@/generated/prisma";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useSession } from "next-auth/react";

jest.mock("next/navigation", () => ({
  usePathname: jest.fn().mockReturnValue("/dashboard"),
  redirect: jest.fn(),
  useRouter: jest.fn(() => ({
    replace: jest.fn(),
  })),
}));
jest.mock("next-auth/react");
jest.mock("../../../_actions/delete-desktop");
jest.mock("react-toastify");
jest.mock("../desktop-form", () => ({
  DesktopForm: jest.fn(({ setAddDesktop }) => (
    <div data-testid="desktop-form">
      <button onClick={() => setAddDesktop(false)}>Close Form</button>
    </div>
  )),
}));

const mockDeleteDesktop = deleteDesktop as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;
const mockUseSession = useSession as jest.Mock;

const mockDesktops: Desktop[] = [
  { id: "d-1", title: "Desktop 1", userId: "u-1", createdAt: new Date(), updatedAt: new Date() },
  { id: "d-2", title: "Desktop 2", userId: "u-1", createdAt: new Date(), updatedAt: new Date() },
];

const mockUserData: Session = {
  user: { id: "u-1" },
  expires: "some-future-date",
};

describe("AppSidebar component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSession.mockReturnValue({ data: mockUserData, status: "authenticated" });
  });

  const renderComponent = (desktops: Desktop[], userData: Session) => {
    return render(
      <SidebarProvider>
        <AppSidebar desktops={desktops} userData={userData} />
      </SidebarProvider>
    );
  };

  it("should render navigation links and desktops", () => {
    renderComponent(mockDesktops, mockUserData);

    expect(screen.getByText("Home")).toBeInTheDocument();
    expect(screen.getByText("Metas")).toBeInTheDocument();
    expect(screen.getByText("Desktop 1")).toBeInTheDocument();
    expect(screen.getByText("Desktop 2")).toBeInTheDocument();
  });

  it("should show the desktop form when 'Adicionar Desktop' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent([], mockUserData);

    const addButton = screen.getByText("Adicionar Desktop");
    await user.click(addButton);

    expect(screen.getByTestId("desktop-form")).toBeInTheDocument();
  });

  it("should show the desktop form in edit mode when 'Editar' is clicked", async () => {
    const user = userEvent.setup();
    renderComponent(mockDesktops, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const editButton = await screen.findByText("Editar");
    await user.click(editButton);

    expect(screen.getByTestId("desktop-form")).toBeInTheDocument();
  });

  it("should call deleteDesktop action and show success toast when 'Deletar' is clicked", async () => {
    const user = userEvent.setup();
    mockDeleteDesktop.mockResolvedValue({ data: "Success" });
    renderComponent(mockDesktops, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const deleteButton = await screen.findByRole("menuitem", { name: /Deletar/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockDeleteDesktop).toHaveBeenCalledWith("d-1");
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Success");
    });
  });

  it("should show an error toast if deleteDesktop fails", async () => {
    const user = userEvent.setup();
    mockDeleteDesktop.mockResolvedValue({ error: "Failed to delete" });
    renderComponent(mockDesktops, mockUserData);

    const optionsButton = screen.getAllByRole("button", { name: /Opções para/i })[0];
    await user.click(optionsButton);

    const deleteButton = await screen.findByRole("menuitem", { name: /Deletar/i });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Failed to delete");
    });
  });

  it("should display a message when no desktops are available", () => {
    renderComponent([], mockUserData);
    expect(screen.getByText("Nenhuma Desktop criada")).toBeInTheDocument();
  });
});
