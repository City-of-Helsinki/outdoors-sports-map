/* eslint-disable global-require */
import { configure } from 'enzyme';
import i18next from 'i18next';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => (Component) => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: (k) => k };
    return Component;
  },
  (err, t) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.log(err, t);
    }
  }
);

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

configure({ adapter: new Adapter() });
