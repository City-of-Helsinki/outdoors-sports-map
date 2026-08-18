type Props = {
  id: string;
  label: string;
  value: string;
  unit?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function SizeInput({ id, label, value, unit, onChange }: Readonly<Props>) {
  return (
    <div className="embed-tool-modal__size-input-wrapper">
      <input
        id={id}
        type="number"
        inputMode="numeric"
        pattern="[0-9]*"
        aria-label={label}
        value={value}
        onChange={onChange}
        className="embed-tool-modal__size-input-field"
      />
      {unit && <span className="embed-tool-modal__size-unit" aria-hidden="true">{unit}</span>}
    </div>
  );
}

export default SizeInput;
