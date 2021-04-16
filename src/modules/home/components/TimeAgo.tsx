/* eslint-disable react/forbid-prop-types */
import moment from "moment";
import PropTypes from "prop-types";
import React from "react";

function TimeAgo({ time }) {
  return <time dateTime={time.toISOString()}>{moment(time).from(moment())}</time>
}

TimeAgo.propTypes = {
  time: PropTypes.object.isRequired,
};

export default TimeAgo;
