// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Props ----- //

type PropTypes = {|
  modifierClasses: Array<?string>,
  children: Node,
|};


// ----- Component ----- //

export default function LeftMarginSection(props: PropTypes) {

  return (
    <section className={classNameWithModifiers('component-left-margin-section', props.modifierClasses)}>
      <div className="component-left-margin-section__content">
        {props.children}
      </div>
    </section>
  );

}


// ----- Default Props ----- //

LeftMarginSection.defaultProps = {
  modifierClasses: [],
};
