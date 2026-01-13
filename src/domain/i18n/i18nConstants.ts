export const SUPPORTED_LANGUAGES = {
  Suomi: "fi",
  Svenska: "sv",
  English: "en",
} as const;

export const MODULE_NAME = "language";

export const languageParam = `:language(${Object.values(
  SUPPORTED_LANGUAGES,
).join("|")})`;
