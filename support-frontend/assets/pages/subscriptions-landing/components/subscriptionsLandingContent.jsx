// @flow

import React from 'react';

import { connect } from 'react-redux';

// components
import SubscriptionsProduct from './subscriptionsProduct';

// images
import FeaturePackshot from 'components/packshots/feature-packshot';
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';

// helpers
import { displayPrice } from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';

// types
import { type CommonState } from 'helpers/page/commonReducer';
import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type Participations } from 'helpers/abTests/abtest';
import { type OptimizeExperiments } from 'helpers/optimize/optimize';
import { type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

type PropTypes = {
  countryGroupId: CountryGroupId,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  optimizeExperiments: OptimizeExperiments,
}

const SubscriptionsLandingContent = ({
  countryGroupId, referrerAcquisitionData, abParticipations, optimizeExperiments,
}: PropTypes) => {

  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
    abParticipations,
    optimizeExperiments,
  );

  console.log(subsLinks);
  return (
    <div className="subscriptions-landing-page">
      <div className="subscriptions__feature" />

      <div className="subscriptions__product-container">

        <SubscriptionsProduct
          title="Digital Subscription"
          subtitle={`from ${displayPrice('DigitalPack', countryGroupId)}`}
          description="The Daily Edition app and Premium app in one pack, plus ad-free reading on all your devices"
          ctaButtonText="Find out more"
          productImage={<FeaturePackshot />}
          link={subsLinks.DigitalPack}
          isFeature
        />

        <SubscriptionsProduct
          title="Guardian Weekly"
          subtitle={`${displayPrice('GuardianWeekly', countryGroupId)}`}
          description="A weekly, global magazine from The Guardian, with delivery worldwide"
          ctaButtonText="Find out more"
          productImage={<GuardianWeeklyPackShot />}
          link={subsLinks.GuardianWeekly}
        />

        {countryGroupId === 'GBPCountries' && (
        <div>
          <SubscriptionsProduct
            title="Paper"
            subtitle={`from ${displayPrice('Paper', countryGroupId)}`}
            description="Save on The Guardian and The Observer's newspaper retail price all year round"
            ctaButtonText="Find out more"
            productImage={<PaperPackshot />}
            offer="Up to 52% off for a year"
            link={subsLinks.Paper}
          />
          <SubscriptionsProduct
            title="Paper+Digital"
            subtitle={`from ${displayPrice('PaperAndDigital', countryGroupId)}`}
            description="Save on The Guardian and The Observer's newspaper retail price all year round"
            ctaButtonText="Find out more"
            productImage={<PaperPackshot />}
            offer="Up to 52% off for a year"
            link={subsLinks.PaperAndDigital}
          />
          <div className="subscriptions__premuim-app">
            <SubscriptionsProduct
              title="Premium App"
              subtitle={`from ${displayPrice('PremiumTier', countryGroupId)}`}
              description="Save on The Guardian and The Observer's newspaper retail price all year round"
              ctaButtonText="Find out more"
              productImage={<PremiumAppPackshot />}
              link="#"
            />
          </div>
        </div>
      )}
      </div>
    </div>

  );

};

function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    optimizeExperiments: state.common.optimizeExperiments,
  };

}

export default connect(mapStateToProps)(SubscriptionsLandingContent);
