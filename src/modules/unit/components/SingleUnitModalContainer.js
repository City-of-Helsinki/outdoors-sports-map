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

import React, { Component } from 'react';
import ProTypes from 'prop-types';
import { Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import { translate } from 'react-i18next';
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
} from '../helpers';
import getServiceName from '../../service/helpers';
import ObservationStatus, {
  StatusUpdated,
  StatusUpdatedAgo,
} from './ObservationStatus';
import UnitIcon from './UnitIcon';

// Export for testing purpose. A bit of an anti-pattern, but required
// less unrelated work to the feature I was developing
export const ModalHeader = ({
  handleClick: onClick,
  unit,
  services,
  isLoading,
  activeLang,
  t,
}) => {
  const handleClick = (e) => {
    e.preventDefault();
    onClick(e);
  };

  const unitAddress = unit ? getAttr(unit.street_address, activeLang()) : null;
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
                {unit ? getAttr(unit.name, activeLang()) : t('MODAL.NOT_FOUND')}
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
              alt={getServiceName(unit.services, services, activeLang())}
            />
            <div>
              <p>{getServiceName(unit.services, services, activeLang())}</p>
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

const LocationState = ({ unit, t }) => (
  <ModalBodyBox title={t('MODAL.QUALITY')}>
    <ObservationStatus unit={unit} />
  </ModalBodyBox>
);

const LocationInfo = ({ unit, t, activeLang }) => (
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
          {upperFirst(getAttr(unit.extensions.lighting, activeLang()))}
        </strong>
      </p>
    )}
    {get(unit, 'extensions.skiing_technique') && (
      <p>
        {`${t('MODAL.SKIING_TECHNIQUE')}: `}
        <strong>
          {upperFirst(getAttr(unit.extensions.skiing_technique, activeLang()))}
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
        <a
          href={getAttr(unit.www, activeLang())}
          target="_blank"
          rel="noopener noreferrer"
        >
          {t('UNIT.FURTHER_INFO')} <SMIcon icon="outbound-link" />
        </a>
      </p>
    )}
  </ModalBodyBox>
);

/**
 * [NoticeInfo description]
 * @param {Object} unit       [description]
 * @param {Function} t          [description]
 * @param {Function} activeLang [description]
 */
const NoticeInfo = ({ unit, t, activeLang }) => {
  const notice = getObservation(unit, 'notice');
  return notice ? (
    <ModalBodyBox title={t('MODAL.NOTICE')}>
      <StatusUpdated time={getObservationTime(notice)} t={t} />
      <ReactMarkdown
        source={getAttr(notice.value, activeLang())}
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

const LocationRoute = ({ routeUrl, t }) => (
  <ModalBodyBox title={t('MODAL.ROUTE_HERE')}>
    <a target="_blank" href={routeUrl} rel="noopener noreferrer">
      {t('MODAL.GET_ROUTE')}
    </a>
  </ModalBodyBox>
);

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

const LocationOpeningHours = ({ unit, t, activeLang }) => (
  <ModalBodyBox title={t('MODAL.OPENING_HOURS')}>
    {getOpeningHours(unit, activeLang())}
  </ModalBodyBox>
);

const LocationTemperature = ({ t, observation }) => {
  const temperature = get(observation, 'name.fi');
  const observationTime = getObservationTime(observation);
  return (
    <ModalBodyBox title={t('MODAL.TEMPERATURE')}>
      <StatusUpdated time={observationTime} t={t} />
      {temperature}
    </ModalBodyBox>
  );
};

const LiveLocationTemperature = ({ t, observation }) => {
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
  getActiveLanguage,
  isLoading,
  liveTemperatureObservation,
  routeUrl,
  shouldShowInfo,
  t,
  temperatureObservation,
}) =>
  currentUnit && !isLoading ? (
    <Modal.Body>
      <LocationState unit={currentUnit} t={t} />
      <NoticeInfo unit={currentUnit} t={t} activeLang={getActiveLanguage} />
      {!liveTemperatureObservation && temperatureObservation && (
        <LocationTemperature t={t} observation={temperatureObservation} />
      )}
      {liveTemperatureObservation && (
        <LiveLocationTemperature
          t={t}
          observation={liveTemperatureObservation}
        />
      )}
      {shouldShowInfo(currentUnit) && (
        <LocationInfo unit={currentUnit} t={t} activeLang={getActiveLanguage} />
      )}
      {getOpeningHours(currentUnit) && (
        <LocationOpeningHours
          unit={currentUnit}
          t={t}
          activeLang={getActiveLanguage}
        />
      )}
      {routeUrl && <LocationRoute t={t} routeUrl={routeUrl} />}
    </Modal.Body>
  ) : null;

SingleUnitModalBody.propTypes = {
  currentUnit: ProTypes.object.isRequired,
  getActiveLanguage: ProTypes.func.isRequired,
  isLoading: ProTypes.bool.isRequired,
  liveTemperatureObservation: ProTypes.object.isRequired,
  routeUrl: ProTypes.string.isRequired,
  shouldShowInfo: ProTypes.func.isRequired,
  t: ProTypes.func.isRequired,
  temperatureObservation: ProTypes.object.isRequired,
};

class SingleUnitModalContainer extends Component {
  shouldShowInfo(unit) {
    const hasExtensions =
      unit.extensions &&
      (unit.extensions.length ||
        unit.extensions.lighting ||
        unit.extensions.skiing_technique);
    return hasExtensions || unit.phone || unit.url;
  }

  render() {
    const {
      handleClick,
      isLoading,
      unit: currentUnit,
      services,
      t,
    } = this.props;
    const { getActiveLanguage } = this.context;
    const temperatureObservation =
      has(currentUnit, 'observations') &&
      getObservation(currentUnit, 'swimming_water_temperature');
    const liveTemperatureObservation =
      has(currentUnit, 'observations') &&
      getObservation(currentUnit, 'live_swimming_water_temperature');
    const routeUrl =
      currentUnit && createReittiopasUrl(currentUnit, getActiveLanguage());

    return (
      <div>
        <Modal
          className="single-unit-modal"
          show={this.props.isOpen}
          backdrop={false}
          animation={false}
        >
          <ModalHeader
            unit={currentUnit}
            services={services}
            handleClick={handleClick}
            isLoading={isLoading}
            t={t}
            activeLang={getActiveLanguage}
          />
          <SingleUnitModalBody
            currentUnit={currentUnit}
            getActiveLanguage={getActiveLanguage}
            isLoading={isLoading}
            liveTemperatureObservation={liveTemperatureObservation}
            routeUrl={routeUrl}
            shouldShowInfo={this.shouldShowInfo}
            t={t}
            temperatureObservation={temperatureObservation}
          />
        </Modal>
      </div>
    );
  }
}

SingleUnitModalContainer.contextTypes = {
  getActiveLanguage: ProTypes.func,
};

export default translate()(SingleUnitModalContainer);
