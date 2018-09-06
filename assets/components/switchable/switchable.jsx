// @flow

// ----- Imports ----- //

import React from 'react';
import type { Status } from 'helpers/settings';

// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  status: Status,
  component: React$ComponentType<*>,
  fallback: React$ComponentType<*>,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Component ----- //

function Switchable(props: PropTypes) {

  if (props.status === 'Off') {
    return <props.fallback />;
  }

  return <props.component />;

}


// ----- Default Props ----- //

Switchable.defaultProps = {
  fallback: null,
};


// ----- Exports ----- //

export default Switchable;
