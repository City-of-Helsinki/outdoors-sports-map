import { subHours, subMinutes } from "date-fns";
import userEvent from "@testing-library/user-event";

import { render, screen, within } from "../../../testingLibraryUtils";
import { createInitialUnitState } from "../../../../tests/testUtils";
import UnitDetails from "../UnitDetails";
import { useGetUnitByIdQuery } from "../../state/unitSlice";

vi.mock("react-router", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>(
    "react-router-dom"
  );

  return {
    ...actual,
    useParams: () => ({ unitId: "40142" }),
  };
});

// Mock the new RTK Query hook
vi.mock("../../state/unitSlice", async () => {
  const actual = await vi.importActual<typeof import("../../state/unitSlice")>("../../state/unitSlice");
  return {
    ...actual,
    useGetUnitByIdQuery: vi.fn(),
  };
});


const temperatureDataObservation = {
  unit: 40142,
  id: 17,
  property: "swimming_water_temperature",
  time: "2020-08-21T14:04:49.387379+0300",
  expiration_time: null,
  name: {
    fi: "32",
  },
};

const liveTemperatureDataObservation = {
  unit: 40142,
  id: 17,
  property: "live_swimming_water_temperature",
  time: "2020-08-21T14:04:49.387379+0300",
  expiration_time: null,
  value: {
    fi: "33.2",
  },
};

