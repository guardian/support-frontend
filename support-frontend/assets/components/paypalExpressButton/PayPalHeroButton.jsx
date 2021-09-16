// @flow

import React from 'react';
import { connect } from 'react-redux';
import { Monthly } from 'helpers/productPrice/billingPeriods';
import { setupSubscriptionPayPalPayment } from 'helpers/forms/paymentIntegrations/payPalRecurringCheckout';
import PayPalExpressButton from 'components/paypalExpressButton/PayPalExpressButton';
import { css } from '@emotion/core';
import { space } from '@guardian/src-foundations';
import {  onPaymentAuthorisedNoCheckout } from 'helpers/subscriptionsForms/submit';
import { PayPal } from 'helpers/forms/paymentMethods';
import { getOphanIds, getSupportAbTests } from 'helpers/tracking/acquisitions';
import type { RegularPaymentRequest } from 'helpers/forms/paymentIntegrations/readerRevenueApis';
import type { CheckoutState } from 'helpers/subscriptionsForms/subscriptionCheckoutReducer';
import { Action } from 'helpers/subscriptionsForms/formActions';
import type { PayPalState } from 'components/paypalExpressButton/PayPalHeroStore';
import { DigitalPack } from 'helpers/productPrice/subscriptions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import { Direct } from 'helpers/productPrice/readerType';

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

function mapDispatchToProps(dispatch) {
  return {
    setupRecurringPayPalPayment: setupSubscriptionPayPalPayment,

    onPaymentAuthorised: (wrappedCheckoutDetails) => (dispatch: Dispatch<Action>, getState: () => PayPalState) => {
      const state: PayPalState = getState()
      const payPalCheckoutDetails: PayPalCheckoutDetails = wrappedCheckoutDetails.token; //TODO: the actual details are being wrapped in PayPalExpressButton.onPaymentAuthorised
      const { abParticipations, referrerAcquisitionData } = state.common;
      const regularPaymentRequest = buildRegularPaymentRequest(payPalCheckoutDetails, referrerAcquisitionData, abParticipations);
      onPaymentAuthorisedNoCheckout(
        dispatch,
        regularPaymentRequest,
        DigitalPack,
        PayPal,
        state.page.csrf,
      )
    },
  }
}

const buildRegularPaymentRequest = (
  payPalCheckoutDetails: PayPalCheckoutDetails,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations
): RegularPaymentRequest => {
  const { user } = payPalCheckoutDetails;
  const paymentFields = { baid: payPalCheckoutDetails.baid };
  const product = { //TODO: most of this is hard coded
    productType: DigitalPack,
    currency: 'GBP',
    billingPeriod: Monthly,
    readerType: Direct,
  };
  const addresses = {
    billingAddress: {
      country: user.shipToCountryCode,
      state: user.shipToState,
      lineOne: user.shipToStreet,
      postCode: user.shipToZip,
      city: user.shipToCity,
    },
    deliveryAddress: null,
  };
  return {
    firstName: user.firstName.trim(),
    lastName: user.lastName.trim(),
    ...addresses,
    email: user.email.trim(),
    product,
    paymentFields,
    ophanIds: getOphanIds(),
    referrerAcquisitionData: referrerAcquisitionData,
    supportAbTests: getSupportAbTests(abParticipations),
    //promoCode: '', //TODO
    debugInfo: '',
  };
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



