// @flow
import React from 'react';
import type { Node } from 'react';
import classNames from 'classnames';

import PageMeta from '../../meta/PageMeta';

export const MAIN_CONTENT_ID = 'main-content';

type Props = {
  children: Node,
  title: string,
  image?: ?string,
  className?: string,
  description?: ?string,
};

const Page = ({ children, title, description, className, image }: Props) => (
  <>
    <PageMeta title={title} description={description} image={image} />
    <main
      id={MAIN_CONTENT_ID}
      className={classNames('main-content', className)}
    >
      {children}
    </main>
  </>
);

export default Page;
