import moment from "moment";
import ReactRouter from "react-router";

import { mount } from "../../../enzymeHelpers";
import UnitDetails from "../UnitDetails";

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
      fi: "possibly_impaired"
  }
}
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
        fi:
          "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/fi/palvelut/liikunta-ja-ulkoilu/uimarantojen-jarjestyssaannot",
        // eslint-disable-next-line max-len
        sv:
          "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/sv/tjanster/motion-och-friluftsliv/ordningsstadga-for-badstrander",
        // eslint-disable-next-line max-len
        en:
          "https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/en/services/sports-and-recreation/rules-and-regulations-for-beaches",
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
        en: "Controlled"
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
        "#valvonta"
      ]
    },
    {
      section_type: "OTHER_INFO",
      name: {
          "fi": "Pysäköintipaikkoja 20 kpl, 2h pysäköinti.",
          "sv": "20 parkeringsplatser, 2 timmars parkering.",
          "en": "20 parking spaces, 2-hour parking."
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
          "#pysäköinti"
      ]
    },
    {
      "section_type": "OTHER_INFO",
      "name": {
          "fi": "Luistelukentän muut palvelut"
      },
      "www": null,
      "email": null,
      "phone": null,
      "contact_person": null,
      "tags": [
        "#muut_palvelut"
      ]
    },
    {
      "section_type": "OTHER_INFO",
      "name": {
          "fi": "Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com"
      },
      "www": null,
      "email": null,
      "phone": null,
      "contact_person": null,
      "tags": [
          "#lisätietoja"
      ]
    },
    {
      id: 12514,
      section_type: "OTHER_INFO",
      name: {
        fi: "Lämmitetty",
        sv: "Uppvärmd",
        en: "Heated"
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
        "#lämmitys"
      ]
    },
    {
      id: 12515,
      section_type: "OTHER_INFO",
      name: {
        fi: "Valaistu",
        sv: "Upplyst",
        en: "Lighted"
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
        "#valaisu"
      ]
    },
    {
      id: 12516,
      section_type: "OTHER_INFO",
      name: {
        fi: "Pukukopit 2kpl, avoinna 24h",
        sv: "Omklädningsrum 2st, öppet 24h",
        en: "Dressing rooms 2pcs, open 24h"
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
        "#pukukoppi"
      ]
    },
    {
      id: 1166808,
      section_type: 'OTHER_INFO',
      name: {
        fi: 'Koiralatu'
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      tags: [
        '#koiralatu'
      ]
    }
  ],
  observations: [temperatureDataObservation, liveTemperatureDataObservation, liveWaterQualityObservation],
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

const getWrapper = (props?: any, modifiedUnit?: any) => {
  jest.spyOn(ReactRouter, "useParams").mockReturnValue({
    unitId: "40142",
  });

  return mount(<UnitDetails {...defaultProps} {...props} />, {
    preloadedState: {
      unit: {
        byId: {
          "40142": {
            ...unit,
            ...modifiedUnit,
          },
        },
        isFetching: false,
        fetchError: null,
        all: ["40142"],
        iceskate: [],
        ski: [],
        swim: [],
        status_ok: [],
      },
    },
  });
};

