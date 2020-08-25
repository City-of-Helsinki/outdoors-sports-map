/* eslint-disable global-require */
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-15';
import i18next from 'i18next';

i18next
  .init({
    resources: {
      en: {
        translation: require('../locales/en.json'),
      },
    },
    lng: 'en',
  }, (err, t) => {
    if (err) {
      console.log(err, t);
    }
  });

const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

// eslint-disable-next-line no-undef
global.localStorage = localStorageMock;

configure({ adapter: new Adapter() });
