// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type HeadingSize } from 'components/heading/heading';
import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/gridImageProperties';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CommonState } from 'helpers/page/page';
import { displayPrice } from 'helpers/subscriptions';
import { addQueryParamsToURL } from 'helpers/url';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
  getSubsLinks,
  iOSAppUrl,
  androidAppUrl,
  dailyEditionUrl,
} from 'helpers/externalLinks';
import { classNameWithModifiers } from 'helpers/utilities';
import { countryGroups } from 'helpers/internationalisation/countryGroup';


// ----- Types and State Mapping ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  headingSize: HeadingSize,
  referrerAcquisitionData: ReferrerAcquisitionData,
};


function mapStateToProps(state: { common: CommonState }) {

  return {
    countryGroupId: state.common.internationalisation.countryGroupId,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };

}


// ----- Setup ----- //

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page';
const internationalAppReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page&utm_campaign=international_subs_landing_pages';


// ----- Component ----- //

function SubscriptionsByCountryGroup(props: PropTypes) {

  const {
    countryGroupId, headingSize, referrerAcquisitionData, ...otherProps
  } = props;
  const subsLinks = getSubsLinks(
    countryGroupId,
    referrerAcquisitionData.campaignCode,
    getCampaign(referrerAcquisitionData),
    referrerAcquisitionData,
  );
  const className = classNameWithModifiers(
    'component-subscriptions-by-country-group',
    [countryGroups[countryGroupId].supportInternationalisationId],
  );

  if (countryGroupId === 'GBPCountries') {
    return (
      <div className={className} {...otherProps}>
        <ThreeSubscriptions heading="Digital Subscriptions">
          <SubscriptionBundle
            modifierClass="premium-tier"
            heading="Premium App"
            subheading={displayPrice('PremiumTier', countryGroupId)}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'The ad-free, premium app, designed especially for your smartphone and tablet',
            }}
            gridImage={{
              gridId: 'premiumTierCircle',
              altText: 'premium app',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Buy in the App Store',
                url: addQueryParamsToURL(iOSAppUrl, { referrer: appReferrer }),
                accessibilityHint: 'Proceed to buy the premium app in the app store',
                modifierClasses: ['premium-tier', 'border', 'ios'],
              },
              {
                text: 'Buy on Google Play',
                url: addQueryParamsToURL(androidAppUrl, { referrer: appReferrer }),
                accessibilityHint: 'Proceed to buy the premium app in the play store',
                modifierClasses: ['premium-tier', 'border', 'android'],
              },
            ]}
          />
          <SubscriptionBundle
            modifierClass="daily-edition"
            heading="Daily Edition"
            subheading={`from ${displayPrice('DailyEdition', 'GBPCountries')}`}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'Your complete daily UK newspaper, designed for iPad and available offline',
            }}
            gridImage={{
              gridId: 'dailyEditionCircle',
              altText: 'daily edition',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Buy in the App Store',
                url: addQueryParamsToURL(dailyEditionUrl, { referrer: appReferrer }),
                accessibilityHint: 'Proceed to buy the daily edition app for iPad in the app store',
                modifierClasses: ['daily-edition', 'border'],
              },
            ]}
          />
          <SubscriptionBundle
            modifierClass="digital"
            heading="Digital Pack"
            subheading={displayPrice('DigitalPack', props.countryGroupId)}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'The premium app and the daily edition in one pack',
            }}
            gridImage={{
              gridId: 'digitalCircleAlt',
              altText: 'digital subscription',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Find out more',
                url: subsLinks.DigitalPack,
                accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
                modifierClasses: ['digital', 'border'],
              },
            ]}
          />
        </ThreeSubscriptions>
        <ThreeSubscriptions heading="Print Subscriptions">
          <SubscriptionBundle
            modifierClass="paper"
            heading="Paper"
            subheading={`from ${displayPrice('Paper', 'GBPCountries')}`}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'The Guardian and The Observer\'s newspaper subscription options',
            }}
            gridImage={{
              gridId: 'paperCircle',
              altText: 'paper subscription',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Choose a package',
                url: subsLinks.Paper,
                accessibilityHint: 'Proceed to paper subscription options',
                modifierClasses: ['paper', 'border'],
              },
            ]}
          />
          <SubscriptionBundle
            modifierClass="paper-digital"
            heading="Paper+Digital"
            subheading={`from ${displayPrice('PaperAndDigital', 'GBPCountries')}`}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'All the benefits of a paper subscription, plus access to the digital pack',
            }}
            gridImage={{
              gridId: 'paperDigitalCircleAlt',
              altText: 'paper + digital subscription',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Choose a package',
                url: subsLinks.PaperAndDigital,
                accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
                modifierClasses: ['paper-digital', 'border'],
              },
            ]}
          />
          <SubscriptionBundle
            modifierClass="weekly"
            heading="Guardian&nbsp;Weekly"
            subheading={displayPrice('GuardianWeekly', props.countryGroupId)}
            headingSize={headingSize}
            benefits={{
              list: false,
              copy: 'A weekly global newspaper delivered to your door',
            }}
            gridImage={{
              gridId: 'weeklyCircle',
              altText: 'weekly subscription',
              ...gridImageProperties,
            }}
            ctas={[
              {
                text: 'Find out more',
                url: subsLinks.GuardianWeekly,
                accessibilityHint: 'Proceed to buy a subscription to The Guardian Weekly',
                modifierClasses: ['weekly', 'border'],
              },
            ]}
          />
        </ThreeSubscriptions>
      </div>
    );
  }

  return (
    <div
      className={className}
      {...otherProps}
    >
      <ThreeSubscriptions>
        <SubscriptionBundle
          modifierClass="premium-tier"
          heading="Premium App"
          subheading="7-day free trial"
          headingSize={headingSize}
          benefits={{
            list: false,
            copy: 'The ad-free, premium app, designed especially for your smartphone and tablet',
          }}
          gridImage={{
            gridId: 'premiumTierCircle',
            altText: 'premium app',
            ...gridImageProperties,
          }}
          ctas={[
            {
              text: 'Buy in the App Store',
              url: addQueryParamsToURL(iOSAppUrl, { referrer: internationalAppReferrer }),
              accessibilityHint: 'Proceed to buy the premium app in the app store',
              modifierClasses: ['premium-tier', 'border', 'ios'],
            },
            {
              text: 'Buy on Google Play',
              url: addQueryParamsToURL(androidAppUrl, { referrer: internationalAppReferrer }),
              accessibilityHint: 'Proceed to buy the premium app in the play store',
              modifierClasses: ['premium-tier', 'border', 'android'],
            },
          ]}
        />
        <SubscriptionBundle
          modifierClass="digital"
          heading="Digital Pack"
          subheading="14-day free trial"
          headingSize={headingSize}
          benefits={{
            list: false,
            copy: 'The Premium App and the Daily Edition iPad app of the UK newspaper in one pack',
          }}
          gridImage={{
            gridId: 'digitalCircleInternational',
            altText: 'digital subscription',
            ...gridImageProperties,
          }}
          ctas={[
            {
              text: 'Find out more',
              url: subsLinks.DigitalPack,
              accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
              modifierClasses: ['digital', 'border'],
            },
          ]}
        />
        <SubscriptionBundle
          modifierClass="weekly"
          heading="Guardian&nbsp;Weekly"
          subheading="&nbsp;"
          headingSize={headingSize}
          benefits={{
            list: false,
            copy: 'A weekly global newspaper delivered to your door',
          }}
          gridImage={{
            gridId: 'weeklyCircle',
            altText: 'weekly subscription',
            ...gridImageProperties,
          }}
          ctas={[
            {
              text: 'Find out more',
              url: subsLinks.GuardianWeekly,
              accessibilityHint: 'Proceed to buy a subscription to The Guardian Weekly',
              modifierClasses: ['weekly', 'border'],
            },
          ]}
        />
      </ThreeSubscriptions>
    </div>
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
