import { render, screen } from "../../../../testingLibraryUtils";
import * as unitHelpers from "../../../unitHelpers";
import UnitBrowserResultList from "../UnitBrowserResultList";

jest.mock("../../../unitConstants", () => ({
  ...jest.requireActual("../../../unitConstants"),
  UNIT_BATCH_SIZE: 1,
}));

const units = {
  "53916": {
    id: 53916,
    name: {
      fi: "Mustavuori-Talosaari latu 5,5 km",
      sv: "Svarta backen-Husö skidspår 5,5 km",
    },
    street_address: {
      fi: "Niinisaarentie",
      sv: "Bastövägen",
      en: "Niinisaarentie",
    },
    www: {
      fi:
        "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
      sv:
        "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
      en:
        "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
    },
    phone: "+358 9 310 87906",
    address_zip: "00960",
    extensions: {
      maintenance_group: "kaikki",
      maintenance_organization: "helsinki",
    },
    municipality: "helsinki",
    services: [191],
    location: {
      type: "Point",
      coordinates: [25.171423, 60.234966],
    },
    connections: [],
    observations: [
      {
        unit: 53916,
        id: 51005,
        property: "ski_trail_condition",
        time: "2021-01-04T14:52:08.546026+0200",
        expiration_time: null,
        name: {
          fi: "Lumenpuute",
          sv: "Snöbrist",
          en: "Lack of snow",
        },
        quality: "unusable",
        value: "snowless",
        primary: true,
      },
    ],
  },
  "54419": {
    id: 54419,
    name: {
      fi: "Mustavuoren latu 2,1 km",
    },
    street_address: {
      fi: "Mustavuori",
      sv: "Svartbäcken",
      en: "Mustavuori",
    },
    www: null,
    phone: null,
    address_zip: "00960",
    extensions: {
      maintenance_group: "kaikki",
      maintenance_organization: "helsinki",
    },
    municipality: "helsinki",
    services: [191],
    location: {
      type: "Point",
      coordinates: [25.1415, 60.2288],
    },
    connections: [],
    observations: [
      {
        unit: 54419,
        id: 50985,
        property: "ski_trail_condition",
        time: "2021-01-04T14:48:26.140649+0200",
        expiration_time: null,
        name: {
          fi: "Lumenpuute",
          sv: "Snöbrist",
          en: "Lack of snow",
        },
        quality: "unusable",
        value: "snowless",
        primary: true,
      },
    ],
  },
};

const defaultProps = {
  position: [1, 1],
  maxUnitCount: 0,
  services: {},
};

const renderComponent = (props?: any) =>
  render(<UnitBrowserResultList {...defaultProps} {...props} />, undefined, {
    unit: {
      byId: units,
      isFetching: false,
      fetchError: null,
      all: Object.keys(units),
      iceskate: Object.keys(units),
      ski: Object.keys(units),
      swim: Object.keys(units),
      status_ok: [],
    } as any,
  });

beforeEach(() => {
  // Mock getDefaultSportFilter to always return the default winter sport ski
  jest.spyOn(unitHelpers, 'getDefaultSportFilter').mockImplementation(() => 'ski');
});

afterEach(() => {
  jest.restoreAllMocks();
});

describe("<UnitBrowserResultList />", () => {
  describe("show more link", () => {
    const getShowMoreLink = () =>
      screen.getByText("Näytä enemmän");

    it("should be rendered", async () => {  
      renderComponent();
      expect(getShowMoreLink()).toBeInTheDocument();
    });
    it("should load more units on click", async () => {
      renderComponent();

      expect(screen.getByText("Mustavuori-Talosaari latu 5,5 km")).toBeInTheDocument();
      expect(screen.queryByText("Mustavuoren latu 2,1 km")).not.toBeInTheDocument();

      const showMoreLink = getShowMoreLink();
      const user = require("@testing-library/user-event").default.setup();
      await user.click(showMoreLink);

      expect(screen.getByText("Mustavuoren latu 2,1 km")).toBeInTheDocument();
      expect(screen.getByText("Mustavuori-Talosaari latu 5,5 km")).toBeInTheDocument();
    });
  });
});

describe("<UnitBrowserResultListSort />", () => {
  it("should render sort by condition by default", async () => {
    renderComponent();
    expect(await screen.findByText("Paras kunto ensin")).toBeInTheDocument();
  });

  it("should render favorites by default if user has saved favorites", async () => {
    // Add unit to favourites
    const favouriteUnit = units["53916"];
    localStorage.setItem('favouriteUnits', JSON.stringify([favouriteUnit]));

    renderComponent();
    expect(await screen.findByText("Suosikit")).toBeInTheDocument();

    // Clean up
    localStorage.removeItem('favouriteUnits');
  });

  it("should render sort by condition if user has favorites but not in selected sport", async () => {
    // Add unit to favourites
    const favouriteUnit = {"id": 12345, "name": {"fi": "Testi tekojääkenttä" }, "services": [406]};
    localStorage.setItem('favouriteUnits', JSON.stringify([favouriteUnit]));

    renderComponent();
    expect(await screen.findByText("Paras kunto ensin")).toBeInTheDocument();

    // Clean up
    localStorage.removeItem('favouriteUnits');
  });
});
