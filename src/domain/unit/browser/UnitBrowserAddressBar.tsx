import { useTranslation } from "react-i18next";

import { Address } from "../../app/appConstants";
import addressBarMarker from "../../assets/markers/location.svg";
import { getAddressToDisplay } from "../unitHelpers";

type Props = {
  address: Address;
  handleClick: (coordinates: [number, number]) => void;
};

function UnitBrowserAddressBarProps({ address, handleClick }: Props) {
  const {
    i18n: {
      languages: [language],
    },
  } = useTranslation();

  return (
    <button
      type="button"
      className="address-bar__container"
      onClick={() => {
        const [lat, long] = address.location.coordinates;

        handleClick([lat, long]);
      }}
    >
      <img
        className="address-bar__marker"
        src={addressBarMarker}
        height="20px"
        width="16px"
        alt=""
      />
      {address && getAddressToDisplay(address, language)}
    </button>
  );
}

export default UnitBrowserAddressBarProps;
