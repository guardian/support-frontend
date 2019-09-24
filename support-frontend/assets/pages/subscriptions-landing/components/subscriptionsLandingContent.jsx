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

  return (
    <div className="subscriptions-landing-page">
      <div className="subscriptions__feature">
        <h2 className="subscriptions__feature-text">A beautiful way to read it.</h2>
        <h2 className="subscriptions__feature-text">A poweful way to fund it.</h2>
      </div>

      <div className="subscriptions__product-container">

        <SubscriptionsProduct
          title="Digital Subscription"
          subtitle={`from ${displayPrice('DigitalPack', countryGroupId)}`}
          description="The Daily Edition app and Premium app in one pack, plus ad-free reading on all your devices"
          productImage={<FeaturePackshot />}
          buttons={[{
            ctaButtonText: 'Find out more',
            link: subsLinks.DigitalPack,
          }]}
          isFeature
        />

        <SubscriptionsProduct
          title="Guardian Weekly"
          subtitle={`${displayPrice('GuardianWeekly', countryGroupId)}`}
          description="A weekly, global magazine from The Guardian, with delivery worldwide"
          buttons={[{
            ctaButtonText: 'Find out more',
            link: subsLinks.GuardianWeekly,
          }]}
          productImage={<GuardianWeeklyPackShot />}
        />

        {countryGroupId === 'GBPCountries' && (
        <div>
          <SubscriptionsProduct
            title="Paper"
            subtitle={`from ${displayPrice('Paper', countryGroupId)}`}
            description="Save on The Guardian and The Observer's newspaper retail price all year round"
            buttons={[{
              ctaButtonText: 'Find out more',
              link: subsLinks.Paper,
            }]}
            productImage={<PaperPackshot />}
            offer="Up to 52% off for a year"
          />
          <SubscriptionsProduct
            title="Paper+Digital"
            subtitle={`from ${displayPrice('PaperAndDigital', countryGroupId)}`}
            description="Save on The Guardian and The Observer's newspaper retail price all year round"
            buttons={[{
              ctaButtonText: 'Find out more',
              link: subsLinks.PaperAndDigital,
            }]}
            productImage={<PaperPackshot />}
            offer="Up to 52% off for a year"
          />
          <div className="subscriptions__premuim-app">
            <SubscriptionsProduct
              title="Premium App"
              subtitle={`from ${displayPrice('PremiumTier', countryGroupId)}`}
              description="Save on The Guardian and The Observer's newspaper retail price all year round"
              buttons={[{
                ctaButtonText: 'Buy in App Store',
                link: subsLinks.PaperAndDigital,
              }, {
                ctaButtonText: 'Buy on Google Play',
                link: subsLinks.PaperAndDigital,
              }]}
              productImage={<PremiumAppPackshot />}
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
