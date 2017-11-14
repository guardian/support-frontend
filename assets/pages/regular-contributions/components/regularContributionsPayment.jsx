// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';

import StripePopUpButton from 'components/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/payPalExpressButton/payPalExpressButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';

import type { Currency } from 'helpers/internationalisation/currency';
import type { Node } from 'react';
import type { Contrib } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abtest';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';


import postCheckout from '../helpers/ajax';


// ----- Types ----- //

export type PaymentStatus = 'NotStarted' | 'Pending' | 'Failed';

export type PayPalButtonType = 'ExpressCheckout' | 'NotSet';

type PropTypes = {
  dispatch: Function,
  email: string,
  hide: boolean,
  error: ?string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  contributionType: Contrib,
  paymentStatus: PaymentStatus,
  currency: Currency,
  amount: number,
  csrf: CsrfState,
  country: IsoCountry,
  abParticipations: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(
  paymentStatus: PaymentStatus,
  hide: boolean,
  error: ?string,
): Node {

  if (paymentStatus === 'Pending') {
    return <ProgressMessage message={['Processing transaction', 'Please wait']} />;
  } else if (hide) {
    return <ErrorMessage message="Please fill in all the fields above." />;
  } else if (error !== null && error !== undefined) {
    return <ErrorMessage message={error} />;
  }

  return null;

}

// Provides the Stripe button component.
function getStripeButton(
  hide: boolean,
  abParticipations: Participations,
  amount: number,
  email: string,
  contribType: Contrib,
  currency: Currency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  dispatch: Function,
  csrf: CsrfState,
  country: IsoCountry,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState,
): Node {

  if (hide) {
    return null;
  }

  return (
    <StripePopUpButton
      email={email}
      callback={postCheckout(
        abParticipations,
        amount,
        csrf,
        currency,
        contribType,
        country,
        dispatch,
        'stripeToken',
        referrerAcquisitionData,
        getState,
      )}
      currency={currency}
      isTestUser={isTestUser}
      isPostDeploymentTestUser={isPostDeploymentTestUser}
      amount={amount}
    />
  );

}

// Provides the PayPal Express Checkout button component.
function getPayPalButton(
  hide: boolean,
  abParticipations: Participations,
  amount: number,
  email: string,
  contribType: Contrib,
  currency: Currency,
  isTestUser: boolean,
  dispatch: Function,
  csrf: CsrfState,
  country: IsoCountry,
  referrerAcquisitionData: ReferrerAcquisitionData,
  getState: Function,
): Node {

  if (hide) {
    return null;
  }

  return (<PayPalExpressButton callback={postCheckout(
    abParticipations,
    amount,
    csrf,
    currency,
    contribType,
    country,
    dispatch,
    'baid',
    referrerAcquisitionData,
    getState,
  )}
  />);

}


// ----- Component ----- //

/*
 * WARNING: we are using the React context here to be able to pass the getState function
 * to the postCheckout function. PostCheckout requires this function to access to the
 * most recent user.
 * More information here:https://reactjs.org/docs/context.html
 * You should not use context for other purposes. Please use redux.
 */
function RegularContributionsPayment(props: PropTypes, context) {

  return (
    <section className="regular-contribution-payment">
      {getStatusMessage(props.paymentStatus, props.hide, props.error)}
      {getStripeButton(
        props.hide,
        props.abParticipations,
        props.amount,
        props.email,
        props.contributionType,
        props.currency,
        props.isTestUser,
        props.isPostDeploymentTestUser,
        props.dispatch,
        props.csrf,
        props.country,
        props.referrerAcquisitionData,
        context.store.getState,
      )}
      {getPayPalButton(
        props.hide,
        props.abParticipations,
        props.amount,
        props.email,
        props.contributionType,
        props.currency,
        props.isTestUser,
        props.dispatch,
        props.csrf,
        props.country,
        props.referrerAcquisitionData,
        context.store.getState,
      )}
    </section>
  );
}

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    hide: state.page.user.firstName === '' || state.page.user.lastName === '',
    error: state.page.regularContrib.error,
    paymentStatus: state.page.regularContrib.paymentStatus,
    amount: state.page.regularContrib.amount,
    currency: state.page.regularContrib.currency,
    regularContrib: state.page.regularContrib,
    csrf: state.page.csrf,
    country: state.common.country,
    abParticipations: state.common.abParticipations,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
  };
}

// ----- Exports ----- //

export default connect(mapStateToProps)(RegularContributionsPayment);
