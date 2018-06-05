// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

/* eslint-disable react/no-unused-prop-types */
type PropTypes = {
  off: boolean,
  component: React$ComponentType<*>,
  fallback: React$ComponentType<*>,
};
/* eslint-enable react/no-unused-prop-types */


// ----- Component ----- //

function Switchable(props: PropTypes) {

  if (props.off) {
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
