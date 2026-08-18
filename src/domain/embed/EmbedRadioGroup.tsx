import { RadioButton } from "hds-react";

type Option<T extends string> = {
  value: T;
  label: string;
};

type Props<T extends string> = {
  name: string;
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
};

function EmbedRadioGroup<T extends string>({ name, options, value, onChange }: Readonly<Props<T>>) {
  return options.map((opt) => (
    <RadioButton
      key={opt.value}
      id={`${name}-${opt.value}`}
      name={name}
      value={opt.value}
      label={opt.label}
      checked={value === opt.value}
      onChange={() => onChange(opt.value)}
    />
  ));
}

export default EmbedRadioGroup;
