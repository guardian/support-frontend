// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { setupSubscriptionPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import { onPaymentAuthorised } from 'helpers/subscriptionsForms/submit';
import { PayPal } from 'helpers/forms/paymentMethods';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { Action, formActionCreators } from 'helpers/subscriptionsForms/formActions';
import { Dispatch } from 'redux';
import { addressActionCreatorsFor } from 'components/subscriptionCheckouts/address/addressFieldsStore';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { BillingPeriod } from 'helpers/productPrice/billingPeriods';

type PayPalUserDetails = {
  firstName: string,
  lastName: string,
  email: string,
  shipToStreet: string,
  shipToCity: string,
  shipToState: string,
  shipToZip: string,
  shipToCountryCode: string,
}

type PayPalCheckoutDetails = {
  baid: string,
  user: PayPalUserDetails
}

function mapStateToProps(state: CheckoutState) {
  return {
    hasLoaded: state.page.checkout.payPalHasLoaded,
    csrf: state.page.csrf,
  };
}

function mapDispatchToProps(dispatch, ownProps) {
  return {
    setupRecurringPayPalPayment: (
      resolve: string => void,
    reject: Error => void,
    currency: IsoCurrency,
    csrf: CsrfState,
    amount: number,
    billingPeriod: BillingPeriod,
) =>  setupSubscriptionPayPalPayment(resolve, reject, currency, csrf, amount, billingPeriod),

    onPaymentAuthorised: (wrappedCheckoutDetails) => (dispatch: Dispatch<Action>, getState: () => CheckoutState) => {
      const payPalCheckoutDetails: PayPalCheckoutDetails = wrappedCheckoutDetails.token; //TODO: the actual details are being wrapped in PayPalExpressButton.onPaymentAuthorised
      updateStore(dispatch, payPalCheckoutDetails.user);
      onPaymentAuthorised(
    {
          paymentMethod: PayPal,
          token: payPalCheckoutDetails.baid,
        },
        dispatch,
        getState(),
      );
    },
    onClick: () => null,
  }
}

const updateStore = (dispatch: Dispatch<Action>, payPalUserDetails: PayPalUserDetails) => {
  const { setEmail, setFirstName, setLastName } = formActionCreators;
  const { setAddressLineOne, setTownCity, setPostcode, setState, setCountry } = addressActionCreatorsFor('billing');

  dispatch(setEmail(payPalUserDetails.email));
  dispatch(setFirstName(payPalUserDetails.firstName));
  dispatch(setLastName(payPalUserDetails.lastName));
  dispatch(setAddressLineOne(payPalUserDetails.shipToStreet))
  dispatch(setTownCity(payPalUserDetails.shipToCity))
  dispatch(setState(payPalUserDetails.shipToState))
  dispatch(setPostcode(payPalUserDetails.shipToZip))
  dispatch(setCountry(payPalUserDetails.shipToCountryCode))
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



