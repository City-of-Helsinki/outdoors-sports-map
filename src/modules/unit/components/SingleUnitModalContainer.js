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

import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Modal } from 'react-bootstrap';
import ReactMarkdown from 'react-markdown';
import breaks from 'remark-breaks';
import { withNamespaces } from 'react-i18next';
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
import ObservationStatus, { StatusUpdated } from './ObservationStatus';
import UnitIcon from './UnitIcon';

const ModalHeader = ({
  handleClick, unit, services, isLoading, activeLang, t,
}) => {
  const unitAddress = unit ? getAttr(unit.street_address, activeLang()) : null;
  const unitZIP = unit ? unit.address_zip : null;
  const unitMunicipality = unit ? unit.municipality : null;

  return (
    <Modal.Header>
      <div>
        <div className="modal-header-name">
          <div>
            {isLoading
              ? <h4>{t('MODAL.LOADING')}</h4>
              : <h4>{unit ? getAttr(unit.name, activeLang()) : t('MODAL.NOT_FOUND')}</h4>}
          </div>
          <div style={{ alignSelf: 'center' }}>
            <a className="modal-close-button close-unit-modal" onClick={handleClick}><SMIcon icon="close" /></a>
          </div>
        </div>
        {unit
          ? (
            <div className="modal-header-description">
              <UnitIcon unit={unit} alt={getServiceName(unit.services, services, activeLang())} />
              <div>
                <p>
                  {
                  getServiceName(unit.services, services, activeLang())
                }
                </p>
                <p>
                  {unitAddress ? `${unitAddress}, ` : ''}
                  {unitZIP ? `${unitZIP} ` : ''}
                  <span style={{ textTransform: 'capitalize' }}>{unitMunicipality || ''}</span>
                </p>
              </div>
            </div>
          )
          : null}
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
      <strong>{upperFirst(getAttr(unit.extensions.lighting, activeLang()))}</strong>
    </p>
    )}
    {get(unit, 'extensions.skiing_technique') && (
    <p>
      {`${t('MODAL.SKIING_TECHNIQUE')}: `}
      <strong>{upperFirst(getAttr(unit.extensions.skiing_technique, activeLang()))}</strong>
    </p>
    )}
    {unit.phone && (
    <p>
      {t('UNIT.PHONE')}
:
      {' '}
      <a href={`tel:${unit.phone}`}>{unit.phone}</a>
    </p>
    )}
    {unit.www && (
    <p>
      <a href={getAttr(unit.www, activeLang())} target="_blank" rel="noopener noreferrer">
        {t('UNIT.FURTHER_INFO')}
        {' '}
        <SMIcon icon="outbound-link" />
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
  return (notice
    ? (
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
    )
    : null
  );
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

const ModalBodyBox = ({
  title, children, className = '', ...rest
}) => (
  <div className={`${className} modal-body-box`} {...rest}>
    {title && <div className="modal-body-box-headline">{title}</div>}
    {children}
  </div>
);

class SingleUnitModalContainer extends Component {
  shouldShowInfo(unit) {
    const hasExtensions = unit.extensions && (unit.extensions.length || unit.extensions.lighting || unit.extensions.skiing_technique);
    return hasExtensions || unit.phone || unit.url;
  }

  render() {
    const {
      handleClick, isLoading, unit: currentUnit, services, t,
    } = this.props;
    const { getActiveLanguage } = this.context;
    const temperatureObservation = has(currentUnit, 'observations') && getObservation(currentUnit, 'swimming_water_temperature');
    const routeUrl = currentUnit && createReittiopasUrl(currentUnit, getActiveLanguage());

    return (
      <div>
        <Modal className="single-unit-modal" show={this.props.isOpen} backdrop={false} animation={false}>
          <ModalHeader unit={currentUnit} services={services} handleClick={handleClick} isLoading={isLoading} t={t} activeLang={getActiveLanguage} />
          {currentUnit && !isLoading
            ? (
              <Modal.Body>
                <LocationState unit={currentUnit} t={t} />
                <NoticeInfo unit={currentUnit} t={t} activeLang={getActiveLanguage} />
                {temperatureObservation && <LocationTemperature t={t} observation={temperatureObservation} />}
                {this.shouldShowInfo(currentUnit) && <LocationInfo unit={currentUnit} t={t} activeLang={getActiveLanguage} />}
                {getOpeningHours(currentUnit) && <LocationOpeningHours unit={currentUnit} t={t} activeLang={getActiveLanguage} />}
                {routeUrl && <LocationRoute t={t} routeUrl={routeUrl} />}
              </Modal.Body>
            )
            : null}
        </Modal>
      </div>
    );
  }
}

SingleUnitModalContainer.contextTypes = {
  getActiveLanguage: PropTypes.func,
};

export default withNamespaces()(SingleUnitModalContainer);
