// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';

import { classNameWithModifiers } from 'helpers/utilities';


// ----- Types ----- //

type PropTypes = {
  ctaText: string,
  url: string,
  price: string,
  secondaryCopy: string | null,
};


// ----- Component ----- //

function PriceCta(props: PropTypes) {

  const withSecondary = props.secondaryCopy !== null;

  return (
    <div className={classNameWithModifiers('component-price-cta', withSecondary ? ['with-secondary'] : [])}>
      <CtaLink
        text={props.ctaText}
        url={props.url}
        accessibilityHint={`${props.ctaText} for only ${props.price} per month`}
        id="price-cta"
      />
      {withSecondary ? <p className="component-price-cta__secondary">{props.secondaryCopy}</p> : null}
    </div>
  );

}


// ----- Default Props ----- //

PriceCta.defaultProps = {
  secondaryCopy: null,
};


// ----- Exports ----- //

export default PriceCta;
