// @flow
import React from 'react';
import { css } from '@emotion/core';
import { body } from '@guardian/src-foundations/typography';

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
      <PaymentSelection orderIsAGift={false} />
    </div>
  </div>
);

const subheading = css`
  ${body.medium()};
`;

export const CallToActionGift = () => (
  <div id="subscribe" className="call-to-action__container">
    <div className="hope-is-power--centered">
      <h2>Choose one of our special gift offers</h2>
      <h3>
        <span css={subheading}>Select a gift period</span>
      </h3>
      <PaymentSelection orderIsAGift />
    </div>
  </div>
);
