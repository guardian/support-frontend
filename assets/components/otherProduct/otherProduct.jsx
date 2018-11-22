// @flow

// ----- Imports ----- //

import React from 'react';

import CtaLink from 'components/ctaLink/ctaLink';
import GridImage from 'components/gridImage/gridImage';

import { classNameWithModifiers } from 'helpers/utilities';
import type { ImageType } from 'helpers/theGrid';
import { sendClickedEvent } from 'helpers/tracking/clickTracking';

// ----- Props ----- //

type PropTypes = {|
  modifierClass?: string,
  gridImg: string,
  imgAlt: string,
  heading: string,
  copy: string,
  ctaText: string,
  ctaUrl: string,
  ctaAccessibilityHint: string,
  imgType?: ImageType,
  context?: string,
|};


// ----- Component ----- //

export default function OtherProduct(props: PropTypes) {
  return (
    <div className={classNameWithModifiers('component-other-product', [props.modifierClass])}>
      <div className="component-other-product__image">
        <GridImage
          gridId={props.gridImg}
          srcSizes={[500, 140]}
          sizes="(max-width: 480px) 90vw, (max-width: 660px) 400px, 270px"
          altText={props.imgAlt}
          imgType={props.imgType}
        />
      </div>
      <h2 className="component-other-product__heading">{props.heading}</h2>
      <p className="component-other-product__copy">{props.copy}</p>
      <CtaLink
        text={props.ctaText}
        url={props.ctaUrl}
        accessibilityHint={props.ctaAccessibilityHint}
        onClick={sendClickedEvent(props.context || '')}
      />
    </div>
  );

}


// ----- Default Props ----- //

OtherProduct.defaultProps = {
  modifierClass: '',
  imgType: 'jpg',
};
