import classNames from "classnames";
import { Link as HdsLink, LinkSize, LinkProps } from "hds-react";
import { useTranslation } from "react-i18next";

type Props = {
  href: string;
  children: string;
  className?: string;
} & LinkProps;

function OutboundLink({ href, children, className, ...rest }: Props) {
  const { t } = useTranslation();
  const openInNewTabAriaLabel = t("OUTBOUND_LINK.OPEN_IN_NEW_TAB");
  const openInExternalDomainAriaLabel = t(
    "OUTBOUND_LINK.OPEN_IN_EXTERNAL_DOMAIN",
  );

  return (
    <HdsLink
      size={LinkSize.Small}
      openInNewTab={true}
      href={href}
      external
      openInNewTabAriaLabel={openInNewTabAriaLabel}
      openInExternalDomainAriaLabel={openInExternalDomainAriaLabel}
      className={classNames(className, "outbound-link")}
      {...rest}
    >
      {children}
    </HdsLink>
  );
}

export default OutboundLink;
