// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { setupSubscriptionPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';

function mapStateToProps(state) {
  return {
    hasLoaded: state.page.hasLoaded,
    csrf: state.page.csrf,
  };
}

function mapDispatchToProps() {
  return {
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
    onPaymentAuthorised: (baid) => console.log(`Baid: ${baid.token}`),
  }
}

const payPalButton = css`
  box-sizing: border-box;
  margin-top: ${space[3]}px;
  min-width: 264px;
`;

function PayPalHeroButton(props) {
  return (
    <div css={payPalButton}>
      <PayPalExpressButton
        onPaymentAuthorisation={props.onPaymentAuthorised}
        csrf={props.csrf}
        currencyId={'GBP'}
        hasLoaded={props.hasLoaded}
        canOpen={() => true}
        onClick={() => null}
        formClassName="form--contribution"
        isTestUser={false}
        setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
        amount={5.99}
        billingPeriod={Monthly}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps())(PayPalHeroButton);



