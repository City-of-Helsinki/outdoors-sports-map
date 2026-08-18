import { Button, ButtonVariant, IconCopy } from "hds-react";

type Props = {
  id: string;
  label: string;
  value: string;
  copyLabel: string;
  copiedLabel: string;
  copied: boolean;
  onCopy: () => void;
};

function CopyRow({ id, label, value, copyLabel, copiedLabel, copied, onCopy }: Readonly<Props>) {
  return (
    <div className="embed-tool-modal__copy-row">
      <label className="embed-tool-modal__copy-label" htmlFor={id}>
        {label}
      </label>
      <div className="embed-tool-modal__copy-box">
        <input
          id={id}
          className="embed-tool-modal__copy-text"
          value={value}
          readOnly
        />
        <Button
          variant={ButtonVariant.Primary}
          iconEnd={<IconCopy aria-hidden />}
          onClick={onCopy}
        >
          {copied ? copiedLabel : copyLabel}
        </Button>
      </div>
      {/* visually hidden live region announces copy result to screen readers */}
      <span
        role="status"
        aria-live="polite"
        style={{ position: "absolute", width: 1, height: 1, overflow: "hidden", clip: "rect(0,0,0,0)", whiteSpace: "nowrap" }}
      >
        {copied ? copiedLabel : ""}
      </span>
    </div>
  );
}

export default CopyRow;
