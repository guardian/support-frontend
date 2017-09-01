// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  message: string,
};


// ----- Component ----- //


export default function ProgressMessage(props: PropTypes) {
  return (
    <div className="component-progress-message">
      <div className="component-progress-message__message">{props.message}</div>
      <div className="component-progress-message__background" />
    </div>
  );
}
