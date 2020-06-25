// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import ProductPagehero
  from 'components/productPage/productPageHero/productPageHero';
import AnchorButton from 'components/button/anchorButton';
import SvgChevron from 'components/svgs/chevron';
import GridImage from 'components/gridImage/gridImage';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getDiscountCopy } from './discountCopy';
import type { State } from 'pages/paper-subscription-landing/paperSubscriptionLandingPageReducer';
import { getMaxSavingVsRetail } from 'helpers/productPrice/paperProductPrices';
import type { DiscountCopy } from 'pages/paper-subscription-landing/components/hero/discountCopy';
import {
  campaignHeader,
  campaignCopy,
  heading,
  subheading,
  graphicOuter,
  graphicInner,
  graphic,
  badge,
} from './campaignHeaderStyles';

// We need to preserve this little bit of scss but hope to gradually move it out
import './campaignHeader.scss';


type PropTypes = {
  discountCopy: DiscountCopy,
}

const mapStateToProps = (state: State) => {
  const maxSavingVsRetail = state.page.productPrices ?
    getMaxSavingVsRetail(state.page.productPrices) : 0;
  return {
    discountCopy: getDiscountCopy(maxSavingVsRetail),
  };
};

const Roundel = (props: { roundelCopy: string[] }) => (
  props.roundelCopy.length > 0 ?
    <div css={badge}>
      <div>
        {props.roundelCopy.map(copy => <span>{ copy }</span>)}
      </div>
    </div> : null
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
    <div css={campaignHeader}>
      <div css={campaignCopy}>
        <h2 css={heading}>
          <span>Subscribe to The Guardian</span><br />
          <span>and The Observer</span>
        </h2>
        <p css={subheading}>Choose from a range of packages to suit you</p>
      </div>
    </div>
    <div css={graphicOuter}>
      <div css={graphicInner}>
        <Roundel roundelCopy={props.discountCopy.roundel} />
        <div css={graphic}>
          <GridImage
            gridId="printCampaignHero"
            srcSizes={[500]}
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
