import { Link as RRLink, LinkProps } from "react-router-dom";

import useLanguage from "../hooks/useLanguage";
import * as PathUtils from "../utils/pathUtils";

export function getToWithLanguage(to: LinkProps["to"], lang: string) {
  if (typeof to === "function") {
    return PathUtils.getLocationFactoryWithLanguage(to, lang);
  }

  if (typeof to === "string") {
    return PathUtils.getPathnameWithLanguage(to, lang);
  }

  return PathUtils.getLocationWithLanguage(to, lang);
}

type Props = LinkProps & {
  lang?: false | string;
};

function Link({ to, lang: userLang, ...rest }: Props) {
  const language = useLanguage();

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
