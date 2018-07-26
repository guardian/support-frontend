// @flow

// ----- Imports ----- //

import React from 'react';
import Heading, { type HeadingSize } from 'components/heading/heading';
import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  highlights: ?string[],
  headingSize: HeadingSize,
  modifierClasses: Array<?string>,
};


// ----- Component ----- //

export default function Highlights(props: PropTypes) {

  if (!props.highlights) {
    return null;
  }

  return (
    <Heading size={props.headingSize} className={classNameWithModifiers('component-highlights', props.modifierClasses)}>
      {props.highlights.map(highlight => (
        <span className="component-highlights__line">
          <span className={classNameWithModifiers('component-highlights__highlight', props.modifierClasses)}>{highlight}</span>
        </span>
      ))}
    </Heading>
  );

}


// ----- Default Props ----- //

Highlights.defaultProps = {
  modifierClasses: [],
};
