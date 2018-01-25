// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgExclamation } from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  error?: boolean,
  message: ?string,
};


// ----- Component ----- //

export default function ErrorMessage(props: PropTypes) {

  if (props.error && props.message) {

    return (
      <div className="component-error-message">
        <SvgExclamation /><span>{props.message}</span>
      </div>
    );

  }

  return null;

}


// ----- Default Props ----- //

ErrorMessage.defaultProps = {
  error: true,
};
