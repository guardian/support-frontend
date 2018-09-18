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
};


// ----- Component ----- //

export default function PriceCta(props: PropTypes) {

  return (
    <div className={classNameWithModifiers('component-price-cta', props.dark ? ['dark'] : [])}>
      <CtaLink
        text={props.ctaText}
        url={props.url}
        accessibilityHint={`${props.ctaText} for only ${props.price} per month`}
        ctaId="price-cta"
      />
    </div>
  );

}


// ----- Default Props ----- //

PriceCta.defaultProps = {
  dark: false,
};
