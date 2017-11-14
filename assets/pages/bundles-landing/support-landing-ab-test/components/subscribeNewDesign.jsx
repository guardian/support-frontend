// @flow

// ----- Imports ----- //

import React from 'react';

import InfoSection from 'components/infoSection/infoSection';

import SubscriptionBundle from './subscriptionBundleNewDesign';
import { features as subscriptionFeatures } from '../helpers/subscriptionFeatures';


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
            copy={subscriptionFeatures.digital}
            ctaText="Start your free trial"
            image="digitalBundle"
          />
          <SubscriptionBundle
            heading="paper"
            price="10.79"
            from
            copy={subscriptionFeatures.paper}
            ctaText="Get paper"
            image="paperBundle"
          />
          <SubscriptionBundle
            heading="paper & digital"
            price="22.06"
            from
            copy={subscriptionFeatures.paperDig}
            ctaText="Get paper + digital"
            image="paperDigitalBundle"
          />
        </div>
      </InfoSection>
    </div>
  );

}
