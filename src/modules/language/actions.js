import { createAction } from 'redux-actions';
import { languageActions } from './constants';

export const changeLanguage = (language) => createAction(languageActions.CHANGE_LANGUAGE)(language);
