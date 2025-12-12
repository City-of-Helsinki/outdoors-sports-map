import classNames from "classnames";

type Props = {
  className?: string;
  icon?: React.ReactNode;
  label: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function HeaderButton({ icon, label, className, ...rest }: Props) {
  return (
    <button {...rest} className={classNames("header-button", className)}>
      <div className="header-button__content">
        <span>
          <span className="header-button__icon">{icon}</span>
          <span className="header-button__label">{label}</span>
        </span>
      </div>
    </button>
  );
}

export default HeaderButton;
