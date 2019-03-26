// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import './leftMarginSection.scss';

// ----- Props ----- //

type PropTypes = {|
  modifierClasses: Array<?string>,
  className: ?string,
  children: Node,
|};


// ----- Component ----- //

export default function LeftMarginSection(props: PropTypes) {

  return (
    <section className={[props.className, classNameWithModifiers('component-left-margin-section', props.modifierClasses)].join(' ')}>
      <div className="component-left-margin-section__content">
        {props.children}
      </div>
    </section>
  );

}


// ----- Default Props ----- //

LeftMarginSection.defaultProps = {
  modifierClasses: [],
  className: null,
};
