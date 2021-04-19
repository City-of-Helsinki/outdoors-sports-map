import { ReactNode } from "react";

type Props = {
  id: string;
  isSelected?: boolean;
  className: string;
  children: ReactNode;
};

export function View({ id, isSelected = false, className, children }: Props) {
  return (
    <div
      id={id}
      className={`view ${isSelected ? "view--selected" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

export default View;
