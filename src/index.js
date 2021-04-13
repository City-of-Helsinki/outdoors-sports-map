/* eslint-disable import/no-extraneous-dependencies */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
/* eslint-enable import/no-extraneous-dependencies */
import { createElement } from 'react';
import { render } from 'react-dom';
import { createBrowserHistory } from 'history';

import './index.scss';
import Root from './modules/common/components/Root';

const history = createBrowserHistory();

render(createElement(Root, { history }), document.getElementById('root'));
