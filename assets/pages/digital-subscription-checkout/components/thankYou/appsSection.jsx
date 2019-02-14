// @flow

// ----- Imports ----- //

import React from 'react';

import {
  getIosAppUrl,
  androidAppUrl,
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
    <Text title="Premium App" headingSize={3}>
      <p>
          Your enhanced experience of The Guardian
          for mobile and tablet, with exclusive features and ad-free reading.
      </p>
      <div className="thank-you-stage__ctas">
        <AnchorButton
          appearance="greyHollow"
          aria-label="Click to download the app on the Apple App Store"
          href={getIosAppUrl(countryGroupId)}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_app_store', 'DigitalPack', null)}
        >
            Download from the App Store
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
    <Text title="Daily Edition (iPad only)" headingSize={3}>
      <p>Every issue of The Guardian and Observer, designed for your iPad and available offline.</p>
      <div className="thank-you-stage__ctas">
        <AnchorButton
          appearance="greyHollow"
          aria-label="Click to download the Daily Tablet Edition app on the Apple App Store"
          href={getDailyEditionUrl(countryGroupId)}
          onClick={sendTrackingEventsOnClick('checkout_thankyou_daily_edition', 'DigitalPack', null)}
        >
            Download the Daily Edition
        </AnchorButton>
      </div>
    </Text>
  </div>
);


// ----- Export ----- //

export default AppsSection;
