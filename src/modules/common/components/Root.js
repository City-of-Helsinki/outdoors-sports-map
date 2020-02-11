import React, { Component } from 'react';
import createStore from '../../../bootstrap/createStore';
import App from './App';

class Root extends Component {
  constructor(props, context) {
    super(props, context);

    this.state = { store: null };
  }

  // eslint-disable-next-line camelcase
  UNSAFE_componentWillMount() {
    createStore().then((store) => this.setState({ store }));
  }

  render() {
    // eslint-disable-next-line react/prop-types
    const { history } = this.props;
    const { store } = this.state;
    return store ? <App store={store} history={history} /> : null;
  }
}

export default Root;
