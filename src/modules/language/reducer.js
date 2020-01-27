import { handleActions } from 'redux-actions';
import { languageActions } from './constants';
import { DEFAULT_LANG } from '../common/constants';

const languageReducer = handleActions({
  [languageActions.CHANGE_LANGUAGE]: (state, { payload: language }) => language,
}, DEFAULT_LANG);

export default languageReducer;
