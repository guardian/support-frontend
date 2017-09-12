// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';

import SubscriptionBundle from './subscriptionBundleNewDesign';


// ----- Component ----- //

export default function Subscribe() {

  return (
    <div className="subscribe-new-design">
      <InfoSection heading="subscribe" className="subscribe-new-design__content gu-content-margin">
        <div className="subscribe-new-design__bundles-wrapper">
          <SubscriptionBundle
            heading="digital"
            price="14.99"
            from={false}
            copy="Get our journalism across up to 10 devices, to enjoy wherever you go"
          />
          <SubscriptionBundle
            heading="paper"
            price="19.99"
            from={true}
            copy="With six day, weekend and everyday options, you can choose the package that suits you"
          />
          <SubscriptionBundle
            heading="paper & digital"
            price="27.99"
            from={true}
            copy="Enjoy the Guardian at your leisure, whether it's on your tablet on the go, or reading the paper at home"
          />
        </div>
      </InfoSection>
    </div>
  );

}
