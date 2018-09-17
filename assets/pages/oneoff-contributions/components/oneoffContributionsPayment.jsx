// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Redirect } from 'react-router';
import { routes } from 'helpers/routes';
import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Status } from 'helpers/settings';
import SvgCreditCard from 'components/svgs/creditCard';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';
import PaymentFailureMessage from 'components/paymentFailureMessage/paymentFailureMessage';
import type { CheckoutFailureReason } from 'helpers/checkoutErrors';
import { formIsValid } from 'helpers/checkoutForm/checkoutForm';
import { type Action as CheckoutAction } from '../helpers/checkoutForm/checkoutFormActions';
import { setFullNameShouldValidate, setEmailShouldValidate } from '../helpers/checkoutForm/checkoutFormActions';
import postCheckout from '../helpers/ajax';
import { type State } from '../oneOffContributionsReducer';
import { formClassName } from './formFields';

// ----- Types ----- //

type PropTypes = {|
  dispatch: Function,
  email: string,
  setShouldValidateFunctions: Array<() => void>,
  checkoutFailureReason: ?CheckoutFailureReason,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  paymentComplete: boolean,
  optimizeExperiments: OptimizeExperiments,
|};


// ----- Map State/Props ----- //


function mapStateToProps(state: State) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    checkoutFailureReason: state.page.oneoffContrib.checkoutFailureReason,
    areAnyRequiredFieldsEmpty: !state.page.user.email || !state.page.user.fullName,
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    currencyId: state.common.internationalisation.currencyId,
    stripeSwitchStatus: state.common.settings.switches.oneOffPaymentMethods.stripe,
    paymentComplete: state.page.oneoffContrib.paymentComplete || false,
    optimizeExperiments: state.common.optimizeExperiments,
  };
}

function mapDispatchToProps(dispatch: Dispatch<CheckoutAction>) {
  return {
    dispatch,
    setShouldValidateFunctions: [
      () => dispatch(setFullNameShouldValidate(true)),
      () => dispatch(setEmailShouldValidate(true)),
    ],
  };
}

// ----- Component ----- //

/*
 * WARNING: we are using the React context here to be able to pass the getState function
 * to the postCheckout function. PostCheckout requires this function to access to the
 * most recent user.
 * More information here:https://reactjs.org/docs/context.html
 * You should not use context for other purposes. Please use redux.
 */
function OneoffContributionsPayment(props: PropTypes, context) {
  return (
    <section className="oneoff-contribution-payment">
      { props.paymentComplete ? <Redirect to={{ pathname: routes.oneOffContribThankyou }} /> : null }
      <PaymentFailureMessage checkoutFailureReason={props.checkoutFailureReason} />
      <StripePopUpButton
        email={props.email}
        callback={postCheckout(
          props.abParticipations,
          props.dispatch,
          props.amount,
          props.currencyId,
          props.referrerAcquisitionData,
          context.store.getState,
          props.optimizeExperiments,
        )}
        canOpen={() => formIsValid(formClassName)}
        whenUnableToOpen={() => props.setShouldValidateFunctions.forEach(f => f())}
        currencyId={props.currencyId}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
        switchStatus={props.stripeSwitchStatus}
        svg={<SvgCreditCard />}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
