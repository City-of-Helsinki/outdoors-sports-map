import userEvent from "@testing-library/user-event";

import { render, screen } from "../../../../testingLibraryUtils";
import * as unitHelpers from "../../../unitHelpers";
import UnitBrowserResultList from "../UnitBrowserResultList";

vi.mock("../../../unitConstants", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    UNIT_BATCH_SIZE: 1,
  };
});

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
      fi: "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
      sv: "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
      en: "https://www.hel.fi/helsinki/fi/kulttuuri-ja-vapaa-aika/liikunta/ulkoliikuntapaikat/ladut/",
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

const renderComponent = (props?: any, customState?: any) =>
  render(
    <UnitBrowserResultList {...defaultProps} {...props} />,
    undefined,
    customState || {
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
    },
  );

beforeEach(() => {
  // Mock getDefaultSportFilter to always return the default winter sport ski
  vi
    .spyOn(unitHelpers, "getDefaultSportFilter")
    .mockImplementation(() => "ski");
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("<UnitBrowserResultList />", () => {
  describe("show more link", () => {
    const getShowMoreLink = () => screen.getByText("Näytä enemmän");

    it("should be rendered", async () => {
      renderComponent();
      expect(getShowMoreLink()).toBeInTheDocument();
    });
    it("should load more units on click", async () => {
      renderComponent();

      expect(
        screen.getByText("Mustavuori-Talosaari latu 5,5 km"),
      ).toBeInTheDocument();
      expect(
        screen.queryByText("Mustavuoren latu 2,1 km"),
      ).not.toBeInTheDocument();

      const showMoreLink = getShowMoreLink();
      const user = userEvent.setup();
      await user.click(showMoreLink);

      expect(screen.getByText("Mustavuoren latu 2,1 km")).toBeInTheDocument();
      expect(
        screen.getByText("Mustavuori-Talosaari latu 5,5 km"),
      ).toBeInTheDocument();
    });
  });

  describe("no results scenarios", () => {
    it("should display 'no results' text when no units found", async () => {
      renderComponent(
        {},
        {
          unit: {
            byId: {},
            isFetching: false,
            fetchError: null,
            all: [],
            iceskate: [],
            ski: [],
            swim: [],
            status_ok: [],
          } as any,
        },
      );

      expect(await screen.findByText("Ei hakutuloksia")).toBeInTheDocument();
    });

    it("should display 'no favorites' text when sorting by favorites but no favorites exist", async () => {
      // Mock localStorage to have no favorites
      localStorage.removeItem("favouriteUnits");

      renderComponent();

      // First, change sort to favorites
      const user = userEvent.setup();
      const sortButton = await screen.findByText(/Paras kunto ensin/);
      await user.click(sortButton);

      const favoritesOption = await screen.findByText("Suosikit");
      await user.click(favoritesOption);

      expect(await screen.findByText("Ei suosikkeja")).toBeInTheDocument();
    });

    it("should display 'no favorites' text when favorites exist but none match current sport", async () => {
      // Add a favorite unit for a different sport (ice skating)
      const favouriteUnit = {
        id: 12345,
        name: { fi: "Testi tekojääkenttä" },
        services: [406], // ice skating service
      };
      localStorage.setItem("favouriteUnits", JSON.stringify([favouriteUnit]));

      renderComponent();

      // Change sort to favorites
      const user = userEvent.setup();
      const sortButton = await screen.findByText(/Paras kunto ensin/);
      await user.click(sortButton);

      const favoritesOption = await screen.findByText("Suosikit");
      await user.click(favoritesOption);

      expect(await screen.findByText("Ei suosikkeja")).toBeInTheDocument();

      // Clean up
      localStorage.removeItem("favouriteUnits");
    });
  });

  describe("result count", () => {
    it("should display plural result count when multiple results exist", async () => {
      renderComponent();
      expect(await screen.findByRole("status")).toHaveTextContent(
        "2 hakutulosta",
      );
    });

    it("should display singular result count when one result exists", async () => {
      renderComponent(
        {},
        {
          unit: {
            byId: { "53916": units["53916"] },
            isFetching: false,
            fetchError: null,
            all: ["53916"],
            iceskate: ["53916"],
            ski: ["53916"],
            swim: ["53916"],
            status_ok: [],
          } as any,
        },
      );
      expect(await screen.findByRole("status")).toHaveTextContent(
        "1 hakutulos",
      );
    });

    it("should not display result count when there are no results", async () => {
      renderComponent(
        {},
        {
          unit: {
            byId: {},
            isFetching: false,
            fetchError: null,
            all: [],
            iceskate: [],
            ski: [],
            swim: [],
            status_ok: [],
          } as any,
        },
      );
      await screen.findByText("Ei hakutuloksia");
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    it("should not display result count while loading", async () => {
      renderComponent(
        {},
        {
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
          search: {
            isFetching: true,
            isActive: true,
            unitResults: [],
            unitSuggestions: [],
            addressSuggestions: [],
          } as any,
        },
      );
      expect(
        document.querySelector(".list-view__results-count"),
      ).not.toBeInTheDocument();
    });

    it("should display total count even when only one page is visible", async () => {
      // UNIT_BATCH_SIZE is mocked to 1, so only 1 unit is shown initially
      // but totalUnits should still be 2
      renderComponent();
      expect(await screen.findByRole("status")).toHaveTextContent(
        "2 hakutulosta",
      );
      expect(
        screen.queryByText("Mustavuoren latu 2,1 km"),
      ).not.toBeInTheDocument();
    });
  });
});

describe("<UnitBrowserResultListSort />", () => {
  it("should render sort by condition by default", async () => {
    renderComponent();
    expect(await screen.findByText(/Paras kunto ensin/)).toBeInTheDocument();
  });

  it("should render favorites by default if user has saved favorites", async () => {
    // Add unit to favourites
    const favouriteUnit = units["53916"];
    localStorage.setItem("favouriteUnits", JSON.stringify([favouriteUnit]));

    renderComponent();
    expect(await screen.findByText("Suosikit")).toBeInTheDocument();

    // Clean up
    localStorage.removeItem("favouriteUnits");
  });

  it("should render sort by condition if user has favorites but not in selected sport", async () => {
    // Add unit to favourites
    const favouriteUnit = {
      id: 12345,
      name: { fi: "Testi tekojääkenttä" },
      services: [406],
    };
    localStorage.setItem("favouriteUnits", JSON.stringify([favouriteUnit]));

    renderComponent();
    expect(await screen.findByText(/Paras kunto ensin/)).toBeInTheDocument();

    // Clean up
    localStorage.removeItem("favouriteUnits");
  });
});
