/* eslint-disable react/forbid-prop-types */
/*
   eslint-disable
   class-methods-use-this,
   jsx-a11y/anchor-is-valid,
   jsx-a11y/click-events-have-key-events,
   jsx-a11y/no-static-element-interactions,
   react/destructuring-assignment,
   react/jsx-props-no-spreading,
   react/prop-types,
*/

import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import { useTranslation } from 'react-i18next';
import upperFirst from 'lodash/upperFirst';
import get from 'lodash/get';
import has from 'lodash/has';

import SMIcon from '../../home/components/SMIcon';
import {
  getAttr,
  getObservation,
  getOpeningHours,
  getObservationTime,
  createReittiopasUrl,
  createPalvelukarttaUrl,
} from '../helpers';
import getServiceName from '../../service/helpers';
import OutboundLink from '../../common/components/OutboundLink';
import ObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from './ObservationStatus';
import UnitIcon from './UnitIcon';

function shouldShowInfo(unit) {
  const hasExtensions =
    unit.extensions &&
    (unit.extensions.length ||
      unit.extensions.lighting ||
      unit.extensions.skiing_technique);

  return hasExtensions || unit.phone || unit.url;
}

// Export for testing purpose. A bit of an anti-pattern, but required
// less unrelated work to the feature I was developing
export const ModalHeader = ({
  handleClick: onClick,
  unit,
  services,
  isLoading,
}) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  const handleClick = (e) => {
    e.preventDefault();
    onClick(e);
  };

  const unitAddress = unit ? getAttr(unit.street_address, language) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <Modal.Header>
      <div>
        <div className="modal-header-name">
          <div>
            {isLoading ? (
              <h4>{t('MODAL.LOADING')}</h4>
            ) : (
              <h4>
                {unit ? getAttr(unit.name, language) : t('MODAL.NOT_FOUND')}
              </h4>
            )}
          </div>
          <div style={{ alignSelf: 'center' }}>
            <a
              className="modal-close-button close-unit-modal"
              onClick={handleClick}
              // Href attribute makes the link focusable with a keyboard
              href=""
            >
              <SMIcon icon="close" aria-label={t('MODAL.CLOSE')} />
            </a>
          </div>
        </div>
        {unit ? (
          <div className="modal-header-description">
            <UnitIcon
              unit={unit}
              alt={getServiceName(unit.services, services, language)}
            />
            <div>
              <p>{getServiceName(unit.services, services, language)}</p>
              <p>
                {unitAddress ? `${unitAddress}, ` : ''}
                {unitZIP ? `${unitZIP} ` : ''}
                <span style={{ textTransform: 'capitalize' }}>
                  {unitMunicipality || ''}
                </span>
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </Modal.Header>
  );
};

const LocationState = ({ unit }) => {
  const { t } = useTranslation();
  return (
    <ModalBodyBox title={t('MODAL.QUALITY')}>
      <ObservationStatus unit={unit} />
    </ModalBodyBox>
  );
};

const LocationInfo = ({ unit }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();

  return (
    <ModalBodyBox title={t('MODAL.INFO')}>
      {get(unit, 'extensions.length') && (
        <p>
          {`${t('MODAL.LENGTH')}: `}
          <strong>
            {unit.extensions.length}
            km
          </strong>
        </p>
      )}
      {get(unit, 'extensions.lighting') && (
        <p>
          {`${t('MODAL.LIGHTING')}: `}
          <strong>
            {upperFirst(getAttr(unit.extensions.lighting, language))}
          </strong>
        </p>
      )}
      {get(unit, 'extensions.skiing_technique') && (
        <p>
          {`${t('MODAL.SKIING_TECHNIQUE')}: `}
          <strong>
            {upperFirst(getAttr(unit.extensions.skiing_technique, language))}
          </strong>
        </p>
      )}
      {unit.phone && (
        <p>
          {t('UNIT.PHONE')}: <a href={`tel:${unit.phone}`}>{unit.phone}</a>
        </p>
      )}
      {unit.www && (
        <p>
          <OutboundLink href={getAttr(unit.www, language)}>
            {t('UNIT.FURTHER_INFO')}
          </OutboundLink>
        </p>
      )}
    </ModalBodyBox>
  );
};

/**
 * [NoticeInfo description]
 * @param {Object} unit       [description]
 */
const NoticeInfo = ({ unit }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const notice = getObservation(unit, 'notice');
  return notice ? (
    <ModalBodyBox title={t('MODAL.NOTICE')}>
      <StatusUpdated time={getObservationTime(notice)} t={t} />
      <ReactMarkdown
        source={getAttr(notice.value, language)}
        // Insert a break for each newline character
        // https://github.com/rexxars/react-markdown/issues/105#issuecomment-346103734
        plugins={[breaks]}
        break="br"
        escapeHtml
        allowedTypes={['text', 'paragraph', 'break']}
      />
    </ModalBodyBox>
  ) : null;
};

const LocationRoute = ({ routeUrl, palvelukarttaUrl }) => {
  const { t } = useTranslation();

  return (
    <ModalBodyBox title={t('MODAL.LINKS')}>
      <ul className="modal-body-list">
        {routeUrl && (
          <li>
            <OutboundLink href={routeUrl}>{t('MODAL.GET_ROUTE')}</OutboundLink>
          </li>
        )}
        {palvelukarttaUrl && (
          <li>
            <OutboundLink href={palvelukarttaUrl}>
              {t('MODAL.SEE_ON_SERVICE_MAP')}
            </OutboundLink>
          </li>
        )}
      </ul>
    </ModalBodyBox>
  );
};

