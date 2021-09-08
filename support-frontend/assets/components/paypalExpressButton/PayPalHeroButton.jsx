// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { setupSubscriptionPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import { PayPalSubmitButton } from 'components/subscriptionCheckouts/payPalSubmitButton';
import { PayPal } from 'helpers/forms/paymentMethods';

function mapStateToProps(state) {
  return {
    hasLoaded: state.page.hasLoaded,
    csrf: state.page.csrf,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,
  }
}

function PayPalHeroButton(props) {
  return (
    <PayPalSubmitButton
      paymentMethod={PayPal}
      onPaymentAuthorised={props.onPaymentAuthorised}
      csrf={props.csrf}
      currencyId={'GBP'}
      payPalHasLoaded={props.hasLoaded}
      formIsValid={() => true}
      validateForm={() => null}
      isTestUser={false}
      setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
      amount={11}
      billingPeriod={Monthly}
      allErrors={[]}
    />
  );
}

export default connect(mapStateToProps, mapDispatchToProps())(PayPalHeroButton);



