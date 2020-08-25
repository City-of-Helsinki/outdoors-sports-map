import React, { } from 'react';
import moment from 'moment';

import { mount } from '../../../common/enzymeHelpers';
import { SingleUnitModalBody } from '../SingleUnitModalContainer';

const defaultProps = {
  isLoading: false,
  shouldShowInfo: () => true,
  t: (string) => string,
  getActiveLanguage: () => 'en',
  routeUrl: '',
};
// eslint-disable-next-line react/jsx-props-no-spreading
const getWrapper = async (props) => mount(<SingleUnitModalBody {...defaultProps} {...props} />);
const unit = {
  id: 40142,
  name: {
    fi: 'Hietarannan uimaranta',
    sv: 'Sandstrands badstrand',
    en: 'Hietaranta beach',
  },
  street_address: {
    fi: 'Hiekkarannantie 11',
    sv: 'Sandstrandsvägen 11',
    en: 'Hiekkarannantie 11',
  },
  www: null,
  phone: null,
  address_zip: '00100',
  extensions: {
    maintenance_group: 'kaikki',
    maintenance_organization: 'helsinki',
  },
  municipality: 'helsinki',
  services: [
    731,
  ],
  location: {
    type: 'Point',
    coordinates: [
      24.907427,
      60.173553,
    ],
  },
  geometry: {
    type: 'Point',
    coordinates: [
      24.907427,
      60.173553,
    ],
  },
  connections: [
    {
      id: 12507,
      section_type: 'OPENING_HOURS',
      name: {
        fi: 'Kausi 1.6. - 9.8.2020\nklo 10.00 - 20.00',
        sv: 'Perioden 1.6. - 9.8.2020\nkl 10.00 - 20.00',
        en: 'Period 1.6. - 9.8.2020\n10.00 - 20.00',
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12508,
      section_type: 'OPENING_HOURS',
      name: {
        fi: 'Uimarantakausi alkaa normaalisti 1.6.',
      },
      www: null,
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12509,
      section_type: 'PHONE_OR_EMAIL',
      name: {
        fi: 'rannan henkilökunta',
        sv: 'strandpersonal',
        en: 'beach personnel',
      },
      www: null,
      email: null,
      phone: '+358 9 310 21416, +358 40 670 0176',
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12510,
      section_type: 'OTHER_INFO',
      name: {
        fi: 'Ulkoliikunta.fi -karttapalvelu',
        sv: 'Tjänsten Utemotionskarta',
        en: 'The Outdoor Exercise Map',
      },
      www: {
        fi: 'https://ulkoliikunta.fi/',
        sv: 'https://ulkoliikunta.fi/',
        en: 'https://ulkoliikunta.fi/',
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12511,
      section_type: 'OTHER_INFO',
      name: {
        fi: 'Järjestyssäännöt',
        sv: 'Ordningsregler',
        en: 'Rules and regulations',
      },
      www: {
        fi: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/fi/palvelut/liikunta-ja-ulkoilu/uimarantojen-jarjestyssaannot',
        sv: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/sv/tjanster/motion-och-friluftsliv/ordningsstadga-for-badstrander',
        en: 'https://www.hel.fi/kulttuurin-ja-vapaa-ajan-toimiala/en/services/sports-and-recreation/rules-and-regulations-for-beaches',
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
    {
      id: 12512,
      section_type: 'OTHER_INFO',
      name: {
        fi: 'Kahvila Bistro Badenbaden, facebook',
        sv: 'Kafé Bistro Badenbaden, facebook',
        en: 'Café Bistro Badenbaden, facebook',
      },
      www: {
        fi: 'https://www.facebook.com/bistrobadenbaden/?fref=ts',
        sv: 'https://www.facebook.com/bistrobadenbaden/?fref=ts',
        en: 'https://www.facebook.com/bistrobadenbaden/?fref=ts',
      },
      email: null,
      phone: null,
      contact_person: null,
      unit: 40142,
    },
  ],
  observations: [
    {
      unit: 40142,
      id: 1,
      property: 'live_swimming_water_temperature',
      time: '2020-08-21T14:03:19.108983+0300',
      expiration_time: null,
      value: {
        fi: '33.2',
      },
    },
  ],
};
const temperatureDataObservation = {
  unit: 40142,
  id: 17,
  property: 'swimming_water_temperature',
  time: '2020-08-21T14:04:49.387379+0300',
  expiration_time: null,
  name: {
    fi: '32',
  },
};
const liveTemperatureDataObservation = {
  unit: 40142,
  id: 17,
  property: 'live_swimming_water_temperature',
  time: '2020-08-21T14:04:49.387379+0300',
  expiration_time: null,
  value: {
    fi: '33.2',
  },
};

describe('<SingleUnitModalContainer />', () => {
  describe('when live temperature data is available', () => {
    const getWrapperWithLiveTemperatureData = async (props) => getWrapper({
      currentUnit: unit,
      temperatureObservation: temperatureDataObservation,
      liveTemperatureObservation: liveTemperatureDataObservation,
      ...props,
    });

    it('should be displayed', async () => {
      const wrapper = await getWrapperWithLiveTemperatureData();
      const liveTemperature = `${liveTemperatureDataObservation.value.fi} °C`;

      expect(wrapper.text().includes(liveTemperature)).toEqual(true);
    });

    it('regular temperature should not be displayed', async () => {
      const wrapper = await getWrapperWithLiveTemperatureData();
      const temperature = `${temperatureDataObservation.name.fi}`;

      expect(wrapper.text().includes(temperature)).toEqual(false);
    });

    describe('temperature measurement time', () => {
      it('when less than an hour has passed it should use minutes', async () => {
        const halfAnHourAgo = moment().subtract(0.5, 'hours');
        const wrapper = await getWrapperWithLiveTemperatureData({
          liveTemperatureObservation: {
            ...liveTemperatureDataObservation,
            time: halfAnHourAgo.toISOString(),
          },
        });

        expect(wrapper.text().includes('30 minuuttia sitten')).toEqual(true);
      });

      it('when at least an hour has passed it should use hours', async () => {
        const anHourAgo = moment().subtract(2, 'hours');
        const wrapper = await getWrapperWithLiveTemperatureData({
          liveTemperatureObservation: {
            ...liveTemperatureDataObservation,
            time: anHourAgo.toISOString(),
          },
        });

        expect(wrapper.text().includes('kaksi tuntia sitten')).toEqual(true);
      });
    });
  });
});
