// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { type Dispatch } from 'redux';
import { Redirect } from 'react-router';
import StripeInlineForm from 'components/stripeInlineForm/stripeInlineForm';
import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButton';
import DirectDebitPopUpButton from 'components/paymentButtons/directDebitPopUpButton/directDebitPopUpButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import ProgressMessage from 'components/progressMessage/progressMessage';
import { emptyInputField } from 'helpers/utilities';
import type { Status } from 'helpers/switch';
import { routes } from 'helpers/routes';
import { stripeInlineFormActionsFor } from 'components/stripeInlineForm/stripeInlineFormActions';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Node } from 'react';
import type { Contrib } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import { setPayPalHasLoaded } from '../regularContributionsActions';
import { postCheckout } from '../helpers/ajax';


// ----- Types ----- //

export type PaymentStatus = 'NotStarted' | 'Pending' | 'PollingTimedOut' | 'Failed' | 'Success';

type PropTypes = {|
  dispatch: Dispatch<*>,
  disable: boolean,
  error: ?string,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  contributionType: Contrib,
  paymentStatus: PaymentStatus,
  currencyId: IsoCurrency,
  amount: number,
  csrf: CsrfState,
  country: IsoCountry,
  abParticipations: Participations,
  referrerAcquisitionData: ReferrerAcquisitionData,
  payPalHasLoaded: boolean,
  payPalSetHasLoaded: () => void,
  directDebitSwitchStatus: Status,
  stripeSwitchStatus: Status,
  payPalSwitchStatus: Status,
  isStripeLoaded: boolean,
  stripeIsLoaded: () => void,
  stripeInlineErrorMessage: ?string,
  stripeInlineSetError: (string) => void,
  stripeInlineResetError: () => void,
  email: string,
|};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(
  paymentStatus: PaymentStatus,
  error: ?string,
): Node {

  if (paymentStatus === 'Pending') {
    return <ProgressMessage message={['Processing transaction', 'Please wait']} />;
  }
  return <ErrorMessage message={error} />;

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
  let directDebitButton = null;

  if (props.country === 'GB') {
    directDebitButton = (
      <DirectDebitPopUpButton
        callback={postCheckout(
          props.abParticipations,
          props.amount,
          props.csrf,
          props.currencyId,
          props.contributionType,
          props.dispatch,
          'DirectDebit',
          props.referrerAcquisitionData,
          context.store.getState,
        )}
        switchStatus={props.directDebitSwitchStatus}
        error={props.error}
        disable={props.disable}
      />);
  }

  const stripeInlineForm = (<StripeInlineForm
    email={props.email}
    callback={postCheckout(
      props.abParticipations,
      props.amount,
      props.csrf,
      props.currencyId,
      props.contributionType,
      props.dispatch,
      'Stripe',
      props.referrerAcquisitionData,
      context.store.getState,
    )}
    stripeIsLoaded={props.stripeIsLoaded}
    isStripeLoaded={props.isStripeLoaded}
    currencyId={props.currencyId}
    isTestUser={props.isTestUser}
    isPostDeploymentTestUser={props.isPostDeploymentTestUser}
    switchStatus={props.stripeSwitchStatus}
    errorMessage={props.stripeInlineErrorMessage}
    setError={props.stripeInlineSetError}
    resetError={props.stripeInlineResetError}
    disable={props.disable}
  />);

  const payPalButton = (<PayPalExpressButton
    amount={props.amount}
    currencyId={props.currencyId}
    csrf={props.csrf}
    callback={postCheckout(
      props.abParticipations,
      props.amount,
      props.csrf,
      props.currencyId,
      props.contributionType,
      props.dispatch,
      'PayPal',
      props.referrerAcquisitionData,
      context.store.getState,
    )}
    hasLoaded={props.payPalHasLoaded}
    setHasLoaded={props.payPalSetHasLoaded}
    switchStatus={props.payPalSwitchStatus}
    disable={props.disable}
  />);

  return (
    <section className="regular-contribution-payment">
      { props.paymentStatus === 'Success' ? <Redirect to={{ pathname: routes.recurringContribThankyou }} /> : null }
      { props.paymentStatus === 'PollingTimedOut' ? <Redirect to={{ pathname: routes.recurringContribPending }} /> : null }
      {getStatusMessage(props.paymentStatus, props.error)}
      {stripeInlineForm}

      <p className="regular-contribution-payment__or-label">or</p>

      {directDebitButton}
      {payPalButton}
    </section>
  );
}

// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    email: state.page.user.email,
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    disable: emptyInputField(state.page.user.firstName) || emptyInputField(state.page.user.lastName),
    error: state.page.regularContrib.error,
    paymentStatus: state.page.regularContrib.paymentStatus,
    amount: state.page.regularContrib.amount,
    currencyId: state.common.internationalisation.currencyId,
    contributionType: state.page.regularContrib.contributionType,
    regularContrib: state.page.regularContrib,
    csrf: state.page.csrf,
    country: state.common.internationalisation.countryId,
    abParticipations: state.common.abParticipations,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    payPalHasLoaded: state.page.regularContrib.payPalHasLoaded,
    directDebitSwitchStatus: state.common.switches.recurringPaymentMethods.directDebit,
    stripeSwitchStatus: state.common.switches.recurringPaymentMethods.stripe,
    payPalSwitchStatus: state.common.switches.recurringPaymentMethods.payPal,
    isStripeLoaded: state.page.stripeInlineForm.isStripeLoaded,
    stripeInlineErrorMessage: state.page.stripeInlineForm.errorMessage,
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return ({
    stripeIsLoaded: () => {
      dispatch(stripeInlineFormActionsFor('regularContributions').stripeIsLoaded());
    },
    dispatch,
    stripeInlineSetError: (message: string) => {
      dispatch(stripeInlineFormActionsFor('regularContributions').setError(message));
    },
    stripeInlineResetError: () => {
      dispatch(stripeInlineFormActionsFor('regularContributions').resetError());
    },
    payPalSetHasLoaded: () => {
      dispatch(setPayPalHasLoaded());
    },
  });
}


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(RegularContributionsPayment);
