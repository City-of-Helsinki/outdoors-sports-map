// @flow
import React, { Component, Node } from 'react';
import PropTypes from 'prop-types';

export const MAIN_CONTENT_ID = 'main-content';

type Props = {
  children: Node,
  title: String,
};

class Page extends Component<Props> {
  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps) {
    const { title } = this.props;

    if (title !== prevProps.title) {
      this.updateTitle();
    }
  }

  updateTitle() {
    const { title } = this.props;

    document.title = title;
  }

  render() {
    const { children } = this.props;

    return (
      <main id={MAIN_CONTENT_ID} className="main-content">
        {children}
      </main>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
