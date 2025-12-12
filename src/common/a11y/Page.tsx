import classNames from "classnames";
import { ReactNode } from "react";

import PageMeta from "../../domain/meta/PageMeta";

export const MAIN_CONTENT_ID = "main-content";

type Props = {
  children: ReactNode;
  title: string;
  image?: string | null;
  className?: string;
  description?: string | null;
  style?: React.CSSProperties;
};

function Page({
  children,
  title,
  description,
  className,
  image,
  style,
}: Readonly<Props>) {
  return (
    <>
      <PageMeta title={title} description={description} image={image} />
      <main
        id={MAIN_CONTENT_ID}
        className={classNames("main-content", className)}
        style={style}
      >
        {children}
      </main>
    </>
  );
}

export default Page;
