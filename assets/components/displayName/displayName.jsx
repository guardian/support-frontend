// @flow

// ----- Imports ----- //

import React from 'react';


// ---- Types ----- //

type PropTypes = {
  name: string,
};


// ----- Component ----- //

export default function DisplayName(props: PropTypes) {

  return (
    <div className="component-display-name">
      <span className="component-display-name__name">{props.name}</span>
    </div>
  );

}
