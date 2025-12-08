import classNames from "classnames";
import { IconArrowLeft } from "hds-react";
import { useLocation } from "react-router-dom";

import Link from "./Link";

type Props = {
  className?: string;
  label: string;
};

function BackLink({ className, label }: Readonly<Props>) {
  const location = useLocation<{ previous?: string }>();

  return (
    <Link // If there was a previous saved into location state, re-apply it
      to={location.state?.previous || "/"}
      className={classNames("back-link", className)}
      aria-label={label}
    >
      <div className="back-link-content">
        <IconArrowLeft aria-hidden="true" />
        <span className="back-link-label">{label}</span>
      </div>
    </Link>
  );
}

export default BackLink;
