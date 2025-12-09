import classNames from "classnames";

type Props = {
  className?: string;
  icon: React.ReactNode;
  iconPosition?: "start" | "end";
  showTextAlways?: boolean;
  text: string;
  onClick: () => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

function TextRevealButton({
  className,
  icon,
  iconPosition = "start",
  showTextAlways = false,
  text,
  onClick,
  ...rest
}: Props) {
  return (
    <button
      {...rest}
      aria-label={text}
      className={classNames(
        "text-reveal-button",
        { "text-reveal-button--show-text-always": showTextAlways },
        className,
      )}
      onClick={onClick}
    >
      <div className="text-reveal-button__wrapper">
        {iconPosition === "start" && icon}
        <div className="text-reveal-button__text">{text}</div>
        {iconPosition === "end" && icon}
      </div>
    </button>
  );
}

export default TextRevealButton;
