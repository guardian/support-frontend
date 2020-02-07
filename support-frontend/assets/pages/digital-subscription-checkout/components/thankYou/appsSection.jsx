// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getIosAppUrl,
  androidAppUrl,
  androidDailyUrl,
  getDailyEditionUrl,
} from 'helpers/externalLinks';


import { type CountryGroupId } from 'helpers/internationalisation/countryGroup';
import { sendTrackingEventsOnClick } from 'helpers/subscriptions';

import Text from 'components/text/text';
import AnchorButton from 'components/button/anchorButton';

// ----- Types ----- //

type PropTypes = {
  countryGroupId: CountryGroupId,
};


// ----- Component ----- //

const AppsSection = ({ countryGroupId }: PropTypes) => (
  <div>
    <Text title="The Guardian Daily" headingSize={3}>
      <p>Each day&#39;s edition, in one simple, elegant app</p>
      <div className="thank-you-stage__ctas">
        <AnchorButton
          appearance="greyHollow"
          aria-label="Click to download the Guardian Daily app on the Apple App Store"
          href={getDailyEditionUrl(countryGroupId)}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_daily_edition', 'DigitalPack', null)}
        >
            Download from App Store
        </AnchorButton>
        <AnchorButton
          appearance="greyHollow"
          aria-label="Click to download the Guardian Daily app on Google Play"
          href={androidDailyUrl}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_daily_edition', 'DigitalPack', null)}
        >
            Download from Google Play
        </AnchorButton>
      </div>
    </Text>
    <Text title="Premium access to The Guardian Live app" headingSize={3}>
      <p>
        Live news, as it happens
      </p>
      <div className="thank-you-stage__ctas">
        <AnchorButton
          appearance="greyHollow"
          aria-label="Click to download the app on the Apple App Store"
          href={getIosAppUrl(countryGroupId)}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_app_store', 'DigitalPack', null)}
        >
            Download from App Store
        </AnchorButton>
        <AnchorButton
          aria-label="Click to download the app on the Google Play store"
          appearance="greyHollow"
          href={androidAppUrl}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_play_store', 'DigitalPack', null)}
        >
            Download from Google Play
        </AnchorButton>
      </div>
    </Text>
  </div>
);


// ----- Export ----- //

export default AppsSection;