const liveWaterQualityObservation = {
  unit: 40386,
  id: 1406465,
  property: "live_swimming_water_quality",
  time: "2023-03-16T13:00:04.499827+0200",
  expiration_time: null,
  value: {
    fi: "possibly_impaired",
  },
};
const unit = {
  id: 40142,
  name: {
    fi: "Hietarannan uimaranta",
    sv: "Sandstrands badstrand",
    en: "Hietaranta beach",
  },
  street_address: {
    fi: "Hiekkarannantie 11",
    sv: "Sandstrandsvägen 11",
    en: "Hiekkarannantie 11",
  },
  www: null,
  phone: null,
  address_zip: "00100",
  extensions: {
    maintenance_group: "kaikki",
    maintenance_organization: "helsinki",
  },
  municipality: "helsinki",
  services: [731],
  location: {
    type: "Point",
    coordinates: [24.907427, 60.173553],
  },
  geometry: {
    type: "Point",
    coordinates: [24.907427, 60.173553],
  },
  connections: [
    {
      id: 12507,
      section_type: "OPENING_HOURS",
      name: {
        fi: "Kausi 1.6. - 9.8.2020\nklo 10.00 - 20.00",
        sv: "Perioden 1.6. - 9.8.2020\nkl 10.00 - 20.00",
        en: "Period 1.6. - 9.8.2020\n10.00 - 20.00",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12508,
      section_type: "OPENING_HOURS",
      name: {
        fi: "Uimarantakausi alkaa normaalisti 1.6.",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12509,
      section_type: "PHONE_OR_EMAIL",
      name: {
        fi: "rannan henkilökunta",
        sv: "strandpersonal",
        en: "beach personnel",
      },
      www: null,
      email: null,
      phone: "+358 9 310 21416, +358 40 670 0176",
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12510,
      section_type: "OTHER_INFO",
      name: {
        fi: "Ulkoliikunta.fi -karttapalvelu",
        sv: "Tjänsten Utemotionskarta",
        en: "The Outdoor Exercise Map",
      },
      www: {
        fi: "https://ulkoliikunta.fi/",
        sv: "https://ulkoliikunta.fi/",
        en: "https://ulkoliikunta.fi/",
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12511,
      section_type: "OTHER_INFO",
      name: {
        fi: "Järjestyssäännöt",
        sv: "Ordningsregler",
        en: "Rules and regulations",
      },
      www: {
        // eslint-disable-next-line max-len
        fi: "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/fi/palvelut/liikunta-ja-ulkoilu/uimarantojen-jarjestyssaannot",
        // eslint-disable-next-line max-len
        sv: "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/sv/tjanster/motion-och-friluftsliv/ordningsstadga-for-badstrander",
        // eslint-disable-next-line max-len
        en: "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/en/services/sports-and-recreation/rules-and-regulations-for-beaches",
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12512,
      section_type: "OTHER_INFO",
      name: {
        fi: "Kahvila Bistro Badenbaden, facebook",
        sv: "Kafé Bistro Badenbaden, facebook",
        en: "Café Bistro Badenbaden, facebook",
      },
      www: {
        fi: "https://www.facebook.com/bistrobadenbaden/?fref=ts",
        sv: "https://www.facebook.com/bistrobadenbaden/?fref=ts",
        en: "https://www.facebook.com/bistrobadenbaden/?fref=ts",
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12513,
      section_type: "OTHER_INFO",
      name: {
        fi: "Valvottu",
        sv: "Kontrollerade",
        en: "Controlled",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#valvonta"],
    },
    {
      section_type: "OTHER_INFO",
      name: {
        fi: "Pysäköintipaikkoja 20 kpl, 2h pysäköinti.",
        sv: "20 parkeringsplatser, 2 timmars parkering.",
        en: "20 parking spaces, 2-hour parking.",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#pysäköinti"],
    },
    {
      section_type: "OTHER_INFO",
      name: {
        fi: "Luistelukentän muut palvelut",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#muut_palvelut"],
    },
    {
      section_type: "OTHER_INFO",
      name: {
        fi: "Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#lisätietoja"],
    },
    {
      id: 12514,
      section_type: "OTHER_INFO",
      name: {
        fi: "Lämmitetty",
        sv: "Uppvärmd",
        en: "Heated",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#lämmitys"],
    },
    {
      id: 12515,
      section_type: "OTHER_INFO",
      name: {
        fi: "Valaistu",
        sv: "Upplyst",
        en: "Lighted",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#valaisu"],
    },
    {
      id: 12516,
      section_type: "OTHER_INFO",
      name: {
        fi: "Pukukopit 2kpl, avoinna 24h",
        sv: "Omklädningsrum 2st, öppet 24h",
        en: "Dressing rooms 2pcs, open 24h",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#pukukoppi"],
    },
    {
      id: 1166808,
      section_type: "OTHER_INFO",
      name: {
        fi: "Koiralatu",
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: ["#koiralatu"],
    },
  ],
  observations: [
    temperatureDataObservation,
    liveTemperatureDataObservation,
    liveWaterQualityObservation,
  ],
  extra: {
    "lipas.routeLengthKm": 4,
    "lipas.litRouteLengthKm": 0,
    "lipas.skiTrackFreestyle": 1,
    "lipas.skiTrackTraditional": 0,
  },
};

const defaultProps = {
  onCenterMapToUnit: () => {},
};

const renderComponent = (props?: any, modifiedUnit?: any) => {
  // Mock the RTK Query hook to return the unit data
  const mockUseGetUnitByIdQuery = useGetUnitByIdQuery as any;
  mockUseGetUnitByIdQuery.mockReturnValue({
    data: {
      ...unit,
      ...modifiedUnit,
    },
    isLoading: false,
    error: null,
  });

  return render(<UnitDetails {...defaultProps} {...props} />, undefined, {
    unit: {
      ...createInitialUnitState(),
      byId: {
        "40142": {
          ...unit,
          ...modifiedUnit,
        },
      },
      all: ["40142"],
    } as any,
  });
};

describe("<UnitDetails />", () => {
  describe("header", () => {
    it("should have a back link", async () => {
      renderComponent();

      const closeButton = await screen.findByRole("link", { name: "Takaisin" });

      // It should exist
      expect(closeButton).toBeInTheDocument();
      // It should take the user to the root route
      expect(closeButton.getAttribute("href")).toEqual("/fi/");
    });
  });

  describe("when live temperature data is available", () => {
    const renderWrapperWithLiveTemperatureData = (props?: any, unit?: any) =>
      renderComponent(props, unit);

    it("should be displayed", () => {
      renderWrapperWithLiveTemperatureData();
      const liveTemperature = `${liveTemperatureDataObservation.value.fi} °C`;

      expect(screen.getByText(liveTemperature)).toBeInTheDocument();
    });

    it("regular temperature should not be displayed", () => {
      renderWrapperWithLiveTemperatureData();
      const temperature = `${temperatureDataObservation.name.fi}`;

      expect(screen.queryByText(temperature)).toBeNull();
    });

    describe("temperature measurement time", () => {
      it("when less than an hour has passed it should use minutes", () => {
        const halfAnHourAgo = subMinutes(new Date(), 30);

        renderWrapperWithLiveTemperatureData(
          {},
          {
            observations: [
              {
                ...liveTemperatureDataObservation,
                time: halfAnHourAgo.toISOString(),
              },
            ],
          },
        );

        expect(screen.getByText("30 minuuttia sitten")).toBeInTheDocument();
      });

      it("when at least an hour has passed it should use hours", () => {
        const anHourAgo = subHours(new Date(), 2);

        renderWrapperWithLiveTemperatureData(
          {},
          {
            observations: [
              {
                ...liveTemperatureDataObservation,
                time: anHourAgo.toISOString(),
              },
            ],
          },
        );

        expect(screen.getByText("noin 2 tuntia sitten")).toBeInTheDocument();
      });
    });
  });

  describe("when regular temperature data is available (no live temperature)", () => {
    const renderWrapperWithRegularTemperatureOnly = (props?: any, unit?: any) =>
      renderComponent(props, {
        ...unit,
        observations: [temperatureDataObservation], // Only regular temperature, no live temperature
      });

    it("should display regular temperature when live temperature is not available", () => {
      renderWrapperWithRegularTemperatureOnly();
      const regularTemperature = `${temperatureDataObservation.name.fi}`;

      expect(screen.getByText(regularTemperature)).toBeInTheDocument();
    });

    it("should display temperature title", () => {
      renderWrapperWithRegularTemperatureOnly();
      
      expect(screen.getByText("Lämpötila")).toBeInTheDocument();
    });

    it("should display StatusUpdated component", () => {
      renderWrapperWithRegularTemperatureOnly();
      
      // Check that the StatusUpdated component is rendered (looks for "Päivitetty" text)
      expect(screen.getByText("Päivitetty")).toBeInTheDocument();
    });

    it("should not be displayed when live temperature is available", () => {
      // This is testing the conditional logic in the main component
      renderComponent(); // Uses default unit with both temperature types
      const regularTemperature = `${temperatureDataObservation.name.fi}`;

      expect(screen.queryByText(regularTemperature)).toBeNull();
    });
  });

  describe("LocationOpeningHours component", () => {
    it("should not display opening hours when unit doesn't have MECHANICALLY_FROZEN_ICE service", () => {
      // Our default test unit has service 731, not 695 (MECHANICALLY_FROZEN_ICE)
      renderComponent();
      
      expect(screen.queryByText("Aukioloajat")).not.toBeInTheDocument();
    });

    it("should not display opening hours when no opening hours data is available", () => {
      renderComponent({}, {
        connections: unit.connections.filter((con) => con.section_type !== "OPENING_HOURS"),
      });
      
      expect(screen.queryByText("Aukioloajat")).not.toBeInTheDocument();
    });

    it("should display opening hours for units with MECHANICALLY_FROZEN_ICE service", () => {
      const iceRinkUnit = {
        ...unit,
        services: [695], // MECHANICALLY_FROZEN_ICE service
        connections: [
          {
            id: 1,
            section_type: "OPENING_HOURS",
            name: {
              fi: "Ma-Pe 06:00-22:00",
              sv: "Mån-Fre 06:00-22:00", 
              en: "Mon-Fri 06:00-22:00",
            },
            www: null,
            email: null,
            phone: null,
            contact_person: null,
            unit: 40142,
          },
          {
            id: 2,
            section_type: "OPENING_HOURS",
            name: {
              fi: "La-Su 08:00-20:00",
              sv: "Lör-Sön 08:00-20:00",
              en: "Sat-Sun 08:00-20:00", 
            },
            www: null,
            email: null,
            phone: null,
            contact_person: null,
            unit: 40142,
          }
        ]
      };

      renderComponent({}, iceRinkUnit);
      
      expect(screen.getByText("Aukioloajat")).toBeInTheDocument();
      expect(screen.getByText("Ma-Pe 06:00-22:00")).toBeInTheDocument();
      expect(screen.getByText("La-Su 08:00-20:00")).toBeInTheDocument();
    });
  });

  describe("when live water quality data is available", () => {
    const renderWrapperWithLiveWaterQualityData = (props?: any, unit?: any) =>
      renderComponent(props, unit);
    const waterQuality = {
      normal: "Tavanomainen",
      possibly_impaired: "Mahdollisesti heikentynyt",
      probably_impaired: "Mahdollisesti heikentynyt",
      error: "Ei arviota",
    };
    it("should be displayed", () => {
      renderWrapperWithLiveWaterQualityData();
      const liveWaterQuality = waterQuality.possibly_impaired;

      expect(screen.getByText(liveWaterQuality)).toBeInTheDocument();
    });
  });

  describe("when control data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(screen.getByText("Valvonta: Valvottu")).toBeInTheDocument();
    });
  });

  describe("when control data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(screen.queryByText("Valvonta: Valvottu")).toBeNull();
    });
  });

  describe("when parking data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(
        screen.getByText(
          "Pysäköinti: Pysäköintipaikkoja 20 kpl, 2h pysäköinti.",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("when parking data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(
        screen.queryByText(
          "Pysäköinti: Pysäköintipaikkoja 20 kpl, 2h pysäköinti.",
        ),
      ).toBeNull();
    });
  });

  describe("when other services data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(
        screen.getByText("Muut palvelut: Luistelukentän muut palvelut"),
      ).toBeInTheDocument();
    });
  });

  describe("when other services data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(
        screen.queryByText("Muut palvelut: Luistelukentän muut palvelut"),
      ).toBeNull();
    });
  });

  describe("when more information data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(
        screen.getByText(
          "Lisätietoja: Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com",
        ),
      ).toBeInTheDocument();
    });
  });

  describe("when more information data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(
        screen.queryByText(
          "Lisätietoja: Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com",
        ),
      ).toBeNull();
    });
  });

  describe("when heating data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(screen.getByText("Lämmitys: Lämmitetty")).toBeInTheDocument();
    });
  });

  describe("when heating data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(screen.queryByText("Lämmitys: Lämmitetty")).toBeNull();
    });
  });

  describe("when lighting data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(screen.getByText("Valaistus: Valaistu")).toBeInTheDocument();
    });
  });

  describe("when lighting data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(screen.queryByText("Valaistus: Valaistu")).toBeNull();
    });
  });

  describe("when dressing room data is available", () => {
    it("should be displayed", () => {
      renderComponent();
      expect(
        screen.getByText("Pukukoppi: Pukukopit 2kpl, avoinna 24h"),
      ).toBeInTheDocument();
    });
  });

  describe("when dressing room data is not available", () => {
    it("should not be displayed", () => {
      renderComponent(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        },
      );
      expect(
        screen.queryByText("Pukukoppi: Pukukopit 2kpl, avoinna 24h"),
      ).toBeNull();
    });
  });

  it("should render extras correctly", () => {
    renderComponent();

    expect(screen.getByText("Info")).toBeInTheDocument();
    const routeLength = screen.getByText("Reitin pituus:");
    expect(routeLength).toBeInTheDocument();
    expect(within(routeLength).getByText("4km")).toBeInTheDocument();
    const litRouteLength = screen.getByText("Valaistu reitti:");
    expect(litRouteLength).toBeInTheDocument();
    expect(within(litRouteLength).getByText("0km")).toBeInTheDocument();
    expect(screen.getByText("Hiihtotyyli:")).toBeInTheDocument();
    expect(screen.getByText("Vapaa")).toBeInTheDocument();
    expect(screen.getByText("Koiralatu")).toBeInTheDocument();
  });
});

