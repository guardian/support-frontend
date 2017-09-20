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
            price="11.99"
            from={false}
            copy="Get our journalism across up to 10 devices, to enjoy wherever you go"
            ctaText="Start 14-day trial"
            image="digitalBundle"
          />
          <SubscriptionBundle
            heading="paper"
            price="10.79"
            from
            copy="With six day, weekend and everyday options, you can choose the package that suits you"
            ctaText="Choose paper"
            image="paperBundle"
          />
          <SubscriptionBundle
            heading="paper & digital"
            price="22.06"
            from
            copy="Enjoy the Guardian at your leisure, whether it's on your tablet on the go, or reading the paper at home"
            ctaText="Choose paper & digital"
            image="paperDigitalBundle"
          />
        </div>
      </InfoSection>
    </div>
  );

}
