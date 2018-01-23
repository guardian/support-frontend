// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';

import { generateClassName } from 'helpers/utilities';


// ----- Props ----- //

type PropTypes = {
  modifierClass?: string,
  heading: string,
  copy: string,
  ctaText: string,
  ctaUrl: string,
  ctaId: string,
  ctaAccessibilityHint: string,
};


// ----- Component ----- //

export default function OtherProduct(props: PropTypes) {

  return (
    <div className={generateClassName('component-other-product', props.modifierClass)}>
      <h2 className="component-other-product__heading">{props.heading}</h2>
      <p className="component-other-product__copy">{props.copy}</p>
      <CtaLink
        text={props.ctaText}
        url={props.ctaUrl}
        ctaId={props.ctaId}
        accessibilityHint={props.ctaAccessibilityHint}
      />
    </div>
  );

}


// ----- Default Props ----- //

OtherProduct.defaultProps = {
  modifierClass: '',
};
