
import { POST } from "./route";
import { NextRequest, NextResponse } from "next/server";
import { sendLoginAlertEmail } from "@/services/email.service";

// Mock a dependência sendLoginAlertEmail
jest.mock("@/services/email.service", () => ({
  sendLoginAlertEmail: jest.fn(),
}));

// Mock o fetch global
global.fetch = jest.fn();

describe("API Route: /api/auth/login-alert", () => {
  beforeEach(() => {
    // Limpa os mocks antes de cada teste
    jest.clearAllMocks();
  });

  it("deve enviar um alerta de login e retornar 200 em caso de sucesso", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User",
        userAgent: "Test Agent",
        deviceInfo: { userAgent: "Device Agent" },
      }),
      headers: new Headers({
        "x-forwarded-for": "123.123.123.123",
      }),
    } as unknown as NextRequest;

    // Mock da resposta da API de geolocalização
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        status: "success",
        city: "Test City",
        regionName: "Test Region",
        country: "Test Country",
      }),
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);
    expect(responseBody.message).toBe("Alerta de login enviado com sucesso");

    expect(sendLoginAlertEmail).toHaveBeenCalledTimes(1);
    expect(sendLoginAlertEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      expect.objectContaining({
        ip: "123.123.123.123",
        location: "Test City, Test Region, Test Country",
        userAgent: "Device Agent",
      })
    );
  });

  it("deve retornar 400 se o email não for fornecido", async () => {
    const mockRequest = {
      json: async () => ({
        name: "Test User",
      }),
      headers: new Headers(),
    } as unknown as NextRequest;

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(400);
    expect(responseBody.error).toBe("Email é obrigatório");
    expect(sendLoginAlertEmail).not.toHaveBeenCalled();
  });

  it("deve lidar com falha na API de geolocalização e continuar a execução", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User",
      }),
      headers: new Headers({
        "x-real-ip": "123.123.123.123",
      }),
    } as unknown as NextRequest;

    // Mock de falha na API de geolocalização
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(200);
    expect(responseBody.success).toBe(true);

    expect(sendLoginAlertEmail).toHaveBeenCalledWith(
      "test@example.com",
      "Test User",
      expect.objectContaining({
        location: "Desconhecida",
      })
    );
  });

  it("deve retornar 500 se ocorrer um erro interno", async () => {
    const mockRequest = {
      json: async () => ({
        email: "test@example.com",
        name: "Test User",
      }),
      headers: new Headers(),
    } as unknown as NextRequest;

    // Força um erro no serviço de email
    (sendLoginAlertEmail as jest.Mock).mockRejectedValueOnce(new Error("Erro de envio"));

    const response = await POST(mockRequest);
    const responseBody = await response.json();

    expect(response.status).toBe(500);
    expect(responseBody.error).toBe("Erro interno do servidor");
  });
});
