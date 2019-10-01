// @flow
import React from 'react';

import PaymentSelection from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';

import './digitalSubscriptionLandingHeader.scss';


type PropTypes = {
    dailyEditionsVariant: boolean,
}

const CallToAction = (props: PropTypes) => (
  <div className="call-to-action__container hope-is-power--centered">
    <PaymentSelection dailyEditionsVariant={props.dailyEditionsVariant} />
  </div>
);

export default CallToAction;
