// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import GridPicture from 'components/gridPicture/gridPicture';
import ProductPagehero
  from 'components/productPage/productPageHero/productPageHero';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getDiscountCopy } from './discountCopy';
import './joyOfPrint.scss';
import type { State } from 'pages/paper-subscription-landing/paperSubscriptionLandingPageReducer';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperProductPrices';
import type { DiscountCopy } from 'pages/paper-subscription-landing/components/hero/discountCopy';

type PropTypes = {
  discountCopy: DiscountCopy,
}

const mapStateToProps = (state: State) => {
  const maxSavingVsRetail = getMaxSavingVsRetail(state.page.productPrices);
  return {
    discountCopy: getDiscountCopy(maxSavingVsRetail),
  }
};

const Discount = (props: { discountCopy: string[] }) => (
  <div>
    {props.discountCopy.map(copy => <span>{ copy }</span>)}
  </div>
);

const HeroPicture = () => (
  <GridPicture
    sources={[
      {
        gridId: 'paperLandingHeroMobile',
        srcSizes: [500, 922],
        imgType: 'png',
        sizes: '100vw',
        media: '(max-width: 739px)',
      },
      {
        gridId: 'paperLandingHero',
        srcSizes: [1000, 2000],
        imgType: 'png',
        sizes: '(min-width: 1000px) 2000px, 1000px',
        media: '(min-width: 740px)',
      },
    ]}
    fallback="paperLandingHero"
    fallbackSize={1000}
    altText=""
    fallbackImgType="png"
  />
);

const CampaignHeader = (props: PropTypes) => (
  <ProductPagehero
    appearance="campaign"
    overheading="Newspaper subscriptions"
    heading={props.discountCopy.heading}
    modifierClasses={['paper-sale']}
    content={<AnchorButton onClick={sendTrackingEventsOnClick('options_cta_click', 'Paper', null)} icon={<SvgChevron />} href="#subscribe">See Subscription options</AnchorButton>}
    hasCampaign
  >
    <div className="sale-joy-of-print">
      <div className="sale-joy-of-print-copy">
        <h2><span>Subscribe to The</span><br /><span>Guardian and The Observer</span></h2>
        <p>Choose from a range of<br />packages to suit you</p>
      </div>
    </div>
    <div className="sale-joy-of-print-graphic-outer">
      <div className="sale-joy-of-print-graphic-inner">
        <div className="sale-joy-of-print-badge">
          <Discount discountCopy={props.discountCopy.roundel} />
        </div>
        <div className="sale-joy-of-print-graphic">
          <GridImage
            gridId="printCampaign2020"
            srcSizes={[1000, 500]}
            sizes="(max-width: 740px) 100vw, 800px"
            imgType="png"
            altText="Newspapers"
          />
        </div>
      </div>
    </div>
  </ProductPagehero>
);

export default connect(mapStateToProps)(CampaignHeader);

export {  HeroPicture };
