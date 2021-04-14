// @flow
import React, { Component } from 'react';
import type { Node } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

export const MAIN_CONTENT_ID = 'main-content';

type Props = {
  children: Node,
  title: string,
  className?: String,
};

class Page extends Component<Props> {
  componentDidMount() {
    this.updateTitle();
  }

  componentDidUpdate(prevProps: Props) {
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
    const { children, className } = this.props;

    return (
      <main
        id={MAIN_CONTENT_ID}
        className={classNames('main-content', className)}
      >
        {children}
      </main>
    );
  }
}

Page.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Page;
