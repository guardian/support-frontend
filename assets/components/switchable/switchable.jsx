// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

export type Switch = 'On' | 'Off';

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  switch: Switch,
  component: React$ComponentType<*>,
  fallback: React$ComponentType<*>,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Component ----- //

function Switchable(props: PropTypes) {

  if (props.switch === 'Off') {
    return <props.fallback />;
  }

  return <props.component />;

}


// ----- Default Props ----- //

/* eslint-disable react/default-props-match-prop-types */
Switchable.defaultProps = {
  fallback: null,
};
/* eslint-enable react/default-props-match-prop-types */


// ----- Exports ----- //

export default Switchable;
