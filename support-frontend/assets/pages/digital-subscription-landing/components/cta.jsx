// @flow
import React from 'react';

import PaymentSelection from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

import './digitalSubscriptionLanding.scss';


type PropTypes = {
  dailyEditionsVariant: boolean,
}

const CallToAction = (props: PropTypes) => (
  <div className="call-to-action__container">
    <div className="hope-is-power--centered">
      <PaymentSelection dailyEditionsVariant={props.dailyEditionsVariant} />
    </div>
  </div>
);

export default CallToAction;
