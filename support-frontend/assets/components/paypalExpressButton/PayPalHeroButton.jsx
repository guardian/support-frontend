// @flow

import React from 'react';
import { connect } from 'react-redux';
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
import { finalPrice } from 'helpers/productPrice/productPrices';

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

function mapStateToProps(state: CheckoutState, ownProps) {
  return {
    hasLoaded: state.page.checkout.payPalHasLoaded,
    csrf: state.page.csrf,
    productPrices: state.page.checkout.productPrices,
    currencyId: state.common.internationalisation.currencyId,
    isTestUser: state.page.checkout.isTestUser,
    amount: finalPrice(
      state.page.checkout.productPrices,
      state.common.internationalisation.countryId,
      ownProps.billingPeriod,
    ).price,
  };
}

function mapDispatchToProps() {
  return {
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,

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
    onClick: (billingPeriod) => (dispatch: Dispatch<Action>) => dispatch(formActionCreators.setBillingPeriod(billingPeriod)),
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
        currencyId={props.currencyId}
        hasLoaded={props.hasLoaded}
        canOpen={() => true}
        onClick={() => props.onClick(props.billingPeriod)}
        formClassName="form--contribution"
        isTestUser={props.isTestUser}
        setupRecurringPayPalPayment={props.setupRecurringPayPalPayment}
        amount={props.amount}
        billingPeriod={props.billingPeriod}
      />
    </div>
  );
}

export default connect(mapStateToProps, mapDispatchToProps())(PayPalHeroButton);



