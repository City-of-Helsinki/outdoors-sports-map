import { CSSProperties, ReactNode } from "react";

type Props = {
  id: string;
  isSelected?: boolean;
  className: string;
  children: ReactNode;
  tabIndex?: number;
  style?: CSSProperties;
};

export function View({
  id,
  isSelected = false,
  className,
  children,
  ...rest
}: Props) {
  return (
    <div
      id={id}
      className={`view ${isSelected ? "view--selected" : ""} ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

export default View;
