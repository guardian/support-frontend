// @flow

// ----- Imports ----- //

import React from 'react';
import GridPicture from 'components/gridPicture/gridPicture';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import ProductPagehero from 'components/productPage/productPageHero/productPageHero';

import './weeklyCampaign.scss';

const HeroImage = () => (
  <GridPicture
    sources={[
        {
          gridId: 'weeklyLandingHero',
          srcSizes: [500, 1000],
          imgType: 'png',
          sizes: '100vw',
          media: '(max-width: 739px)',
        },
        {
          gridId: 'weeklyLandingHero',
          srcSizes: [1000, 2000],
          imgType: 'png',
          sizes: '(min-width: 1000px) 2000px, 1000px',
          media: '(min-width: 740px)',
        },
      ]}
    fallback="weeklyLandingHero"
    fallbackSize={1000}
    altText="A collection of Guardian Weekly magazines"
    fallbackImgType="png"
  />
);

const DefaultHeader = () => (
  <header>
    <ProductPagehero
      appearance="feature"
      overheading="Guardian Weekly subscriptions"
      heading="Get a clearer, global perspective on the issues that matter, in one magazine."
      modifierClasses={['weekly']}
      content={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
      hasCampaign={false}
    >
      <GridPicture
        sources={[
            {
              gridId: 'weeklyLandingHero',
              srcSizes: [500, 1000],
              imgType: 'png',
              sizes: '100vw',
              media: '(max-width: 739px)',
            },
            {
              gridId: 'weeklyLandingHero',
              srcSizes: [1000, 2000],
              imgType: 'png',
              sizes: '(min-width: 1000px) 2000px, 1000px',
              media: '(min-width: 740px)',
            },
          ]}
        fallback="weeklyLandingHero"
        fallbackSize={1000}
        altText="A collection of Guardian Weekly magazines"
        fallbackImgType="png"
      />
    </ProductPagehero>
  </header>
);

const CampaignHeader = () => (
  <ProductPagehero
    appearance="campaign"
    overheading="Guardian Weekly subscriptions"
    heading="The Guardian's essential news magazine"
    modifierClasses={['weekly-campaign']}
    content={<AnchorButton aria-label={null} onClick={sendTrackingEventsOnClick('options_cta_click', 'GuardianWeekly', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
    hasCampaign
  >

    <div className="weekly-campaign-hero">
      <div className="weekly-campaign-hero__copy">
        <h2>Think globally.<br />Read Weekly.</h2>
      </div>

      <div className="weekly-campaign-hero__graphic">
        <GridImage
          gridId="weeklyCampaignHeroImg"
          srcSizes={[1000, 1358]}
          sizes="(max-width: 740px) 1000px, 1358px"
          imgType="png"
          altText="A collection of Guardian Weekly magazines"
        />
      </div>

    </div>


  </ProductPagehero>
);


export { DefaultHeader, CampaignHeader, HeroImage };
