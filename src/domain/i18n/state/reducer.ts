import { handleActions } from "redux-actions";

import { languageActions } from "../i18nConstants";

const languageReducer = handleActions(
  {
    [languageActions.CHANGE_LANGUAGE]: (state, { payload: language }) =>
      language,
  },
  null,
);

export default languageReducer;
