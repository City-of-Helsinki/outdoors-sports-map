import { vi } from 'vitest';
import '@testing-library/jest-dom';

// Suppress jsdom CSS parsing errors from hds-react
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorPatterns = [
    "Could not parse CSS stylesheet",
    "Error: Not implemented: HTMLFormElement.prototype.submit",
    "Support for defaultProps will be removed from function components in a future major release",
    "Error: Not implemented: navigation (except hash changes)",
  ];

  if (
    typeof args[0] === "string" &&
    errorPatterns.some((pattern) => args[0].includes(pattern))
  ) {
    return;
  }
  originalConsoleError(...args);
};

const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage ??= Object.create(localStorageMock);

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor() {}
  observe = vi.fn()
  unobserve = vi.fn()
  disconnect = vi.fn()
};

vi.spyOn(window.navigator, "languages", "get").mockReturnValue(["fi"]);