import { render, screen } from "@testing-library/react";
import Home from "../page";
import { redirect } from "next/navigation";
import getSession from "@/lib/getSession";

jest.mock("next/navigation");

describe("Home Page", () => {
  beforeEach(() => {
    (redirect as unknown as jest.Mock).mockClear();
  });
  it("should redirect to dashboard if session exists", async () => {
    (getSession as jest.Mock).mockResolvedValue({ user: { id: "1" } });
    render(await Home());
    expect(redirect).toHaveBeenCalledWith("/dashboard");
  });
});
