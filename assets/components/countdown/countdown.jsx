// @flow

// ----- Imports ----- //
import React from 'react';


// ---- Types ----- //
type CountdownTime = {
  days: number,
  hours: number,
  minutes: number,
  seconds: number,
}

type PropTypes = {
  unixTimeLeft: number
};

// ---- Helpers ----- //
const addLeadingZeros = (value: number): string => {
  let valueStr = String(value);
  while (valueStr.length < 2) {
    valueStr = `0${valueStr}`;
  }
  return valueStr;
};

const calculateCountdown = (unixTimeLeft: number): CountdownTime => {
  const seconds = Math.floor((unixTimeLeft / 1000) % 60);
  const minutes = Math.floor((unixTimeLeft / 1000 / 60) % 60);
  const hours = Math.floor((unixTimeLeft / (1000 * 60 * 60)) % 24);
  const days = Math.floor(unixTimeLeft / (1000 * 60 * 60 * 24));

  return {
    seconds, minutes, hours, days,
  };
};


// ----- Component ----- //
export default (props: PropTypes) => {
  const {
    days, hours, minutes, seconds,
  } = calculateCountdown(props.unixTimeLeft);

  const units = days > 0 ? [days, hours, minutes, seconds] : [hours, minutes, seconds];

  return (
    <time>
      {units.map(addLeadingZeros).join(':')}
    </time>
  );
};
