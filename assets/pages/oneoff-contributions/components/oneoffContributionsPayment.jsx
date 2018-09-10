// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Redirect } from 'react-router';
import { routes } from 'helpers/routes';
import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import ErrorMessage from 'components/errorMessage/errorMessage';
import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Status } from 'helpers/settings';
import SvgCreditCard from 'components/svgs/creditCard';
import type { OptimizeExperiments } from 'helpers/tracking/optimize';
import { type UserFormFieldAttribute } from 'helpers/checkoutForm/checkoutForm';
import { type Action as CheckoutAction } from '../helpers/checkoutForm/checkoutFormActions';
import { setFullNameShouldValidate, setEmailShouldValidate } from '../helpers/checkoutForm/checkoutFormActions';
import postCheckout from '../helpers/ajax';
import { getFormFields } from '../helpers/checkoutForm/checkoutFormFieldsSelector';
import { type State } from '../oneOffContributionsReducer';

// ----- Types ----- //

type PropTypes = {|
  dispatch: Function,
  email: string,
  setShouldValidateFunctions: Array<() => void>,
  error: ?string,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  abParticipations: Participations,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  paymentComplete: boolean,
  optimizeExperiments: OptimizeExperiments,
  formFields: Array<UserFormFieldAttribute>
|};


// ----- Map State/Props ----- //


function mapStateToProps(state: State) {
  const { fullName, email } = getFormFields(state);

  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: email.value,
    formFields: [email, fullName],
    error: state.page.oneoffContrib.error,
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
      () => dispatch(setFullNameShouldValidate()),
      () => dispatch(setEmailShouldValidate()),
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
      <ErrorMessage message={props.error} />
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
        canOpen={() => props.formFields.every(f => f.isValid)}
        whenUnableToOpen={() => props.setShouldValidateFunctions.forEach(f => f())}
        currencyId={props.currencyId}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
        switchStatus={props.stripeSwitchStatus}
        disable={false}
        svg={<SvgCreditCard />}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
