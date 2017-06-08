// @flow

// ----- Imports ----- //

import React from 'react';

import Svg from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  name: string,
};


// ----- Component ----- //

export default function DisplayName(props: PropTypes) {

  return (
    <div className="component-display-name">
      <Svg svgName="user" />
      <span className="component-display-name__name">{props.name}</span>
    </div>
  );

}
