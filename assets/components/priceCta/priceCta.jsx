// @flow

// ----- Imports ----- //

import React from 'react';

import AnchorButton from 'components/button/anchorButton';

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
      <AnchorButton
        href={props.url}
        aria-label={`${props.ctaText} for only ${props.price} per month`}
      >{props.ctaText}
      </AnchorButton>
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
