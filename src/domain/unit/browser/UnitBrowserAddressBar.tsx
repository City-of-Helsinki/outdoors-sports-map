import { IconLocation, Tag, TagTheme } from "hds-react";

import useLanguage from "../../../common/hooks/useLanguage";
import { Address } from "../../app/appConstants";
import { getAddressToDisplay } from "../unitHelpers";

type Props = {
  address: Address;
  handleClick: (coordinates: [number, number]) => void;
};

function UnitBrowserAddressBarProps({ address, handleClick }: Props) {
  const language = useLanguage();

  const addressText = getAddressToDisplay(address, language) || "";

  return (
    <Tag 
      className="address-bar__container"
      iconStart={<IconLocation />}
      onClick={() => {
        const [long, lat] = address.location.coordinates;
        handleClick([lat, long]);
      }}
      theme={{
        '--background-color': 'var(--color-coat-of-arms)',
        '--background-color-hover': 'var(--color-coat-of-arms-dark)',
        '--color': 'var(--color-white)',
        "--border-color": 'var(--color-coat-of-arms)',
        "--border-color-hover": 'var(--color-coat-of-arms-dark)',
      } as TagTheme}
    >
      {addressText}
    </Tag>
  );
}

export default UnitBrowserAddressBarProps;
