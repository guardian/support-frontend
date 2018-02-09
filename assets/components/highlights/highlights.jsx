// @flow

// ----- Imports ----- //

import React from 'react';


// ----- Types ----- //

type PropTypes = {
  highlights: ?string[],
};


// ----- Component ----- //

export default function Highlights(props: PropTypes) {

  if (!props.highlights) {
    return null;
  }

  return (
    <h1 className="component-highlights">
      {props.highlights.map(highlight => (
        <span className="component-highlights__line">
          <span className="component-highlights__highlight">{highlight}</span>
        </span>
      ))}
    </h1>
  );

}
