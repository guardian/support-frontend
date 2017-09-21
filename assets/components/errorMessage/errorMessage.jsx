// @flow

// ----- Imports ----- //

import React from 'react';
import Svg from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  message: string,
  id?: string,
};


// ----- Component ----- //

export default function ErrorMessage(props: PropTypes) {
  return (
    <div id={props.id || 'validation-error'} className="component-error-message">
      <Svg svgName="exclamation" /><span>{props.message}</span>
    </div>
  );
}


// ----- Default Props ----- //

ErrorMessage.defaultProps = {
  message: null,
  id: null,
};
