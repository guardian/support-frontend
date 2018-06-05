// @flow

// ----- Imports ----- //

import React from 'react';
import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  highlights: ?string[],
  modifierClasses: Array<?string>,
};


// ----- Component ----- //

export default function Highlights(props: PropTypes) {

  if (!props.highlights) {
    return null;
  }

  return (
    <h1 className={classNameWithModifiers('component-highlights', props.modifierClasses)}>
      {props.highlights.map(highlight => (
        <span className="component-highlights__line">
          <span className={classNameWithModifiers('component-highlights__highlight', props.modifierClasses)}>{highlight}</span>
        </span>
      ))}
    </h1>
  );

}


// ----- Default Props ----- //

/* eslint-disable react/default-props-match-prop-types */
Highlights.defaultProps = {
  modifierClasses: [],
};
/* eslint-enable react/default-props-match-prop-types */
