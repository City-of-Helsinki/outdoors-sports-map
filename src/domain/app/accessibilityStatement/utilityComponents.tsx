import React from "react";

type EmailProps = {
  children: string;
};

export function Email({ children }: EmailProps) {
  return <a href={`mailto:${children}`}>{children}</a>;
}

type LinkWithoutLabelProps = {
  children: string;
};

export function LinkWithoutLabel({ children }: LinkWithoutLabelProps) {
  return <a href={`https://${children}`}>{children}</a>;
}

type LinkProps = {
  children: string;
  href: string;
};

export function Link({ children, href }: LinkProps) {
  return <a href={href}>{children}</a>;
}

type PhoneNumberProps = {
  children: string;
};

export function PhoneNumber({ children }: PhoneNumberProps) {
  return <a href={`tel:${children.replace(/ /g, "")}`}>{children}</a>;
}
