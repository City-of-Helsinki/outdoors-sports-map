import React, { } from 'react';
// eslint-disable-next-line import/no-extraneous-dependencies
import { mount as enzymeMount } from 'enzyme';
import { Provider } from 'react-redux';

import createStore from '../../bootstrap/createStore';
import TranslationProvider from './components/translation/TranslationProvider';

// eslint-disable-next-line import/prefer-default-export
export const mount = async (element) => {
  const store = await createStore();

  return enzymeMount(
    <Provider store={store}>
      <TranslationProvider>
        {element}
      </TranslationProvider>
    </Provider>,
  );
};
