import { createAction } from "redux-actions";

import { languageActions } from "./constants";

const changeLanguage = (language) =>
  createAction(languageActions.CHANGE_LANGUAGE)(language);

export default changeLanguage;
