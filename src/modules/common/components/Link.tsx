import React from "react";
import type { Node } from "react";
import { useTranslation } from "react-i18next";
import type { LocationShape } from "react-router-dom";
import { Link as RRLink } from "react-router-dom";

import * as PathUtils from "../pathUtils";

export function getToWithLanguage(to: string | LocationShape, lang: string) {
  if (typeof to === "function") {
    return PathUtils.getLocationFactoryWithLanguage(to, lang);
  }

  if (typeof to === "string") {
    return PathUtils.getPathnameWithLanguage(to, lang);
  }

  return PathUtils.getLocationWithLanguage(to, lang);
}

type Props = {
  className?: string;
  to: string | LocationShape;
  replace?: boolean;
  children?: Node;
} & {
  lang?: false | string;
};

function Link({ to, lang: userLang, ...rest }: Props) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  const lang = userLang !== undefined ? userLang : language;

  // Allow the language interpolation to be ignored in case the language
  // is already available in the url or if it's not needed.
  const injectedTo =
    typeof lang === "boolean" && lang === false
      ? to
      : getToWithLanguage(to, lang);

  return <RRLink {...rest} to={injectedTo} />;
}

export default Link;