// TODO
// const LocationWeather = ({t}) =>
//   <ModalBodyBox title={t('MODAL.WEATHER')}>
//     Wow such weather.
//   </ModalBodyBox>;
//
// const LocationHeightProfile = ({t}) =>
//   <ModalBodyBox title={t('MODAL.HEIGHT_PROFILE')}>
//     Wow such profile.
//   </ModalBodyBox>;

const LocationOpeningHours = ({ unit }) => {
  const {
    t,
    i18n: { language },
  } = useTranslation();
  const openingHours = getOpeningHours(unit, language);

  if (openingHours.length === 0) {
    return null;
  }

  return (
    <ModalBodyBox title={t('MODAL.OPENING_HOURS')}>
      {openingHours.map((openingHour) => (
        <div key={openingHour.id} className="modal-body-multi-line">
          {openingHour}
        </div>
      ))}
    </ModalBodyBox>
  );
};

const LocationTemperature = ({ observation }) => {
  const { t } = useTranslation();
  const temperature = get(observation, 'name.fi');
  const observationTime = getObservationTime(observation);
  return (
    <ModalBodyBox title={t('MODAL.TEMPERATURE')}>
      <StatusUpdated time={observationTime} t={t} />
      {temperature}
    </ModalBodyBox>
  );
};

const LiveLocationTemperature = ({ observation }) => {
  const { t } = useTranslation();
  const temperature = get(observation, 'value.fi');
  const observationTime = getObservationTime(observation);
  return (
    <ModalBodyBox title={t('MODAL.WATER_TEMPERATURE')}>
      <StatusUpdatedAgo
        time={observationTime}
        t={t}
        sensorName={t('MODAL.WATER_TEMPERATURE_SENSOR')}
      />
      {`${temperature} °C`}
    </ModalBodyBox>
  );
};

const ModalBodyBox = ({ title, children, className = '', ...rest }) => (
  <div className={`${className} modal-body-box`} {...rest}>
    {title && <div className="modal-body-box-headline">{title}</div>}
    {children}
  </div>
);

// Enzyme is not able to render the legacy portals our version of
// react-bootstrap uses. By separating the content into its own
// component and exporting it, we are able to test the content without
// more convoluted hacks. Ideally we would write tests for the entire
// component.
export const SingleUnitModalBody = ({
  currentUnit,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  temperatureObservation,
  palvelukarttaUrl,
}) =>
  currentUnit && !isLoading ? (
    <Modal.Body>
      <LocationState unit={currentUnit} />
      <NoticeInfo unit={currentUnit} />
      {!liveTemperatureObservation && temperatureObservation && (
        <LocationTemperature observation={temperatureObservation} />
      )}
      {liveTemperatureObservation && (
        <LiveLocationTemperature observation={liveTemperatureObservation} />
      )}
      {shouldShowInfo(currentUnit) && <LocationInfo unit={currentUnit} />}
      {getOpeningHours(currentUnit) && (
        <LocationOpeningHours unit={currentUnit} />
      )}
      {(routeUrl || palvelukarttaUrl) && (
        <LocationRoute
          routeUrl={routeUrl}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      )}
    </Modal.Body>
  ) : null;

SingleUnitModalBody.defaultProps = {
  liveTemperatureObservation: null,
  temperatureObservation: null,
  routeUrl: undefined,
  currentUnit: undefined,
};

SingleUnitModalBody.propTypes = {
  currentUnit: PropTypes.object,
  isLoading: PropTypes.bool.isRequired,
  liveTemperatureObservation: PropTypes.object,
  routeUrl: PropTypes.string,
  temperatureObservation: PropTypes.object,
};

const SingleUnitModalContainer = ({
  handleClick,
  isLoading,
  unit: currentUnit,
  services,
  isOpen,
}) => {
  const {
    i18n: { language },
  } = useTranslation();
  const temperatureObservation = has(currentUnit, 'observations')
    ? getObservation(currentUnit, 'swimming_water_temperature')
    : null;
  const liveTemperatureObservation = has(currentUnit, 'observations')
    ? getObservation(currentUnit, 'live_swimming_water_temperature')
    : null;
  const routeUrl = currentUnit && createReittiopasUrl(currentUnit, language);
  const palvelukarttaUrl =
    currentUnit && createPalvelukarttaUrl(currentUnit, language);

  return (
    <div>
      <Modal
        className="single-unit-modal"
        show={isOpen}
        backdrop={false}
        animation={false}
      >
        <ModalHeader
          unit={currentUnit}
          services={services}
          handleClick={handleClick}
          isLoading={isLoading}
        />
        <SingleUnitModalBody
          currentUnit={currentUnit}
          isLoading={isLoading}
          liveTemperatureObservation={liveTemperatureObservation}
          routeUrl={routeUrl}
          temperatureObservation={temperatureObservation}
          palvelukarttaUrl={palvelukarttaUrl}
        />
      </Modal>
    </div>
  );
};

export default SingleUnitModalContainer;
