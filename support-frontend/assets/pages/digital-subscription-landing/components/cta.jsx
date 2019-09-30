// @flow
import React from 'react';

import PaymentSelection from 'pages/digital-subscription-landing/components/paymentSelection/paymentSelection';
import LeftMarginSection from 'components/leftMarginSection/leftMarginSection';

import './theMoment.scss';


const PaymentSelectionContainer = ({ dailyEditionsVariant }: { dailyEditionsVariant: boolean }) => (
  <div className="payment-selection-container">
    <LeftMarginSection>
      <PaymentSelection dailyEditionsVariant={dailyEditionsVariant} />
    </LeftMarginSection>
  </div>
);

type PropTypes = {
    dailyEditionsVariant: boolean,
}

const CallToAction = (props: PropTypes) => (
  <div className="call-to-action__container">
    <PaymentSelectionContainer dailyEditionsVariant={props.dailyEditionsVariant} />
  </div>
);

export default CallToAction;
