// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import { type HeadingSize } from 'components/heading/heading';
import ThreeSubscriptions from 'components/threeSubscriptions/threeSubscriptions';
import SubscriptionBundle from 'components/subscriptionBundle/subscriptionBundle';
import { gridImageProperties } from 'components/threeSubscriptions/helpers/gridImageProperties';

import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { type CommonState } from 'helpers/page/page';
import { displayPrice } from 'helpers/subscriptions';
import { addQueryParamsToURL } from 'helpers/url';
import { getCampaign, type ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import {
  getSubsLinks,
  type SubsUrls,
  iOSAppUrl,
  androidAppUrl,
  dailyEditionUrl,
} from 'helpers/externalLinks';
import { classNameWithModifiers } from 'helpers/utilities';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { type ImageId } from 'helpers/theGrid';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';


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
        <Digital headingSize={headingSize} subsLinks={subsLinks} countryGroupId={countryGroupId} />
        <Paper headingSize={headingSize} subsLinks={subsLinks} countryGroupId={countryGroupId} />
      </div>
    );
  }

  return (
    <div className={className} {...otherProps}>
      <International headingSize={headingSize} subsLinks={subsLinks} />
    </div>
  );

}


// ----- Auxiliary Components ----- //

function Digital(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
}) {
  return (
    <ThreeSubscriptions heading="Digital Subscriptions">
      <PremiumTier
        headingSize={props.headingSize}
        internationalReferrer={false}
        subheading={displayPrice('PremiumTier', props.countryGroupId)}
      />
      <SubscriptionBundle
        modifierClass="daily-edition"
        heading="Daily Edition"
        subheading={`from ${displayPrice('DailyEdition', props.countryGroupId)}`}
        headingSize={props.headingSize}
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
            modifierClasses: ['border'],
            onClick: appStoreCtaClick,
          },
        ]}
      />
      <DigitalPack
        headingSize={props.headingSize}
        url={props.subsLinks.DigitalPack}
        subheading={displayPrice('DigitalPack', props.countryGroupId)}
        gridId="digitalCircleAlt"
        copy="The premium app and the daily edition in one pack"
      />
    </ThreeSubscriptions>
  );
}

function Paper(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
  countryGroupId: CountryGroupId,
}) {

  return (
    <ThreeSubscriptions heading="Print Subscriptions">
      <SubscriptionBundle
        modifierClass="paper"
        heading="Paper"
        subheading={`from ${displayPrice('Paper', props.countryGroupId)}`}
        headingSize={props.headingSize}
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
            url: props.subsLinks.Paper,
            accessibilityHint: 'Proceed to paper subscription options',
            modifierClasses: ['border'],
          },
        ]}
      />
      <SubscriptionBundle
        modifierClass="paper-digital"
        heading="Paper+Digital"
        subheading={`from ${displayPrice('PaperAndDigital', props.countryGroupId)}`}
        headingSize={props.headingSize}
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
            url: props.subsLinks.PaperAndDigital,
            accessibilityHint: 'Proceed to choose which days you would like to regularly receive the newspaper in conjunction with a digital subscription',
            modifierClasses: ['border'],
          },
        ]}
      />
      <Weekly
        headingSize={props.headingSize}
        url={props.subsLinks.GuardianWeekly}
        subheading={displayPrice('GuardianWeekly', props.countryGroupId)}
      />
    </ThreeSubscriptions>
  );

}

function International(props: {
  headingSize: HeadingSize,
  subsLinks: SubsUrls,
}) {

  return (
    <ThreeSubscriptions>
      <PremiumTier headingSize={props.headingSize} internationalReferrer subheading="7-day free trial" />
      <DigitalPack
        headingSize={props.headingSize}
        url={props.subsLinks.DigitalPack}
        subheading="14-day free trial"
        gridId="digitalCircleInternational"
        copy="The Premium App and the Daily Edition iPad app of the UK newspaper in one pack"
      />
      <Weekly headingSize={props.headingSize} subheading="&nbsp;" url={props.subsLinks.GuardianWeekly} />
    </ThreeSubscriptions>
  );

}

function PremiumTier(props: {
  headingSize: HeadingSize,
  internationalReferrer: boolean,
  subheading: string,
}) {

  const referrer = props.internationalReferrer ? internationalAppReferrer : appReferrer;

  return (
    <SubscriptionBundle
      modifierClass="premium-tier"
      heading="Premium App"
      subheading={props.subheading}
      headingSize={props.headingSize}
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
          url: addQueryParamsToURL(iOSAppUrl, { referrer }),
          accessibilityHint: 'Proceed to buy the premium app in the app store',
          modifierClasses: ['border', 'ios'],
          onClick: appStoreCtaClick,
        },
        {
          text: 'Buy on Google Play',
          url: addQueryParamsToURL(androidAppUrl, { referrer }),
          accessibilityHint: 'Proceed to buy the premium app in the play store',
          modifierClasses: ['border', 'android'],
          onClick: appStoreCtaClick,
        },
      ]}
    />
  );

}

function DigitalPack(props: {
  headingSize: HeadingSize,
  url: string,
  subheading: string,
  copy: string,
  gridId: ImageId,
}) {

  return (
    <SubscriptionBundle
      modifierClass="digital"
      heading="Digital Pack"
      subheading={props.subheading}
      headingSize={props.headingSize}
      benefits={{
        list: false,
        copy: props.copy,
      }}
      gridImage={{
        gridId: props.gridId,
        altText: 'digital subscription',
        ...gridImageProperties,
      }}
      ctas={[
        {
          text: 'Find out more',
          url: props.url,
          accessibilityHint: 'Find out how to sign up for a free trial of The Guardian\'s digital subscription.',
          modifierClasses: ['border'],
        },
      ]}
    />
  );

}

function Weekly(props: { headingSize: HeadingSize, url: string, subheading: string }) {

  return (
    <SubscriptionBundle
      modifierClass="weekly"
      heading="Guardian&nbsp;Weekly"
      subheading={props.subheading}
      headingSize={props.headingSize}
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
          url: props.url,
          accessibilityHint: 'Proceed to buy a subscription to The Guardian Weekly',
          modifierClasses: ['border'],
        },
      ]}
    />
  );

}


// ----- Exports ----- //

export default connect(mapStateToProps)(SubscriptionsByCountryGroup);
