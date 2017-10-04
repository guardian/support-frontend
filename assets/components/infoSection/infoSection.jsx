// @flow

// ----- Imports ----- //

import React from 'react';

import type { Node } from 'react';


// ---- Types ----- //

type PropTypes = {
  heading?: ?string,
  className?: string,
  children?: Node,
  headingContent?: Node,
};


// ----- Component ----- //

export default function InfoSection(props: PropTypes) {

  const heading = (
    <h2 className="component-info-section__heading">{props.heading}</h2>
  );

  return (
    <section className={`component-info-section ${props.className || ''}`}>
      <div className="component-info-section__header">
        {props.heading ? heading : null}
        {props.headingContent}
      </div>
      <div className="component-info-section__content">{props.children}</div>
    </section>
  );

}


// ----- Proptypes ----- //

InfoSection.defaultProps = {
  heading: null,
  className: '',
  children: null,
  headingContent: null,
};
