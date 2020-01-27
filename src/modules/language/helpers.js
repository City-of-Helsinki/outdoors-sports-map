import { APP_NAME } from '../common/constants';
import { MODULE_NAME } from './constants';

export const getStoredLang = () => localStorage.getItem(`${APP_NAME}:${MODULE_NAME}`);
