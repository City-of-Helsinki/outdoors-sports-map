// @flow

export const SUPPORTED_LANGUAGES = {
  English: 'en',
  Svenska: 'sv',
  Suomi: 'fi',
};

export const languageActions = {
  CHANGE_LANGUAGE: 'home/CHANGE_LANGUAGE',
};

export const MODULE_NAME = 'language';

export type LanguageState = string;
