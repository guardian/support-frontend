// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getSubsLinks,
  iOSAppUrl,
  androidAppUrl,
} from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import { appStoreCtaClick } from 'helpers/tracking/googleTagManager';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { addQueryParamsToURL } from 'helpers/url';

import PageSection from 'components/pageSection/pageSection';
import { PremiumTier, DigitalBundle } from 'components/digitalSubscriptions/digitalSubscriptions';
import { WeeklyBundle } from 'components/paperSubscriptions/paperSubscriptions';
import { type HeadingSize } from 'components/heading/heading';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { countryGroups } from 'helpers/internationalisation/countryGroup';
import { classNameWithModifiers } from 'helpers/utilities';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
  referrerAcquisitionData: ReferrerAcquisitionData,
  headingSize: HeadingSize,
};


// ----- Setup ----- //

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page&utm_campaign=international_subs_landing_pages';


// ----- Component ----- //

export default function InternationalSubscriptions(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    props.referrerAcquisitionData,
  );

  return (
    <div
      className={classNameWithModifiers(
        'component-international-subscriptions',
        [countryGroups[props.countryGroupId].supportInternationalisationId],
      )}
    >
      <PageSection
        heading="Subscribe"
        modifierClass="international-subscriptions"
      >
        <PremiumTier
          countryGroupId={props.countryGroupId}
          iOSUrl={addQueryParamsToURL(iOSAppUrl, { referrer: appReferrer })}
          androidUrl={addQueryParamsToURL(androidAppUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
          subheading="7-day free trial"
          ctaOnClick={appStoreCtaClick}
        />
        <DigitalBundle
          countryGroupId={props.countryGroupId}
          url={subsLinks.DigitalPack}
          headingSize={props.headingSize}
          subheading="14-day free trial"
        />
        <WeeklyBundle
          countryGroupId={props.countryGroupId}
          url={subsLinks.GuardianWeekly}
          headingSize={props.headingSize}
          subheading="&nbsp;"
        />
      </PageSection>
    </div>
  );

}