it("should render 'Lisää suosikiksi' button", () => {
  renderComponent();
  expect(screen.getByText("Lisää suosikiksi")).toBeInTheDocument();
});

it("should render 'Poista suosikeista' button if unit is already in favourites", () => {
  // Add unit to favourites
  const favouriteUnit = unit;
  localStorage.setItem("favouriteUnits", JSON.stringify([unit]));

  renderComponent({ unit: favouriteUnit });
  expect(screen.getByText("Poista suosikeista")).toBeInTheDocument();

  // Clean up local storage
  localStorage.removeItem("favouriteUnits");
});

describe("toggleFavourite functionality", () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.removeItem("favouriteUnits");
  });

  afterEach(() => {
    // Clean up after each test
    localStorage.removeItem("favouriteUnits");
  });

  it("should add unit to favourites when clicking 'Lisää suosikiksi' button", async () => {
    const user = userEvent.setup();
    renderComponent();
    
    const addButton = screen.getByText("Lisää suosikiksi");
    expect(addButton).toBeInTheDocument();
    
    // Click the add to favourites button
    await user.click(addButton);
    
    // Check localStorage was updated
    const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
    expect(favourites).toHaveLength(1);
    expect(favourites[0].id).toBe(unit.id);
  });

  it("should remove unit from favourites when clicking 'Poista suosikeista' button", async () => {
    const user = userEvent.setup();
    
    // Pre-populate localStorage with the unit
    localStorage.setItem("favouriteUnits", JSON.stringify([unit]));
    
    renderComponent();
    
    const removeButton = screen.getByText("Poista suosikeista");
    expect(removeButton).toBeInTheDocument();
    
    // Click the remove from favourites button
    await user.click(removeButton);
    
    // Check localStorage was cleared
    const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
    expect(favourites).toHaveLength(0);
  });

  it("should handle adding unit when favourites list already contains other units", async () => {
    const user = userEvent.setup();
    const otherUnit = { ...unit, id: 999, name: { fi: "Other Unit" } };
    
    // Pre-populate with another unit
    localStorage.setItem("favouriteUnits", JSON.stringify([otherUnit]));
    
    renderComponent();
    
    const addButton = screen.getByText("Lisää suosikiksi");
    await user.click(addButton);
    
    const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
    expect(favourites).toHaveLength(2);
    expect(favourites.find((f: any) => f.id === unit.id)).toBeDefined();
    expect(favourites.find((f: any) => f.id === otherUnit.id)).toBeDefined();
  });

  it("should handle removing unit when favourites list contains multiple units", async () => {
    const user = userEvent.setup();
    const otherUnit = { ...unit, id: 999, name: { fi: "Other Unit" } };
    
    // Pre-populate with both units
    localStorage.setItem("favouriteUnits", JSON.stringify([unit, otherUnit]));
    
    renderComponent();
    
    const removeButton = screen.getByText("Poista suosikeista");
    await user.click(removeButton);
    
    const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
    expect(favourites).toHaveLength(1);
    expect(favourites[0].id).toBe(otherUnit.id);
    expect(favourites.find((f: any) => f.id === unit.id)).toBeUndefined();
  });

  it("should handle empty localStorage gracefully", async () => {
    const user = userEvent.setup();
    
    // Ensure localStorage is completely empty
    localStorage.removeItem("favouriteUnits");
    
    renderComponent();
    
    const addButton = screen.getByText("Lisää suosikiksi");
    await user.click(addButton);
    
    const favourites = JSON.parse(localStorage.getItem("favouriteUnits") || "[]");
    expect(favourites).toHaveLength(1);
    expect(favourites[0].id).toBe(unit.id);
  });
});

