import 'core-js/stable';
import 'regenerator-runtime/runtime';
import { createElement } from 'react';
import { render } from 'react-dom';
import { browserHistory } from 'react-router';
import './index.scss';
import Root from './modules/common/components/Root';

render(
  createElement(Root, { history: browserHistory }),
  document.getElementById('root'),
);
