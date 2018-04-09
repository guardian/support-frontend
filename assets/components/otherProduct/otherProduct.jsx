// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import GridImage from 'components/gridImage/gridImage';

import { classNameWithOptModifier } from 'helpers/utilities';


// ----- Props ----- //

type PropTypes = {
  modifierClass?: string,
  gridImg: string,
  imgAlt: string,
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
    <div className={classNameWithOptModifier('component-other-product', props.modifierClass)}>
      <div className="component-other-product__image">
        <GridImage
          gridId={props.gridImg}
          srcSizes={[1000, 500, 140]}
          sizes="(max-width: 480px) 90vw, (max-width: 660px) 400px, 270px"
          altText={props.imgAlt}
        />
      </div>
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
