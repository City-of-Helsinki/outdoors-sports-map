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
};

function Page({ children, title, description, className, image }: Props) {
  return (
    <>
      <PageMeta title={title} description={description} image={image} />
      <main
        id={MAIN_CONTENT_ID}
        className={classNames("main-content", className)}
      >
        {children}
      </main>
    </>
  );
}

export default Page;
