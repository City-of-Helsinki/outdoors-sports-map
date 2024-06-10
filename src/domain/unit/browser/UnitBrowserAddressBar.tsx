import useLanguage from "../../../common/hooks/useLanguage";
import { Address } from "../../app/appConstants";
import addressBarMarker from "../../assets/markers/location.svg";
import { getAddressToDisplay } from "../unitHelpers";

type Props = {
  address: Address;
  handleClick: (coordinates: [number, number]) => void;
};

function UnitBrowserAddressBarProps({ address, handleClick }: Props) {
  const language = useLanguage();

  return (
    <button
      type="button"
      className="address-bar__container"
      onClick={() => {
        const [long, lat] = address.location.coordinates;
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
