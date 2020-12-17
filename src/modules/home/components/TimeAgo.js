/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';

const TimeAgo = ({ time }) => (
  <time dateTime={time.toISOString()}>{moment(time).from(moment())}</time>
);

TimeAgo.propTypes = {
  time: PropTypes.object.isRequired,
};

export default TimeAgo;
