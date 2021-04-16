import isEmpty from "lodash/isEmpty";

import { DEFAULT_LANG } from "../common/constants";
import { getAttr } from "../unit/helpers";

const getServiceName = (
  unitServices: number[],
  services: Record<string, any>,
  language: string | null | undefined = DEFAULT_LANG
) => {
  if (!services || isEmpty(services)) {
    return "";
  }

  // eslint-disable-next-line no-restricted-syntax
  for (const id of unitServices) {
    const service = services[id];

    if (service && typeof service.name !== "undefined") {
      return getAttr(services[id].name, language);
    }
  }

  return "";
};

export default getServiceName;
