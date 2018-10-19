// @flow

// ----- Imports ----- //

import React from 'react';

import Heading from 'components/heading/heading';
import CtaLink from 'components/ctaLink/ctaLink';
import GridPicture from 'components/gridPicture/gridPicture';
import { getDiscountedPrice } from 'helpers/flashSale';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import type { ComponentAbTest } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';

// ----- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
  url: string,
  abTest: ComponentAbTest | null,
};


export default function FlashSaleDigitalPack(props: PropTypes) {
  return (
    <section className="component-flash-sale-featured-digital-pack">
      <div className="component-flash-sale-featured-digital-pack__description">
        <Heading
          className="component-flash-sale-featured-digital-pack__heading"
          size={props.headingSize}
        >
          50% off
        </Heading>
        <Heading
          className="component-flash-sale-featured-digital-pack__subheading"
          size={props.headingSize}
        >
          Screen time well spent
        </Heading>
        <p className="component-flash-sale-featured-digital-pack__copy">
          Read the Guardian ad-free on all devices, including the Premium App and Daily Edition iPad app.
          £${getDiscountedPrice('DigitalPack', 'GBPCountries')} for your first three months.
        </p>
        <CtaLink
          text="Subscribe now"
          url={props.url}
          accessibilityHint="Buy now"
          onClick={sendTrackingEventsOnClick('featured_digipack_cta', 'DigitalPack', props.abTest)}
        />
      </div>
      <div className="component-featured-digital-pack__image">
        <GridPicture
          sources={[
            {
              gridId: 'digitalPackFlashSaleMobile',
              srcSizes: [467],
              imgType: 'png',
              sizes: '90vw',
              media: '(max-width: 659px)',
            },
            {
              gridId: 'digitalPackFlashSaleDesktop',
              srcSizes: [140, 500, 1000, 1027],
              imgType: 'png',
              sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw, 90vw',
              media: '(min-width: 660px)',
            },
          ]}
          fallback="digitalPackBenefitsDesktop"
          fallbackSize={796}
          altText="ad-free, live and discover, and the daily edition"
          fallbackImgType="png"
        />
      </div>
    </section>
  );
}

