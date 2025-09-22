import { render, screen } from '@testing-library/react';
import { redirect } from 'next/navigation';
import getSession from '@/lib/getSession';
import { getDesktops } from './_data-access/get-desktops';
import { Desktop, Group, Item } from '@/generated/prisma';
import { Session } from 'next-auth';
import Layout from './layout';

// Mock apenas o que não está nos mocks globais
jest.mock('./_data-access/get-desktops');

jest.mock("./_components/sidebar/app-sidebar", () => ({
  AppSidebar: ({ desktops, userData }: { desktops: Desktop[], userData: Session | null }) => (
    <div data-testid="app-sidebar">
      <span data-testid="desktops-count">{desktops?.length || 0}</span>
      <span data-testid="user-email">{userData?.user?.email || 'no-email'}</span>
    </div>
  )
}));

jest.mock('@/components/ui/sidebar', () => ({
  SidebarProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="sidebar-provider">{children}</div>
  ),
  SidebarTrigger: ({ className }: { className?: string }) => (
    <button data-testid="sidebar-trigger" className={className}>
      Toggle
    </button>
  ),
}));

const mockSession = {
  user: { id: '1', email: 'user@test.com' }
} as Session;

type MockedDesktop = Desktop & {
  groupe: (Group & { item: Item[] })[];
};

const mockDesktops: MockedDesktop[] = [
  { id: '1', title: 'Desktop 1', createdAt: new Date(), updatedAt: new Date(), userId: '1', groupe: [] },
  { id: '2', title: 'Desktop 2', createdAt: new Date(), updatedAt: new Date(), userId: '1', groupe: [] }
];

const mockGetDesktops = getDesktops as jest.MockedFunction<typeof getDesktops>;
const mockRedirect = redirect as jest.MockedFunction<typeof redirect>;
const mockGetSession = getSession as unknown as jest.Mock<Promise<Session | null>>;

describe('Dashboard Layout', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("Authentication", () => {
    it("should redirect to home when no session exists", async () => {
      // Mock para retornar null (usuário não autenticado)
      mockGetSession.mockResolvedValue(null);

      // Mock redirect to throw an error, simulating Next.js behavior
      mockRedirect.mockImplementation(() => {
        throw new Error('NEXT_REDIRECT'); // Next.js internal error for redirect
      });

      // Expect the Layout component to throw the redirect error
      await expect(Layout({ children: <div>Test</div> })).rejects.toThrow('NEXT_REDIRECT');

      expect(mockRedirect).toHaveBeenCalledWith('/');
      expect(mockGetDesktops).not.toHaveBeenCalled();
    });

    it("should not redirect when session exists", async () => {
      // Sobrescreve o mock global para este teste
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDesktops.mockResolvedValue([]);

      const result = await Layout({ children: <div>Test</div> });

      expect(mockRedirect).not.toHaveBeenCalled();
      expect(mockGetDesktops).toHaveBeenCalled();
    });
  });

  describe('Data Loading', () => {
    beforeEach(() => {
      mockGetSession.mockResolvedValue(mockSession);
    });

    it('should load desktops when authenticated', async () => {
      mockGetDesktops.mockResolvedValue(mockDesktops);

      const result = await Layout({
        children: <div data-testid="children">Test Content</div>
      });

      expect(mockGetDesktops).toHaveBeenCalled();

      // Renderizar o resultado para verificar props
      render(result);
      expect(screen.getByTestId('desktops-count')).toHaveTextContent('2');
    });

    it('should handle empty desktops array', async () => {
      mockGetDesktops.mockResolvedValue([]);

      const result = await Layout({
        children: <div data-testid="children">Test Content</div>
      });

      render(result);
      expect(screen.getByTestId('desktops-count')).toHaveTextContent('0');
    });

    it('should handle getDesktops error gracefully', async () => {
      mockGetDesktops.mockRejectedValue(new Error('Database error'));

      // O layout deve propagar o erro
      await expect(
        Layout({ children: <div>Test</div> })
      ).rejects.toThrow('Database error');

      // Verifica que não tentou fazer redirect por erro
      expect(mockRedirect).not.toHaveBeenCalled();
    });
  });

  describe('Component Rendering', () => {
    const localMockDesktops: MockedDesktop[] = [{ id: '1', title: 'Desktop 1', createdAt: new Date(), updatedAt: new Date(), userId: '1', groupe: [] }];

    beforeEach(() => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDesktops.mockResolvedValue(localMockDesktops);
    });

    it('should render all components with correct props', async () => {
      const result = await Layout({
        children: <div data-testid="test-children">Children Content</div>
      });

      render(result);

      // Verifica se todos os componentes estão presentes
      expect(screen.getByTestId('sidebar-provider')).toBeInTheDocument();
      expect(screen.getByTestId('app-sidebar')).toBeInTheDocument();
      expect(screen.getByTestId('sidebar-trigger')).toBeInTheDocument();
      expect(screen.getByTestId('test-children')).toBeInTheDocument();
    });

    it('should pass correct props to AppSidebar', async () => {
      const result = await Layout({
        children: <div>Test</div>
      });

      render(result);

      expect(screen.getByTestId('desktops-count')).toHaveTextContent('1');
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@test.com');
    });

    it('should render SidebarTrigger with fixed class', async () => {
      const result = await Layout({
        children: <div>Test</div>
      });

      render(result);

      const trigger = screen.getByTestId('sidebar-trigger');
      expect(trigger).toHaveClass('fixed');
    });

    it('should render main with correct classes', async () => {
      const result = await Layout({
        children: <div data-testid="child">Test</div>
      });

      render(result);

      const main = screen.getByRole('main');
      expect(main).toHaveClass('w-full', 'px-2', 'pt-4');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete happy path flow', async () => {
      mockGetSession.mockResolvedValue(mockSession);
      mockGetDesktops.mockResolvedValue(mockDesktops);

      const result = await Layout({
        children: <div data-testid="app-content">Dashboard Content</div>
      });

      render(result);

      // Verifica fluxo completo
      expect(mockRedirect).not.toHaveBeenCalled();
      expect(screen.getByTestId('app-content')).toBeInTheDocument();
      expect(screen.getByTestId('desktops-count')).toHaveTextContent('2');
      expect(screen.getByTestId('user-email')).toHaveTextContent('user@test.com');
    });

    it('should maintain proper component hierarchy', async () => {
      mockGetSession.mockResolvedValue(mockSession);

      const result = await Layout({
        children: <div data-testid="child-content">Child</div>
      });

      render(result);

      // Verifica hierarquia: SidebarProvider > (AppSidebar + main)
      const sidebarProvider = screen.getByTestId('sidebar-provider');
      const appSidebar = screen.getByTestId('app-sidebar');
      const main = screen.getByRole('main');
      const childContent = screen.getByTestId('child-content');

      expect(sidebarProvider).toContainElement(appSidebar);
      expect(sidebarProvider).toContainElement(main);
      expect(main).toContainElement(childContent);
    });
  });
});