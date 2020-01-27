import React, { Component } from 'react';
import { hot } from 'react-hot-loader';
import createStore from '../../../bootstrap/createStore';
import App from './App';

class Root extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { store: null };
  }

  componentWillMount() {
    createStore().then((store) => this.setState({ store }));
  }

  render() {
    const { history } = this.props;
    const { store } = this.state;
    return store ? <App store={store} history={history} /> : null;
  }
}

export default hot(module)(Root);
