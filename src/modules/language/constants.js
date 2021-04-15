// @flow
import { normalizeActionName } from '../common/helpers';

export const SUPPORTED_LANGUAGES = {
  Suomi: 'fi',
  Svenska: 'sv',
  English: 'en',
};

export const languageActions = {
  CHANGE_LANGUAGE: normalizeActionName('home/CHANGE_LANGUAGE'),
};

export const MODULE_NAME = 'language';

export type LanguageState = string;

export const languageParam = `:language(${Object.values(
  SUPPORTED_LANGUAGES
).join('|')})`;