describe("error handling", () => {
  it("should display not found message when unit fetch fails", () => {
    // Mock error scenario: unitError && !currentUnit && !unitIsLoading
    const mockUseGetUnitByIdQuery = useGetUnitByIdQuery as any;
    mockUseGetUnitByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Unit not found', status: 404 }
    });

    // Render with no unit data in Redux state
    render(<UnitDetails {...defaultProps} />, undefined, {
      unit: createInitialUnitState() // No unit data
    });

    expect(screen.getAllByText("Pahoittelut, kohdetta ei löytynyt :(")).toHaveLength(2);
    // Should have the error message in both header and body
    expect(screen.getByRole('main')).toHaveTextContent("Pahoittelut, kohdetta ei löytynyt :(");
  });

  it("should not display error when unit is still loading", () => {
    // Mock loading scenario
    const mockUseGetUnitByIdQuery = useGetUnitByIdQuery as any;
    mockUseGetUnitByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: true, // Still loading
      error: { message: 'Unit not found' }
    });

    render(<UnitDetails {...defaultProps} />, undefined, {
      unit: createInitialUnitState()
    });

    // Should not show error when still loading
    expect(screen.queryByText("Pahoittelut, kohdetta ei löytynyt :(")).not.toBeInTheDocument();
  });

  it("should not display error when fallback unit exists in Redux state", () => {
    // Mock error with fallback unit available
    const mockUseGetUnitByIdQuery = useGetUnitByIdQuery as any;
    mockUseGetUnitByIdQuery.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { message: 'Unit not found' }
    });

    // Render with fallback unit in Redux state
    render(<UnitDetails {...defaultProps} />, undefined, {
      unit: {
        ...createInitialUnitState(),
        byId: {
          "40142": unit, // Fallback unit exists
        },
        all: ["40142"],
      }
    });

    // Should not show error when fallback unit exists
    expect(screen.queryByText("Pahoittelut, kohdetta ei löytynyt :(")).not.toBeInTheDocument();
    // Should show the unit name instead
    expect(screen.getByText("Hietarannan uimaranta")).toBeInTheDocument();
  });
});
