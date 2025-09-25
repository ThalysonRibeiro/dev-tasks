import { test, expect } from "@playwright/test";

test.describe("Public Pages", () => {
  test.describe("Home Page", () => {
    test("should display the home page and initiate login", async ({ page }) => {
      await page.goto("/");

      // Check for the main title
      await expect(page.getByRole("heading", { name: "dev tasks" })).toBeVisible();

      // Check for the sign-in card
      await expect(page.getByTestId("card-signin")).toBeVisible();

      // Test the GitHub login button
      const githubLoginButton = page.getByRole("button", { name: /github/i });
      await expect(githubLoginButton).toBeVisible();
      await githubLoginButton.click();
      await page.waitForURL(/github/);
      await expect(page.url()).toContain("github.com");

      // Go back to the home page for the next test
      await page.goto("/");

      // Test the Google login button
      const googleLoginButton = page.getByRole("button", { name: /google/i });
      await expect(googleLoginButton).toBeVisible();
      await googleLoginButton.click();
      await page.waitForURL(/google/);
      await expect(page.url()).toContain("accounts.google.com");
    });
  });

  test.describe("Verify Email Page", () => {
    test("should show success message for valid token", async ({ page }) => {
      await page.route("/api/verify-email?token=valid-token", async route => {
        await route.fulfill({
          status: 200,
          json: { message: "E-mail confirmado com sucesso!" },
        });
      });

      await page.goto("/verify-email?token=valid-token");

      await expect(page.getByText("E-mail Verificado!")).toBeVisible();
      await expect(page.getByText("E-mail confirmado com sucesso!")).toBeVisible();
      await expect(page.getByText(/Redirecionando para a página de login em/)).toBeVisible();

      // Check that it redirects
      await page.getByRole("button", { name: "Ir para Login Agora" }).click();
      await expect(page).toHaveURL("/");
    });

    test("should show error message for invalid token", async ({ page }) => {
      await page.route("/api/verify-email?token=invalid-token", async route => {
        await route.fulfill({
          status: 400,
          json: { error: "Token inválido." },
        });
      });

      await page.goto("/verify-email?token=invalid-token");

      await expect(page.getByText("Erro na Verificação")).toBeVisible();
      await expect(page.getByText("Token inválido.")).toBeVisible();
    });

    test("should show error message for no token", async ({ page }) => {
      await page.goto("/verify-email");

      await expect(page.getByText("Erro na Verificação")).toBeVisible();
      await expect(page.getByText("Token de verificação não encontrado.")).toBeVisible();
    });
  });
});