// @flow

import React from 'react';

import { connect } from 'react-redux';

// components
import SubscriptionsProduct from './subscriptionsProduct';
import FeatureHeader from './featureHeader';

// images
import FeaturePackshot from 'components/packshots/feature-packshot';
import GuardianWeeklyPackShot from 'components/packshots/guardian-weekly-packshot';
import PaperPackshot from 'components/packshots/paper-packshot';
import PremiumAppPackshot from 'components/packshots/premium-app-packshot';
import PaperAndDigitalPackshot from 'components/packshots/paper-and-digital-packshot';

// helpers
import { displayPrice, sendTrackingEventsOnClick } from 'helpers/subscriptions';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { getSubsLinks } from 'helpers/externalLinks';
import { androidAppUrl, getIosAppUrl } from 'helpers/externalLinks';
import trackAppStoreLink from 'components/subscriptionBundles/appCtaTracking';

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
  const abTest = null;

  return (
    <div className="subscriptions-landing-page">
      <FeatureHeader />

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
          analyticsTracking={() => sendTrackingEventsOnClick('digipack_cta', 'DigitalPack', abTest, 'digital-subscription')}
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
          analyticsTracking={() => sendTrackingEventsOnClick('weekly_cta', 'GuardianWeekly', abTest)}
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
            analyticsTracking={sendTrackingEventsOnClick('paper_cta', 'Paper', abTest, 'paper-subscription')}
          />
          <SubscriptionsProduct
            title="Paper+Digital"
            subtitle={`from ${displayPrice('PaperAndDigital', countryGroupId)}`}
            description="Save on The Guardian and The Observer's newspaper retail price all year round"
            buttons={[{
              ctaButtonText: 'Find out more',
              link: subsLinks.PaperAndDigital,
            }]}
            productImage={<PaperAndDigitalPackshot />}
            offer="Up to 52% off for a year"
            analyticsTracking={sendTrackingEventsOnClick('paper_digital_cta', 'PaperAndDigital', abTest, 'paper-and-digital-subscription')}
          />
          <div className="subscriptions__premuim-app">
            <SubscriptionsProduct
              title="Premium App"
              subtitle={`from ${displayPrice('PremiumTier', countryGroupId)}`}
              description="Save on The Guardian and The Observer's newspaper retail price all year round"
              buttons={[{
                ctaButtonText: 'Buy in App Store',
                link: getIosAppUrl(countryGroupId),
                onClick: trackAppStoreLink('premium_tier_ios_cta', 'PremiumTier', abTest),
                // these buttons need a change there css so the text fits at 320px width
              }, {
                ctaButtonText: 'Buy on Google Play',
                link: androidAppUrl,
                onClick: trackAppStoreLink('premium_tier_android_cta', 'PremiumTier', abTest),
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
