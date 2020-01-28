import { APP_NAME } from '../common/constants';
import { MODULE_NAME } from './constants';

const getStoredLang = () => localStorage.getItem(`${APP_NAME}:${MODULE_NAME}`);
export default getStoredLang;
