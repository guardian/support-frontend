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
      <span>{props.message}</span>
    </div>
  );
}
