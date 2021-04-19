type Props = {
  icon: string;
  className?: string;
  alt?: string;
};

function OSMIcon({ icon, className, ...rest }: Props) {
  return <span className={`icon-${icon} ${className || ""}`} {...rest} />;
}

export default OSMIcon;