describe("<UnitDetails />", () => {
  describe("header", () => {
    it("should have a close button", async () => {
      const wrapper = getWrapper();

      const closeButton = wrapper
        .find({
          "aria-label": "Sulje",
        })
        .at(0)
        .parent();

      // It should exist
      expect(closeButton.length > 0).toBeTruthy();
      // It should take the user to the root route
      expect(closeButton.prop("href")).toEqual("/fi/");
    });
  });

  describe("when live temperature data is available", () => {
    const getWrapperWithLiveTemperatureData = (props?: any, unit?: any) =>
      getWrapper(props, unit);

    it("should be displayed", () => {
      const wrapper = getWrapperWithLiveTemperatureData();
      const liveTemperature = `${liveTemperatureDataObservation.value.fi} °C`;

      expect(wrapper.text().includes(liveTemperature)).toEqual(true);
    });

    it("regular temperature should not be displayed", () => {
      const wrapper = getWrapperWithLiveTemperatureData();
      const temperature = `${temperatureDataObservation.name.fi}`;

      expect(wrapper.text().includes(temperature)).toEqual(false);
    });

    describe("temperature measurement time", () => {
      it("when less than an hour has passed it should use minutes", () => {
        const halfAnHourAgo = moment().subtract(0.5, "hours");

        const wrapper = getWrapperWithLiveTemperatureData(
          {},
          {
            observations: [
              {
                ...liveTemperatureDataObservation,
                time: halfAnHourAgo.toISOString(),
              },
            ],
          }
        );

        expect(wrapper.text().includes("30 minuuttia sitten")).toEqual(true);
      });

      it("when at least an hour has passed it should use hours", () => {
        const anHourAgo = moment().subtract(2, "hours");

        const wrapper = getWrapperWithLiveTemperatureData(
          {},
          {
            observations: [
              {
                ...liveTemperatureDataObservation,
                time: anHourAgo.toISOString(),
              },
            ],
          }
        );

        expect(wrapper.text().includes("kaksi tuntia sitten")).toEqual(true);
      });
    });
  });

  describe("when live water quality data is available", () => {
    const getWrapperWithLiveWaterQualityData = (props?: any, unit?: any) =>
      getWrapper(props, unit);
    const waterQuality= {
      normal: "Tavanomainen",
      possibly_impaired: "Mahdollisesti heikentynyt",
      probably_impaired: "Mahdollisesti heikentynyt",
      error: "Ei arviota"
    }
    it("should be displayed", () => {
      const wrapper = getWrapperWithLiveWaterQualityData();
      const liveWaterQuality = waterQuality.possibly_impaired;

      expect(wrapper.text().includes(liveWaterQuality)).toEqual(true);
    });
  });

  describe("when control data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Valvonta: Valvottu")).toEqual(true);
    });
  });

  describe("when control data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper({}, {
        connections: unit.connections.filter((con) => con.tags === undefined)
      });
      expect(wrapper.text().includes("Valvonta: Valvottu")).toEqual(false);
    });
  })

  describe("when parking data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Pysäköinti: Pysäköintipaikkoja 20 kpl, 2h pysäköinti.")).toEqual(true);
    });
  });

  describe("when parking data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper({}, {
        connections: unit.connections.filter((con) => con.tags === undefined)
      });
      expect(wrapper.text().includes("Pysäköinti: Pysäköintipaikkoja 20 kpl, 2h pysäköinti.")).toEqual(false);
    });
  })
  
  describe("when other services data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Muut palvelut: Luistelukentän muut palvelut")).toEqual(true);
    });
  });

  describe("when other services data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper({}, {
        connections: unit.connections.filter((con) => con.tags === undefined)
      });
      expect(wrapper.text().includes("Muut palvelut: Luistelukentän muut palvelut")).toEqual(false);
    });
  })

  describe("when more information data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Lisätietoja: Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com")).toEqual(true);
    });
  });

  describe("when more information data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper({}, {
        connections: unit.connections.filter((con) => con.tags === undefined)
      });
      expect(wrapper.text().includes("Lisätietoja: Lisätietoja suoraan seuralta kskdjdseuraj@gmail.com")).toEqual(false);
    });
  })

  describe("when heating data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Lämmitys: Lämmitetty")).toEqual(true);
    });
  });

  describe("when heating data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper({}, {
        connections: unit.connections.filter((con) => con.tags === undefined)
      });
      expect(wrapper.text().includes("Lämmitys: Lämmitetty")).toEqual(false);
    });
  })

  describe("when lighting data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Valaistus: Valaistu")).toEqual(true);
    });
  });

  describe("when lighting data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        }
      );
      expect(wrapper.text().includes("Valaistus: Valaistu")).toEqual(false);
    });
  });

  describe("when dressing room data is available", () => {
    it("should be displayed", () => {
      const wrapper = getWrapper();
      expect(wrapper.text().includes("Pukukoppi: Pukukopit 2kpl, avoinna 24h")).toEqual(true);
    });
  });

  describe("when dressing room data is not available", () => {
    it("should not be displayed", () => {
      const wrapper = getWrapper(
        {},
        {
          connections: unit.connections.filter((con) => con.tags === undefined),
        }
      );
      expect(wrapper.text().includes("Pukukoppi: Pukukopit 2kpl, avoinna 24h")).toEqual(false);
    });
  });

  it("should render extras correctly", () => {
    const wrapper = getWrapper();
    const wrapperText = wrapper.text();

    expect(wrapperText.includes("Info")).toEqual(true);
    expect(wrapperText.includes("Reitin pituus: 4km")).toEqual(true);
    expect(wrapperText.includes("Valaistu reitti: 0km")).toEqual(true);
    expect(wrapperText.includes("Hiihtotyyli: Vapaa Koiralatu")).toEqual(true);
  });
});

it("should render 'Lisää suosikiksi' button", () => {
  const wrapper = getWrapper();
  expect(wrapper.find('button').text().includes("Lisää suosikiksi")).toEqual(true);
});

it("should render 'Poista suosikeista' button if unit is already in favourites", () => {
  // Add unit to favourites
  const favouriteUnit = unit;
  localStorage.setItem('favouriteUnits', JSON.stringify([unit]));

  const wrapper = getWrapper({ unit: favouriteUnit });
  expect(wrapper.find('button').text().includes("Poista suosikeista")).toEqual(true);

  // Clean up local storage
  localStorage.removeItem('favouriteUnits');
});
