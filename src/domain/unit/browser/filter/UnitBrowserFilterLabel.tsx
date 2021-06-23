type Props = {
  message: string;
  id?: string;
};

function UnitBrowserFilterLabel({ message, id }: Props) {
  if (!message) {
    return null;
  }

  return (
    <div className="unit-filter-label" id={id}>
      <span>{message}:</span>
    </div>
  );
}

export default UnitBrowserFilterLabel;
