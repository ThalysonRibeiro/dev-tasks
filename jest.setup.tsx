// IMPORTANT: This console.error override must be at the very top
// to ensure it's applied before other modules might log errors.
const originalConsoleError = console.error;
console.error = (...args) => {
  const [message, ...rest] = args;
  // Suppress the "Erro na requisição: Error: Network error" message
  if (typeof message === 'string' && message.includes('Erro na requisição: Error: Network error')) {
    return;
  }
  // Suppress the 'priority' warning
  if (typeof message === 'string' && message.includes('Received `true` for a non-boolean attribute `priority`')) {
    return;
  }
  // Also suppress the "act" warnings if they reappear, as they are also noisy
  if (typeof message === 'string' && message.includes('A suspended resource finished loading inside a test, but the event was not wrapped in act')) {
    return;
  }
  if (typeof message === 'string' && message.includes('A component suspended inside an `act` scope, but the `act` call was not awaited')) {
    return;
  }
  originalConsoleError(message, ...rest);
};

import '@testing-library/jest-dom';
import 'whatwg-fetch';
import { TextEncoder, TextDecoder } from 'util';
global.TextEncoder = TextEncoder as typeof global.TextEncoder;
global.TextDecoder = TextDecoder as typeof global.TextDecoder;

// Polyfill for requestAnimationFrame
global.requestAnimationFrame = (cb: FrameRequestCallback) => {
  return setTimeout(cb, 0);
};

global.cancelAnimationFrame = (id: number) => {
  clearTimeout(id);
};

import './src/test-utils/next-mocks.tsx';

import { prismaMock, mockReset } from './src/test-utils/prisma-mock';

beforeEach(() => {
  mockReset(prismaMock);
});