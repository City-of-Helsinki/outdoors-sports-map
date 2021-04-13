import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

jest.spyOn(window.navigator, 'languages', 'get').mockReturnValue(['fi']);

configure({ adapter: new Adapter() });
