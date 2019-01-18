// @flow

// ----- Imports ----- //

import React from 'react';

import UiButton from 'components/ui/uiButton/uiButton';

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
      <UiButton
        href={props.url}
        aria-label={`${props.ctaText} for only ${props.price} per month`}
      >{props.ctaText}
      </UiButton>
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
