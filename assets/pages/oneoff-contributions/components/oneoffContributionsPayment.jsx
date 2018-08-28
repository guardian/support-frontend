// @flow

// ----- Imports ----- //

import React from 'react';
import { connect } from 'react-redux';
import type { Dispatch } from 'redux';
import { Redirect } from 'react-router';

import { routes } from 'helpers/routes';
import StripePopUpButton from 'components/paymentButtons/stripePopUpButton/stripePopUpButton';
import ErrorMessage from 'components/errorMessage/errorMessage';

import { validateEmailAddress } from 'helpers/utilities';

import type { ReferrerAcquisitionData } from 'helpers/tracking/acquisitions';
import type { Participations } from 'helpers/abTests/abtest';
import type { IsoCurrency } from 'helpers/internationalisation/currency';
import type { Status } from 'helpers/switch';

import { checkoutError, type Action } from '../oneoffContributionsActions';
import postCheckout from '../helpers/ajax';


// ----- Types ----- //

type PropTypes = {|
  dispatch: Function,
  email: string,
  error: ?string,
  areAnyRequiredFieldsEmpty: boolean,
  amount: number,
  referrerAcquisitionData: ReferrerAcquisitionData,
  checkoutError: (?string) => void,
  abParticipations: Participations,
  currencyId: IsoCurrency,
  isTestUser: boolean,
  isPostDeploymentTestUser: boolean,
  stripeSwitchStatus: Status,
  paymentComplete: boolean,
|};


// ----- Map State/Props ----- //

function mapStateToProps(state) {
  return {
    isTestUser: state.page.user.isTestUser || false,
    isPostDeploymentTestUser: state.page.user.isPostDeploymentTestUser,
    email: state.page.user.email,
    error: state.page.oneoffContrib.error,
    areAnyRequiredFieldsEmpty: !state.page.user.email || !state.page.user.fullName,
    amount: state.page.oneoffContrib.amount,
    referrerAcquisitionData: state.common.referrerAcquisitionData,
    abParticipations: state.common.abParticipations,
    currencyId: state.common.internationalisation.currencyId,
    stripeSwitchStatus: state.common.switches.oneOffPaymentMethods.stripe,
    paymentComplete: state.page.oneoffContrib.paymentComplete || false,
  };
}

function mapDispatchToProps(dispatch: Dispatch<Action>) {
  return {
    dispatch,
    checkoutError: (message: ?string) => {
      dispatch(checkoutError(message));
    },
  };
}

// ----- Functions ----- //

// If the form is valid, calls the given callback, otherwise sets an error.
function formValidation(
  areAnyRequiredFieldsEmpty: boolean,
  validEmail: boolean,
  error: ?string => void,
): Function {

  return (): boolean => {

    if (!areAnyRequiredFieldsEmpty && validEmail) {
      if (error) {
        error(null);
      }
      return true;
    }

    if (error) {
      if (areAnyRequiredFieldsEmpty) {
        error('Please fill in all the fields above.');
      } else {
        error('Please fill in a valid email address.');
      }
    }
    return false;
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
        )}
        canOpen={formValidation(
          props.areAnyRequiredFieldsEmpty,
          validateEmailAddress(props.email),
          props.checkoutError,
        )}
        currencyId={props.currencyId}
        isTestUser={props.isTestUser}
        isPostDeploymentTestUser={props.isPostDeploymentTestUser}
        amount={props.amount}
        switchStatus={props.stripeSwitchStatus}
        disable={false}
      />
    </section>
  );

}

// ----- Exports ----- //

export default connect(mapStateToProps, mapDispatchToProps)(OneoffContributionsPayment);
