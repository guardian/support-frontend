// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

export type Switch = 'On' | 'Off' | 'Error';

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  switch: Switch,
  component: React$ComponentType<*>,
  errorComponent: React$ComponentType<*>,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Component ----- //

export default function Switchable(props: PropTypes) {

  if (props.switch === 'Off') {
    return null;
  } else if (props.switch === 'Error') {
    return <props.errorComponent />;
  }

  return <props.component />;

}
