// @flow
import React from 'react';

import PaymentSelection
  from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

import './digitalSubscriptionLanding.scss';

export const CallToAction = () => (
  <div id="subscribe" className="call-to-action__container">
    <div className="hope-is-power--centered">
      <h2>Choose one of our special offers and subscribe today</h2>
      <h3>After your <strong>14-day free trial</strong>, your
      subscription will begin automatically and you can cancel any time
      </h3>
      <PaymentSelection orderIsGift={false} />
    </div>
  </div>
);

export const CallToActionGift = () => (
  <div id="subscribe" className="call-to-action__container">
    <div className="hope-is-power--centered">
      <h2 className="heading--gift">Select a gift period</h2>
      <PaymentSelection orderIsGift />
    </div>
  </div>
);
