// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';


// ----- Types ----- //

type PropTypes = {
  ctaText: string,
  url: string,
  price: string,
};


// ----- Component ----- //

export default function PriceCta(props: PropTypes) {

  return (
    <div className="component-price-cta">
      <CtaLink
        text={props.ctaText}
        url={props.url}
        accessibilityHint={`${props.ctaText} for only ${props.price} per month`}
        ctaId="price-cta"
      />
    </div>
  );

}

