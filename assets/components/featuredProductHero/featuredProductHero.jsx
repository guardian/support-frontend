// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';
import { type SubscriptionProduct } from 'helpers/subscriptions';

import Heading from 'components/heading/heading';
import FlashSaleCountdown from 'components/flashSaleCountdown/flashSaleCountdown';
import type { HeadingSize } from 'components/heading/heading';

// ----- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
  headingText: string,
  subheadingText?: ?string,
  bodyText: string,
  cta?: Node,
  image?: Node,
  product?: ?SubscriptionProduct,
};

export default function FeaturedProductHero(props: PropTypes) {

  const {
    headingSize,
    headingText,
    subheadingText,
    bodyText,
    cta,
    image,
    product,
  } = props;

  const hasTimer = product === 'DigitalPack';
  const timerClassName = classNameWithModifiers('component-featured-product-hero__countdownbox', hasTimer ? [] : ['hidden']);
  const rootClassName = classNameWithModifiers(
    'component-featured-product-hero',
    [
      product === 'DigitalPack' ? 'digital-pack' : null,
      product === 'Paper' ? 'paper' : null,
      product === 'GuardianWeekly' ? 'guardian-weekly' : null,
    ],
  );
  return (
    <section className={rootClassName}>
      <div className="component-featured-product-hero__content">
        <div className="component-featured-product-hero__description">
          <Heading
            className="component-featured-product-hero__heading"
            size={headingSize}
          >
            {headingText}
          </Heading>
          {subheadingText &&
            <Heading
              className="component-featured-product-hero__subheading"
              size={headingSize}
            >
              {subheadingText}
            </Heading>
          }
          <div className={timerClassName}>
            <FlashSaleCountdown />
            <p className="component-featured-product-hero__copy">
              {bodyText}
            </p>
            {cta}
          </div>
        </div>
        <div className="component-featured-product-hero__image">
          {image}
        </div>
      </div>
    </section>
  );
}


// ----- Default Props ----- //

FeaturedProductHero.defaultProps = {
  subheadingText: null,
  cta: null,
  image: null,
  product: null,
};
