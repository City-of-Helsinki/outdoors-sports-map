import { createAction } from "redux-actions";

import { languageActions } from "../i18nConstants";

const changeLanguage = (language: string) =>
  createAction(languageActions.CHANGE_LANGUAGE)(language);

export default changeLanguage;
