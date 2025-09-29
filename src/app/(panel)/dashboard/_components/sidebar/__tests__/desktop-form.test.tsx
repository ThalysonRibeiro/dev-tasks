
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { DesktopForm } from "../desktop-form";
import { createDesktop } from "../../../_actions/create-desktop";
import { updateDesktop } from "../../../_actions/update-desktop";
import { toast } from "react-toastify";

jest.mock("../../../_actions/create-desktop");
jest.mock("../../../_actions/update-desktop");
jest.mock("react-toastify");

const mockCreateDesktop = createDesktop as jest.Mock;
const mockUpdateDesktop = updateDesktop as jest.Mock;
const mockToastError = toast.error as jest.Mock;
const mockToastSuccess = toast.success as jest.Mock;

describe("DesktopForm component", () => {
  let setAddDesktop: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    setAddDesktop = jest.fn();
  });

  it("should render in create mode and call createDesktop on submit", async () => {
    mockCreateDesktop.mockResolvedValue({ newDesktop: { id: "1", title: "New Desktop" } });
    render(<DesktopForm setAddDesktop={setAddDesktop} />);

    const input = screen.getByPlaceholderText("Digite o nome da Desktop");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "New Desktop" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockCreateDesktop).toHaveBeenCalledWith({ title: "New Desktop" });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Desktop cadastrada com sucesso!");
      expect(setAddDesktop).toHaveBeenCalledWith(false);
    });
  });

  it("should render in update mode and call updateDesktop on submit", async () => {
    mockUpdateDesktop.mockResolvedValue({ data: "Success" });
    const initialValues = { title: "Old Desktop" };
    render(
      <DesktopForm
        setAddDesktop={setAddDesktop}
        desktopId="desktop-123"
        initialValues={initialValues}
      />
    );

    const input = screen.getByDisplayValue("Old Desktop");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "Updated Desktop" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockUpdateDesktop).toHaveBeenCalledWith({
        desktopId: "desktop-123",
        title: "Updated Desktop",
      });
    });

    await waitFor(() => {
      expect(mockToastSuccess).toHaveBeenCalledWith("Success");
      expect(setAddDesktop).toHaveBeenCalledWith(false);
    });
  });

  it("should handle error on createDesktop failure", async () => {
    mockCreateDesktop.mockResolvedValue({ error: "Creation failed" });
    render(<DesktopForm setAddDesktop={setAddDesktop} />);

    const input = screen.getByPlaceholderText("Digite o nome da Desktop");
    const form = input.closest("form");

    fireEvent.change(input, { target: { value: "New Desktop" } });
    fireEvent.submit(form!);

    await waitFor(() => {
      expect(mockToastError).toHaveBeenCalledWith("Erro ao cadastrar Desktop");
    });
  });

  it("should call setAddDesktop(false) when clicking outside", () => {
    render(<DesktopForm setAddDesktop={setAddDesktop} />);
    
    fireEvent.mouseDown(document.body);

    expect(setAddDesktop).toHaveBeenCalledWith(false);
  });
});
