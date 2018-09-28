// @flow

// ----- Imports ----- //

import React from 'react';

import Heading, { type HeadingSize } from 'components/heading/heading';
import CtaLink from 'components/ctaLink/ctaLink';
import GridPicture from 'components/gridPicture/gridPicture';
import SvgCircle from 'components/svgs/circle';

import {
  displayPrice,
  sendTrackingEventsOnClick,
  type ComponentAbTest,
} from 'helpers/subscriptions';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';


// ----- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  url: string,
  abTest: ComponentAbTest | null,
};


// ----- Components ----- //

function FeaturedDigitalPack(props: PropTypes) {

  return (
    <section className="component-featured-digital-pack">
      <div className="component-featured-digital-pack__description">
        <Heading
          className="component-featured-digital-pack__heading"
          size={props.headingSize}
        >
          Digital pack 14-day free trial
        </Heading>
        <Heading
          className="component-featured-digital-pack__subheading"
          size={props.headingSize}
        >
          What&#39;s in the Digital pack?
        </Heading>
        <p className="component-featured-digital-pack__copy">
          Read the Guardian ad-free on all devices plus get all the
          benefits of the Premium App and Daily Edition iPad app for
          just {displayPrice('DigitalPack', props.countryGroupId)}
        </p>
        <CtaLink
          text="Buy now"
          url={props.url}
          accessibilityHint="Buy now"
          onClick={sendTrackingEventsOnClick('featured_digipack_cta', 'DigitalPack', props.abTest)}
        />
      </div>
      <div className="component-featured-digital-pack__image">
        <SvgCircle />
        <GridPicture
          sources={[
            {
              gridId: 'digitalPackBenefitsMobile',
              srcSizes: [140, 500, 1000, 1730],
              imgType: 'png',
              sizes: '90vw',
              media: '(max-width: 659px)',
            },
            {
              gridId: 'digitalPackBenefitsDesktop',
              srcSizes: [140, 500, 796],
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


// ----- Default Props ----- //

FeaturedDigitalPack.defaultProps = {
  abTest: null,
};


// ----- Exports ----- //

export default FeaturedDigitalPack;
