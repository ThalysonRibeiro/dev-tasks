import { prismaMock } from "@/test-utils/prisma-mock";
import { auth } from "../auth";




// Mock 'next-auth'
jest.mock('next-auth', () => ({
  __esModule: true,
  default: jest.fn().mockImplementation((config) => {
    return {
      handlers: {},
      signIn: jest.fn(),
      signOut: jest.fn(),
      auth: jest.fn().mockImplementation(async () => {
        const session = {
          user: { id: 'user-1', name: 'Test User', email: 'test@example.com' },
          expires: '2025-10-16T12:00:00.000Z',
        };
        // Simulate the session callback logic for the test
        if (config.callbacks && config.callbacks.session) {
          return await config.callbacks.session({ session, user: session.user });
        }
        return session;
      }),
    };
  }),
}));

describe('getSession (auth)', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(auth).toBeDefined();
  });

  type MockUser = {
    id: string;
    UserSettings: {
      id: string;
      userId: string;
      // other settings...
    } | null;
    // other user properties...
  };

  it('should create user settings if they do not exist', async () => {
    // Arrange: Mock that the user exists but has no settings
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: 'user-1',
      UserSettings: null,
      // other user properties...
    } as MockUser);

    // Act: Call the function that would be called by NextAuth
    const session = await auth();

    // Assert: Check that create was called and session is returned
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { UserSettings: true },
    });
    expect(prismaMock.userSettings.create).toHaveBeenCalledWith({
      data: { userId: 'user-1' },
    });
    expect(session).toBeDefined();
    expect(session?.user?.id).toBe('user-1');
  });

  it('should not create user settings if they already exist', async () => {
    // Arrange: Mock that the user and their settings exist
    prismaMock.user.findFirst.mockResolvedValueOnce({
      id: 'user-1',
      UserSettings: {
        id: 'settings-1',
        userId: 'user-1',
        // other settings...
      },
      // other user properties...
    } as MockUser);

    // Act: Call the function
    const session = await auth();

    // Assert: Check that create was NOT called
    expect(prismaMock.user.findFirst).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      include: { UserSettings: true },
    });
    expect(prismaMock.userSettings.create).not.toHaveBeenCalled();
    expect(session).toBeDefined();
  });
});
