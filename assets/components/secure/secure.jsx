// @flow

// ----- Imports ----- //

import React from 'react';

import { SvgLock } from 'components/svg/svg';

// ----- Types ----- //

type PropTypes = {
  style?: Object
}

// ----- Component ----- //

export default function Secure(props: PropTypes) {

  return (
    <div className="component-secure" style={props.style}>
      <SvgLock />
      <span className="component-secure__text">Secure</span>
    </div>
  );

}

// ----- Default Props ----- //

Secure.defaultProps = {
  style: {},
};
