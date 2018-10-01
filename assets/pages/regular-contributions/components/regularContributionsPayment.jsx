// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router';
import type { Dispatch } from 'redux';
import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import PayPalExpressButton from 'components/paymentButtons/payPalExpressButton/payPalExpressButton';
import DirectDebitPopUpButton from 'components/paymentButtons/directDebitPopUpButton/directDebitPopUpButton';
import ProgressMessage from 'components/progressMessage/progressMessage';
import SvgArrowRightStraight from 'components/svgs/arrowRightStraight';
import type { Status } from 'helpers/settings';
import { routes } from 'helpers/routes';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Node } from 'react';
import type { Contrib } from 'helpers/contributions';
import type { IsoCountry } from 'helpers/internationalisation/country';
import type { Participations } from 'helpers/abTests/abtest';
import type { Csrf as CsrfState } from 'helpers/csrf/csrfReducer';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import { setPayPalHasLoaded } from '../regularContributionsActions';
import { postCheckout } from '../helpers/ajax';

// ----- Types ----- //

export type PaymentStatus = 'NotStarted' | 'Pending' | 'PollingTimedOut' | 'Failed' | 'Success';

type PropTypes = {|
  dispatch: Dispatch<*>,
  email: string,
  checkoutFailureReason: ?CheckoutFailureReason,
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
  optimizeExperiments: OptimizeExperiments,
  canOpen: () => boolean,
  whenUnableToOpen: () => void,
|};


// ----- Functions ----- //

// Shows a message about the status of the form or the payment.
function getStatusMessage(
  paymentStatus: PaymentStatus,
  checkoutFailureReason: ?CheckoutFailureReason,
): Node {

  if (paymentStatus === 'Pending') {
    return <ProgressMessage message={['Processing transaction', 'Please wait']} />;
  }
  return <PaymentFailureMessage checkoutFailureReason={checkoutFailureReason} />;

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
        onPaymentAuthorisation={postCheckout(
          props.abParticipations,
          props.amount,
          props.csrf,
          props.currencyId,
          props.contributionType,
          props.dispatch,
          'DirectDebit',
          props.referrerAcquisitionData,
          context.store.getState,
          props.optimizeExperiments,
        )}
        switchStatus={props.directDebitSwitchStatus}
        canOpen={props.canOpen}
        whenUnableToOpen={props.whenUnableToOpen}
      />);
  }

  const stripeButton = (<StripePopUpButton
    email={props.email}
    onPaymentAuthorisation={postCheckout(
      props.abParticipations,
      props.amount,
      props.csrf,
      props.currencyId,
      props.contributionType,
      props.dispatch,
      'Stripe',
      props.referrerAcquisitionData,
      context.store.getState,
      props.optimizeExperiments,
    )}
    currencyId={props.currencyId}
    isTestUser={props.isTestUser}
    isPostDeploymentTestUser={props.isPostDeploymentTestUser}
    amount={props.amount}
    switchStatus={props.stripeSwitchStatus}
    svg={<SvgArrowRightStraight />}
    canOpen={props.canOpen}
    whenUnableToOpen={props.whenUnableToOpen}
  />);

  const payPalButton = (<PayPalExpressButton
    amount={props.amount}
    currencyId={props.currencyId}
    csrf={props.csrf}
    onPaymentAuthorisation={postCheckout(
      props.abParticipations,
      props.amount,
      props.csrf,
      props.currencyId,
      props.contributionType,
      props.dispatch,
      'PayPal',
      props.referrerAcquisitionData,
      context.store.getState,
      props.optimizeExperiments,
    )}
    hasLoaded={props.payPalHasLoaded}
    setHasLoaded={props.payPalSetHasLoaded}
    switchStatus={props.payPalSwitchStatus}
    canOpen={props.canOpen}
    whenUnableToOpen={props.whenUnableToOpen}
  />);

  return (
    <section className="regular-contribution-payment">
      { props.paymentStatus === 'Success' ? <Redirect to={{ pathname: routes.recurringContribThankyou }} /> : null }
      { props.paymentStatus === 'PollingTimedOut' ? <Redirect to={{ pathname: routes.recurringContribPending }} /> : null }
      {getStatusMessage(props.paymentStatus, props.checkoutFailureReason)}
      {directDebitButton}
      {stripeButton}
      {payPalButton}
    </section>
  );
}

// ----- Map State/Props ----- //

function mapStateToProps(state) {

  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    checkoutFailureReason: state.page.regularContrib.checkoutFailureReason,
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
    directDebitSwitchStatus: state.common.settings.switches.recurringPaymentMethods.directDebit,
    stripeSwitchStatus: state.common.settings.switches.recurringPaymentMethods.stripe,
    payPalSwitchStatus: state.common.settings.switches.recurringPaymentMethods.payPal,
    optimizeExperiments: state.common.optimizeExperiments,
  };
}

function mapDispatchToProps(dispatch: Dispatch<*>) {
  return {
    dispatch,
    payPalSetHasLoaded: () => {
      dispatch(setPayPalHasLoaded());
    },
  };
}

RegularContributionsPayment.defaultProps = {
  canOpen: () => true,
  whenUnableToOpen: () => undefined,
};


// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(RegularContributionsPayment);
