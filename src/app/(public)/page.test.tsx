import { render, screen } from "@testing-library/react";
import Home from "./page";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";

describe("Home Page", () => {
  it("should redirect to dashboard if session exists", async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    render(await Home());
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });

  it("should render the home page if no session exists", async () => {
    (getSession as jest.Mock).mockResolvedValue(null);
    render(await Home());
    expect(screen.getByText("dev tasks")).toBeInTheDocument();
    expect(screen.getByAltText("imagem do logo")).toBeInTheDocument();
    expect(screen.getByTestId("card-signin")).toBeInTheDocument();
    expect(screen.getByTestId("background")).toBeInTheDocument();
  });
});
