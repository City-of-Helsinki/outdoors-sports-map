type Props = {
  icon: string;
  className?: string;
  title?: string;
  onClick?: (e: React.MouseEvent<HTMLSpanElement>) => void;
  style?: Record<string, unknown>;
};

function SMIcon({ icon, className, ...rest }: Props) {
  return <span className={`icon-icon-${icon} ${className || ""}`} {...rest} />;
}

export default SMIcon;
