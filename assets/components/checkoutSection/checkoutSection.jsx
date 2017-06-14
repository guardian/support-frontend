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

export default function CheckoutSection(props: PropTypes) {

  const headerContent = (
    <h2 className="component-checkout-section__heading">{props.heading}</h2>
  );

  return (
    <section className={`component-checkout-section ${props.className || ''}`}>
      <div className="component-checkout-section__header">
        {props.heading ? headerContent : null}
      </div>
      <div className="component-checkout-section__content">{props.children}</div>
    </section>
  );

}


// ----- Proptypes ----- //

CheckoutSection.defaultProps = {
  heading: null,
  className: '',
  children: null,
};
