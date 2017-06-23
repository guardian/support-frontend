// @flow

// ----- Imports ----- //

import React from 'react';

import type { Children } from 'react';


// ---- Types ----- //

type PropTypes = {
  heading?: string,
  className?: string,
  children?: Children,
};


// ----- Component ----- //

export default function InfoSection(props: PropTypes) {

  const headerContent = (
    <h2 className="component-info-section__heading">{props.heading}</h2>
  );

  return (
    <section className={`component-info-section ${props.className || ''}`}>
      <div className="component-info-section__header">
        {props.heading ? headerContent : null}
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
};
