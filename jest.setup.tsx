
const originalConsoleError = console.error;
console.error = (...args) => {
  const suppressedMessages = [
    'Erro na requisição: Error: Network error',
    'Received `true` for a non-boolean attribute `priority`',
    'A suspended resource finished loading inside a test, but the event was not wrapped in act',
    'A component suspended inside an `act` scope, but the `act` call was not awaited',
    'Erro ao enviar alerta de login:',
    'Erro ao verificar email:',
    'In HTML, <html> cannot be a child of <div>. This will cause a hydration error.',
  ];

  const isSuppressed = args.some(arg =>
    typeof arg === 'string' && suppressedMessages.some(msg => arg.includes(msg))
  );

  if (isSuppressed) {
    return;
  }

  originalConsoleError(...args);
};

import '@testing-library/jest-dom';
import './src/test-utils/global-mocks.ts';
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