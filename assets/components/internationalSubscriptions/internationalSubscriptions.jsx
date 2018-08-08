// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getSubsLinks,
  iOSAppUrl,
  androidAppUrl,
} from 'helpers/externalLinks';
import { getCampaign } from 'helpers/tracking/acquisitions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import { addQueryParamsToURL } from 'helpers/url';

import PageSection from 'components/pageSection/pageSection';
import { PremiumTier, DigitalBundle } from 'components/digitalSubscriptions/digitalSubscriptions';
import { WeeklyBundle } from 'components/paperSubscriptions/paperSubscriptions';
import { type HeadingSize } from 'components/heading/heading';
import type { CountryGroupId } from 'helpers/internationalisation/countryGroup';

// ----- Types ----- //

type ClickEvent = () => void;

type PropTypes = {
  countryGroupId: CountryGroupId,
  referrerAcquisitionData: ReferrerAcquisitionData,
  headingSize: HeadingSize,
  clickEvents: {
    iOSApp: ClickEvent,
    androidApp: ClickEvent,
    digiPack: ClickEvent,
    weekly: ClickEvent,
  },
};


// ----- Setup ----- //

const appReferrer = 'utm_source=support.theguardian.com&utm_medium=subscribe_landing_page&utm_campaign=international_subs_landing_pages';


// ----- Component ----- //

export default function InternationalSubscriptions(props: PropTypes) {

  const subsLinks = getSubsLinks(
    props.countryGroupId,
    props.referrerAcquisitionData.campaignCode,
    getCampaign(props.referrerAcquisitionData),
    [],
    props.referrerAcquisitionData,
  );

  return (
    <div className="component-international-subscriptions">
      <PageSection
        heading="Subscribe"
        modifierClass="international-subscriptions"
      >
        <PremiumTier
          countryGroupId={props.countryGroupId}
          iOSUrl={addQueryParamsToURL(iOSAppUrl, { referrer: appReferrer })}
          androidUrl={addQueryParamsToURL(androidAppUrl, { referrer: appReferrer })}
          headingSize={props.headingSize}
          iOSOnClick={props.clickEvents.iOSApp}
          androidOnClick={props.clickEvents.androidApp}
        />
        <DigitalBundle
          countryGroupId={props.countryGroupId}
          url={subsLinks.DigitalPack}
          headingSize={props.headingSize}
          onClick={props.clickEvents.digiPack}
        />
        <WeeklyBundle
          countryGroupId={props.countryGroupId}
          url={subsLinks.GuardianWeekly}
          headingSize={props.headingSize}
          onClick={props.clickEvents.digiPack}
        />
      </PageSection>
    </div>
  );

}
