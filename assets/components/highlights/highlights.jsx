// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  highlights: ?string[],
  modifiers?: string[],
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
          <span className={classNameWithModifiers('component-highlights__highlight', props.modifiers)}>{highlight}</span>
        </span>
      ))}
    </h1>
  );

}
