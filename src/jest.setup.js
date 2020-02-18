import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => (Component) => {
    // eslint-disable-next-line no-param-reassign
    Component.defaultProps = { ...Component.defaultProps, t: (k) => k };
    return Component;
  },
}));

configure({ adapter: new Adapter() });
