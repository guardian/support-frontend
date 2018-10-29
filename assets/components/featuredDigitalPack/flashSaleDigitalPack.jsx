// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import Heading from 'components/heading/heading';
import CtaLink from 'components/ctaLink/ctaLink';
import GridPicture from 'components/gridPicture/gridPicture';
import FlashSaleCountdown from 'components/flashSaleCountdown/flashSaleCountdown';
import { currencies, detect } from 'helpers/internationalisation/currency';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { getDiscountedPrice, getCountdownAbTestParticipation } from 'helpers/flashSale';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getSubsLinks } from 'helpers/externalLinks';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { ComponentAbTest } from 'helpers/subscriptions';
import type { HeadingSize } from 'components/heading/heading';

// ----- Types ----- //

type PropTypes = {
  headingSize: HeadingSize,
  countryGroupId: CountryGroupId,
  abTest: ComponentAbTest | null,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
};

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    optimizeExperiments: state.common.optimizeExperiments,
  };

}


function FlashSaleDigitalPack(props: PropTypes) {

  const {
    countryGroupId,
    headingSize,
    referrerAcquisitionData,
    abParticipations,
    abTest,
    optimizeExperiments,
  } = props;

  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
    optimizeExperiments,
  );

  const currency = currencies[detect(countryGroupId)].glyph;
  const timerClassName = getCountdownAbTestParticipation() ? 'component-flash-sale-featured-digital-pack__countdownbox' : 'component-flash-sale-featured-digital-pack__countdownbox component-flash-sale-featured-digital-pack__countdownbox--hidden';
  return (
    <section className="component-flash-sale-featured-digital-pack">
      <div className="component-flash-sale-featured-digital-pack__content">
        <div className="component-flash-sale-featured-digital-pack__description">
          <Heading
            className="component-flash-sale-featured-digital-pack__heading"
            size={headingSize}
          >
            Digital Pack
          </Heading>
          <Heading
            className="component-flash-sale-featured-digital-pack__subheading"
            size={headingSize}
          >
            Save 50% for three months
          </Heading>
          <div className={timerClassName}>
            <FlashSaleCountdown />
            <p className="component-flash-sale-featured-digital-pack__copy">
              Read the Guardian ad-free on all devices, including the Premium App and Daily Edition iPad app.
              {' '}{currency}{getDiscountedPrice('DigitalPack', countryGroupId)} for your first three months.
            </p>
            <CtaLink
              text="Subscribe now"
              url={subsLinks.DigitalPack}
              accessibilityHint="Buy now"
              modifierClasses={['flash-sale']}
              onClick={sendTrackingEventsOnClick('featured_digipack_cta', 'DigitalPack', abTest)}
            />
          </div>
        </div>
        <div className="component-flash-sale-featured-digital-pack__image">
          <GridPicture
            sources={[
              {
                gridId: 'digitalPackFlashSaleMobile',
                srcSizes: [140, 500, 717],
                imgType: 'png',
                sizes: '90vw',
                media: '(max-width: 739px)',
              },
              {
                gridId: 'digitalPackFlashSaleDesktop',
                srcSizes: [140, 500, 1000, 1388],
                imgType: 'png',
                sizes: '(min-width: 1300px) 750px, (min-width: 1140px) 700px, (min-width: 980px) 600px, (min-width: 740px) 60vw',
                media: '(min-width: 740px)',
              },
            ]}
            fallback="digitalPackFlashSaleDesktop"
            fallbackSize={500}
            altText="ad-free, live and discover, and the daily edition"
            fallbackImgType="png"
          />
        </div>
      </div>
    </section >
  );
}


// ----- Default Props ----- //

FlashSaleDigitalPack.defaultProps = {
  abTest: null,
};


// ----- Export ----- //

export default connect(mapStateToProps)(FlashSaleDigitalPack);

