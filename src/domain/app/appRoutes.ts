import { languageParam } from "../i18n/i18nConstants";

const routerPaths = {
  unitDetails: `/${languageParam}/unit/:unitId`,
  unitBrowser: `/${languageParam}`,
  unitBrowserSearch: `/${languageParam}/search`,
};

export default routerPaths;
