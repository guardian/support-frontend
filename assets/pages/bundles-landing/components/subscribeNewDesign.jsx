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
            image="7c7b9580924281914e82dc163bf716ede52daa8b/0_0_600_360"
          />
          <SubscriptionBundle
            heading="paper"
            price="10.79"
            from
            copy="With six day, weekend and everyday options, you can choose the package that suits you"
            ctaText="Choose paper"
            image="4d0851394ce3c100649800733f230a78c0d38555/0_0_600_360"
          />
          <SubscriptionBundle
            heading="paper & digital"
            price="22.06"
            from
            copy="Enjoy the Guardian at your leisure, whether it's on your tablet on the go, or reading the paper at home"
            ctaText="Choose paper & digital"
            image="1199912112859eecf3f2d94edc6fdd73843d10e9/0_0_600_360"
          />
        </div>
      </InfoSection>
    </div>
  );

}
