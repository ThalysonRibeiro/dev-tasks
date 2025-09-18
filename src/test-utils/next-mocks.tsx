// Mock for matchMedia
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}

// Add global mocks for Next.js specific functions
jest.mock('next/navigation', () => ({
  ...jest.requireActual('next/navigation'), // Import and retain default behavior
  redirect: jest.fn(), // Mock redirect
}));

jest.mock('../lib/getSession', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve(null)), // Mock getSession to return null by default
}));

// More robust mock for next/image that explicitly filters Next.js specific props
jest.mock('next/image', () => ({
  __esModule: true,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  default: (props: any) => {
    const { src, alt, width, height, priority, layout, objectFit, ...rest } = props;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt} width={width} height={height} {...rest} />;
  },
}));

// Mock o NextResponse
jest.mock('next/server', () => ({
  ...jest.requireActual('next/server'),
  NextResponse: {
    json: jest.fn((body, init) => {
      return {
        json: () => Promise.resolve(body),
        status: init?.status || 200,
        headers: new Headers(),
      };
    }),
  },
}));
