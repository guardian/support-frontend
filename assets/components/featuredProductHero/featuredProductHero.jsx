// @flow

// ----- Imports ----- //

import React, { type Node } from 'react';

import { classNameWithModifiers } from 'helpers/utilities';

import Heading from 'components/heading/heading';
import FlashSaleCountdown from 'components/flashSaleCountdown/flashSaleCountdown';
import type { HeadingSize } from 'components/heading/heading';

// ----- Types ----- //

type PropTypes = {
  hasTimer?: boolean,
  headingSize: HeadingSize,
  headingText: string,
  subheadingText?: ?string,
  bodyText: string,
  cta?: Node,
  image?: Node,
};

export default function FeaturedProductHero(props: PropTypes) {

  const {
    hasTimer,
    headingSize,
    headingText,
    subheadingText,
    bodyText,
    cta,
    image,
  } = props;

  const timerClassName = classNameWithModifiers('component-featured-product-hero__countdownbox', hasTimer ? [] : ['hidden']);

  return (
    <section className="component-featured-product-hero">
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
  hasTimer: false,
};
