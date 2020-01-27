// @flow
import isEmpty from 'lodash/isEmpty';
import { DEFAULT_LANG } from '../common/constants';
import { getAttr } from '../unit/helpers';

export const getServiceName = (unitServices: number[], services: Object, language: ?string = DEFAULT_LANG) => {
  if (!services || isEmpty(services)) {
    return '';
  }
  for (const id of unitServices) {
    const service = services[id];
    if (service && typeof service.name !== 'undefined') {
      return getAttr(services[id].name, language);
    }
  }
  return '';
};
