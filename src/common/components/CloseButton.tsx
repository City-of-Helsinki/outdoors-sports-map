import { Button, ButtonSize, ButtonTheme, ButtonVariant } from "hds-react";
import { CSSProperties } from "react";

type Props = {
  label: string;
  onClick: () => void;
  iconStart?: React.ReactNode;
  variant?: ButtonVariant;
  theme?: ButtonTheme;
  style?: CSSProperties;
};

function CloseButton({ label, onClick, iconStart, variant = ButtonVariant.Primary, theme, style }: Readonly<Props>) {
  return (
    <Button
      size={ButtonSize.Small}
      variant={variant}
      iconStart={iconStart}
      theme={theme}
      onClick={onClick}
      style={style}
    >
      {label}
    </Button>
  );
}

export default CloseButton;
