import {Link as HDSLink, LinkSize} from "hds-react";
import React from "react";

type EmailProps = {
  children: string;
};

export function Email({ children }: EmailProps) {
  return <HDSLink size={LinkSize.Small} href={`mailto:${children}`}>{children}</HDSLink>;
}

type LinkWithoutLabelProps = {
  children: string;
  external?: boolean;
  openInNewTab?: boolean;
};

export function LinkWithoutLabel({ children, external, openInNewTab }: LinkWithoutLabelProps) {
  const hasProtocol = /^https?:\/\/|^ftp:\/\//.test(children);
  return <HDSLink external={external} openInNewTab={openInNewTab} size={LinkSize.Small} href={`${hasProtocol ? '' : 'https://'}${children}`}>{children}</HDSLink>;
}

type LinkProps = {
  children: string;
  external?: boolean;
  href: string;
  openInNewTab?: boolean;
};

export function Link({ children, href, external, openInNewTab }: LinkProps) {
  return <HDSLink external={external} openInNewTab={openInNewTab} size={LinkSize.Small} href={href}>{children}</HDSLink>;
}

type PhoneNumberProps = {
  children: string;
};

export function PhoneNumber({ children }: PhoneNumberProps) {
  return <HDSLink size={LinkSize.Small} href={`tel:${children.replace(/ /g, "")}`}>{children}</HDSLink>;
}
