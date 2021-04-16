import { Link } from "react-router-dom";

const addressIcon = require("../../../assets/markers/unknown-satisfactory-off.png")
  .default;

type Props = {
  address: Record<string, any>;
  handleClick: (coordinates: [number, number]) => void;
};

function AddressSuggestion({ address, handleClick }: Props) {
  return (
    <Link
      to=""
      className="search-suggestions__result"
      onClick={(e) => {
        e.preventDefault();
        handleClick(address.geometry.coordinates.slice().reverse());
      }}
    >
      <div className="search-suggestions__address-icon">
        <img src={addressIcon} height="21px" alt="" />
      </div>
      <div className="search-suggestions__result-details">
        <div className="search-suggestions__result-details__name">
          {address.properties.label}
        </div>
      </div>
    </Link>
  );
}

export default AddressSuggestion;
