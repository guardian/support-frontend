// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  message: string,
};


// ----- Component ----- //


export default function ErrorMessage(props: PropTypes) {
  return (
    <div className="component-error-message">
      <Svg svgName="exclamation" /><span>{props.message}</span>
    </div>
  );
}
