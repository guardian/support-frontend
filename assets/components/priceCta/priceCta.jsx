// @flow

// ----- Imports ----- //

import React from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import CtaLink from 'components/ctaLink/ctaLink';


// ----- Types ----- //

type PropTypes = {
  ctaText: string,
  url: string,
  price: string,
  dark: boolean,
  secondaryCopy: string,
};


// ----- Component ----- //

export default function PriceCta(props: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-price-cta', props.dark ? ['dark'] : [])}>
      <CtaLink
        text={props.ctaText}
        url={props.url}
        accessibilityHint={`${props.ctaText} for only ${props.price} per month`}
      />
      <p className="component-price-cta__price">
        <span className="component-price-cta__price-copy">for only</span>
        <span className="component-price-cta__price-amount">{props.price}</span>
        <span className="component-price-cta__price-copy">per month</span>
      </p>
      <p className="component-price-cta__cancel">{props.secondaryCopy}</p>
    </div>
  );

}


// ----- Default Props ----- //

PriceCta.defaultProps = {
  dark: false,
  secondaryCopy: 'You can cancel your subscription at any time',
};
