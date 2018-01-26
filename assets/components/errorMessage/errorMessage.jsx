// @flow

// ----- Imports ----- //

import React from 'react';
import { SvgExclamation } from 'components/svg/svg';


// ---- Types ----- //

type PropTypes = {
  showError?: boolean,
  message: ?string,
};


// ----- Component ----- //

export default function ErrorMessage(props: PropTypes) {

  if (props.showError && props.message) {

    return (
      <div className="component-error-message">
        <SvgExclamation /><span className="component-error-message__message">{props.message}</span>
      </div>
    );

  }

  return null;

}


// ----- Default Props ----- //

ErrorMessage.defaultProps = {
  showError: true,
};
