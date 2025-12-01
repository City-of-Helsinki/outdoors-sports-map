// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";

// Suppress jsdom CSS parsing errors from hds-react
const originalConsoleError = console.error;
console.error = (...args: any[]) => {
  const errorPatterns = [
    "Could not parse CSS stylesheet",
    "Error: Not implemented: HTMLFormElement.prototype.submit",
    "Support for defaultProps will be removed from function components in a future major release",
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
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage ??= Object.create(localStorageMock);

// Mock ResizeObserver
class MockResizeObserver {
  callback: ResizeObserverCallback;

  constructor(callback: ResizeObserverCallback) {
    this.callback = callback;
  }

  observe() {
    // Mock implementation
  }

  disconnect() {
    // Mock implementation
  }

  unobserve() {
    // Mock implementation
  }
}

global.ResizeObserver ??= MockResizeObserver as any;

jest.spyOn(window.navigator, "languages", "get").mockReturnValue(["fi"]);
