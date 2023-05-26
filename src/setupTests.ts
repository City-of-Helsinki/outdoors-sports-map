// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import "@testing-library/jest-dom";
import Adapter from "@wojtekmaj/enzyme-adapter-react-17";
import { configure } from "enzyme";

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage ??= Object.create(localStorageMock);

jest.spyOn(window.navigator, "languages", "get").mockReturnValue(["fi"]);
configure({
  adapter: new Adapter(),
});
